import type { Transaction } from "../types/banking";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });

interface TransactionDetailsProps {
  transaction: Transaction;
  onClose: () => void;
}

export function TransactionDetails({ transaction, onClose }: TransactionDetailsProps) {
  return (
    <div className="transfer-overlay" role="presentation">
      <section className="transfer-modal details-modal" role="dialog" aria-modal="true" aria-labelledby="transaction-details-title">
        <div className="transfer-heading">
          <div>
            <p className="eyebrow">Transaction details</p>
            <h2 id="transaction-details-title">{transaction.merchant}</h2>
          </div>
          <button className="close-button" type="button" onClick={onClose} aria-label="Close transaction details">×</button>
        </div>
        <div className="detail-list">
          <div className="review-row"><span>Transaction ID</span><strong>{transaction.id}</strong></div>
          <div className="review-row"><span>Category</span><strong>{transaction.category}</strong></div>
          <div className="review-row"><span>Date</span><strong>{dateFormatter.format(new Date(transaction.date))}</strong></div>
          <div className="review-row"><span>Type</span><strong>{transaction.type}</strong></div>
          <div className="review-row"><span>Status</span><strong><span className={`status ${transaction.status.toLowerCase()}`}>{transaction.status}</span></strong></div>
          <div className="review-row"><span>Amount</span><strong className={transaction.type === "DEBIT" ? "debit" : "credit"}>{transaction.type === "DEBIT" ? "−" : "+"}{currency.format(transaction.amount)}</strong></div>
        </div>
        <button className="primary full-width" type="button" onClick={onClose}>Close</button>
      </section>
    </div>
  );
}
