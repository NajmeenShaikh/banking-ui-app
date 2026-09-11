import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Transaction } from "../types/banking";
import { TransactionTable } from "./TransactionTable";

const transactions: Transaction[] = [
  { id: "TXN-1", merchant: "Amazon India", category: "Shopping", amount: 3499, type: "DEBIT", status: "SUCCESS", date: "2026-09-08" },
  { id: "TXN-2", merchant: "Salary Credit", category: "Income", amount: 95000, type: "CREDIT", status: "SUCCESS", date: "2026-09-01" },
  { id: "TXN-3", merchant: "Electricity Bill", category: "Utilities", amount: 1840, type: "DEBIT", status: "SUCCESS", date: "2026-08-29" },
  { id: "TXN-4", merchant: "Rent Transfer", category: "Housing", amount: 22000, type: "DEBIT", status: "PENDING", date: "2026-08-27" },
];

describe("TransactionTable", () => {
  it("renders the first page and filters debit transactions", () => {
    render(<TransactionTable transactions={transactions} />);
    expect(screen.getByText("Amazon India")).toBeInTheDocument();
    expect(screen.getByText("Salary Credit")).toBeInTheDocument();
    expect(screen.getByText("Electricity Bill")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Debit" }));
    expect(screen.getByText("Amazon India")).toBeInTheDocument();
    expect(screen.queryByText("Salary Credit")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Debit" })).toHaveAttribute("aria-pressed", "true");
  });

  it("searches by merchant or transaction ID", () => {
    render(<TransactionTable transactions={transactions} />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Search transactions" }), { target: { value: "electricity" } });
    expect(screen.getByText("Electricity Bill")).toBeInTheDocument();
    expect(screen.queryByText("Amazon India")).not.toBeInTheDocument();
  });

  it("filters by status and opens transaction details", () => {
    render(<TransactionTable transactions={transactions} />);
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "PENDING" } });
    expect(screen.getByText("Rent Transfer")).toBeInTheDocument();
    expect(screen.queryByText("Amazon India")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "View details" }));
    expect(screen.getByRole("dialog", { name: /rent transfer/i })).toBeInTheDocument();
    expect(screen.getByText("TXN-4")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close transaction details" }));
    expect(screen.queryByRole("dialog", { name: /rent transfer/i })).not.toBeInTheDocument();
  });

  it("supports pagination", () => {
    render(<TransactionTable transactions={transactions} />);
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Rent Transfer")).toBeInTheDocument();
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("shows an empty state when no transaction matches", () => {
    render(<TransactionTable transactions={[]} />);
    expect(screen.getByText("No transactions match your search or filters.")).toBeInTheDocument();
  });
});
