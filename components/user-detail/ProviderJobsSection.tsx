import { useState } from "react";
import { Job, JobWithQuotes } from "@/types/job";
import { JobCard } from "./JobCard";
import { RiLoader4Line } from "react-icons/ri";

interface ProviderJobsSectionProps {
  jobs: {
    leads: Job[];
    quotes: JobWithQuotes[];
    active: Job[];
    completed: Job[];
  };
  loading: boolean;
}

export function ProviderJobsSection({
  jobs,
  loading,
}: ProviderJobsSectionProps) {
  const [activeTab, setActiveTab] = useState<
    "leads" | "quotes" | "active" | "completed"
  >("leads");

  return (
    <div
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <h2 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">
        Jobs
      </h2>

      {/* Tab selector */}
      <div className="flex items-center gap-1 bg-[var(--surface-alt)] rounded-xl p-1 mb-4 w-fit border border-[var(--border)]">
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "leads"
              ? "bg-[var(--primary)] text-black shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Leads ({jobs.leads.length})
        </button>
        <button
          onClick={() => setActiveTab("quotes")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "quotes"
              ? "bg-[var(--primary)] text-black shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Quotes ({jobs.quotes.length})
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "active"
              ? "bg-[var(--primary)] text-black shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Active ({jobs.active.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "completed"
              ? "bg-[var(--primary)] text-black shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Completed ({jobs.completed.length})
        </button>
      </div>

      {/* Jobs list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RiLoader4Line
            className="animate-spin text-[var(--primary)]"
            size={24}
          />
        </div>
      ) : jobs[activeTab].length === 0 ? (
        <div className="text-center py-12 text-[var(--text-tertiary)]">
          <p className="text-sm">No {activeTab} jobs</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs[activeTab].map((job) => (
            <JobCard
              key={job.id}
              job={job}
              showQuoteInfo={activeTab === "quotes"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
