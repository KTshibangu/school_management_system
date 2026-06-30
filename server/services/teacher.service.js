import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import Subject from "../models/Subject.js";
import Class from "../models/Class.js"
import logger from "../config/logger.js";

/**
 * TEMPLATE NOTE:
 * Services must never import or reference req, res, or next.
 * They receive plain arguments, return plain values, and throw plain Errors.
 * HTTP status codes and res.json() belong exclusively in the controller.
 */


// Throws if the given subject id doesn't exist
const assertSubjectExists = async (subjectId, session) => {
    const exists = await Subject.exists({ _id: subjectId }).session(session);
    if (!exists) throw new Error("Subject not found");
};

// Throws if any of the given class ids don't exist
const assertClassesExist = async (classIds, session) => {
    if (!classIds || classIds.length === 0) return;

    const count = await Class.countDocuments({ _id: { $in: classIds } }).session(session);
    if (count !== classIds.length) throw new Error("One or more classes not found");
};


// GET /api/teachers
export const getTeachers = async () => {
    const teachers = await Teacher.find()
        .sort({ createdAt: -1 })
        .populate("userId", "email role")
        .populate("subject", "name") 
        .populate("classesAssigned", "name")
        .lean();

    return teachers.map((teacher) => ({
        ...teacher,
        id: teacher._id.toString(),
        user: teacher.userId
            ? { email: teacher.userId.email, role: teacher.userId.role }
            : null,
    }));
};


// POST /api/teachers
export const createTeacher = async (data) => {
    const {
        firstName, lastName, email, phone, subject,
        employeeCode, classesAssigned, joinDate, password,
        role, bio,
    } = data;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await assertSubjectExists(subject, session);
        await assertClassesExist(classesAssigned, session);

        const hashed = await bcrypt.hash(password, 10);

        const [user] = await User.create(
            [{ email, password: hashed, role: role || "TEACHER" }],
            { session }
        );

        const [teacher] = await Teacher.create(
            [{
                userId: user._id,
                firstName,
                lastName,
                email,
                phone,
                subject,
                employeeCode,
                classesAssigned: classesAssigned || [],
                joinDate: new Date(joinDate),
                bio: bio || "",
            }],
            { session }
        );

        await session.commitTransaction();

        logger.info(`Teacher ${email} created successfully`);
        return teacher;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};


// PUT /api/teachers/:id
export const updateTeacher = async (id, data) => {
    const {
        firstName, lastName, email, phone, subject,
        employeeCode, classesAssigned, bio, password, role,
    } = data;

    const teacher = await Teacher.findById(id);
    if (!teacher) throw new Error("Teacher not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (subject !== undefined) await assertSubjectExists(subject, session);
        if (classesAssigned !== undefined) await assertClassesExist(classesAssigned, session);

        const teacherUpdate = {
            ...(firstName    !== undefined && { firstName }),
            ...(lastName     !== undefined && { lastName }),
            ...(email        !== undefined && { email }),
            ...(phone        !== undefined && { phone }),
            ...(subject      !== undefined && { subject }),
            ...(employeeCode !== undefined && { employeeCode }),
            ...(classesAssigned !== undefined && { classesAssigned }),
            ...(bio          !== undefined && { bio }),
        };

        const updatedTeacher = await Teacher.findByIdAndUpdate(
            id,
            teacherUpdate,
            { new: true, runValidators: true, session }
        );

        const userUpdate = {
            ...(email    !== undefined && { email }),
            ...(role     !== undefined && { role }),
            ...(password !== undefined && { password: await bcrypt.hash(password, 10) }),
        };

        if (Object.keys(userUpdate).length > 0) {
            await User.findByIdAndUpdate(teacher.userId, userUpdate, { session });
        }

        await session.commitTransaction();

        logger.info(`Teacher ${updatedTeacher.email} updated successfully`);
        return updatedTeacher;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};


// DELETE /api/teachers/:id
export const deleteTeacher = async (id) => {
    const teacher = await Teacher.findById(id);
    if (!teacher) throw new Error("Teacher not found");

    teacher.isDeleted = true;
    await teacher.save();

    await User.findByIdAndUpdate(teacher.userId, { isActive: false });

    logger.info(`Teacher ${teacher.email} soft-deleted`);
};