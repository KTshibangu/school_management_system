import logger from "../config/logger.js";
import { getAdminDashboard, getTeacherDashboard } from "../services/dashboard.service.js";

// GET /api/dashboard
export const getDashboard = async (req, res, next) => {
    try {
        const { userId, role } = req.user;

        const data = role === "ADMIN"
            ? await getAdminDashboard()
            : await getTeacherDashboard(userId);

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        logger.error(`Error fetching dashboard: ${error.message}`);

        if (error.message === "Teacher not found") {
            return res.status(404).json({ success: false, error: error.message });
        }

        next(error);
    }
};