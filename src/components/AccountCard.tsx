import type { Account } from "../types/banking";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

export function AccountCard({ account }: { account: Account }) {
  return (
    <section className="account-card" aria-labelledby="account-title">
      <div>
        <p className="eyebrow">{account.type}</p>
        <h2 id="account-title">{account.name}</h2>
        <p className="muted">{account.maskedNumber}</p>
      </div>
      <div className="balance">
        <span>Available balance</span>
        <strong>{currency.format(account.balance)}</strong>
      </div>
    </section>
  );
}