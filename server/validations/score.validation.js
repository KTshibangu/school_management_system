import { z } from "zod";
import { GRADE_LEVEL } from "../constants/gradeLevel.js";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const scoreBaseSchema = z.object({
    gradeLevel: z.enum(GRADE_LEVEL, { error: `Grade level must be one of: ${GRADE_LEVEL.join(", ")}` }),
    class: objectIdSchema,
    assessment: objectIdSchema,
    student: objectIdSchema,
    score: z.number({ error: "Score must be a number" }).min(0, "Score cannot be negative"),
    maxScore: z.number({ error: "Max score must be a number" }).min(1, "Max score must be at least 1"),
    remarks: z.string().optional(),
});

export const createScoreSchema = scoreBaseSchema.refine(
    (data) => data.score <= data.maxScore,
    {
        message: "Score cannot exceed max score",
        path: ["score"],
    }
);

export const updateScoreSchema = scoreBaseSchema.partial().refine(
    (data) => {
        if (data.score !== undefined && data.maxScore !== undefined) {
            return data.score <= data.maxScore;
        }
        return true;
    },
    {
        message: "Score cannot exceed max score",
        path: ["score"],
    }
);

export const mongoIdSchema = z.object({
    id: objectIdSchema,
});