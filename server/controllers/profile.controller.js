import logger from "../config/logger.js";
import { getProfile, updateProfile } from "../services/profile.service.js";
import { updateProfileSchema } from "../validations/profile.validation.js";
import { formatValidationError } from "../utils/format.js";

// GET /api/profile
export const fetchProfile = async (req, res, next) => {
    try {
        const profile = await getProfile(req.user);
        console.log("Profile data:", JSON.stringify(profile, null, 2));

        return res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        logger.error(`Error fetching profile: ${error.message}`);
        next(error);
    }
};

// PUT /api/profile
export const updateProfileById = async (req, res, next) => {
    try {
        const validation = updateProfileSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const updatedProfile = await updateProfile(req.user, validation.data);

        logger.info(`Profile updated for user ${req.user.userId}`);
        return res.status(200).json({
            success: true,
            data: updatedProfile,
        });
    } catch (error) {
        logger.error(`Error updating profile: ${error.message}`);

        if (error.message === "Teacher not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "Account is deactivated") {
            return res.status(403).json({ error: "Your account is deactivated. You cannot update your profile." });
        }

        next(error);
    }
};