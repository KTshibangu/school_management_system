import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGODB_URI
    if(!uri) throw new Error("MONGODB_URI is not set!")
    try {
        mongoose.connection.on('connected', () => console.log("DB connected"))
        await mongoose.connect(uri)
    } catch (error) {
        console.error("Database connection failed:", error.message)
        throw error
    }
}

export default connectDB