import Student from "../models/Student.js";
import Class from "../models/Class.js";
import logger from "../config/logger.js";

const assertClassExists = async (classId) => {
    const exists = await Class.exists({ _id: classId });
    if (!exists) throw new Error("Class not found");
};

// GET /api/students
export const getStudents = async () => {
    const students = await Student.find()
        .sort({ lastName: 1, firstName: 1 })
        .populate("class", "name grade")
        .lean();

    return students.map((student) => ({
        ...student,
        id: student._id.toString(),
    }));
};

// GET /api/students/:id
export const getStudentById = async (id) => {
    const student = await Student.findById(id)
        .populate("class", "name grade")
        .lean();
    if (!student) throw new Error("Student not found");

    return { ...student, id: student._id.toString() };
};

// POST /api/students
export const createStudent = async (data) => {
    const { firstName, lastName, parentName, parentCell, class: classId } = data;

    await assertClassExists(classId);

    const student = await Student.create({
        firstName,
        lastName,
        parentName,
        parentCell,
        class: classId,
    });

    logger.info(`Student ${firstName} ${lastName} created successfully`);
    return student;
};

// PUT /api/students/:id
export const updateStudent = async (id, data) => {
    const { class: classId } = data;

    const student = await Student.findById(id);
    if (!student) throw new Error("Student not found");

    if (classId !== undefined) await assertClassExists(classId);

    const updatedStudent = await Student.findByIdAndUpdate(
        id,
        {
            ...(data.firstName  !== undefined && { firstName: data.firstName }),
            ...(data.lastName   !== undefined && { lastName: data.lastName }),
            ...(data.parentName !== undefined && { parentName: data.parentName }),
            ...(data.parentCell !== undefined && { parentCell: data.parentCell }),
            ...(classId         !== undefined && { class: classId }),
        },
        { new: true, runValidators: true }
    );

    logger.info(`Student ${updatedStudent.firstName} ${updatedStudent.lastName} updated successfully`);
    return updatedStudent;
};

// DELETE /api/students/:id
export const deleteStudent = async (id) => {
    const student = await Student.findByIdAndDelete(id);
    if (!student) throw new Error("Student not found");

    logger.info(`Student ${student.firstName} ${student.lastName} deleted`);
};