import Event from "../models/Event.js";
import logger from "../config/logger.js";

// GET /api/events
export const getEvents = async () => {
    const events = await Event.find()
        .sort({ startDateTime: 1 })
        .lean();

    return events.map((event) => ({
        ...event,
        id: event._id.toString(),
    }));
};

// GET /api/events/:id
export const getEventById = async (id) => {
    const event = await Event.findById(id).lean();
    if (!event) throw new Error("Event not found");

    return { ...event, id: event._id.toString() };
};

// POST /api/events
export const createEvent = async (data) => {
    const event = await Event.create(data);

    logger.info(`Event "${event.title}" created successfully`);
    return event;
};

// PUT /api/events/:id
export const updateEvent = async (id, data) => {
    const event = await Event.findById(id);
    if (!event) throw new Error("Event not found");

    const { title, description, type, audience, status, location, startDateTime, endDateTime } = data;

    // resolve final start/end for the date-order check —
    // use incoming value if provided, otherwise fall back to what's already saved
    const resolvedStart = startDateTime ?? event.startDateTime;
    const resolvedEnd   = endDateTime   ?? event.endDateTime;

    if (resolvedEnd <= resolvedStart) {
        throw new Error("End date and time must be after start date and time");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
        id,
        {
            ...(title         !== undefined && { title }),
            ...(description   !== undefined && { description }),
            ...(type          !== undefined && { type }),
            ...(audience      !== undefined && { audience }),
            ...(status          !== undefined && { status }),
            ...(location      !== undefined && { location }),
            ...(startDateTime !== undefined && { startDateTime }),
            ...(endDateTime   !== undefined && { endDateTime }),
        },
        { new: true, runValidators: true }
    );

    logger.info(`Event "${updatedEvent.title}" updated successfully`);
    return updatedEvent;
};

// DELETE /api/events/:id
export const deleteEvent = async (id) => {
    const event = await Event.findByIdAndDelete(id);
    if (!event) throw new Error("Event not found");

    logger.info(`Event "${event.title}" deleted`);
};