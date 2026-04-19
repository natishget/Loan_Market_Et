import { z } from "zod";

export const createLoanSchema = z.object({
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
  borrowerName: z.string().optional(),
  borrowerPhone: z.string().optional(),
});

export const createMarketplaceLoanSchema = createLoanSchema.omit({
  borrowerName: true,
  borrowerPhone: true,
});

export type CreateLoanInput = z.infer<typeof createLoanSchema>;
export type CreateMarketplaceLoanInput = z.infer<
  typeof createMarketplaceLoanSchema
>;
