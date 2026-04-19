import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\s-]+$/, "Enter a valid phone number"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name is too long"),
  companyName: z
    .string()
    .min(2, "Company name is required")
    .max(100, "Company name is too long"),
  tinNumber: z
    .string()
    .min(6, "TIN Number must be at least 6 characters")
    .max(20, "TIN Number is too long"),
  email: z
    .string()
    .email("Enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\s-]+$/, "Enter a valid phone number"),
  faydaId: z
    .string()
    .min(5, "Fayda ID (FAN) is required")
    .max(30, "Fayda ID is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
