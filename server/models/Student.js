import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        parentName: {
            type: String,
            required: true,
            trim: true,
        },
        parentCell: {
            type: String,
            required: true,
            trim: true,
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// index for fast lookup of all students in a class — expected to be a frequent query
studentSchema.index({ class: 1 })

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema)

export default Student