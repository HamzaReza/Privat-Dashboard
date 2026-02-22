import { Job, JobWithQuotes } from "@/types/job";
import { RiMapPinLine, RiCalendarLine } from "react-icons/ri";

interface JobCardProps {
  job: Job | JobWithQuotes;
  showQuoteInfo?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function JobCard({ job, showQuoteInfo = false }: JobCardProps) {
  const jobWithQuotes = job as JobWithQuotes;
  const quoteDesc = jobWithQuotes.quotes?.[0]?.description?.trim();
  const descriptionText = showQuoteInfo ? quoteDesc : job.description?.trim();
  const minAmount = jobWithQuotes.quotes?.[0]?.minAmount;
  const maxAmount = jobWithQuotes.quotes?.[0]?.maxAmount;
  const sameAmount = minAmount === maxAmount;
  const quoteStatus = jobWithQuotes.quotes?.[0]?.status;

  return (
    <div className="py-5 px-5 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors">
      {/* Title + Budget */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <p className="text-base font-semibold text-[var(--text-primary)] leading-tight">
          {job.title}
        </p>
        {job.budget && (
          <p className="text-base font-bold text-[var(--primary)] flex-shrink-0">
            €{job.budget}
          </p>
        )}
      </div>

      {/* Description */}
      {descriptionText && (
        <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2 leading-relaxed">
          {descriptionText}
        </p>
      )}

      {/* Quote amount + Status (for quotes tab) */}
      {showQuoteInfo && minAmount !== undefined && (
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {sameAmount ? `€${minAmount}` : `€${minAmount} - €${maxAmount}`}
          </p>
          {quoteStatus && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                quoteStatus === "accepted"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                  : quoteStatus === "rejected"
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                    : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
              }`}
            >
              {quoteStatus.charAt(0).toUpperCase() + quoteStatus.slice(1)}
            </span>
          )}
        </div>
      )}

      {/* Location + Date */}
      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
        {job.location && (
          <span className="flex items-center gap-1">
            <RiMapPinLine size={12} />
            {job.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <RiCalendarLine size={12} />
          {formatDate(job.created_at)}
        </span>
      </div>
    </div>
  );
}
