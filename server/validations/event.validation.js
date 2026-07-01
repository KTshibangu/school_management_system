import { z } from "zod";
import { EVENT_TYPES } from "../constants/eventTypes.js";
import { EVENT_AUDIENCES } from "../constants/eventAudience.js";

// base schema with no refinements — required so .partial() works in Zod v4
const eventBaseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    type: z.enum(EVENT_TYPES, { error: `Type must be one of: ${EVENT_TYPES.join(", ")}` }),
    audience: z.enum(EVENT_AUDIENCES, { error: `Audience must be one of: ${EVENT_AUDIENCES.join(", ")}` }),
    location: z.string().min(1, "Location is required"),
    startDateTime: z.coerce.date(),
    endDateTime: z.coerce.date(),
});

// refinement applied after the base — create always has both dates so this is safe
export const createEventSchema = eventBaseSchema.refine(
    (data) => data.endDateTime > data.startDateTime,
    {
        message: "End date and time must be after start date and time",
        path: ["endDateTime"],
    }
);

// .partial() on the base (no refinement), then refine separately
export const updateEventSchema = eventBaseSchema.partial().refine(
    (data) => {
        // only validate order if both dates are present in the update
        if (data.startDateTime && data.endDateTime) {
            return data.endDateTime > data.startDateTime;
        }
        return true;
    },
    {
        message: "End date and time must be after start date and time",
        path: ["endDateTime"],
    }
);

export const mongoIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID"),
});