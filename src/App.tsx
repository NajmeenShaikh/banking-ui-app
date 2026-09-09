import { AccountCard } from "./components/AccountCard";
import { StatCard } from "./components/StatCard";
import { TransactionTable } from "./components/TransactionTable";
import { useDashboard } from "./hooks/useDashboard";
import "./styles.css";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function App() {
  const { data, isLoading, error, retry } = useDashboard();

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="SecureBank home">Secure<span>Bank</span></a>
        <div className="user-menu" aria-label="Signed in user">NS <span>Personal banking</span></div>
      </header>

      <main className="content">
        <section className="hero" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">Personal banking</p>
            <h1 id="page-title">Good morning, Nazmeen.</h1>
            <p className="muted">A clear view of your accounts, spending and recent activity.</p>
          </div>
          <button className="primary" type="button">Transfer money</button>
        </section>

        {isLoading && <div className="state" role="status" aria-live="polite" aria-busy="true">Loading your secure dashboard…</div>}

        {error && (
          <div className="state error" role="alert">
            <strong>{error}</strong>
            <button className="secondary" type="button" onClick={() => void retry()}>Retry</button>
          </div>
        )}

        {data && (
          <>
            <AccountCard account={data.account} />
            <section className="stats" aria-label="Account summary">
              <StatCard label="Monthly spending" value={currency.format(data.monthlySpend)} hint="Across recent activity" />
              <StatCard label="Pending transfers" value={String(data.pendingTransfers)} hint="Needs your attention" />
              <StatCard label="Notifications" value={String(data.notifications)} hint="Unread updates" />
            </section>
            <TransactionTable transactions={data.transactions} />
          </>
        )}
      </main>

      <footer className="footer">Demo portfolio application — no real financial transactions are processed.</footer>
    </div>
  );
}