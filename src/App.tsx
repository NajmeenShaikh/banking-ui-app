import { useState } from "react";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { AccountCard } from "./components/AccountCard";
import { FinancialInsights } from "./components/FinancialInsights";
import { QuickActions } from "./components/QuickActions";
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
  const [darkMode, setDarkMode] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const account = data ? { ...data.account, balance: data.account.balance + transferAdjustment } : null;
  const transactions = data ? [...transferTransactions, ...data.transactions] : [];

  const handleTransferSuccess = (amount: number, transactionId: string, beneficiary: Beneficiary) => {
    setTransferAdjustment((current) => current - amount);
    setTransferTransactions((current) => [{ id: transactionId, merchant: beneficiary.name, category: "Transfer", amount, type: "DEBIT", status: "SUCCESS", date: new Date().toISOString().slice(0, 10) }, ...current]);
  };

  return (
    <div className={`app-shell ${darkMode ? "theme-dark" : ""}`}>
      <aside className={`sidebar ${mobileNav ? "open" : ""}`} aria-label="Primary navigation">
        <a className="brand" href="/" aria-label="SecureBank home"><span className="brand-mark">S</span>Secure<span>Bank</span></a>
        <nav className="side-nav">
          <a className="nav-item active" href="#dashboard">⌂ <span>Dashboard</span></a>
          <a className="nav-item" href="#transactions-title">↗ <span>Transactions</span></a>
          <a className="nav-item" href="#quick-actions-title">▣ <span>Payments</span></a>
          <a className="nav-item" href="#account-title">◉ <span>Accounts</span></a>
        </nav>
        <div className="sidebar-bottom"><p>Need help?</p><span>SecureBank support is available 24/7.</span></div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button className="mobile-menu" type="button" onClick={() => setMobileNav((value) => !value)} aria-label="Toggle navigation"><Menu size={20} /></button>
          <div className="top-search"><Search size={17} aria-hidden="true" /><input aria-label="Search SecureBank" placeholder="Search payments, transactions..." /></div>
          <div className="top-actions">
            <button className="icon-button" type="button" onClick={() => setDarkMode((value) => !value)} aria-label={darkMode ? "Use light mode" : "Use dark mode"}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            {data && <button className="icon-button notification-button" type="button" aria-label={`Notifications, ${data.notifications} unread`}><Bell size={18} /><span>{data.notifications}</span></button>}
            <div className="profile-chip"><span>NS</span><div><strong>Nazmeen</strong><small>Personal</small></div></div>
          </div>
        </header>

        <main className="content" id="dashboard">
          <section className="hero" aria-labelledby="page-title">
            <div><p className="eyebrow">Personal banking · September 2026</p><h1 id="page-title">Good morning, Nazmeen.</h1><p className="muted">Your money at a glance. Everything important is right where you need it.</p></div>
            {account && <button className="primary hero-action" type="button" onClick={() => setIsTransferOpen(true)}>Transfer money <span aria-hidden="true">↗</span></button>}
          </section>

          {isLoading && <div className="state" role="status" aria-live="polite" aria-busy="true">Loading your secure dashboard…</div>}
          {error && <div className="state error" role="alert"><strong>{error}</strong><button className="secondary" type="button" onClick={() => void retry()}>Retry</button></div>}

          {data && account && (
            <>
              <AccountCard account={account} />
              <QuickActions onTransfer={() => setIsTransferOpen(true)} />
              <section className="stats" aria-label="Account summary">
                <StatCard label="Monthly spending" value={currency.format(data.monthlySpend + transferAdjustment * -1)} hint="Across recent activity" />
                <StatCard label="Pending transfers" value={String(data.pendingTransfers)} hint="Needs your attention" />
                <StatCard label="Notifications" value={String(data.notifications)} hint="Unread updates" />
              </section>
              <FinancialInsights transactions={transactions} monthlySpend={data.monthlySpend + transferAdjustment * -1} />
              <TransactionTable transactions={transactions} />
            </>
          )}
        </main>

        <footer className="footer">SecureBank UI · Portfolio demonstration · No real financial transactions are processed.</footer>
      </div>

      {isTransferOpen && account && <TransferMoney account={account} onSuccess={handleTransferSuccess} onClose={() => setIsTransferOpen(false)} />}
    </div>
  );
}
