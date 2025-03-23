import { z } from "zod";

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters long")
  .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
  .transform((val) => val.replace(/\s+/g, " ").trim());

export const descriptionSchema = z
  .string()
  .min(1, "Description is required")
  .max(100, "Description should not exceed 100 characters")
  .refine((val) => val.trim().length > 0, "Description cannot be just spaces");

export const priceSchema = z.number().gt(0);

export const serviceSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  price: priceSchema,
});

export const capacitySchema = z.number().gt(0);

export const cabinSchema = serviceSchema
  .extend({
    minCapacity: capacitySchema,
    maxCapacity: capacitySchema,
  })
  .refine((data) => data.minCapacity < data.maxCapacity, {
    message: "Min capacity should be less than Max capacity",
    path: ["minCapacity"],
  });

export const deleteItemsSchema = z.object({
  ids: z
    .string()
    .refine((value) => value.split(",").every((id) => !isNaN(Number(id))), {
      message: "Invalid ID format. IDs must be comma-separated numbers.",
    })
    .transform((value) => value.split(",").map(Number)), // Convert to number array
});
