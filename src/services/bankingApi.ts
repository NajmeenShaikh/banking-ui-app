import type { DashboardData } from "../types/banking";

const dashboard: DashboardData = {
  account: {
    id: "ACC-001",
    name: "Primary Savings",
    maskedNumber: "•••• 4821",
    type: "SAVINGS",
    balance: 128450.75,
    currency: "INR",
  },
  monthlySpend: 28450.2,
  pendingTransfers: 2,
  notifications: 3,
  transactions: [
    { id: "TXN-1001", merchant: "Amazon India", category: "Shopping", amount: 3499, type: "DEBIT", status: "SUCCESS", date: "2026-09-08" },
    { id: "TXN-1002", merchant: "Salary Credit", category: "Income", amount: 95000, type: "CREDIT", status: "SUCCESS", date: "2026-09-01" },
    { id: "TXN-1003", merchant: "Electricity Bill", category: "Utilities", amount: 1840, type: "DEBIT", status: "SUCCESS", date: "2026-08-29" },
    { id: "TXN-1004", merchant: "Rent Transfer", category: "Housing", amount: 22000, type: "DEBIT", status: "PENDING", date: "2026-08-27" },
  ],
};

export async function fetchDashboard(): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return dashboard;
}