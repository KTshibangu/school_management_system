import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const createClassSchema = z.object({
    name: z.string().min(1, "Class name is required"),
    grade: z.string().min(1, "Grade is required"),
    classSubjects: z.array(objectIdSchema).optional(),
});

export const updateClassSchema = createClassSchema.partial();

export const mongoIdSchema = z.object({
    id: objectIdSchema,
});