import { useMemo, useState } from "react";
import type { Transaction, TransactionType } from "../types/banking";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

type Filter = "ALL" | TransactionType;

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const filtered = useMemo(
    () => filter === "ALL" ? transactions : transactions.filter((item) => item.type === filter),
    [filter, transactions],
  );

  return (
    <section className="panel" aria-labelledby="transactions-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Activity</p>
          <h2 id="transactions-title">Recent transactions</h2>
        </div>
        <div className="filters" role="group" aria-label="Transaction filters">
          {(["ALL", "DEBIT", "CREDIT"] as Filter[]).map((option) => (
            <button
              key={option}
              className={filter === option ? "filter active" : "filter"}
              type="button"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
            >
              {option === "ALL" ? "All" : option === "DEBIT" ? "Debit" : "Credit"}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <caption className="sr-only">Recent banking transactions</caption>
          <thead>
            <tr><th scope="col">Merchant</th><th scope="col">Category</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col">Amount</th></tr>
          </thead>
          <tbody>
            {filtered.map((transaction) => (
              <tr key={transaction.id}>
                <td><strong>{transaction.merchant}</strong><span className="muted">{transaction.id}</span></td>
                <td>{transaction.category}</td>
                <td>{new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(transaction.date))}</td>
                <td><span className={`status ${transaction.status.toLowerCase()}`}>{transaction.status}</span></td>
                <td className={transaction.type === "DEBIT" ? "debit" : "credit"}>{transaction.type === "DEBIT" ? "−" : "+"}{currency.format(transaction.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty">No transactions match this filter.</p>}
      </div>
    </section>
  );
}