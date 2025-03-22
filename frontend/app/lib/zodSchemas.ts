import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Invalid Email")
  .trim()
  .toLowerCase();

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters long")
  .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
  .transform((val) => val.replace(/\s+/g, " ").trim());

export const phoneNumberSchema = z
  .string()
  .regex(
    /^09\d{9}$/,
    "Invalid phone number. Please enter an 11-digit number starting with '09' (e.g., 09658108388)."
  )
  .trim();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password must be at most 64 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[\W_]/,
    "Password must contain at least one special character (!@#$%^&*)"
  );

export const messageSchema = z
  .string()
  .min(1, "Message is required")
  .max(500, "Message should not exceed 500 characters")
  .refine((val) => val.trim().length > 0, "Message cannot be just spaces");

export const paymentSchema = z.object({
  paymentMethod: z.string().nonempty("Payment method is required"),
});

export const walkinSchema = z.object({
  firstName: nameSchema,
  lastName: z.string().nonempty("Last name is required"),
  email: emailSchema,
  contactNumber: phoneNumberSchema,
  packageType: z.enum(["Day Tour", "Overnight"], {
    message: "Package type is required",
  }),
  selectedPackage: z.string().nonempty("Select a package"),
  checkInDate: z.string().nonempty("Check-in date is required"),
  checkOutDate: z.string().optional(),
  proofOfPayment: z.string().nonempty("Proof of payment is required"),
  bookingStatus: z.string().nonempty("Booking status is required"),
});
