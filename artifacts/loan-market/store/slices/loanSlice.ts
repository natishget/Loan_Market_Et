import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Loan, MarketplaceLoan, LoanStatus } from "@/types";
import { MOCK_LOANS, MOCK_MARKETPLACE_LOANS } from "@/data/mockData";

interface LoanState {
  loans: Loan[];
  marketplaceLoans: MarketplaceLoan[];
  loading: boolean;
}

const initialState: LoanState = {
  loans: MOCK_LOANS,
  marketplaceLoans: MOCK_MARKETPLACE_LOANS,
  loading: false,
};

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

const loanSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {
    createLoan: (
      state,
      action: PayloadAction<{
        amount: number;
        interestRate: number;
        termMonths: number;
        purpose: string;
        description: string;
        collateral?: string;
        borrowerId: string;
        borrowerName: string;
        lenderId: string;
        lenderName: string;
      }>
    ) => {
      const now = new Date().toISOString().split("T")[0];
      const due = new Date();
      due.setMonth(due.getMonth() + action.payload.termMonths);

      const monthlyPayment = Math.round(
        (action.payload.amount *
          (1 + (action.payload.interestRate / 100) * (action.payload.termMonths / 12))) /
          action.payload.termMonths
      );

      const newLoan: Loan = {
        id: generateId(),
        type: "direct",
        status: "pending",
        createdAt: now,
        updatedAt: now,
        dueDate: due.toISOString().split("T")[0],
        monthlyPayment,
        ...action.payload,
      };
      state.loans.push(newLoan);
    },

    createMarketplaceLoan: (
      state,
      action: PayloadAction<{
        amount: number;
        interestRate: number;
        termMonths: number;
        purpose: string;
        description: string;
        borrowerId: string;
        borrowerName: string;
        borrowerInitials: string;
        location: string;
        businessType: string;
      }>
    ) => {
      const now = new Date().toISOString().split("T")[0];
      const newMarketplaceLoan: MarketplaceLoan = {
        id: generateId(),
        status: "open",
        createdAt: now,
        ...action.payload,
      };
      state.marketplaceLoans.push(newMarketplaceLoan);
    },

    applyToLoan: (
      state,
      action: PayloadAction<{
        marketplaceLoanId: string;
        lenderId: string;
        lenderName: string;
      }>
    ) => {
      const mktLoan = state.marketplaceLoans.find(
        (l) => l.id === action.payload.marketplaceLoanId
      );
      if (!mktLoan) return;

      mktLoan.status = "filled";

      const now = new Date().toISOString().split("T")[0];
      const due = new Date();
      due.setMonth(due.getMonth() + mktLoan.termMonths);

      const monthlyPayment = Math.round(
        (mktLoan.amount *
          (1 + (mktLoan.interestRate / 100) * (mktLoan.termMonths / 12))) /
          mktLoan.termMonths
      );

      const newLoan: Loan = {
        id: generateId(),
        type: "marketplace",
        amount: mktLoan.amount,
        interestRate: mktLoan.interestRate,
        termMonths: mktLoan.termMonths,
        purpose: mktLoan.purpose,
        description: mktLoan.description,
        status: "accepted",
        borrowerId: mktLoan.borrowerId,
        borrowerName: mktLoan.borrowerName,
        lenderId: action.payload.lenderId,
        lenderName: action.payload.lenderName,
        createdAt: now,
        updatedAt: now,
        dueDate: due.toISOString().split("T")[0],
        monthlyPayment,
        collateral: "As agreed between parties",
      };
      state.loans.push(newLoan);
    },

    updateLoanStatus: (
      state,
      action: PayloadAction<{ loanId: string; status: LoanStatus }>
    ) => {
      const loan = state.loans.find((l) => l.id === action.payload.loanId);
      if (loan) {
        loan.status = action.payload.status;
        loan.updatedAt = new Date().toISOString().split("T")[0];
      }
    },

    cancelLoan: (state, action: PayloadAction<string>) => {
      const loan = state.loans.find((l) => l.id === action.payload);
      if (loan) {
        loan.status = "cancelled";
        loan.updatedAt = new Date().toISOString().split("T")[0];
      }
    },
  },
});

export const {
  createLoan,
  createMarketplaceLoan,
  applyToLoan,
  updateLoanStatus,
  cancelLoan,
} = loanSlice.actions;
export default loanSlice.reducer;
