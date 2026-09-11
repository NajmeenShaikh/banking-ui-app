import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("SecureBank dashboard", () => {
  it("renders loading state and then dashboard content", async () => {
    render(<App />);

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(
      await screen.findByText("Available balance"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /good morning, nazmeen/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("filters transactions and keeps the selected filter accessible", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByText("Available balance");

    const debitButton = screen.getByRole("button", {
      name: "Debit",
    });

    await user.click(debitButton);

    expect(debitButton).toHaveAttribute("aria-pressed", "true");

    expect(
      screen.getByRole("button", {
        name: "All",
      }),
    ).toHaveAttribute("aria-pressed", "false");

    expect(screen.getByText("TXN-1001")).toBeInTheDocument();
    expect(screen.getByText("TXN-1003")).toBeInTheDocument();

    expect(screen.queryByText("TXN-1002")).not.toBeInTheDocument();
  });

  it("renders dashboard notification summary", async () => {
    render(<App />);

    // Wait for the dashboard data to load.
    expect(
      await screen.findByRole("button", {
        name: /notifications, 3 unread/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("3")).toBeInTheDocument();
  });
});