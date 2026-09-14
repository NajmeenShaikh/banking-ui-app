import { describe, expect, it } from "vitest";
import { beneficiaries, createTransfer, validateTransfer } from "./transferService";
import type { Account } from "../types/banking";

const account: Account = {
  id: "ACC-001",
  name: "Primary Savings",
  maskedNumber: "•••• 4821",
  type: "SAVINGS",
  balance: 128450.75,
  currency: "INR",
};

describe("transfer service", () => {
  it("validates a valid transfer", () => {
    expect(validateTransfer(account, "BEN-001", "5000")).toEqual({ valid: true, amount: 5000 });
  });

  it("rejects missing beneficiary and invalid amounts", () => {
    expect(validateTransfer(account, "", "5000").valid).toBe(false);
    expect(validateTransfer(account, "BEN-001", "0").valid).toBe(false);
    expect(validateTransfer(account, "BEN-001", "abc").valid).toBe(false);
  });

  it("rejects an amount above balance or demo limit", () => {
    expect(validateTransfer(account, "BEN-001", "200000").valid).toBe(false);
    expect(validateTransfer(account, "BEN-001", "130000").valid).toBe(false);
  });

  it("creates a successful transfer receipt", async () => {
    const receipt = await createTransfer({
      sourceAccountId: account.id,
      beneficiaryId: beneficiaries[0].id,
      amount: 5000,
      currency: "INR",
      idempotencyKey: "success-test-key",
    });

    expect(receipt.status).toBe("SUCCESS");
    expect(receipt.amount).toBe(5000);
    expect(receipt.beneficiaryName).toBe("Aarav Mehta");
    expect(receipt.transactionId).toMatch(/^TXN-/);
  });

  it("rejects a duplicate idempotency key", async () => {
    const request = {
      sourceAccountId: account.id,
      beneficiaryId: beneficiaries[1].id,
      amount: 2500,
      currency: "INR" as const,
      idempotencyKey: "duplicate-test-key",
    };

    await createTransfer(request);
    await expect(createTransfer(request)).rejects.toThrow("already been processed");
  });

  it("rejects incomplete transfer requests", async () => {
    await expect(
      createTransfer({
        sourceAccountId: "",
        beneficiaryId: beneficiaries[0].id,
        amount: 100,
        currency: "INR",
        idempotencyKey: "missing-account-key",
      }),
    ).rejects.toThrow("missing required fields");
  });
});
