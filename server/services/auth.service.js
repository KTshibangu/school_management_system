import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const loginUser = async ({ email, password, role }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    // Role gate: only check when the caller specifies which portal they're logging into
    if (role === "admin" && user.role !== "ADMIN") {
        throw new Error("Not authorized as admin");
    }
    if (role === "teacher" && user.role !== "TEACHER") {
        throw new Error("Not authorized as teacher");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    const payload = {
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    return { user: payload, token };
};


export const changeUserPassword = async (userId, { currentPassword, newPassword }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new Error("Current password is incorrect");

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashed });
};