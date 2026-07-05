import Teacher from "../models/Teacher.js";

export const getProfile = async (user) => {
    const teacher = await Teacher.findOne({ userId: user.userId }).lean();

    // Authenticated user is an ADMIN with no Teacher record — return a minimal admin profile
    if (!teacher) {
        return {
            firstName: "Administrator",
            lastName: "",
            email: user.email,
        };
    }

    return teacher;
};

export const updateProfile = async (user, updates) => {
    const teacher = await Teacher.findOne({ userId: user.userId });
    if (!teacher) throw new Error("Teacher not found");

    // isDeleted is caught by the pre-find middleware on most queries, but
    // findOne can still return a result if bypassed — guard explicitly here
    if (teacher.isDeleted) throw new Error("Account is deactivated");

    const { bio, phone } = updates;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
        teacher._id,
        {
            ...(bio !== undefined && { bio }),
            ...(phone !== undefined && { phone }),
        },
        { new: true, runValidators: true }
    );

    return updatedTeacher;
};