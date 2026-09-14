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

const processedIdempotencyKeys = new Set<string>();

export function validateTransfer(account: Account, beneficiaryId: string, amountInput: string) {
  const amount = Number(amountInput);

  if (!beneficiaryId) return { valid: false, message: "Select a beneficiary." };
  if (!Number.isFinite(amount) || amount <= 0) return { valid: false, message: "Enter an amount greater than zero." };
  if (amount > 100000) return { valid: false, message: "Demo transfer limit is ₹1,00,000." };
  if (amount > account.balance) return { valid: false, message: "Insufficient available balance." };

  return { valid: true, amount };
}

export async function createTransfer(request: TransferRequest): Promise<TransferReceipt> {
  if (!request.sourceAccountId || !request.idempotencyKey) {
    throw new Error("Transfer request is missing required fields.");
  }
  if (processedIdempotencyKeys.has(request.idempotencyKey)) {
    throw new Error("This transfer request has already been processed.");
  }

  const beneficiary = beneficiaries.find((item) => item.id === request.beneficiaryId);
  if (!beneficiary) throw new Error("Beneficiary could not be found.");
  if (!Number.isFinite(request.amount) || request.amount <= 0) {
    throw new Error("Transfer amount must be greater than zero.");
  }

  processedIdempotencyKeys.add(request.idempotencyKey);
  await new Promise((resolve) => setTimeout(resolve, 450));

  return {
    transactionId: `TXN-${Date.now()}`,
    status: "SUCCESS",
    amount: request.amount,
    beneficiaryName: beneficiary.name,
  };
}
