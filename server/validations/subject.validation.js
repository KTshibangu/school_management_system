import { z } from "zod";

export const createSubjectSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
    code: z.string().min(1, "Subject code is required"),
    grade: z.string().min(1, "Grade is required"),
    term1: z.string().min(1, "Term 1 is required"),
    term2: z.string().min(1, "Term 2 is required"),
    term3: z.string().min(1, "Term 3 is required"),
    term4: z.string().min(1, "Term 4 is required"),
});

export const updateSubjectSchema = createSubjectSchema.partial();

export const mongoIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID"),
});