import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Transaction } from "../types/banking";
import { TransactionTable } from "./TransactionTable";

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
  {
    id: "TXN-3",
    merchant: "Electricity Bill",
    category: "Utilities",
    amount: 1840,
    type: "DEBIT",
    status: "SUCCESS",
    date: "2026-08-29",
  },
];

describe("TransactionTable", () => {
  it("renders all transactions by default", () => {
    render(<TransactionTable transactions={transactions} />);

    expect(screen.getByText("Amazon India")).toBeInTheDocument();
    expect(screen.getByText("Salary Credit")).toBeInTheDocument();
    expect(screen.getByText("Electricity Bill")).toBeInTheDocument();
  });

  it("filters debit transactions and exposes the pressed state", () => {
    render(<TransactionTable transactions={transactions} />);

    fireEvent.click(screen.getByRole("button", { name: "Debit" }));

    expect(screen.getByText("Amazon India")).toBeInTheDocument();
    expect(screen.getByText("Electricity Bill")).toBeInTheDocument();
    expect(screen.queryByText("Salary Credit")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Debit" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("filters credit transactions", () => {
    render(<TransactionTable transactions={transactions} />);

    fireEvent.click(screen.getByRole("button", { name: "Credit" }));

    expect(screen.getByText("Salary Credit")).toBeInTheDocument();
    expect(screen.queryByText("Amazon India")).not.toBeInTheDocument();
    expect(screen.queryByText("Electricity Bill")).not.toBeInTheDocument();
  });

  it("shows an empty state when the supplied transaction list is empty", () => {
    render(<TransactionTable transactions={[]} />);

    expect(
      screen.getByText("No transactions match this filter."),
    ).toBeInTheDocument();
  });
});
