import { z } from "zod";
 
export const updateProfileSchema = z.object({
    bio: z.string().optional(),
    phone: z.string().min(5, "Phone number is required").optional(),
}).refine(
    (data) => data.bio !== undefined || data.phone !== undefined,
    { message: "At least one field (bio or phone) must be provided" }
);
 