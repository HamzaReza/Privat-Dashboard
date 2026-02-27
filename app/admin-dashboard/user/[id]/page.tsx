"use client";

import { CreditHistorySection } from "@/components/user-detail/CreditHistorySection";
import { CustomerJobsSection } from "@/components/user-detail/CustomerJobsSection";
import { ProviderJobsSection } from "@/components/user-detail/ProviderJobsSection";
import { ServiceProviderInfo } from "@/components/user-detail/ServiceProviderInfo";
import { UserProfileCard } from "@/components/user-detail/UserProfileCard";
import { createClient } from "@/lib/supabase/client";
import { Job, JobWithQuotes } from "@/types/job";
import { UserDetailsResponse } from "@/types/user";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  RiArrowLeftLine,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiLoader4Line,
  RiLoginBoxLine,
  RiMailLine,
  RiPhoneLine,
} from "react-icons/ri";

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<UserDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<{
    open: Job[];
    active: Job[];
    completed: Job[];
  }>({ open: [], active: [], completed: [] });
  const [providerJobs, setProviderJobs] = useState<{
    leads: Job[];
    quotes: JobWithQuotes[];
    active: Job[];
    completed: Job[];
  }>({ leads: [], quotes: [], active: [], completed: [] });
  const [jobsLoading, setJobsLoading] = useState(false);
  const [providerJobsLoading, setProviderJobsLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  // Auth check — admin only
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const role =
          session?.user?.user_metadata?.role ||
          session?.user?.app_metadata?.role;
        if (!session?.user || role !== "admin") {
          router.replace("/admin-login");
          return;
        }
        setAuthUserId(session.user.id);
        setAuthChecked(true);
      } catch {
        router.replace("/admin-login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
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
  }, [id, refreshTick, authChecked]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!data) return;
      const role =
        data.user.user_metadata?.role || data.user.app_metadata?.role;
      if (role !== "customer") return;
      setJobsLoading(true);
      try {
        const res = await fetch(`/api/users/${id}/customer-jobs`);
        if (res.ok) setJobs(await res.json());
      } catch {
        // ignore
      } finally {
        setJobsLoading(false);
      }
    };
    fetchJobs();
  }, [id, data]);

  useEffect(() => {
    const fetchProviderJobs = async () => {
      if (!data) return;
      const role =
        data.user.user_metadata?.role || data.user.app_metadata?.role;
      if (role !== "service_provider") return;
      setProviderJobsLoading(true);
      try {
        const res = await fetch(`/api/users/${id}/provider-jobs`);
        if (res.ok) setProviderJobs(await res.json());
      } catch {
        // ignore
      } finally {
        setProviderJobsLoading(false);
      }
    };
    fetchProviderJobs();
  }, [id, data]);

  if (!authChecked || loading) {
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
  const isViewingOwnProfile = authUserId === id;
  console.log(
    "🚀 ~ page.tsx:159 ~ AdminUserDetailPage ~ isViewingOwnProfile:",
    isViewingOwnProfile,
  );
  const isCurrentUserAdmin = true;

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
    <div className="min-h-screen bg-[var(--background)] font-body">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--border-hsl))/0.5] bg-[hsl(var(--background-hsl))/0.9] backdrop-blur-md">
        <div className="max-w-screen-lg mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <img src="/privat-logo.png" alt="PRIVAT" className="h-40" />
          </Link>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[hsl(var(--muted-foreground-hsl))] hover:text-[hsl(var(--primary-hsl))] transition-colors cursor-pointer font-body text-sm"
          >
            <RiArrowLeftLine size={18} />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-screen-lg mx-auto px-6 py-8 space-y-6">
        <UserProfileCard user={user} isCurrentUserAdmin={isCurrentUserAdmin} />

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
              {appMeta.providers &&
              Array.isArray(appMeta.providers) &&
              appMeta.providers.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {appMeta.providers.map((provider: unknown) => (
                    <span
                      key={provider as string}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30"
                    >
                      {typeof provider === "string"
                        ? provider.charAt(0).toUpperCase() + provider.slice(1)
                        : (provider as string)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-secondary)]">—</p>
              )}
            </div>
          </div>
        </div>

        {isServiceProvider && <ServiceProviderInfo meta={meta} />}

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
            isViewingOwn={isViewingOwnProfile}
          />
        )}

        {isCustomer && (
          <CustomerJobsSection jobs={jobs} loading={jobsLoading} />
        )}

        {isServiceProvider && (
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
