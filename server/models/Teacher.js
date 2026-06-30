import mongoose from 'mongoose'

const teacherSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
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
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true,
        },
        employeeCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        classesAssigned: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Class',
            default: [],
        },
        joinDate: {
            type: Date,
            required: true,
        },
        bio: {
            type: String,
            trim: true,
            default: '',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

// soft delete helper — filters out deleted teachers from any query
teacherSchema.pre(/^find/, function (next) {
    this.where({ isDeleted: false })
    next()
})

const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema)

export default Teacher