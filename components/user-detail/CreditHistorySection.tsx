"use client";

import { PACKAGES } from "@/constants/packages";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  RiAddLine,
  RiCloseLine,
  RiCoinsLine,
  RiLoader4Line,
} from "react-icons/ri";

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
  isViewingOwn: boolean;
}

export function CreditHistorySection({
  userId,
  creditHistory,
  onAdded,
  isViewingOwn,
}: CreditHistorySectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        {/* Gold accent top line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent" />

        <div className="px-6 pt-5 pb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center">
                <RiCoinsLine size={14} className="text-[var(--primary)]" />
              </div>
              <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
                Credit History
              </h2>
            </div>
            {isViewingOwn && (
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black text-xs font-medium transition-colors cursor-pointer"
              >
                <RiAddLine size={13} />
                Add Credits
              </button>
            )}
          </div>

          {creditHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-[var(--text-tertiary)]">
              <RiCoinsLine size={28} className="opacity-25" />
              <p className="text-sm">No credit history yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {creditHistory.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 py-3 px-4 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] hover:border-[var(--primary)]/20 transition-colors"
                >
                  {/* Amount badge */}
                  <div
                    className={`flex-shrink-0 min-w-[52px] h-10 rounded-lg px-2 flex items-center justify-center border ${
                      entry.type === "deduct"
                        ? "bg-red-500/10 border-red-500/20"
                        : "bg-green-500/10 border-green-500/20"
                    }`}
                  >
                    <span
                      className={`text-[15px] font-bold tabular-nums ${
                        entry.type === "deduct"
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {entry.type === "deduct" ? "−" : "+"}
                      {entry.amount}
                    </span>
                  </div>

                  {/* Description + date */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-[var(--text-primary)] truncate">
                      {entry.description}
                    </p>
                    <p className="text-[13px] text-[var(--text-tertiary)] mt-0.5">
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
              ))}
            </div>
          )}
        </div>
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
  const paddleRef = useRef<Paddle | undefined>(undefined);
  // Keep a stable ref so the Paddle eventCallback always calls the latest onAdded
  const onAddedRef = useRef(onAdded);
  useEffect(() => {
    onAddedRef.current = onAdded;
  }, [onAdded]);

  // Tracks whether the checkout completed so we know the "closed" event is post-payment
  const completedRef = useRef(false);

  // Initialize Paddle.js once on mount
  useEffect(() => {
    initializePaddle({
      environment:
        (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as
          | "sandbox"
          | "production") ?? "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
      eventCallback(event) {
        if (event.name === "checkout.completed") {
          completedRef.current = true;
          // Close the overlay and start polling for updated credits
          paddleRef.current?.Checkout.close();
          setSaving(false);
          onAddedRef.current();
        }
        if (event.name === "checkout.closed" && !completedRef.current) {
          // User dismissed overlay without paying
          setSaving(false);
        }
      },
    }).then((paddle) => {
      if (paddle) paddleRef.current = paddle;
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleBuy = async () => {
    if (!selected) return;

    setSaving(true);
    setError(null);
    completedRef.current = false;

    try {
      const res = await fetch("/api/paddle/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, packageId: selected }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create checkout");
      }

      const { transactionId } = await res.json();
      paddleRef.current?.Checkout.open({ transactionId });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setSaving(false);
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--glass-overlay)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden flex flex-col max-h-[90vh]"
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
        <div className="p-6 space-y-2.5 overflow-y-auto flex-1">
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
                  <p
                    className={`text-sm font-semibold ${selected === pkg.id ? "text-[var(--primary)]" : "text-[var(--text-primary)]"}`}
                  >
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
            onClick={handleBuy}
            disabled={!selected || saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving && <RiLoader4Line className="animate-spin" size={15} />}
            {saving ? "Opening…" : "Buy"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
