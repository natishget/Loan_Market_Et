export type LoanStatus =
  | "open"
  | "pending"
  | "accepted"
  | "approved"
  | "repaid"
  | "cancelled";

export type LoanType = "direct" | "marketplace";

export interface User {
  id: string;
  name: string;
  phone: string;
  tinNumber: string;
  businessType: string;
  location: string;
  rating: number;
  totalLoansGiven: number;
  totalLoansTaken: number;
  joinedAt: string;
}

export interface Loan {
  id: string;
  type: LoanType;
  amount: number;
  interestRate: number;
  termMonths: number;
  purpose: string;
  description: string;
  status: LoanStatus;
  borrowerId: string;
  borrowerName: string;
  lenderId?: string;
  lenderName?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  collateral?: string;
  monthlyPayment?: number;
}

export interface MarketplaceLoan {
  id: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  purpose: string;
  description: string;
  status: "open" | "filled";
  borrowerId: string;
  borrowerName: string;
  borrowerInitials: string;
  createdAt: string;
  location: string;
  businessType: string;
}

export interface Notification {
  id: string;
  type:
    | "new_marketplace_loan"
    | "loan_accepted"
    | "loan_approved"
    | "loan_repaid"
    | "payment_due";
  title: string;
  message: string;
  loanId: string;
  read: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
