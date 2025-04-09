import z from "zod";

export const feedbackSchema = z.object({
  referenceCode: z.string(),
  feedback: z
    .string()
    .max(100, "Feedback should not exceed 100 characters")
    .refine((val) => val.trim().length > 0, "Description cannot be just spaces")
    .optional(),
});
