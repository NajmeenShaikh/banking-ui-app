import { ArrowUpRight, CreditCard, FileText, Landmark, Users } from "lucide-react";

const actions = [
  { id: "transfer", label: "Transfer", hint: "Send money", icon: ArrowUpRight },
  { id: "beneficiary", label: "Beneficiary", hint: "Manage payees", icon: Users },
  { id: "cards", label: "Cards", hint: "View cards", icon: CreditCard },
  { id: "loans", label: "Loans", hint: "EMI & loans", icon: Landmark },
  { id: "statement", label: "Statement", hint: "Download activity", icon: FileText },
];

interface QuickActionsProps { onTransfer: () => void; }

export function QuickActions({ onTransfer }: QuickActionsProps) {
  return <section className="quick-section" aria-labelledby="quick-actions-title"><div className="section-heading"><div><p className="eyebrow">Shortcuts</p><h2 id="quick-actions-title">Quick actions</h2></div><span className="muted">Everything you need, one tap away</span></div><div className="quick-actions">{actions.map(({ id, label, hint, icon: Icon }) => <button className="quick-action" type="button" key={id} onClick={id === "transfer" ? onTransfer : undefined} disabled={id !== "transfer"}><span className="quick-icon"><Icon size={19} aria-hidden="true" /></span><span><strong>{label}</strong><small>{hint}</small></span>{id === "transfer" && <span className="quick-arrow" aria-hidden="true">↗</span>}</button>)}</div></section>;
}
