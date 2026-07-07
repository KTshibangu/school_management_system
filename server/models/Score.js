import mongoose from 'mongoose'
import { GRADE_LEVEL } from '../constants/gradeLevel.js'

const scoreSchema = new mongoose.Schema(
    {
        gradeLevel: {
            type: String,
            enum: GRADE_LEVEL,
            required: true,
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true,
        },
        assessment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assessment',
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        score: {
            type: Number,
            required: true,
            min: [0, "Score cannot be negative"],
        },
        maxScore: {
            type: Number,
            required: true,
            min: [1, "Max score must be at least 1"],
        },
        remarks: {
            type: String,
            trim: true,
            default: '',
        },
        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// one grade per student per assessment — enforced at DB level
scoreSchema.index({ student: 1, assessment: 1 }, { unique: true })

// common lookup patterns
scoreSchema.index({ class: 1 })
scoreSchema.index({ gradedBy: 1 })

// guard: score cannot exceed maxScore
scoreSchema.pre('save', function () {
    if (this.score > this.maxScore) {
        return next(new Error("Score cannot exceed max score"))
    }
})

const Score = mongoose.models.Score || mongoose.model('Score', scoreSchema)

export default Score