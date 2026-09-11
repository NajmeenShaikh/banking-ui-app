import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("SecureBank dashboard", () => {
  it("renders loading state and then dashboard content", async () => {
    render(<App />);

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", {
        name: /good morning, nazmeen/i,
      }),
    ).toBeInTheDocument();

    expect(await screen.findByText(/available balance/i)).toBeInTheDocument();
    expect(await screen.findByRole("table")).toBeInTheDocument();
  });

  it("filters transactions and keeps the selected filter accessible", async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByRole("heading", {
      name: /good morning, nazmeen/i,
    });

    const debitButton = screen.getByRole("button", { name: "Debit" });
    await user.click(debitButton);

    expect(debitButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    expect(screen.getByText("TXN-1001")).toBeInTheDocument();
    expect(screen.getByText("TXN-1003")).toBeInTheDocument();
    expect(screen.queryByText("TXN-1002")).not.toBeInTheDocument();
  });

  it("renders dashboard notification summary", async () => {
    render(<App />);

    await screen.findByRole("heading", {
      name: /good morning, nazmeen/i,
    });

    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
