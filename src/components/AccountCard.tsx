import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Account } from "../types/banking";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

export function AccountCard({ account }: { account: Account }) {
  const [visible, setVisible] = useState(true);

  return (
    <section className="account-card" aria-labelledby="account-title">
      <div className="account-glow" aria-hidden="true" />
      <div className="account-copy">
        <div className="account-topline"><span className="account-badge"><Sparkles size={14} aria-hidden="true" /> Primary account</span><span className="account-live"><i /> Active</span></div>
        <p className="eyebrow">{account.type}</p>
        <h2 id="account-title">{account.name}</h2>
        <p className="masked-number">{account.maskedNumber}</p>
      </div>
      <div className="balance">
        <div className="balance-label"><span>Available balance</span><button className="balance-toggle" type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? "Hide balance" : "Show balance"}>{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
        <strong>{visible ? currency.format(account.balance) : "₹ ••••••"}</strong>
        <span className="balance-hint">Updated just now · INR</span>
      </div>
    </section>
  );
}
