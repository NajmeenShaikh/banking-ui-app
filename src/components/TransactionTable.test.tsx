import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionTable } from "./TransactionTable";
import type { Transaction } from "../types/banking";

const transactions: Transaction[] = [
  {
    id: "TXN-1",
    merchant: "Amazon India",
    category: "Shopping",
    amount: 3499,
    type: "DEBIT",
    status: "SUCCESS",
    date: "2026-09-08",
  },
  {
    id: "TXN-2",
    merchant: "Salary Credit",
    category: "Income",
    amount: 95000,
    type: "CREDIT",
    status: "SUCCESS",
    date: "2026-09-01",
  },
];

describe("TransactionTable", () => {
  it("renders transaction rows", () => {
    render(<TransactionTable transactions={transactions} />);

    expect(screen.getByText("Amazon India")).toBeInTheDocument();
    expect(screen.getByText("Salary Credit")).toBeInTheDocument();
  });

  it("filters transactions by debit and credit", () => {
    render(<TransactionTable transactions={transactions} />);

    fireEvent.click(screen.getByRole("button", { name: "Debit" }));
    expect(screen.getByText("Amazon India")).toBeInTheDocument();
    expect(screen.queryByText("Salary Credit")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Credit" }));
    expect(screen.getByText("Salary Credit")).toBeInTheDocument();
    expect(screen.queryByText("Amazon India")).not.toBeInTheDocument();
  });

  it("shows an empty state when the supplied transaction list is empty", () => {
    render(<TransactionTable transactions={[]} />);

    expect(screen.getByText("No transactions match this filter.")).toBeInTheDocument();
  });
});
