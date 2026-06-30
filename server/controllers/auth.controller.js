import logger from "../config/logger.js";
import { loginUser, changeUserPassword } from "../services/auth.service.js";
import { loginSchema, changePasswordSchema } from "../validations/auth.validation.js";
import { formatValidationError } from "../utils/format.js";

// POST /api/auth/login
export const login = async (req, res, next) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "Login Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const result = await loginUser(validation.data);

        logger.info(`User ${result.user.email} logged in`);
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Login error: ${error.message}`);

        const authErrors = [
            "Invalid credentials",
            "Not authorized as admin",
            "Not authorized as teacher",
        ];
        if (authErrors.includes(error.message)) {
            return res.status(401).json({ error: error.message });
        }

        next(error);
    }
};

// GET /api/auth/session
export const session = (req, res) => {
    return res.status(200).json({ user: req.session });
};

// POST /api/auth/change-password
export const changePassword = async (req, res, next) => {
    try {
        const validation = changePasswordSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "Change Password Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        await changeUserPassword(req.session.userId, validation.data);

        logger.info(`Password changed for user ${req.session.userId}`);
        return res.status(200).json({ success: true });
    } catch (error) {
        logger.error(`Change password error: ${error.message}`);

        if (error.message === "User not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "Current password is incorrect") {
            return res.status(400).json({ error: error.message });
        }

        next(error);
    }
};