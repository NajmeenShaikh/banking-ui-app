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

    expect(await screen.findByText(/available balance/i)).toBeInTheDocument();
    expect(await screen.findByRole("table")).toBeInTheDocument();
  });

  it("renders transaction filters with accessible pressed states", async () => {
    render(<App />);

    await screen.findByRole("heading", {
      name: /good morning, nazmeen/i,
    });

    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Debit" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Credit" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
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
