import { describe, expect, it } from "vitest";
import { fetchDashboard } from "./bankingApi";

describe("bankingApi", () => {
  it("returns the expected dashboard contract", async () => {
    const dashboard = await fetchDashboard();

    expect(dashboard.account.accountNumber).toBe("ACC-001");
    expect(dashboard.account.currency).toBe("INR");
    expect(dashboard.transactions.length).toBeGreaterThan(0);
    expect(dashboard.transactions[0]).toHaveProperty("id");
  });
});
