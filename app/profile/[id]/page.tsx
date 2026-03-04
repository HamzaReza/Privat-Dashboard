"use client";

import { CreditHistorySection } from "@/components/user-detail/CreditHistorySection";
import { CustomerJobsSection } from "@/components/user-detail/CustomerJobsSection";
import { EditProfileModal } from "@/components/user-detail/EditProfileModal";
import { ProviderJobsSection } from "@/components/user-detail/ProviderJobsSection";
import { ServiceProviderInfo } from "@/components/user-detail/ServiceProviderInfo";
import { UserProfileCard } from "@/components/user-detail/UserProfileCard";
import { createClient } from "@/lib/supabase/client";
import { Job, JobWithQuotes } from "@/types/job";
import { UserDetailsResponse } from "@/types/user";
import { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiLoader4Line,
  RiLoginBoxLine,
  RiLogoutBoxLine,
  RiMailLine,
  RiPhoneLine,
  RiUserLine,
} from "react-icons/ri";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<UserDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
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
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Auth check — must be viewing own profile, not admin
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        if (!session?.user) {
          router.replace("/login");
          return;
        }
        const role =
          session.user.user_metadata?.role || session.user.app_metadata?.role;
        if (role === "admin") {
          router.replace("/admin-dashboard");
          return;
        }
        if (session.user.id !== id) {
          router.replace(`/profile/${session.user.id}`);
          return;
        }
        setAuthChecked(true);
      } catch {
        router.replace("/login");
      }
    };
    checkAuth();
  }, [id, router]);

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

  useEffect(() => {
    if (!authChecked) return;
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, authChecked]);

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

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/login");
    } catch {
      setSigningOut(false);
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin" />
          <div className="absolute inset-2 rounded-full bg-[var(--primary)]/10 blur-sm" />
        </div>
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
  const isViewingOwnProfile = session?.user?.id === id;
  const isCurrentUserAdmin = false;

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
    <div className="relative min-h-screen bg-[var(--background)]">
      {editModalOpen && (
        <EditProfileModal
          userId={id}
          role={role}
          currentValues={{
            full_name: (meta.full_name ?? meta.name) as string | undefined,
            phone: meta.phone as string | undefined,
            avatar_url: meta.avatar_url as string | undefined,
            businessName: meta.businessName as string | undefined,
            businessPhone: meta.businessPhone as string | undefined,
            serviceArea: meta.serviceArea as string | undefined,
            latitude: meta.latitude as number | undefined,
            longitude: meta.longitude as number | undefined,
            categories: meta.categories as string[] | undefined,
          }}
          onClose={() => setEditModalOpen(false)}
          onSaved={() => {
            setEditModalOpen(false);
            fetchUser();
          }}
        />
      )}
      {/* Ambient gold glow */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--primary)]/[0.05] blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[hsl(var(--background-hsl))/0.85] backdrop-blur-xl">
        <div className="w-full px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <img src="/privat-logo-rect.png" alt="PRIVAT" className="h-7 w-auto" />
          </Link>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[hsl(var(--border-hsl))/0.5] text-[hsl(var(--muted-foreground-hsl))] text-sm hover:border-[hsl(var(--primary-hsl))/0.6] hover:text-[hsl(var(--primary-hsl))] transition-all duration-200 disabled:opacity-60 cursor-pointer"
          >
            {signingOut ? (
              <RiLoader4Line className="animate-spin" size={15} />
            ) : (
              <RiLogoutBoxLine size={15} />
            )}
            <span>Sign out</span>
          </button>
        </div>
        {/* Gold gradient separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent" />
      </header>

      {/* Content */}
      <main className="relative w-full px-6 py-10 space-y-6">
        <div className="slide-up">
          <UserProfileCard
            user={user}
            isCurrentUserAdmin={isCurrentUserAdmin}
            isViewingOwnProfile={isViewingOwnProfile}
            onEdit={() => setEditModalOpen(true)}
          />
        </div>

        {/* Account Details — unified panel */}
        <div
          className="slide-up bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
          style={{ animationDelay: "0.08s", boxShadow: "var(--shadow-sm)" }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent" />

          {/* Header */}
          <div className="flex items-center gap-2.5 px-6 pt-5 pb-4">
            <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center">
              <RiUserLine size={14} className="text-[var(--primary)]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
              Account Details
            </h2>
          </div>

          {/* 2-column grid */}
          <div className="grid grid-cols-2 border-t border-[var(--border)]/60">
            {/* Email */}
            <div className="px-6 py-4 border-r border-[var(--border)]/60 hover:bg-[var(--surface-alt)]/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-[var(--surface-alt)] flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                  <RiMailLine size={12} />
                </div>
                <span className="text-xs font-medium text-[var(--text-tertiary)]">
                  Email
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[15px] text-[var(--text-primary)] break-all">
                  {user.email ?? "—"}
                </span>
                {meta.email_verified === true ? (
                  <span className="text-green-600 dark:text-green-400 text-xs flex items-center gap-0.5 flex-shrink-0">
                    <RiCheckLine size={12} /> Verified
                  </span>
                ) : meta.email_verified === false ? (
                  <span className="text-yellow-600 dark:text-yellow-400 text-xs flex items-center gap-0.5 flex-shrink-0">
                    <RiCloseLine size={12} /> Unverified
                  </span>
                ) : null}
              </div>
            </div>

            {/* Phone */}
            <div className="px-6 py-4 hover:bg-[var(--surface-alt)]/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-[var(--surface-alt)] flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                  <RiPhoneLine size={12} />
                </div>
                <span className="text-xs font-medium text-[var(--text-tertiary)]">
                  Phone
                </span>
              </div>
              <span className="text-[15px] text-[var(--text-primary)]">
                {(meta.phone as string | undefined) ?? "—"}
              </span>
            </div>

            {/* Joined */}
            <div className="px-6 py-4 border-t border-r border-[var(--border)]/60 hover:bg-[var(--surface-alt)]/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-[var(--surface-alt)] flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                  <RiCalendarLine size={12} />
                </div>
                <span className="text-xs font-medium text-[var(--text-tertiary)]">
                  Joined
                </span>
              </div>
              <span className="text-[15px] text-[var(--text-primary)]">
                {formatDate(user.created_at)}
              </span>
            </div>

            {/* Auth Providers */}
            <div className="px-6 py-4 border-t border-[var(--border)]/60 hover:bg-[var(--surface-alt)]/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-[var(--surface-alt)] flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                  <RiLoginBoxLine size={12} />
                </div>
                <span className="text-xs font-medium text-[var(--text-tertiary)]">
                  Auth
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {appMeta.providers &&
                Array.isArray(appMeta.providers) &&
                appMeta.providers.length > 0 ? (
                  appMeta.providers.map((provider: unknown) => (
                    <span
                      key={provider as string}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30"
                    >
                      {typeof provider === "string"
                        ? provider.charAt(0).toUpperCase() + provider.slice(1)
                        : (provider as string)}
                    </span>
                  ))
                ) : (
                  <span className="text-[15px] text-[var(--text-secondary)]">
                    —
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {isServiceProvider && (
          <div className="slide-up" style={{ animationDelay: "0.15s" }}>
            <ServiceProviderInfo meta={meta} />
          </div>
        )}

        {isServiceProvider && (isViewingOwnProfile || isCurrentUserAdmin) && (
          <div className="slide-up" style={{ animationDelay: "0.2s" }}>
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
              onAdded={() => {
                const prevCredits = (meta.credits as number) ?? 0;
                const started = Date.now();
                const poll = async () => {
                  if (Date.now() - started > 30000) return; // give up after 30s
                  try {
                    const res = await fetch(`/api/users/${id}`);
                    if (res.ok) {
                      const json: UserDetailsResponse = await res.json();
                      const newCredits =
                        (json.user?.user_metadata?.credits as number) ?? 0;
                      if (newCredits > prevCredits) {
                        setData(json);
                        return;
                      }
                    }
                  } catch {}
                  setTimeout(poll, 2000);
                };
                setTimeout(poll, 2000);
              }}
              isViewingOwn={isViewingOwnProfile}
            />
          </div>
        )}

        {isCustomer && (
          <div className="slide-up" style={{ animationDelay: "0.15s" }}>
            <CustomerJobsSection jobs={jobs} loading={jobsLoading} />
          </div>
        )}

        {isServiceProvider && (
          <div className="slide-up" style={{ animationDelay: "0.25s" }}>
            <ProviderJobsSection
              jobs={providerJobs}
              loading={providerJobsLoading}
            />
          </div>
        )}
      </main>
    </div>
  );
}
