export type TransactionType = "DEBIT" | "CREDIT";
export type TransactionStatus = "SUCCESS" | "PENDING" | "FAILED";

export interface Account {
  id: string;
  name: string;
  maskedNumber: string;
  type: "SAVINGS" | "CURRENT";
  balance: number;
  currency: "INR";
}

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
}

export interface DashboardData {
  account: Account;
  monthlySpend: number;
  pendingTransfers: number;
  notifications: number;
  transactions: Transaction[];
}