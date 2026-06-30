import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        grade: {
            type: String,
            required: true,
            trim: true,
        },
        term1: {
            type: String,
            required: true,
            trim: true,
        },
        term2: {
            type: String,
            required: true,
            trim: true,
        },
        term3: {
            type: String,
            required: true,
            trim: true,
        },
        term4: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

// belt-and-braces: same name should not repeat for the same grade
// (e.g. two "Mathematics" entries both for grade 8), even though code is the
// real unique key — this catches accidental duplicate entry at the data level.
subjectSchema.index({ name: 1, grade: 1 }, { unique: true })

const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema)

export default Subject