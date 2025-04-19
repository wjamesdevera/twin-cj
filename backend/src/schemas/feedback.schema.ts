import z from "zod";
import { nameSchema } from "./service.schemas";

export const feedbackSchema = z.object({
  referenceCode: z.string(),
  name: nameSchema,
  feedback: z
    .string()
    .max(200, "Feedback should not exceed 200 characters")
    .refine((val) => val.trim().length > 0, "Description cannot be just spaces")
    .optional(),
});

export const updateFeedbackSchema = z.object({
  statusId: z.number().gt(0),
});
