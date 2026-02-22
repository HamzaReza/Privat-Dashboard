"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserDetailsResponse } from "@/types/user";
import { Job, JobWithQuotes } from "@/types/job";
import {
  RiArrowLeftLine,
  RiLoader4Line,
  RiMailLine,
  RiPhoneLine,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiLogoutBoxLine,
  RiLoginBoxLine,
} from "react-icons/ri";
import { UserProfileCard } from "@/components/user-detail/UserProfileCard";
import { ServiceProviderInfo } from "@/components/user-detail/ServiceProviderInfo";
import { CreditHistorySection } from "@/components/user-detail/CreditHistorySection";
import { CustomerJobsSection } from "@/components/user-detail/CustomerJobsSection";
import { ProviderJobsSection } from "@/components/user-detail/ProviderJobsSection";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<UserDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [refreshTick, setRefreshTick] = useState(0);

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
  }, [id, refreshTick]);

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
        const res = await fetch(`/api/users/${id}/customer-jobs`);
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
  const appMeta = user.app_metadata ?? {};
  const role = (meta.role ?? user.app_metadata?.role ?? "user") as string;
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

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

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
        <UserProfileCard user={user} isCurrentUserAdmin={isCurrentUserAdmin} />

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
          <div
            className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 flex items-start gap-3"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--surface-alt)] flex items-center justify-center text-[var(--primary)] flex-shrink-0 mt-0.5">
              <RiLoginBoxLine size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold mb-1">
                Auth Providers
              </p>
              {appMeta.providers && Array.isArray(appMeta.providers) && appMeta.providers.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {appMeta.providers.map((provider: unknown) => (
                    <span
                      key={provider as string}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30"
                    >
                      {typeof provider === 'string' ? provider.charAt(0).toUpperCase() + provider.slice(1) : provider as string}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-secondary)]">—</p>
              )}
            </div>
          </div>
        </div>

        {/* Service Provider specific info */}
        {isServiceProvider && <ServiceProviderInfo meta={meta} />}

        {/* Credit History - Show for service providers (own profile or admin viewing) */}
        {isServiceProvider && (isViewingOwnProfile || isCurrentUserAdmin) && (
          <CreditHistorySection
            userId={id}
            creditHistory={
              (meta.creditHistory as {
                type: string;
                amount: number;
                createdAt: string;
                description: string;
              }[]) ?? []
            }
            onAdded={() => setRefreshTick((t) => t + 1)}
          />
        )}

        {/* Customer Jobs - Only show if customer is viewing their own profile */}
        {isCustomer && isViewingOwnProfile && (
          <CustomerJobsSection jobs={jobs} loading={jobsLoading} />
        )}

        {/* Service Provider Jobs - Only show if service provider is viewing their own profile */}
        {isServiceProvider && isViewingOwnProfile && (
          <ProviderJobsSection
            jobs={providerJobs}
            loading={providerJobsLoading}
          />
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
