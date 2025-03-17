import { z } from "zod";

export const bookingSchema = z.object({
  referenceCode: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  customerId: z.number(),
  bookingStatusId: z.number(),
  totalPax: z.number(),
  amount: z.number(),
  notes: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  contactNumber: z.string(),
  email: z.string().email(),
});

export const personalDetailSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
});
