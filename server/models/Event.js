import mongoose from 'mongoose'
import { EVENT_TYPES } from '../constants/eventTypes.js'
import { EVENT_AUDIENCES } from '../constants/eventAudience.js'




const eventSchema = new mongoose.Schema(
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
            enum: EVENT_TYPES,
            required: true,
        },
        audience: {
            type: String,
            enum: EVENT_AUDIENCES,
            required: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        startDateTime: {
            type: Date,
            required: true,
        },
        endDateTime: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// guard: end must always be after start at the DB level
eventSchema.pre('save', function (next) {
    if (this.endDateTime <= this.startDateTime) {
        return next(new Error("End date and time must be after start date and time"))
    }
    next()
})

// index for date-range queries — expected to be the most common lookup pattern
eventSchema.index({ startDateTime: 1 })

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema)

export default Event