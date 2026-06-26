import logger from "../config/logger";
import { getTeachers, updateTeacher, createTeacher, deleteTeacher } from "../services/teacher.service";
import { createTeacherSchema, updateTeacherSchema, mongoIdSchema } from "../validations/teacher.validation";
import { formatValidationError } from "../utils/format";

/**
 * TEMPLATE NOTE:
 * Controllers own the HTTP layer only — validate input, call the service,
 * map return values / errors to HTTP responses. No DB logic lives here.
 *
 * Pattern for every handler:
 *  1. Validate input (Zod)
 *  2. Call service with plain data
 *  3. Return HTTP response
 *  4. Catch → map known error messages to status codes, default to 500
 */


export const fetchAllTeachers = async (req, res, next) => {
    try {
        logger.info("Getting teachers...")
        const teachers = await getTeachers();

        return res.status(200).json({
            message: 'Successfully retrieved teachers',
            success: true,
            data: teachers,
        });
    } catch (error) {
        logger.error(error)
        next(error)
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

export const postTeacher = async (req, res, next) => {
    try {
        logger.info("Creating teacher...")

        const validationResult = createTeacherSchema.safeParse(req.body)
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Create validation failed',
                details: formatValidationError(validationResult.error),
            });
        }

        const teacher = await createTeacher(validationResult.data);

        logger.info('Teacher created successfully!');
        return res.status(201).json({
            message: 'Teacher created successfully!',
            success: true,
            data: teacher,
        });
    } catch (error) {
        logger.error(`Error creating teacher: ${error.message}`);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: "A teacher with that email or employee code already exists",
            });
        }
        next(error)
    }
};

export const updateTeacherById = async (req, res, next) => {
    try {
        logger.info(`Updating teacher by id: ${req.params.id}`);

        const idValidation = mongoIdSchema.safeParse(req.params);
        if (!idValidation.success) {
            return res.status(400).json({
                error: 'Id Validation failed',
                details: formatValidationError(idValidation.error),
            });
        }

        // Validate the request body
        const bodyValidation = updateTeacherSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({
                error: 'Update Validation failed',
                details: formatValidationError(bodyValidation.error),
            });
        }

        const updatedTeacher = await updateTeacher(idValidation.data.id, bodyValidation.data);

        logger.info(`Teacher ${updatedTeacher?.email} updated successfully!`);
        return res.status(200).json({
            message: 'Teacher updated successfully!',
            success: true,
            data: updatedTeacher,
        });
    } catch (error) {
        logger.error(`Error updating Teacher: ${error.message}`);
        if (error.message === "Teacher not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: "A teacher with that email or employee code already exists",
            });
        }

        next(error);
    }
};

export const deleteTeacherById = async (req, res) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);

        if (!validation.success) {
            return res.status(400).json({
                error: "Id Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        logger.info(`Deleting teacher by id: ${req.params.id}`);

        await deleteTeacher(validation.data.id);

        return res.status(200).json({
            success: true,
            message: "Teacher deleted successfully",
        });
    } catch (error) {
        logger.error(`Error deleting teacher: ${error.message}`);
        if (error.message === "Teacher not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
 
        next(error);
    }
};