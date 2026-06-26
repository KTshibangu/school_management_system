import logger from "../config/logger";
import { getTeachers, updateTeacher, createTeacher, deleteTeacher } from "../services/teacher.service";
import { createTeacherSchema, updateTeacherSchema, mongoIdSchema } from "../validations/teacher.validation";
import { formatValidationError } from "../utils/format";

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

        const teacher = await createTeacher(req.body);

        logger.info('Teacher created successfully!');
        return res.status(201).json({
            message: 'Teacher created successfully!',
            success: true,
            data: teacher,
        });
    } catch (error) {
        logger.error(`Error creating teacher: ${error.message}`);
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

export const updateTeacherById = async (req, res, next) => {
    try {
        logger.info(`Updating teacher by id: ${req.params.id}`);

        const idValidation = mongoIdSchema.safeParse(req.params);

        if (!idValidation.success) {
            return res.status(400).json({
                error: 'Update Validation failed',
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

        const { id } = idValidation.data;
        const updates = bodyValidation.data;

        const updatedTeacher = await updateTeacher(id, updates);

        logger.info(`Teacher ${updatedTeacher?.email} updated successfully!`);
        return res.status(200).json({
            message: 'Teacher updated successfully!',
            success: true,
            data: updatedTeacher,
        });
    } catch (error) {
        logger.error(`Error updating Teacher: ${error.message}`);
        return res.status(
            error.message === "Teacher not found" ? 404 : 400
        ).json({
            success: false,
            error: error.message,
        });
    }
};

export const deleteTeacherById = async (req, res) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);

        if (!validation.success) {
            return res.status(400).json({
                error: "Delete Validation failed",
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
        return res.status(
            error.message === "Teacher not found" ? 404 : 400
        ).json({
            success: false,
            error: error.message,
        });
    }
};