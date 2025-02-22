import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string({ message: "Name is required" }),
  description: z.string({ message: "Description is required" }),
  quantity: z.number({ message: "Quantity required" }).int(),
  price: z.number({ message: "Price required" }),
});

export const cabinSchema = serviceSchema
  .extend({
    minCapacity: z.number().int(),
    maxCapacity: z.number().int(),
  })
  .refine((data) => data.minCapacity < data.maxCapacity, {
    message: "Min capacity should be less than Max capacity",
    path: ["minCapacity"],
  });
