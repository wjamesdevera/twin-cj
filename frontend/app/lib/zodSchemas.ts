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

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "File is required")
  .refine((file) => file.size <= 1024 * 1024, "File size must be less than 1MB")
  .refine(
    (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
    "Invalid File Type"
  );

export const priceSchema = z
  .string()
  .regex(/[0-9.]/, "Price must be a number")
  .refine((price) => Number(price) >= 0, "Invalid price");

export const capacitySchema = z
  .string()
  .regex(/[0-9.]/, "Capacity must be a number")
  .refine((price) => Number(price) >= 0, "Invalid capacity");

export const descriptionSchema = z
  .string()
  .min(1, "Description is required")
  .max(100, "Description should not exceed 100 characters")
  .refine((val) => val.trim().length > 0, "Description cannot be just spaces");

export const optionalSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val)) // Convert empty string to undefined
  .optional(); // Make field optional
