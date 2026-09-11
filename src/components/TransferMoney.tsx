import { useMemo, useState } from "react";
import { beneficiaries, createTransfer, validateTransfer, type Beneficiary } from "../services/transferService";
import type { Account } from "../types/banking";

interface TransferMoneyProps {
  account: Account;
  onSuccess: (amount: number, transactionId: string, beneficiary: Beneficiary) => void;
  onClose: () => void;
}

type Step = "details" | "review" | "processing" | "success" | "error";

export function TransferMoney({ account, onSuccess, onClose }: TransferMoneyProps) {
  const [step, setStep] = useState<Step>("details");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState<{ id: string; amount: number; name: string } | null>(null);

  const selectedBeneficiary = useMemo(
    () => beneficiaries.find((item) => item.id === beneficiaryId),
    [beneficiaryId],
  );

  const handleReview = () => {
    const result = validateTransfer(account, beneficiaryId, amount);
    if (!result.valid) {
      setMessage(result.message);
      return;
    }
    setMessage("");
    setStep("review");
  };

  const handleConfirm = async () => {
    if (!selectedBeneficiary) return;
    const numericAmount = Number(amount);
    setStep("processing");
    setMessage("");

    try {
      const result = await createTransfer({
        sourceAccountId: account.id,
        beneficiaryId,
        amount: numericAmount,
        currency: "INR",
        idempotencyKey: crypto.randomUUID(),
      });
      setReceipt({ id: result.transactionId, amount: result.amount, name: result.beneficiaryName });
      onSuccess(result.amount, result.transactionId, selectedBeneficiary);
      setStep("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Transfer failed. Please try again.");
      setStep("error");
    }
  };

  return (
    <div className="transfer-overlay" role="presentation">
      <section className="transfer-modal" role="dialog" aria-modal="true" aria-labelledby="transfer-title">
        <div className="transfer-heading">
          <div>
            <p className="eyebrow">Secure transfer</p>
            <h2 id="transfer-title">Transfer money</h2>
          </div>
          <button className="close-button" type="button" onClick={onClose} aria-label="Close transfer">×</button>
        </div>

        {step === "details" && (
          <div className="transfer-form">
            <label htmlFor="beneficiary">Beneficiary</label>
            <select id="beneficiary" value={beneficiaryId} onChange={(event) => setBeneficiaryId(event.target.value)}>
              <option value="">Select a beneficiary</option>
              {beneficiaries.map((beneficiary) => (
                <option key={beneficiary.id} value={beneficiary.id}>
                  {beneficiary.name} — {beneficiary.maskedAccount}
                </option>
              ))}
            </select>

            <label htmlFor="transfer-amount">Amount (INR)</label>
            <input
              id="transfer-amount"
              inputMode="decimal"
              min="1"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="e.g. 5000"
            />
            <p className="helper">Available balance: {account.balance.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</p>

            {message && <p className="form-error" role="alert">{message}</p>}

            <button className="primary full-width" type="button" onClick={handleReview}>Review transfer</button>
          </div>
        )}

        {step === "review" && selectedBeneficiary && (
          <div className="transfer-review">
            <p className="helper">Review before confirming</p>
            <div className="review-row"><span>Beneficiary</span><strong>{selectedBeneficiary.name}</strong></div>
            <div className="review-row"><span>Bank / account</span><strong>{selectedBeneficiary.bankName} · {selectedBeneficiary.maskedAccount}</strong></div>
            <div className="review-row"><span>Amount</span><strong>{Number(amount).toLocaleString("en-IN", { style: "currency", currency: "INR" })}</strong></div>
            <div className="review-actions">
              <button className="secondary" type="button" onClick={() => setStep("details")}>Back</button>
              <button className="primary" type="button" onClick={() => void handleConfirm()}>Confirm transfer</button>
            </div>
          </div>
        )}

        {step === "processing" && <div className="transfer-state" role="status" aria-live="polite">Processing your transfer securely…</div>}

        {step === "success" && receipt && (
          <div className="transfer-state success-state" role="status" aria-live="polite">
            <h3>Transfer successful</h3>
            <p>{receipt.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })} sent to {receipt.name}.</p>
            <p className="helper">Reference: {receipt.id}</p>
            <button className="primary full-width" type="button" onClick={onClose}>Done</button>
          </div>
        )}

        {step === "error" && (
          <div className="transfer-state" role="alert">
            <h3>Transfer could not be completed</h3>
            <p>{message}</p>
            <button className="secondary" type="button" onClick={() => setStep("details")}>Try again</button>
          </div>
        )}
      </section>
    </div>
  );
}
