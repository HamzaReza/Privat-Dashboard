import { useState } from "react";
import { Job } from "@/types/job";
import { JobCard } from "./JobCard";
import { RiLoader4Line } from "react-icons/ri";

interface CustomerJobsSectionProps {
  jobs: {
    open: Job[];
    active: Job[];
    completed: Job[];
  };
  loading: boolean;
}

export function CustomerJobsSection({
  jobs,
  loading,
}: CustomerJobsSectionProps) {
  const [activeTab, setActiveTab] = useState<"open" | "active" | "completed">(
    "open"
  );

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
          onClick={() => setActiveTab("open")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === "open"
              ? "bg-[var(--primary)] text-black shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Open ({jobs.open.length})
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
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
