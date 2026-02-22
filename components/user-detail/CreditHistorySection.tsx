"use client";

import { useState, useRef, useEffect } from "react";
import { RiAddLine, RiLoader4Line, RiCloseLine, RiCoinsLine } from "react-icons/ri";

interface CreditHistoryEntry {
  type: string;
  amount: number;
  createdAt: string;
  description: string;
}

interface CreditHistorySectionProps {
  userId: string;
  creditHistory: CreditHistoryEntry[];
  onAdded: () => void;
}

const PACKAGES = [
  { id: "starter", name: "Starter", credits: 25, price: 35, perCredit: 1.4 },
  { id: "small", name: "Small", credits: 60, price: 72, perCredit: 1.2 },
  { id: "medium", name: "Medium (Best Value)", credits: 150, price: 157.5, perCredit: 1.05 },
  { id: "pro", name: "Pro", credits: 350, price: 332.5, perCredit: 0.95 },
  { id: "business", name: "Business", credits: 900, price: 765, perCredit: 0.85 },
] as const;

export function CreditHistorySection({
  userId,
  creditHistory,
  onAdded,
}: CreditHistorySectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
            Credit History
          </h2>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black text-xs font-semibold transition-colors cursor-pointer"
          >
            <RiAddLine size={14} />
            Add Credits
          </button>
        </div>

        {creditHistory.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)] text-center py-6">
            No credit history yet
          </p>
        ) : (
          <div className="space-y-2">
            {creditHistory.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg font-bold ${
                      entry.type === "deduct"
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {entry.type === "deduct" ? "-" : "+"}
                    {entry.amount}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {entry.description}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                      {new Date(entry.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <AddCreditsModal
          userId={userId}
          onClose={() => setModalOpen(false)}
          onAdded={() => {
            setModalOpen(false);
            onAdded();
          }}
        />
      )}
    </>
  );
}

function AddCreditsModal({
  userId,
  onClose,
  onAdded,
}: {
  userId: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleConfirm = async () => {
    if (!selected) return;
    const pkg = PACKAGES.find((p) => p.id === selected);
    if (!pkg) return;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${userId}/credits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: pkg.credits, packageName: pkg.name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to add credits");
      }
      onAdded();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setSaving(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--glass-overlay)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="w-full max-w-md bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
        style={{ boxShadow: "var(--shadow-xl)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <RiCoinsLine size={18} className="text-[var(--primary)]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Add Credits
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-alt)] transition-colors cursor-pointer"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Packages */}
        <div className="p-6 space-y-2.5">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelected(pkg.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selected === pkg.id
                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                  : "border-[var(--border)] bg-[var(--surface-alt)] hover:border-[var(--primary)]/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selected === pkg.id
                      ? "border-[var(--primary)]"
                      : "border-[var(--text-tertiary)]"
                  }`}
                >
                  {selected === pkg.id && (
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${selected === pkg.id ? "text-[var(--primary)]" : "text-[var(--text-primary)]"}`}>
                    {pkg.name}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                    ≈ €{pkg.perCredit.toFixed(2)}/credit
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {pkg.credits} credits
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  €{pkg.price % 1 === 0 ? pkg.price : pkg.price.toFixed(2)}
                </p>
              </div>
            </button>
          ))}

          {error && (
            <p className="text-sm text-[var(--error)] bg-[var(--error-bg)] border border-[var(--error)]/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--surface-alt)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected || saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving && <RiLoader4Line className="animate-spin" size={15} />}
            {saving ? "Adding…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
