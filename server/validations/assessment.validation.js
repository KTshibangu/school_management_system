import { z } from "zod";
import { ASSESSMENT_TYPES } from "../constants/assessmentTypes.js";
import { SCHOOL_TERMS } from "../constants/schoolTerms.js";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const assessmentBaseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    type: z.enum(ASSESSMENT_TYPES, { error: `Type must be one of: ${ASSESSMENT_TYPES.join(", ")}` }),
    term: z.enum(SCHOOL_TERMS, { error: `Term must be one of: ${SCHOOL_TERMS.join(", ")}` }),
    class: objectIdSchema,
    dueDate: z.coerce.date(),
    maxScore: z.coerce.number({ error: "Max score must be a number" }).min(1, "Max score must be at least 1"),
});

export const createAssessmentSchema = assessmentBaseSchema;
export const updateAssessmentSchema = assessmentBaseSchema.partial();

export const mongoIdSchema = z.object({
    id: objectIdSchema,
});