interface CreditHistoryEntry {
  type: string;
  amount: number;
  createdAt: string;
  description: string;
}

interface CreditHistorySectionProps {
  creditHistory: CreditHistoryEntry[];
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <h2 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function CreditHistorySection({
  creditHistory,
}: CreditHistorySectionProps) {
  return (
    <Section title="Credit History">
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
    </Section>
  );
}
