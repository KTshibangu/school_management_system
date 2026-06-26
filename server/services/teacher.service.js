import Teacher from "../models/Teacher.js"
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import logger from "../config/logger.js";

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

export const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, password, role, bio, subject, employeeCode, classesAssigned
        } = req.body;

        const teacher = await Teacher.findByIdAndUpdate(id);
        if (!teacher) return res.status(404).json({ error: "Teacher not found" })

        await Teacher.findByIdAndUpdate(id, {
            firstName,
            lastName,
            email,
            phone,
            subject,
            employeeCode,
            classesAssigned,
            bio
        })

        // Update user record
        const userUpdate = {}
        if (email) userUpdate.email = email;
        if (role) userUpdate.role = role;
        if (password) userUpdate.password = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(teacher.userId, userUpdate)

        return res.json({ success: true })

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already exists" })
        }
        logger.error("Update teacher error:", error)
        return res.status(500).json({ error: "Failed to update teacher" })
    }

}

// DELETE teacher
// DELETE /api/teacher/:id
export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        const teacher = await Teacher.findById(id)
        if (!teacher) return res.status(404).json({ error: "teacher Not Found" })

        teacher.isDeleted = true;
        await teacher.save()
        return res.json({ success: true })
    } catch (error) {
        logger.error("Delete teacher error:", error)
        return res.status(500).json({ error: "Failed To Delete teacher" })
    }
}