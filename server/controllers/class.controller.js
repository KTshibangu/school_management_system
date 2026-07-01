import logger from "../config/logger.js";
import { getClasses, getClassById, createClass, updateClass, deleteClass } from "../services/class.service.js";
import { createClassSchema, updateClassSchema, mongoIdSchema } from "../validations/class.validation.js";
import { formatValidationError } from "../utils/format.js";

const referenceErrors = ["One or more subjects not found"];

// GET /api/classes
export const fetchAllClasses = async (req, res, next) => {
    try {
        logger.info("Getting classes...");
        const classes = await getClasses();

        return res.status(200).json({
            success: true,
            message: "Successfully retrieved classes",
            data: classes,
        });
    } catch (error) {
        logger.error(`Error fetching classes: ${error.message}`);
        next(error);
    }
};

// GET /api/classes/:id
export const fetchClassById = async (req, res, next) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                error: "Fetch Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const cls = await getClassById(validation.data.id);

        return res.status(200).json({
            success: true,
            data: cls,
        });
    } catch (error) {
        logger.error(`Error fetching class: ${error.message}`);

        if (error.message === "Class not found") {
            return res.status(404).json({ success: false, error: error.message });
        }

        next(error);
    }
};

// POST /api/classes
export const postClass = async (req, res, next) => {
    try {
        logger.info("Creating class...");

        const validation = createClassSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "Create validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const cls = await createClass(validation.data);

        logger.info("Class created successfully!");
        return res.status(201).json({
            success: true,
            message: "Class created successfully!",
            data: cls,
        });
    } catch (error) {
        logger.error(`Error creating class: ${error.message}`);

        if (referenceErrors.includes(error.message)) {
            return res.status(400).json({ success: false, error: error.message });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: "A class with that name already exists for this grade",
            });
        }

        next(error);
    }
};

// PUT /api/classes/:id
export const updateClassById = async (req, res, next) => {
    try {
        const idValidation = mongoIdSchema.safeParse(req.params);
        if (!idValidation.success) {
            return res.status(400).json({
                error: "Update id Validation failed",
                details: formatValidationError(idValidation.error),
            });
        }

        const bodyValidation = updateClassSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({
                error: "Update validation failed",
                details: formatValidationError(bodyValidation.error),
            });
        }

        const cls = await updateClass(idValidation.data.id, bodyValidation.data);

        logger.info(`Class ${cls.name} updated successfully!`);
        return res.status(200).json({
            success: true,
            message: "Class updated successfully!",
            data: cls,
        });
    } catch (error) {
        logger.error(`Error updating class: ${error.message}`);

        if (error.message === "Class not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        if (referenceErrors.includes(error.message)) {
            return res.status(400).json({ success: false, error: error.message });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: "A class with that name already exists for this grade",
            });
        }

        next(error);
    }
};

// DELETE /api/classes/:id
export const deleteClassById = async (req, res, next) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        logger.info(`Deleting class by id: ${req.params.id}`);

        await deleteClass(validation.data.id);

        return res.status(200).json({
            success: true,
            message: "Class deleted successfully",
        });
    } catch (error) {
        logger.error(`Error deleting class: ${error.message}`);

        if (error.message === "Class not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        if (error.message === "Class is assigned to one or more teachers") {
            return res.status(409).json({ success: false, error: error.message });
        }

        next(error);
    }
};