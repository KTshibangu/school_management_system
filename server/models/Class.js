import mongoose from 'mongoose'

const classSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        grade: {
            type: String,
            required: true,
            trim: true,
        },
        classSubjects: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Subject',
            default: [],
        },
    },
    {
        timestamps: true,
    }
)
 
// only one "8A" per grade — same pattern as Subject's name+grade constraint
classSchema.index({ name: 1, grade: 1 }, { unique: true })

const Class = mongoose.models.Class || mongoose.model('Class', classSchema)

export default Class