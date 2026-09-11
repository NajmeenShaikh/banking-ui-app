import { useMemo, useState } from "react";
import type { Transaction, TransactionType } from "../types/banking";
import { TransactionDetails } from "./TransactionDetails";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });

type Filter = "ALL" | TransactionType;
type StatusFilter = "ALL" | Transaction["status"];
const PAGE_SIZE = 3;

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return transactions.filter((item) => {
      const matchesType = filter === "ALL" || item.type === filter;
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchesSearch = !normalizedQuery || [item.merchant, item.category, item.id].some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [filter, query, statusFilter, transactions]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const changeFilter = (nextFilter: Filter) => { setFilter(nextFilter); setPage(1); };
  const changeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => { setStatusFilter(event.target.value as StatusFilter); setPage(1); };
  const changeQuery = (event: React.ChangeEvent<HTMLInputElement>) => { setQuery(event.target.value); setPage(1); };

  return (
    <section className="panel" aria-labelledby="transactions-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Activity</p>
          <h2 id="transactions-title">Recent transactions</h2>
          <p className="helper" aria-live="polite">Showing {filtered.length} of {transactions.length} transactions</p>
        </div>
        <div className="filters" role="group" aria-label="Transaction type filters">
          {(["ALL", "DEBIT", "CREDIT"] as Filter[]).map((option) => (
            <button key={option} className={filter === option ? "filter active" : "filter"} type="button" aria-pressed={filter === option} onClick={() => changeFilter(option)}>
              {option === "ALL" ? "All" : option === "DEBIT" ? "Debit" : "Credit"}
            </button>
          ))}
        </div>
      </div>

      <div className="transaction-controls">
        <label className="search-field">
          <span>Search transactions</span>
          <input type="search" value={query} onChange={changeQuery} placeholder="Merchant, category or transaction ID" />
        </label>
        <label className="status-field">
          <span>Status</span>
          <select value={statusFilter} onChange={changeStatus}>
            <option value="ALL">All statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </label>
      </div>

      <div className="table-wrap">
        {paginated.length > 0 ? (
          <table>
            <caption className="sr-only">Recent banking transactions</caption>
            <thead><tr><th scope="col">Merchant</th><th scope="col">Category</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col">Amount</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {paginated.map((transaction) => (
                <tr key={transaction.id}>
                  <td><strong>{transaction.merchant}</strong><span className="muted">{transaction.id}</span></td>
                  <td>{transaction.category}</td>
                  <td>{dateFormatter.format(new Date(transaction.date))}</td>
                  <td><span className={`status ${transaction.status.toLowerCase()}`}>{transaction.status}</span></td>
                  <td className={transaction.type === "DEBIT" ? "debit" : "credit"}>{transaction.type === "DEBIT" ? "−" : "+"}{currency.format(transaction.amount)}</td>
                  <td><button className="text-button" type="button" onClick={() => setSelectedTransaction(transaction)}>View details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="empty">No transactions match your search or filters.</p>}
      </div>

      {filtered.length > 0 && (
        <nav className="pagination" aria-label="Transaction pagination">
          <button className="secondary" type="button" disabled={currentPage === 1} onClick={() => setPage((value) => value - 1)}>Previous</button>
          <span aria-live="polite">Page {currentPage} of {pageCount}</span>
          <button className="secondary" type="button" disabled={currentPage === pageCount} onClick={() => setPage((value) => value + 1)}>Next</button>
        </nav>
      )}

      {selectedTransaction && <TransactionDetails transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />}
    </section>
  );
}
