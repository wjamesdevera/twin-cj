import { z } from "zod";

export const bookingSchema = z.object({
  referenceCode: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  notes: z.string().optional(),
  customerId: z.number(),
  bookingStatusId: z.number(),
  totalPax: z.number(),
  amount: z.number(),
});
