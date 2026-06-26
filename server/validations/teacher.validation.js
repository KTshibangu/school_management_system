import { z } from 'zod'
 
export const createTeacherSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5, "Phone number is required"),
    subject: z.string().min(1, "Subject is required"),
    employeeCode: z.string().min(1, "Employee code is required"),
    classesAssigned: z.array(z.string()).optional(),
    joinDate: z.coerce.date(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["ADMIN", "TEACHER"]).optional(),
    bio: z.string().optional(),
});
 
export const updateTeacherSchema = createTeacherSchema.partial();
 
export const mongoIdSchema = z.object({
    id: z.string().regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid MongoDB ID"
    ),
});
 