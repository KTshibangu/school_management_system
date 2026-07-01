import logger from "../config/logger.js";
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../services/event.service.js";
import { createEventSchema, updateEventSchema, mongoIdSchema } from "../validations/event.validation.js";
import { formatValidationError } from "../utils/format.js";

const dateOrderError = "End date and time must be after start date and time";

// GET /api/events
export const fetchAllEvents = async (req, res, next) => {
    try {
        logger.info("Getting events...");
        const events = await getEvents();

        return res.status(200).json({
            success: true,
            message: "Successfully retrieved events",
            data: events,
        });
    } catch (error) {
        logger.error(`Error fetching events: ${error.message}`);
        next(error);
    }
};

// GET /api/events/:id
export const fetchEventById = async (req, res, next) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                error: "AFetch by Id Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const event = await getEventById(validation.data.id);

        return res.status(200).json({
            success: true,
            data: event,
        });
    } catch (error) {
        logger.error(`Error fetching event: ${error.message}`);

        if (error.message === "Event not found") {
            return res.status(404).json({ success: false, error: error.message });
        }

        next(error);
    }
};

// POST /api/events
export const postEvent = async (req, res, next) => {
    try {
        logger.info("Creating event...");

        const validation = createEventSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "Create validation failed",
                details: formatValidationError(validation.error),
            });
        }

        const event = await createEvent(validation.data);

        logger.info("Event created successfully!");
        return res.status(201).json({
            success: true,
            message: "Event created successfully!",
            data: event,
        });
    } catch (error) {
        logger.error(`Error creating event: ${error.message}`);

        if (error.message === dateOrderError) {
            return res.status(400).json({ success: false, error: error.message });
        }

        next(error);
    }
};

// PUT /api/events/:id
export const updateEventById = async (req, res, next) => {
    try {
        const idValidation = mongoIdSchema.safeParse(req.params);
        if (!idValidation.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: formatValidationError(idValidation.error),
            });
        }

        const bodyValidation = updateEventSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({
                error: "Update validation failed",
                details: formatValidationError(bodyValidation.error),
            });
        }

        const event = await updateEvent(idValidation.data.id, bodyValidation.data);

        logger.info(`Event "${event.title}" updated successfully!`);
        return res.status(200).json({
            success: true,
            message: "Event updated successfully!",
            data: event,
        });
    } catch (error) {
        logger.error(`Error updating event: ${error.message}`);

        if (error.message === "Event not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        if (error.message === dateOrderError) {
            return res.status(400).json({ success: false, error: error.message });
        }

        next(error);
    }
};

// DELETE /api/events/:id
export const deleteEventById = async (req, res, next) => {
    try {
        const validation = mongoIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: formatValidationError(validation.error),
            });
        }

        logger.info(`Deleting event by id: ${req.params.id}`);

        await deleteEvent(validation.data.id);

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        logger.error(`Error deleting event: ${error.message}`);

        if (error.message === "Event not found") {
            return res.status(404).json({ success: false, error: error.message });
        }

        next(error);
    }
};