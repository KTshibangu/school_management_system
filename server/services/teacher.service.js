import Teacher from "../models/Teacher.js"
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import logger from "../config/logger.js";
import mongoose from "mongoose";

/**
 * TEMPLATE NOTE:
 * Services must never import or reference req, res, or next.
 * They receive plain arguments, return plain values, and throw plain Errors.
 * HTTP status codes and res.json() belong exclusively in the controller.
 */
 

//GET Teachers
// GET /api/teachers


export const getTeachers = async () => {
    const teachers = await Teacher.find()
        .sort({ createdAt: -1 })
        .populate("userId", "email role")
        .lean();

    return teachers.map((teach) => ({
        ...teach,
        id: teach._id.toString(),
        user: teach.userId
            ? { email: teach.userId.email, role: teach.userId.role } : null
    }))
}


//Create Teachers
// POST /api/teachers

export const createTeacher = async (data) => {
    const {
        firstName, lastName, email, phone, subject, employeeCode, classesAssigned,
        joinDate, password, role, bio
    } = data;

    // fix: wrap two-collection write in a transaction to prevent orphaned User records
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const hashed = await bcrypt.hash(password, 10)

        const [user] = await User.create(
            [{ email, password: hashed, role: role || "TEACHER" }],
            { session }
        )

        const [teacher] = await Teacher.create(
            [{
                userId: user._id,
                firstName,
                lastName,
                email,  // kept here only while email still exists on the Teacher model
                phone,
                subject,
                employeeCode,
                classesAssigned: classesAssigned || [],
                joinDate: new Date(joinDate),
                bio: bio || "",
            }],
            { session }
        );

        await session.commitTransaction()

        logger.info(`Teacher ${email} created successfully`);
        return teacher;

    } catch (error) {
        await session.abortTransaction()
        throw Error
    } finally {
        session.endSession()
    }



    const teacher = await Teacher.create({
        userId: user._id,
        firstName,
        lastName,
        email,
        phone,
        subject,
        employeeCode,
        classesAssigned: classesAssigned || [],
        joinDate: new Date(joinDate),
        bio: bio || ""
    })

    return res.status(201).json({ success: true, teacher })
}

//Update teacher
// PUT /api/teacher/:id

export const updateTeacher = async (id, data) => {
    const {
        firstName, lastName, email, phone, password, role,
        bio, subject, employeeCode, classesAssigned
    } = data;

    const teacher = await Teacher.findById(id);
    if (!teacher) throw new Error("Teacher not found")

    const session = await mongoose.startSession();
    session.startTransaction()

    try {
        const teacherUpdate = {
            ...(firstName !== undefined && { firstName }),
            ...(lastName !== undefined && { lastName }),
            ...(email !== undefined && { email }),
            ...(phone !== undefined && { phone }),
            ...(subject !== undefined && { subject }),
            ...(employeeCode !== undefined && { employeeCode }),
            ...(classesAssigned !== undefined && { classesAssigned }),
            ...(bio !== undefined && { bio }),
        };

        const updatedTeacher = await Teacher.findByIdAndUpdate(
            id,
            teacherUpdate,
            { new: true, runValidators: true, session }
        )

        const userUpdate = {
            ...(email !== undefined && { email }),
            ...(role !== undefined && { role }),
            ...(password !== undefined && { password: await bcrypt.hash(password, 10) }),
        }

        if (Object.keys(userUpdate).length > 0) {
            await User.findByIdAndUpdate(teacher.userId, userUpdate, { session });
        }

        await session.commitTransaction()

        logger.info(`Teacher ${updatedTeacher.email} updated successfully`);
        return updatedTeacher;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession()
    }
}

// DELETE teacher
// DELETE /api/teacher/:id
export const deleteTeacher = async (id) => {
    try {
        const teacher = await Teacher.findById(id);
        if (!teacher) throw new Error("Teacher not found");

        teacher.isDeleted = true;
        await teacher.save()

        // deactivate the linked User account so they can no longer log in
        await User.findByIdAndUpdate(teacher.userId, { isActive: false });

    

    } catch (error) {
        logger.error("Delete teacher error:", error)
    }
}