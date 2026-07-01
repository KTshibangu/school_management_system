import mongoose from 'mongoose'
import { ASSESSMENT_TYPES } from '../constants/assessmentTypes.js'
import { SCHOOL_TERMS } from '../constants/schoolTerms.js'



const assessmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ASSESSMENT_TYPES,
            required: true,
        },
        term: {
            type: String,
            enum: SCHOOL_TERMS,
            required: true,
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        maxScore: {
            type: Number,
            required: true,
            min: [1, "Max score must be at least 1"],
        },
    },
    {
        timestamps: true,
    }
)

// fast lookup of all assessments for a class or by a teacher — both expected to be frequent
assessmentSchema.index({ class: 1 })
assessmentSchema.index({ createdBy: 1 })

const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema)

export default Assessment