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
  .regex(/[\W_]/, "Password must contain at least one special character");

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
  lastName: nameSchema,
  email: emailSchema,
  contactNumber: phoneNumberSchema,
  packageType: z.enum(["day-tour", "cabins"]),
  selectedPackageId: z.string().min(1, "Selected package is required"),
  selectedPackageName: z.string().min(1),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  paymentAccountName: z.string().min(1, "Payment account name is required"),
  paymentAccountNumber: z.string().min(1, "Payment account number is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  proofOfPayment: z.any().optional(),
  totalPax: z
    .string()
    .min(1, "Total Pax must be at least 1")
    .max(30, "Total Pax must be at most 30"),
  amount: z.string().min(1, "Amount must be at least 1"),
  bookingStatus: z.enum(["approve", "reject", "cancel"]), 
});

export const fileSchema = z
  .instanceof(File, { message: "Image upload is required" })
  .refine((file) => file.size > 0, "File is required")
  .refine((file) => file.size <= 1024 * 1024, "File size must be less than 1MB")
  .refine(
    (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
    "Invalid File Type"
  );

export const priceSchema = z
  .string()
  .regex(/[0-9.]/, "Price must be a number")
  .refine((price) => Number(price) >= 0, "Invalid price")
  .refine((price) => Number(price) <= 100_000, "Invalid price");

export const capacitySchema = z
  .string()
  .regex(/[0-9.]/, "Capacity must be a number")
  .refine((price) => Number(price) >= 0, "Invalid capacity");

export const descriptionSchema = z
  .string()
  .min(1, "Description is required")
  .max(500, "Description should not exceed 500 characters")
  .refine((val) => val.trim().length > 0, "Description cannot be just spaces");

export const optionalSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val)) // Convert empty string to undefined
  .optional(); // Make field optional
