import type { DashboardData } from "../types/banking";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function parseDashboardData(value: unknown): DashboardData {
  if (!isRecord(value) || !isRecord(value.account) || !Array.isArray(value.transactions)) {
    throw new Error("Invalid dashboard response.");
  }

  const account = value.account;
  if (
    !isString(account.id) ||
    !isString(account.name) ||
    !isString(account.maskedNumber) ||
    !isString(account.type) ||
    !isNumber(account.balance) ||
    account.currency !== "INR"
  ) {
    throw new Error("Invalid account data.");
  }

  for (const transaction of value.transactions) {
    if (
      !isRecord(transaction) ||
      !isString(transaction.id) ||
      !isString(transaction.merchant) ||
      !isString(transaction.category) ||
      !isNumber(transaction.amount) ||
      !isString(transaction.type) ||
      !isString(transaction.status) ||
      !isString(transaction.date)
    ) {
      throw new Error("Invalid transaction data.");
    }
  }

  if (
    !isNumber(value.monthlySpend) ||
    !isNumber(value.pendingTransfers) ||
    !isNumber(value.notifications)
  ) {
    throw new Error("Invalid dashboard summary.");
  }

  return value as DashboardData;
}
