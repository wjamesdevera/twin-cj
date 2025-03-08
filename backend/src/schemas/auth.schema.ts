import { nullable, z } from "zod";

export const emailSchema = z
  .string()
  .email()
  .min(1)
  .max(255)
  .trim()
  .toLowerCase();

const passwordSchema = z.string().min(6).max(255);
const phoneNumberSchema = z.string().min(11).max(15);
const nameSchema = z.string().nullable();

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
  .extend({
    firstName: nameSchema,
    lastName: nameSchema,
    confirmPassword: passwordSchema,
    phoneNumber: phoneNumberSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verificationCodeSchema = z.string().min(1).max(36);

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});

export const changePasswordSchema = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

export const idSchema = z.string().uuid().trim();

export const editUserSchema = z.object({
  email: emailSchema,
  firstName: nameSchema.nullable(),
  lastName: nameSchema.nullable(),
  phoneNumber: phoneNumberSchema,
});
