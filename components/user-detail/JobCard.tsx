import { Job, JobWithQuotes } from "@/types/job";
import { RiCalendarLine, RiMapPinLine, RiStarFill } from "react-icons/ri";

interface JobCardProps {
  job: Job | JobWithQuotes;
  showQuoteInfo?: boolean;
  showReview?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <RiStarFill
          key={i}
          size={12}
          className={
            i <= rating ? "text-[var(--primary)]" : "text-[var(--border)]"
          }
          style={
            i <= rating
              ? { filter: "drop-shadow(0 0 4px rgba(212,175,55,0.7))" }
              : undefined
          }
        />
      ))}
      <span className="ml-1.5 text-[12px] font-semibold tabular-nums text-[var(--primary)]">
        {rating}.0
      </span>
    </span>
  );
}

function ReviewBlock({
  label,
  initial,
  review,
  variant,
}: {
  label: string;
  initial: string;
  review: { rating: number; comment: string };
  variant: "gold" | "blue";
}) {
  const isGold = variant === "gold";
  return (
    <div
      className={`rounded-xl px-4 py-3 border ${
        isGold
          ? "bg-[var(--primary)]/5 border-[var(--primary)]/20"
          : "bg-[var(--info-bg)] border-[var(--info)]/15"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
              isGold
                ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                : "bg-[var(--info)]/15 text-[var(--info)]"
            }`}
          >
            {initial}
          </div>
          <span className="text-[12px] font-medium text-[var(--text-secondary)]">
            {label}
          </span>
        </div>
        <StarRating rating={review.rating} />
      </div>
      {review.comment && (
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed pl-[30px] italic">
          &ldquo;{review.comment}&rdquo;
        </p>
      )}
    </div>
  );
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

export function JobCard({
  job,
  showQuoteInfo = false,
  showReview = false,
}: JobCardProps) {
  const jobWithQuotes = job as JobWithQuotes;
  const quoteDesc = jobWithQuotes.quotes?.[0]?.description?.trim();
  const descriptionText = showQuoteInfo ? quoteDesc : job.description?.trim();
  const minAmount = jobWithQuotes.quotes?.[0]?.minAmount;
  const maxAmount = jobWithQuotes.quotes?.[0]?.maxAmount;
  const sameAmount = minAmount === maxAmount;
  const quoteStatus = jobWithQuotes.quotes?.[0]?.status;
  const category = job.category_name_en ?? job.category;

  return (
    <div className="group relative rounded-2xl bg-[var(--surface-alt)] border border-[var(--border)] hover:border-[var(--primary)]/45 transition-all duration-300 overflow-hidden hover:shadow-[0_8px_32px_rgba(212,175,55,0.09)]">
      {/* Ambient corner glow — appears on hover */}
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[var(--primary)]/0 group-hover:bg-[var(--primary)]/10 blur-2xl transition-all duration-500 pointer-events-none" />

      {/* Top edge accent line — brightens on hover */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/0 group-hover:via-[var(--primary)]/50 to-transparent transition-all duration-500" />

      {/* Main content */}
      <div className="relative px-5 pt-4 pb-4">
        {/* Title + Budget */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <h3 className="text-[15px] font-semibold text-[var(--text-primary)] leading-snug mb-2">
            {job.title}
          </h3>
          <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/25 text-[var(--primary)] text-xs font-bold">
            {job.budget != null ? `€${job.budget}` : "TBC"}
          </span>
        </div>

        {/* Description */}
        {descriptionText && (
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-3">
            {descriptionText}
          </p>
        )}

        {/* Quote amount + status */}
        {showQuoteInfo && minAmount !== undefined && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[15px] font-semibold text-[var(--text-primary)]">
              {sameAmount ? `€${minAmount}` : `€${minAmount} – €${maxAmount}`}
            </span>
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

        {/* Footer: location · date */}
        <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-tertiary)] pt-3 border-t border-[var(--border)]/50">
          {job.location && (
            <>
              <RiMapPinLine size={11} className="flex-shrink-0" />
              <span>{job.location}</span>
              <span className="mx-1 opacity-40 select-none">·</span>
            </>
          )}
          <RiCalendarLine size={11} className="flex-shrink-0 ml-auto" />
          <span>{formatDate(job.created_at)}</span>
        </div>
      </div>

      {/* Reviews panel */}
      {showReview && job.reviews && (
        <div className="border-t border-[var(--border)]/50 px-5 pt-3.5 pb-4 space-y-2.5">
          <p className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
            Reviews
          </p>
          {job.reviews.by_user && (
            <ReviewBlock
              label="Customer"
              initial="C"
              review={job.reviews.by_user}
              variant="gold"
            />
          )}
          {job.reviews.by_provider && (
            <ReviewBlock
              label="Provider"
              initial="P"
              review={job.reviews.by_provider}
              variant="blue"
            />
          )}
        </div>
      )}
    </div>
  );
}
