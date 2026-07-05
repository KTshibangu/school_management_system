import logger from "../config/logger.js";
import { getStudents, getStudentById, createStudent, updateStudent, deleteStudent } from "../services/student.service.js";
import { createStudentSchema, updateStudentSchema, mongoIdSchema } from "../validations/student.validation.js";
import { formatValidationError } from "../utils/format.js";

const referenceErrors = ["Class not found"];

// GET /api/students
export const fetchAllStudents = async (req, res, next) => {
    try {
        logger.info("Getting students...");
        const students = await getStudents();
        console.log("Student data:", JSON.stringify(students, null, 2));

        return res.status(200).json({
            success: true,
            message: "Successfully retrieved students",
            data: students,
        });
    } catch (error) {
        logger.error(`Error fetching students: ${error.message}`);
        next(error);
    }
};

// GET /api/students/:id
export const fetchStudentById = async (req, res, next) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                error: "Fetching Student Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const student = await getStudentById(validation.data.id);

        return res.status(200).json({
            success: true,
            data: student,
        });
    } catch (error) {
        logger.error(`Error fetching student: ${error.message}`);

        if (error.message === "Student not found") {
            return res.status(404).json({ success: false, error: error.message });
        }

        next(error);
    }
};

// POST /api/students
export const postStudent = async (req, res, next) => {
    try {
        logger.info("Creating student...");

        const validation = createStudentSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "Create validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const student = await createStudent(validation.data);

        logger.info("Student created successfully!");
        return res.status(201).json({
            success: true,
            message: "Student created successfully!",
            data: student,
        });
    } catch (error) {
        logger.error(`Error creating student: ${error.message}`);

        if (referenceErrors.includes(error.message)) {
            return res.status(400).json({ success: false, error: error.message });
        }

        next(error);
    }
};

// PUT /api/students/:id
export const updateStudentById = async (req, res, next) => {
    try {
        const idValidation = mongoIdSchema.safeParse(req.params);
        if (!idValidation.success) {
            return res.status(400).json({
                error: "Id Validation failed",
                details: formatValidationError(idValidation.error),
            });
        }

        const bodyValidation = updateStudentSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({
                error: "Update validation failed",
                details: formatValidationError(bodyValidation.error),
            });
        }

        const student = await updateStudent(idValidation.data.id, bodyValidation.data);

        logger.info(`Student ${student.firstName} ${student.lastName} updated successfully!`);
        return res.status(200).json({
            success: true,
            message: "Student updated successfully!",
            data: student,
        });
    } catch (error) {
        logger.error(`Error updating student: ${error.message}`);

        if (error.message === "Student not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        if (referenceErrors.includes(error.message)) {
            return res.status(400).json({ success: false, error: error.message });
        }

        next(error);
    }
};

// DELETE /api/students/:id
export const deleteStudentById = async (req, res, next) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                error: "Delete Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        logger.info(`Deleting student by id: ${req.params.id}`);

        await deleteStudent(validation.data.id);

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully",
        });
    } catch (error) {
        logger.error(`Error deleting student: ${error.message}`);

        if (error.message === "Student not found") {
            return res.status(404).json({ success: false, error: error.message });
        }

        next(error);
    }
};