import { z } from "zod";

export const emailSchema = z.string().email("Invalid Email").trim();
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
  );
