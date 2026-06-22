import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['ADMIN', 'TEACHER'],
        default: 'TEACHER',
    }
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User