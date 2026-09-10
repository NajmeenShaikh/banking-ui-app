
import { render, screen } from "@testing-library/react";
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

    expect(
      await screen.findByText(/available balance/i),
    ).toBeInTheDocument();

    expect(await screen.findByRole("table")).toBeInTheDocument();
  });

  it("renders transaction filters", async () => {
    render(<App />);

    await screen.findByRole("heading", {
      name: /good morning, nazmeen/i,
    });

    expect(
      await screen.findByRole("button", { name: "All" }),
    ).toHaveAttribute("aria-pressed", "true");

    expect(
      await screen.findByRole("button", { name: "Debit" }),
    ).toHaveAttribute("aria-pressed", "false");

    expect(
      await screen.findByRole("button", { name: "Credit" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("renders notification count accessibly", async () => {
    render(<App />);

    await screen.findByRole("heading", {
      name: /good morning, nazmeen/i,
    });

    expect(
      await screen.findByRole("button", {
        name: /notifications, 3 unread/i,
      }),
    ).toBeInTheDocument();
  });
});

