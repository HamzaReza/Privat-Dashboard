import { useState } from "react";
import { Job, JobWithQuotes } from "@/types/job";
import { JobCard } from "./JobCard";
import { RiBriefcaseLine } from "react-icons/ri";

interface ProviderJobsSectionProps {
  jobs: {
    leads: Job[];
    quotes: JobWithQuotes[];
    active: Job[];
    completed: Job[];
  };
  loading: boolean;
}

const TABS = [
  { key: "leads", label: "Leads" },
  { key: "quotes", label: "Quotes" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
] as const;

type Tab = "leads" | "quotes" | "active" | "completed";

export function ProviderJobsSection({
  jobs,
  loading,
}: ProviderJobsSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>("leads");

  return (
    <div
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {/* Gold accent top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent" />

      <div className="px-6 pt-5 pb-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center">
            <RiBriefcaseLine size={14} className="text-[var(--primary)]" />
          </div>
          <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
            Jobs
          </h2>
        </div>

        {/* Underline tab bar */}
        <div className="flex items-center border-b border-[var(--border)] mb-5">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative px-3.5 py-2.5 text-[15px] font-medium transition-all duration-200 cursor-pointer ${
                activeTab === key
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {label}
              <span className="ml-1.5 text-[13px] font-normal opacity-60">
                {jobs[key].length}
              </span>
              {activeTab === key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin" />
            </div>
          </div>
        ) : jobs[activeTab].length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-[var(--text-tertiary)]">
            <RiBriefcaseLine size={28} className="opacity-25" />
            <p className="text-sm">No {activeTab} jobs</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {jobs[activeTab].map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showQuoteInfo={activeTab === "quotes"}
                showReview={activeTab === "completed"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
