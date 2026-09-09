import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("SecureBank dashboard", () => {
  it("renders the loading state and then dashboard content", async () => {
    render(<App />);

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(await screen.findByRole("heading", { name: /good morning, nazmeen/i })).toBeInTheDocument();
    expect(screen.getByText(/available balance/i)).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders the notification count accessibly", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /notifications, 3 unread/i })).toBeInTheDocument();
    });
  });
});
