import { describe, expect, it } from "vitest";
import { parseDashboardData } from "./apiValidation";

const validDashboard = {
  account: {
    id: "ACC-001",
    name: "Primary Savings",
    maskedNumber: "•••• 4821",
    type: "SAVINGS",
    balance: 1000,
    currency: "INR",
  },
  monthlySpend: 200,
  pendingTransfers: 1,
  notifications: 2,
  transactions: [],
};

describe("parseDashboardData", () => {
  it("accepts a valid dashboard response", () => {
    expect(parseDashboardData(validDashboard)).toEqual(validDashboard);
  });

  it("rejects malformed API data", () => {
    expect(() => parseDashboardData({ ...validDashboard, monthlySpend: "200" })).toThrow(
      "Invalid dashboard summary.",
    );
  });

  it("rejects malformed transaction data", () => {
    expect(() =>
      parseDashboardData({
        ...validDashboard,
        transactions: [{ id: "TXN-1", amount: "100" }],
      }),
    ).toThrow("Invalid transaction data.");
  });
});
