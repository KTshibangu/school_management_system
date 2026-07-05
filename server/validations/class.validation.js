import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const classesSubjectsSchema = z.preprocess((val) => {
    if (typeof val === "string") {
        return val === "" ? [] : val.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return val;
}, z.array(objectIdSchema).optional());

export const createClassSchema = z.object({
    name: z.string().min(1, "Class name is required"),
    grade: z.string().min(1, "Grade is required"),
    classSubjects: classesSubjectsSchema,
});

export const updateClassSchema = createClassSchema.partial();

export const mongoIdSchema = z.object({
    id: objectIdSchema,
});