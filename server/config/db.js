import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("DB connected"))
        await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
        console.error("Database connection failed:", error.message)
    }
}

export default connectDB