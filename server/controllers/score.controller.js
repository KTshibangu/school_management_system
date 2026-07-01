import logger from "../config/logger.js";
import { getScores, getScoreById, createScore, updateScore, deleteScore } from "../services/score.service.js";
import { createScoreSchema, updateScoreSchema, mongoIdSchema } from "../validations/score.validation.js";
import { formatValidationError } from "../utils/format.js";

const referenceErrors = ["Class not found", "Assessment not found", "Student not found"];
const scoreError = "Score cannot exceed max score";

// GET /api/scores
export const fetchAllScores = async (req, res, next) => {
    try {
        logger.info(`Getting scores for teacher ${req.user.userId}`);
        const scores = await getScores(req.user.userId);

        return res.status(200).json({
            success: true,
            message: "Successfully retrieved scores",
            data: scores,
        });
    } catch (error) {
        logger.error(`Error fetching scores: ${error.message}`);
        next(error);
    }
};

// GET /api/scores/:id
export const fetchScoreById = async (req, res, next) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                error: "Fetch Score Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const score = await getScoreById(validation.data.id, req.user.userId);

        return res.status(200).json({
            success: true,
            data: score,
        });
    } catch (error) {
        logger.error(`Error fetching score: ${error.message}`);

        if (error.message === "Score not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        if (error.message === "Access denied") {
            return res.status(403).json({ success: false, error: error.message });
        }

        next(error);
    }
};

// POST /api/scores
export const postScore = async (req, res, next) => {
    try {
        logger.info("Creating score...");

        const validation = createScoreSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "Create validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const score = await createScore(validation.data, req.user.userId);

        logger.info("Score created successfully!");
        return res.status(201).json({
            success: true,
            message: "Score created successfully!",
            data: score,
        });
    } catch (error) {
        logger.error(`Error creating score: ${error.message}`);

        if (referenceErrors.includes(error.message)) {
            return res.status(400).json({ success: false, error: error.message });
        }
        if (error.message === scoreError) {
            return res.status(400).json({ success: false, error: error.message });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: "A score already exists for this student and assessment",
            });
        }

        next(error);
    }
};

// PUT /api/scores/:id
export const updateScoreById = async (req, res, next) => {
    try {
        const idValidation = mongoIdSchema.safeParse(req.params);
        if (!idValidation.success) {
            return res.status(400).json({
                error: "Update Id Validation failed",
                details: formatValidationError(idValidation.error),
            });
        }

        const bodyValidation = updateScoreSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({
                error: "Update validation failed",
                details: formatValidationError(bodyValidation.error),
            });
        }

        const score = await updateScore(idValidation.data.id, bodyValidation.data, req.user.userId);

        logger.info(`Score ${score._id} updated successfully!`);
        return res.status(200).json({
            success: true,
            message: "Score updated successfully!",
            data: score,
        });
    } catch (error) {
        logger.error(`Error updating score: ${error.message}`);

        if (error.message === "Score not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        if (error.message === "Access denied") {
            return res.status(403).json({ success: false, error: error.message });
        }
        if (referenceErrors.includes(error.message)) {
            return res.status(400).json({ success: false, error: error.message });
        }
        if (error.message === scoreError) {
            return res.status(400).json({ success: false, error: error.message });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: "A score already exists for this student and assessment",
            });
        }

        next(error);
    }
};

// DELETE /api/scores/:id
export const deleteScoreById = async (req, res, next) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                error: "Delete Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        logger.info(`Deleting score by id: ${req.params.id}`);

        await deleteScore(validation.data.id, req.user.userId);

        return res.status(200).json({
            success: true,
            message: "Score deleted successfully",
        });
    } catch (error) {
        logger.error(`Error deleting score: ${error.message}`);

        if (error.message === "Score not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        if (error.message === "Access denied") {
            return res.status(403).json({ success: false, error: error.message });
        }

        next(error);
    }
};