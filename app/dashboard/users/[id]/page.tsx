"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserDetailsResponse } from "@/types/user";
import { Job, JobWithQuotes } from "@/types/job";
import {
  RiArrowLeftLine,
  RiLoader4Line,
  RiUserLine,
  RiMailLine,
  RiPhoneLine,
  RiCalendarLine,
  RiTimeLine,
  RiShieldLine,
  RiBriefcaseLine,
  RiMapPinLine,
  RiCoinLine,
  RiFileTextLine,
  RiCheckLine,
  RiCloseLine,
  RiLogoutBoxLine,
} from "react-icons/ri";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<UserDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeJobTab, setActiveJobTab] = useState<
    "open" | "active" | "completed"
  >("open");
  const [activeProviderTab, setActiveProviderTab] = useState<
    "leads" | "quotes" | "active" | "completed"
  >("leads");
  const [jobs, setJobs] = useState<{
    open: Job[];
    active: Job[];
    completed: Job[];
  }>({
    open: [],
    active: [],
    completed: [],
  });
  const [providerJobs, setProviderJobs] = useState<{
    leads: Job[];
    quotes: JobWithQuotes[];
    active: Job[];
    completed: Job[];
  }>({
    leads: [],
    quotes: [],
    active: [],
    completed: [],
  });
  const [jobsLoading, setJobsLoading] = useState(false);
  const [providerJobsLoading, setProviderJobsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error("User not found");
        const json: UserDetailsResponse = await res.json();
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setCurrentUserId(session?.user?.id || null);
        const role =
          session?.user?.user_metadata?.role ||
          session?.user?.app_metadata?.role;
        setCurrentUserRole(role || null);
      } catch (e) {
        console.error("Failed to get current user:", e);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!data || !currentUserId) return;

      const role =
        data.user.user_metadata?.role || data.user.app_metadata?.role;

      // Only fetch jobs if user is a customer viewing their own profile
      if (role !== "customer" || currentUserId !== id) return;

      setJobsLoading(true);
      try {
        const res = await fetch(`/api/users/${id}/jobs`);
        if (res.ok) {
          const jobsData = await res.json();
          setJobs(jobsData);
        }
      } catch (e) {
        console.error("Failed to fetch jobs:", e);
      } finally {
        setJobsLoading(false);
      }
    };
    fetchJobs();
  }, [id, data, currentUserId]);

  useEffect(() => {
    const fetchProviderJobs = async () => {
      if (!data || !currentUserId) return;

      const role =
        data.user.user_metadata?.role || data.user.app_metadata?.role;

      // Only fetch jobs if user is a service provider viewing their own profile
      if (role !== "service_provider" || currentUserId !== id) return;

      setProviderJobsLoading(true);
      try {
        const res = await fetch(`/api/users/${id}/provider-jobs`);
        if (res.ok) {
          const jobsData = await res.json();
          setProviderJobs(jobsData);
        }
      } catch (e) {
        console.error("Failed to fetch provider jobs:", e);
      } finally {
        setProviderJobsLoading(false);
      }
    };
    fetchProviderJobs();
  }, [id, data, currentUserId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <RiLoader4Line
          className="animate-spin text-[var(--primary)]"
          size={32}
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] gap-4">
        <p className="text-[var(--error)]">{error ?? "User not found"}</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-[var(--primary)] underline underline-offset-2 cursor-pointer"
        >
          Go back
        </button>
      </div>
    );
  }

  const { user } = data;
  const meta = user.user_metadata ?? {};
  const fullName = meta.full_name ?? meta.name ?? "—";
  const avatarUrl = meta.avatar_url;
  const role = meta.role ?? user.app_metadata?.role ?? "user";
  const isServiceProvider = role === "service_provider";
  const isCustomer = role === "customer";
  const isViewingOwnProfile = currentUserId === id;
  const isCurrentUserAdmin = currentUserRole === "admin";

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/signin");
    } catch (e) {
      console.error("Sign out failed:", e);
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header
        className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--border)]"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div className="max-w-screen-lg mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {isCurrentUserAdmin ? (
            <>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
              >
                <RiArrowLeftLine size={18} />
                <span className="text-sm font-medium">Back</span>
              </button>
            </>
          ) : (
            <>
              <div></div>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm hover:border-[var(--error)] hover:text-[var(--error)] transition-colors disabled:opacity-60 cursor-pointer"
              >
                {signingOut ? (
                  <RiLoader4Line className="animate-spin" size={15} />
                ) : (
                  <RiLogoutBoxLine size={15} />
                )}
                <span>Sign out</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-screen-lg mx-auto px-6 py-8 space-y-6">
        {/* Profile card */}
        <div
          className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[var(--surface-alt)] border border-[var(--border)] overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <RiUserLine size={28} className="text-[var(--text-tertiary)]" />
              )}
            </div>

            {/* Name & badge */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-[var(--text-primary)] truncate">
                {fullName}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    role === "service_provider"
                      ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                      : role === "customer"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                        : role === "admin"
                          ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30"
                          : "bg-[var(--surface-alt)] text-[var(--text-secondary)] border-[var(--border)]"
                  }`}
                >
                  <RiShieldLine size={11} />
                  {role === "service_provider"
                    ? "Service Provider"
                    : role === "customer"
                      ? "Customer"
                      : role}
                </span>
                {meta.status && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      meta.status === "active"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                        : "bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {meta.status.charAt(0).toUpperCase() + meta.status.slice(1)}
                  </span>
                )}
              </div>
            </div>

            {/* User ID */}
            <div className="text-right hidden sm:block">
              <p className="text-xs text-[var(--text-tertiary)] mb-1">
                User ID
              </p>
              <code className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--surface-alt)] px-2 py-1 rounded-lg border border-[var(--border)]">
                {user.id}
              </code>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard
            icon={<RiMailLine size={16} />}
            label="Email"
            value={user.email ?? "—"}
            badge={
              meta.email_verified === true ? (
                <span className="text-green-600 dark:text-green-400 text-xs flex items-center gap-1">
                  <RiCheckLine size={14} /> Verified
                </span>
              ) : meta.email_verified === false ? (
                <span className="text-yellow-600 dark:text-yellow-400 text-xs flex items-center gap-1">
                  <RiCloseLine size={14} /> Unverified
                </span>
              ) : undefined
            }
          />
          <InfoCard
            icon={<RiPhoneLine size={16} />}
            label="Phone"
            value={meta.phone ?? "—"}
          />
          <InfoCard
            icon={<RiCalendarLine size={16} />}
            label="Joined"
            value={formatDate(user.created_at)}
          />
          <InfoCard
            icon={<RiTimeLine size={16} />}
            label="Last Sign In"
            value={
              user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "Never"
            }
          />
        </div>

        {/* Service Provider specific info */}
        {isServiceProvider && (
          <>
            <Section title="Service Provider Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {meta.businessName && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                      <RiBriefcaseLine size={14} />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        Business Name
                      </span>
                    </div>
                    <span className="text-sm text-[var(--text-primary)]">
                      {meta.businessName}
                    </span>
                  </div>
                )}
                {meta.businessPhone && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                      <RiPhoneLine size={14} />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        Business Phone
                      </span>
                    </div>
                    <span className="text-sm text-[var(--text-primary)]">
                      {meta.businessPhone}
                    </span>
                  </div>
                )}
                {meta.serviceArea && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                      <RiMapPinLine size={14} />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        Service Area
                      </span>
                    </div>
                    <span className="text-sm text-[var(--text-primary)]">
                      {meta.serviceArea}
                    </span>
                  </div>
                )}
                {meta.credits !== undefined && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                      <RiCoinLine size={14} />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        Credits
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                      {meta.credits}
                    </span>
                  </div>
                )}
                {meta.categories && Array.isArray(meta.categories) && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                      <RiFileTextLine size={14} />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        Categories
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {meta.categories.map((cat: string) => (
                        <span
                          key={cat}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[var(--surface-alt)] text-[var(--text-secondary)] border border-[var(--border)]"
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {meta.consent_background_check !== undefined && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                      <RiShieldLine size={14} />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        Background Check Consent
                      </span>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        meta.consent_background_check
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {meta.consent_background_check
                        ? "✓ Consented"
                        : "✗ Not Consented"}
                    </span>
                  </div>
                )}
                {meta.document_url && (
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                      <RiFileTextLine size={14} />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        Document
                      </span>
                    </div>
                    <a
                      href={meta.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--primary)] hover:underline break-all"
                    >
                      View Document
                    </a>
                  </div>
                )}
              </div>
            </Section>

            {/* Credit History */}
            {meta.creditHistory &&
              Array.isArray(meta.creditHistory) &&
              meta.creditHistory.length > 0 && (
                <Section title="Credit History">
                  <div className="space-y-2">
                    {meta.creditHistory.map(
                      (
                        entry: {
                          type: string;
                          amount: number;
                          createdAt: string;
                          description: string;
                        },
                        idx: number,
                      ) => (
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
                                {new Date(entry.createdAt).toLocaleString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </Section>
              )}
          </>
        )}

        {/* Customer Jobs - Only show if customer is viewing their own profile */}
        {isCustomer && isViewingOwnProfile && (
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
                onClick={() => setActiveJobTab("open")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeJobTab === "open"
                    ? "bg-[var(--primary)] text-black shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Open ({jobs.open.length})
              </button>
              <button
                onClick={() => setActiveJobTab("active")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeJobTab === "active"
                    ? "bg-[var(--primary)] text-black shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Active ({jobs.active.length})
              </button>
              <button
                onClick={() => setActiveJobTab("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeJobTab === "completed"
                    ? "bg-[var(--primary)] text-black shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Completed ({jobs.completed.length})
              </button>
            </div>

            {/* Jobs list */}
            {jobsLoading ? (
              <div className="flex items-center justify-center py-12">
                <RiLoader4Line
                  className="animate-spin text-[var(--primary)]"
                  size={24}
                />
              </div>
            ) : jobs[activeJobTab].length === 0 ? (
              <div className="text-center py-12 text-[var(--text-tertiary)]">
                <p className="text-sm">No {activeJobTab} jobs</p>
              </div>
            ) : (
              <div className="space-y-2">
                {jobs[activeJobTab].map((job) => (
                  <div
                    key={job.id}
                    className="py-3 px-4 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors"
                  >
                    {/* Title and Budget Row */}
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {job.title}
                      </p>
                      {job.budget && (
                        <p className="text-sm font-semibold text-[var(--primary)] flex-shrink-0">
                          €{job.budget}
                        </p>
                      )}
                    </div>

                    {/* Description Row */}
                    {job.description && (
                      <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    {/* Location and Date Row */}
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
                ))}
              </div>
            )}
          </div>
        )}

        {/* Service Provider Jobs - Only show if service provider is viewing their own profile */}
        {isServiceProvider && isViewingOwnProfile && (
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
                onClick={() => setActiveProviderTab("leads")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeProviderTab === "leads"
                    ? "bg-[var(--primary)] text-black shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Leads ({providerJobs.leads.length})
              </button>
              <button
                onClick={() => setActiveProviderTab("quotes")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeProviderTab === "quotes"
                    ? "bg-[var(--primary)] text-black shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Quotes ({providerJobs.quotes.length})
              </button>
              <button
                onClick={() => setActiveProviderTab("active")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeProviderTab === "active"
                    ? "bg-[var(--primary)] text-black shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Active ({providerJobs.active.length})
              </button>
              <button
                onClick={() => setActiveProviderTab("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeProviderTab === "completed"
                    ? "bg-[var(--primary)] text-black shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Completed ({providerJobs.completed.length})
              </button>
            </div>

            {/* Jobs list */}
            {providerJobsLoading ? (
              <div className="flex items-center justify-center py-12">
                <RiLoader4Line
                  className="animate-spin text-[var(--primary)]"
                  size={24}
                />
              </div>
            ) : providerJobs[activeProviderTab].length === 0 ? (
              <div className="text-center py-12 text-[var(--text-tertiary)]">
                <p className="text-sm">No {activeProviderTab} jobs</p>
              </div>
            ) : (
              <div className="space-y-3">
                {providerJobs[activeProviderTab].map((job) => {
                  const quoteDesc = job.quotes?.[0]?.description?.trim();
                  const descriptionText =
                    activeProviderTab === "quotes"
                      ? quoteDesc
                      : job.description?.trim();
                  const minAmount = job.quotes?.[0]?.minAmount;
                  const maxAmount = job.quotes?.[0]?.maxAmount;
                  const sameAmount = minAmount === maxAmount;

                  return (
                    <div
                      key={job.id}
                      className="py-3 px-4 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                          {job.title}
                        </p>
                        {job.budget && (
                          <p className="text-sm font-semibold text-[var(--primary)] flex-shrink-0">
                            €{job.budget}
                          </p>
                        )}
                      </div>
                      {descriptionText && (
                        <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2">
                          {descriptionText}
                        </p>
                      )}
                      {activeProviderTab === "quotes" && (
                        <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2">
                          {sameAmount
                            ? `€${minAmount}`
                            : `€${minAmount} - €${maxAmount}`}
                        </p>
                      )}
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
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: React.ReactNode;
}) {
  return (
    <div
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 flex items-start gap-3"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="w-8 h-8 rounded-xl bg-[var(--surface-alt)] flex items-center justify-center text-[var(--primary)] flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
            {label}
          </p>
          {badge && <div>{badge}</div>}
        </div>
        <p className="text-sm text-[var(--text-primary)] break-all">{value}</p>
      </div>
    </div>
  );
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
