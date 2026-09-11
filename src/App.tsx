import { useState } from "react";
import { AccountCard } from "./components/AccountCard";
import { StatCard } from "./components/StatCard";
import { TransactionTable } from "./components/TransactionTable";
import { TransferMoney } from "./components/TransferMoney";
import { useDashboard } from "./hooks/useDashboard";
import type { Beneficiary } from "./services/transferService";
import type { Transaction } from "./types/banking";
import "./styles.css";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function App() {
  const { data, isLoading, error, retry } = useDashboard();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferAdjustment, setTransferAdjustment] = useState(0);
  const [transferTransactions, setTransferTransactions] = useState<Transaction[]>([]);

  const account = data
    ? { ...data.account, balance: data.account.balance + transferAdjustment }
    : null;

  const transactions = data ? [...transferTransactions, ...data.transactions] : [];

  const handleTransferSuccess = (amount: number, transactionId: string, beneficiary: Beneficiary) => {
    setTransferAdjustment((current) => current - amount);
    setTransferTransactions((current) => [
      {
        id: transactionId,
        merchant: beneficiary.name,
        category: "Transfer",
        amount,
        type: "DEBIT",
        status: "SUCCESS",
        date: new Date().toISOString().slice(0, 10),
      },
      ...current,
    ]);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="SecureBank home">Secure<span>Bank</span></a>
        <div className="user-menu" aria-label="Signed in user">NS <span>Personal banking</span></div>
        {data && (
          <button className="notification-button" type="button" aria-label={`Notifications, ${data.notifications} unread`}>
            Notifications
          </button>
        )}
      </header>

      <main className="content">
        <section className="hero" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">Personal banking</p>
            <h1 id="page-title">Good morning, Nazmeen.</h1>
            <p className="muted">A clear view of your accounts, spending and recent activity.</p>
          </div>
          {account && (
            <button className="primary" type="button" onClick={() => setIsTransferOpen(true)}>Transfer money</button>
          )}
        </section>

        {isLoading && <div className="state" role="status" aria-live="polite" aria-busy="true">Loading your secure dashboard…</div>}

        {error && (
          <div className="state error" role="alert">
            <strong>{error}</strong>
            <button className="secondary" type="button" onClick={() => void retry()}>Retry</button>
          </div>
        )}

        {data && account && (
          <>
            <AccountCard account={account} />
            <section className="stats" aria-label="Account summary">
              <StatCard label="Monthly spending" value={currency.format(data.monthlySpend + transferAdjustment * -1)} hint="Across recent activity" />
              <StatCard label="Pending transfers" value={String(data.pendingTransfers)} hint="Needs your attention" />
              <StatCard label="Notifications" value={String(data.notifications)} hint="Unread updates" />
            </section>
            <TransactionTable transactions={transactions} />
          </>
        )}
      </main>

      <footer className="footer">Demo portfolio application — no real financial transactions are processed.</footer>

      {isTransferOpen && account && (
        <TransferMoney
          account={account}
          onSuccess={handleTransferSuccess}
          onClose={() => setIsTransferOpen(false)}
        />
      )}
    </div>
  );
}
