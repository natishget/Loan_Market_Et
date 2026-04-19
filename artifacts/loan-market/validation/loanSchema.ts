import { z } from "zod";

export const createDirectLoanSchema = z.object({
  lenderId: z
    .string()
    .min(3, "Lender ID is required")
    .max(50, "Lender ID is too long"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(1000, "Minimum loan amount is ETB 1,000")
    .max(5000000, "Maximum loan amount is ETB 5,000,000"),
  interestRate: z
    .number({ invalid_type_error: "Interest rate must be a number" })
    .min(1, "Minimum interest rate is 1%")
    .max(30, "Maximum interest rate is 30%"),
  termMonths: z
    .number({ invalid_type_error: "Term must be a number" })
    .min(1, "Minimum term is 1 month")
    .max(60, "Maximum term is 60 months"),
  purpose: z
    .string()
    .min(3, "Purpose is required")
    .max(100, "Purpose must be under 100 characters"),
  description: z
    .string()
    .min(20, "Please provide at least 20 characters describing your loan")
    .max(500, "Description must be under 500 characters"),
  collateral: z.string().optional(),
});

export const createMarketplaceLoanSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(1000, "Minimum loan amount is ETB 1,000")
    .max(5000000, "Maximum loan amount is ETB 5,000,000"),
  interestRate: z
    .number({ invalid_type_error: "Interest rate must be a number" })
    .min(1, "Minimum interest rate is 1%")
    .max(30, "Maximum interest rate is 30%"),
  termMonths: z
    .number({ invalid_type_error: "Term must be a number" })
    .min(1, "Minimum term is 1 month")
    .max(60, "Maximum term is 60 months"),
  purpose: z
    .string()
    .min(3, "Purpose is required")
    .max(100, "Purpose must be under 100 characters"),
  description: z
    .string()
    .min(20, "Please provide at least 20 characters describing your loan")
    .max(500, "Description must be under 500 characters"),
  collateral: z.string().optional(),
});

export type CreateDirectLoanInput = z.infer<typeof createDirectLoanSchema>;
export type CreateMarketplaceLoanInput = z.infer<typeof createMarketplaceLoanSchema>;

// Legacy alias
export const createLoanSchema = createDirectLoanSchema;
