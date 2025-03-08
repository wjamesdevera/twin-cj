import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string({ message: "Name is required" }),
  description: z.string({ message: "Description is required" }),
  price: z.number({ message: "Price required" }),
  additionalFee: z
    .object({
      type: z.string().optional(),
      description: z.string().optional(),
      amount: z.number().optional(),
    })
    .optional(),
});

export const cabinSchema = serviceSchema
  .extend({
    minCapacity: z.number().int(),
    maxCapacity: z.number().int(),
    additionalFee: z
      .object({
        type: z.string().min(1, "Fee type is required"),
        description: z.string().optional(),
        amount: z.number().positive("Amount must be greater than 0"),
      })
      .optional(),
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
