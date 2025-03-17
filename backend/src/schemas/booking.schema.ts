import { z } from "zod";

export const bookingSchema = z.object({
  personalDetailId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  totalPax: z.number(),
  selectedServices: z.array(z.number()).optional(),
  paymentDetails: z.object({
    paymentMethodId: z.number(),
    paymentMethodName: z.string(),
    paymentMethodType: z.string(),
    amount: z.number(),
    proofOfPaymentImageUrl: z.string().optional(),
    paymentStatusId: z.number(),
    accountName: z.string(),
    accountNumber: z.string(),
  }),
  notes: z.string().optional(),
  bookingStatusId: z.number(),
});

export const personalDetailSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
});
