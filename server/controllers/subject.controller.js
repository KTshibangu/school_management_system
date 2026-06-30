import logger from "../config/logger.js";
import { getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject } from "../services/subject.service.js";
import { createSubjectSchema, updateSubjectSchema, mongoIdSchema } from "../validations/subject.validation.js";
import { formatValidationError } from "../utils/format.js";

// GET /api/subjects
export const fetchAllSubjects = async (req, res, next) => {
    try {
        logger.info("Getting subjects...");
        const subjects = await getSubjects();

        return res.status(200).json({
            success: true,
            message: "Successfully retrieved subjects",
            data: subjects,
        });
    } catch (error) {
        logger.error(`Error fetching subjects: ${error.message}`);
        next(error);
    }
};

// GET /api/subjects/:id
export const fetchSubjectById = async (req, res, next) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                error: "Fetchng subject Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const subject = await getSubjectById(validation.data.id);

        return res.status(200).json({
            success: true,
            data: subject,
        });
    } catch (error) {
        logger.error(`Error fetching subject: ${error.message}`);

        if (error.message === "Subject not found") {
            return res.status(404).json({ success: false, error: error.message });
        }

        next(error);
    }
};

// POST /api/subjects
export const postSubject = async (req, res, next) => {
    try {
        logger.info("Creating subject...");

        const validation = createSubjectSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "Create validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const subject = await createSubject(validation.data);

        logger.info("Subject created successfully!");
        return res.status(201).json({
            success: true,
            message: "Subject created successfully!",
            data: subject,
        });
    } catch (error) {
        logger.error(`Error creating subject: ${error.message}`);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: "A subject with that code already exists for this grade",
            });
        }

        next(error);
    }
};

// PUT /api/subjects/:id
export const updateSubjectById = async (req, res, next) => {
    try {
        const idValidation = mongoIdSchema.safeParse(req.params);
        if (!idValidation.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: formatValidationError(idValidation.error),
            });
        }

        const bodyValidation = updateSubjectSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({
                error: "Update validation failed",
                details: formatValidationError(bodyValidation.error),
            });
        }

        const subject = await updateSubject(idValidation.data.id, bodyValidation.data);

        logger.info(`Subject ${subject.code} updated successfully!`);
        return res.status(200).json({
            success: true,
            message: "Subject updated successfully!",
            data: subject,
        });
    } catch (error) {
        logger.error(`Error updating subject: ${error.message}`);

        if (error.message === "Subject not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: "A subject with that code already exists for this grade",
            });
        }

        next(error);
    }
};

// DELETE /api/subjects/:id
export const deleteSubjectById = async (req, res, next) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        logger.info(`Deleting subject by id: ${req.params.id}`);

        await deleteSubject(validation.data.id);

        return res.status(200).json({
            success: true,
            message: "Subject deleted successfully",
        });
    } catch (error) {
        logger.error(`Error deleting subject: ${error.message}`);

        if (error.message === "Subject not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        if (error.message === "Subject is assigned to one or more teachers") {
            return res.status(409).json({ success: false, error: error.message });
        }

        next(error);
    }
};