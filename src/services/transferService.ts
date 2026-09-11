import type { Account } from "../types/banking";

export interface Beneficiary {
  id: string;
  name: string;
  maskedAccount: string;
  bankName: string;
}

export interface TransferRequest {
  sourceAccountId: string;
  beneficiaryId: string;
  amount: number;
  currency: "INR";
  idempotencyKey: string;
}

export interface TransferReceipt {
  transactionId: string;
  status: "SUCCESS" | "FAILED";
  amount: number;
  beneficiaryName: string;
}

export const beneficiaries: Beneficiary[] = [
  { id: "BEN-001", name: "Aarav Mehta", maskedAccount: "•••• 1942", bankName: "SecureBank" },
  { id: "BEN-002", name: "Neha Sharma", maskedAccount: "•••• 7310", bankName: "SecureBank" },
  { id: "BEN-003", name: "Home Rent", maskedAccount: "•••• 8821", bankName: "HDFC Bank" },
];

export function validateTransfer(account: Account, beneficiaryId: string, amountInput: string) {
  const amount = Number(amountInput);

  if (!beneficiaryId) return { valid: false, message: "Select a beneficiary." };
  if (!Number.isFinite(amount) || amount <= 0) return { valid: false, message: "Enter an amount greater than zero." };
  if (amount > 100000) return { valid: false, message: "Demo transfer limit is ₹1,00,000." };
  if (amount > account.balance) return { valid: false, message: "Insufficient available balance." };

  return { valid: true, amount };
}

export async function createTransfer(request: TransferRequest): Promise<TransferReceipt> {
  await new Promise((resolve) => setTimeout(resolve, 450));
  const beneficiary = beneficiaries.find((item) => item.id === request.beneficiaryId);

  if (!beneficiary) throw new Error("Beneficiary could not be found.");

  return {
    transactionId: `TXN-${Date.now()}`,
    status: "SUCCESS",
    amount: request.amount,
    beneficiaryName: beneficiary.name,
  };
}
