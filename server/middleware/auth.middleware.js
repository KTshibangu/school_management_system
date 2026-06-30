import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

/**
 * Verifies the Bearer token from the Authorization header and attaches
 * the decoded payload to req.user for downstream handlers.
 */
export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const token = authHeader.split(" ")[1];

        // jwt.verify throws on invalid/expired tokens — never returns falsy
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        logger.info(`User authenticated: ${decoded.email} (${decoded.role})`);
        next();

    } catch (error) {
        // jwt.verify throws named errors we can map to specific responses
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Session expired, please sign in again" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }

        logger.error(`Authentication error: ${error.message}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Role-based access control. Always chain after protect.
 *
 * Usage:
 *   router.get('/admin/stats', protect, requireRole(['ADMIN']), handler)
 *   router.get('/dashboard', protect, requireRole(['ADMIN', 'TEACHER']), handler)
 */
export const requireRole = (allowedRoles) => (req, res, next) => {
    // protect always runs first, but this guards against accidental misuse
    if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
        logger.warn(
            `Access denied — user ${req.user.email} has role ${req.user.role}, required one of: ${allowedRoles.join(", ")}`
        );
        return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
};