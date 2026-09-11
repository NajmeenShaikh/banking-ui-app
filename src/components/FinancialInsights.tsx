import { ArrowDownRight, ArrowUpRight, Lightbulb, TrendingUp } from "lucide-react";
import type { Transaction } from "../types/banking";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function FinancialInsights({ transactions, monthlySpend }: { transactions: Transaction[]; monthlySpend: number }) {
  const debitTotal = transactions.filter((item) => item.type === "DEBIT").reduce((sum, item) => sum + item.amount, 0);
  const creditTotal = transactions.filter((item) => item.type === "CREDIT").reduce((sum, item) => sum + item.amount, 0);
  const categories = ["Housing", "Shopping", "Utilities", "Other"].map((category) => ({
    label: category,
    value: transactions.filter((item) => item.type === "DEBIT" && (category === "Other" ? !["Housing", "Shopping", "Utilities"].includes(item.category) : item.category === category)).reduce((sum, item) => sum + item.amount, 0),
  }));
  const maxCategory = Math.max(...categories.map((item) => item.value), 1);
  const savingsRate = creditTotal > 0 ? Math.max(0, Math.round(((creditTotal - debitTotal) / creditTotal) * 100)) : 0;

  return (
    <section className="insights-grid" aria-label="Financial overview">
      <article className="insight-card spending-card">
        <div className="insight-heading"><div><p className="eyebrow">Money overview</p><h2>September snapshot</h2></div><span className="insight-icon"><TrendingUp size={18} aria-hidden="true" /></span></div>
        <div className="money-summary">
          <div><span>Income</span><strong className="credit">{currency.format(creditTotal)}</strong><small><ArrowUpRight size={14} /> Money in</small></div>
          <div><span>Spending</span><strong className="debit">{currency.format(monthlySpend)}</strong><small><ArrowDownRight size={14} /> Money out</small></div>
        </div>
        <div className="progress-track" aria-label={`Estimated savings rate ${savingsRate}%`}><span style={{ width: `${Math.min(savingsRate, 100)}%` }} /></div>
        <p className="insight-foot">Estimated savings rate <strong>{savingsRate}%</strong></p>
      </article>

      <article className="insight-card category-card">
        <div className="insight-heading"><div><p className="eyebrow">Spending</p><h2>Where your money goes</h2></div></div>
        <div className="category-list">
          {categories.map((category) => <div className="category-row" key={category.label}><div className="category-meta"><span>{category.label}</span><strong>{currency.format(category.value)}</strong></div><div className="category-track"><span style={{ width: `${(category.value / maxCategory) * 100}%` }} /></div></div>)}
        </div>
      </article>

      <article className="insight-card smart-card">
        <div className="smart-icon"><Lightbulb size={20} aria-hidden="true" /></div>
        <div><p className="eyebrow">Smart insight</p><h2>Keep your spending on track</h2><p>Your recent activity shows {currency.format(monthlySpend)} in monthly spending. Review recurring payments before your next transfer.</p><button className="insight-link" type="button" onClick={() => document.getElementById("transactions-title")?.scrollIntoView({ behavior: "smooth" })}>Review activity <span aria-hidden="true">→</span></button></div>
      </article>
    </section>
  );
}
