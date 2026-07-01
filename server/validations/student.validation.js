import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const createStudentSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    parentName: z.string().min(2, "Parent name must be at least 2 characters"),
    parentCell: z.string().min(5, "Parent cell number is required"),
    class: objectIdSchema,
});

export const updateStudentSchema = createStudentSchema.partial();

export const mongoIdSchema = z.object({
    id: objectIdSchema,
});