import { describe, expect, it } from "vitest";
import { fetchDashboard } from "./bankingApi";

describe("bankingApi", () => {
  it("returns the expected dashboard contract", async () => {
    const dashboard = await fetchDashboard();

    expect(dashboard.account.id).toBe("ACC-001");
    expect(dashboard.account.currency).toBe("INR");
    expect(dashboard.transactions).toHaveLength(4);
    expect(dashboard.transactions[0]).toMatchObject({
      id: "TXN-1001",
      type: "DEBIT",
      status: "SUCCESS",
    });
  });
});
