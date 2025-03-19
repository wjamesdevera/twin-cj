import { z } from "zod";

export const emailSchema = z.string().email("Invalid Email").trim();
export const nameSchema = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters");
export const phoneNumberSchema = z
  .string()
  .regex(
    /^09\d{9}$/,
    "Invalid phone number. Please enter an 11-digit number starting with '09' (e.g., 09658108388)."
  );
