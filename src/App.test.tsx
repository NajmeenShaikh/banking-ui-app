import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("SecureBank dashboard", () => {
  it("renders loading state and then dashboard content", async () => {
    render(<App />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: /good morning, nazmeen/i })).toBeInTheDocument();
    expect(await screen.findByText(/available balance/i)).toBeInTheDocument();
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /september snapshot/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /smart insight/i })).toBeInTheDocument();
  });

  it("filters transactions and keeps the selected filter accessible", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: /good morning, nazmeen/i });

    const debitButton = screen.getByRole("button", { name: "Debit" });
    await user.click(debitButton);

    expect(debitButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("TXN-1001")).toBeInTheDocument();
    expect(screen.getByText("TXN-1003")).toBeInTheDocument();
    expect(screen.queryByText("TXN-1002")).not.toBeInTheDocument();
  });

  it("opens the transfer workflow and completes a transfer", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: /good morning, nazmeen/i });

    await user.click(screen.getByRole("button", { name: /transfer money/i }));
    expect(screen.getByRole("dialog", { name: /transfer money/i })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Beneficiary"), "BEN-001");
    await user.type(screen.getByLabelText("Amount (INR)"), "5000");
    await user.click(screen.getByRole("button", { name: "Review transfer" }));

    expect(screen.getByText(/review before confirming/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Confirm transfer" }));

    expect(await screen.findByRole("status", { name: /transfer successful/i })).toBeInTheDocument();
    expect(screen.getByText(/₹5,000 sent to Aarav Mehta/i)).toBeInTheDocument();
  });

  it("toggles the account balance visibility and renders dashboard notification summary", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: /good morning, nazmeen/i });

    const hideButton = screen.getByRole("button", { name: "Hide balance" });
    expect(screen.getByText(/₹128,450.75/)).toBeInTheDocument();
    await user.click(hideButton);
    expect(screen.getByText("₹ ••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show balance" })).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);
  });
});
