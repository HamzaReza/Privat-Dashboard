"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
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
          router.replace("/login");
          return;
        }

        const role =
          session.user.user_metadata?.role ||
          session.user.app_metadata?.role;

        if (role !== "admin") {
          await supabase.auth.signOut();
          router.replace("/login");
          return;
        }

        setUserEmail(session.user.email ?? null);
      } catch {
        router.replace("/login");
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
      router.replace("/login");
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
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--border)]"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary)] flex items-center justify-center">
              <span className="text-sm font-bold text-black">P</span>
            </div>
            <span className="font-semibold text-[var(--text-primary)] text-sm hidden sm:block">
              Privat Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="text-sm text-[var(--text-secondary)] hidden md:block truncate max-w-[200px]">
                {userEmail}
              </span>
            )}
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm hover:border-[var(--error)] hover:text-[var(--error)] transition-colors disabled:opacity-60 cursor-pointer"
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
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
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
