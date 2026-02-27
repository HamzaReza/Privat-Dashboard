"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { UsersTab } from "@/components/dashboard/UsersTab";
import { CategoriesTab } from "@/components/dashboard/CategoriesTab";
import {
  RiGroupLine,
  RiAppsLine,
  RiLoader4Line,
  RiLogoutBoxLine,
} from "react-icons/ri";

type Tab = "users" | "categories";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "users", label: "Users", icon: <RiGroupLine size={18} /> },
  { id: "categories", label: "Categories", icon: <RiAppsLine size={18} /> },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          router.replace("/admin-login");
          return;
        }

        const role =
          session.user.user_metadata?.role || session.user.app_metadata?.role;

        if (role !== "admin") {
          await supabase.auth.signOut();
          router.replace("/admin-login");
          return;
        }

        setUserEmail(session.user.email ?? null);
      } catch {
        router.replace("/admin-login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/admin-login");
    } catch {
      setSigningOut(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col font-body">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--border-hsl))/0.5] bg-[hsl(var(--background-hsl))/0.9] backdrop-blur-md">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <img src="/privat-logo.png" alt="PRIVAT" className="h-10" />
          </Link>

          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="text-sm font-body text-[hsl(var(--muted-foreground-hsl))] hidden md:block truncate max-w-[200px]">
                {userEmail}
              </span>
            )}
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm border border-[hsl(var(--border-hsl))/0.5] text-[hsl(var(--muted-foreground-hsl))] text-sm font-body hover:border-[hsl(var(--primary-hsl))] hover:text-[hsl(var(--primary-hsl))] transition-colors disabled:opacity-60 cursor-pointer"
            >
              {signingOut ? (
                <RiLoader4Line className="animate-spin" size={15} />
              ) : (
                <RiLogoutBoxLine size={15} />
              )}
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-8">
        {/* Tab selector */}
        <div className="flex items-center gap-1 bg-[var(--surface-alt)] rounded-2xl p-1.5 mb-8 w-fit border border-[var(--border)]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[var(--primary)] text-black shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "categories" && <CategoriesTab />}
      </main>
    </div>
  );
}
