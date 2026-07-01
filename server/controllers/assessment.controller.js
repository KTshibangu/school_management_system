import logger from "../config/logger.js";
import { getAssessments, getAssessmentById, createAssessment, updateAssessment, deleteAssessment } from "../services/assessment.service.js";
import { createAssessmentSchema, updateAssessmentSchema, mongoIdSchema } from "../validations/assessment.validation.js";
import { formatValidationError } from "../utils/format.js";

// GET /api/assessments
export const fetchAllAssessments = async (req, res, next) => {
    try {
        logger.info(`Getting assessments for teacher ${req.user.userId}`);
        const assessments = await getAssessments(req.user.userId);

        return res.status(200).json({
            success: true,
            message: "Successfully retrieved assessments",
            data: assessments,
        });
    } catch (error) {
        logger.error(`Error fetching assessments: ${error.message}`);
        next(error);
    }
};

// GET /api/assessments/:id
export const fetchAssessmentById = async (req, res, next) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                error: "Fetching Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const assessment = await getAssessmentById(validation.data.id, req.user.userId);

        return res.status(200).json({
            success: true,
            data: assessment,
        });
    } catch (error) {
        logger.error(`Error fetching assessment: ${error.message}`);

        if (error.message === "Assessment not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        if (error.message === "Access denied") {
            return res.status(403).json({ success: false, error: error.message });
        }

        next(error);
    }
};

// POST /api/assessments
export const postAssessment = async (req, res, next) => {
    try {
        logger.info("Creating assessment...");

        const validation = createAssessmentSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "Create validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const assessment = await createAssessment(validation.data, req.user.userId);

        logger.info("Assessment created successfully!");
        return res.status(201).json({
            success: true,
            message: "Assessment created successfully!",
            data: assessment,
        });
    } catch (error) {
        logger.error(`Error creating assessment: ${error.message}`);

        if (error.message === "Class not found") {
            return res.status(400).json({ success: false, error: error.message });
        }

        next(error);
    }
};

// PUT /api/assessments/:id
export const updateAssessmentById = async (req, res, next) => {
    try {
        const idValidation = mongoIdSchema.safeParse(req.params);
        if (!idValidation.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: formatValidationError(idValidation.error),
            });
        }

        const bodyValidation = updateAssessmentSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({
                error: "Update validation failed",
                details: formatValidationError(bodyValidation.error),
            });
        }

        const assessment = await updateAssessment(idValidation.data.id, bodyValidation.data, req.user.userId);

        logger.info(`Assessment "${assessment.title}" updated successfully!`);
        return res.status(200).json({
            success: true,
            message: "Assessment updated successfully!",
            data: assessment,
        });
    } catch (error) {
        logger.error(`Error updating assessment: ${error.message}`);

        if (error.message === "Assessment not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        if (error.message === "Access denied") {
            return res.status(403).json({ success: false, error: error.message });
        }
        if (error.message === "Class not found") {
            return res.status(400).json({ success: false, error: error.message });
        }

        next(error);
    }
};

// DELETE /api/assessments/:id
export const deleteAssessmentById = async (req, res, next) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                error: " Delete Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        logger.info(`Deleting assessment by id: ${req.params.id}`);

        await deleteAssessment(validation.data.id, req.user.userId);

        return res.status(200).json({
            success: true,
            message: "Assessment deleted successfully",
        });
    } catch (error) {
        logger.error(`Error deleting assessment: ${error.message}`);

        if (error.message === "Assessment not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        if (error.message === "Access denied") {
            return res.status(403).json({ success: false, error: error.message });
        }

        next(error);
    }
};