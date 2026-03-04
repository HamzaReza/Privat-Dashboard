"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RiBriefcaseLine, RiUserLine } from "react-icons/ri";

export default function RegisterPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const role =
            session.user.user_metadata?.role || session.user.app_metadata?.role;
          router.replace(
            role === "admin" ? "/admin-dashboard" : `/profile/${session.user.id}`
          );
          return;
        }
      } catch {
        // ignore
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[var(--primary)]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative slide-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/privat-logo-rect.png"
            alt="PRIVAT"
            width={280}
            height={60}
            className="h-10 w-auto"
          />
        </div>

        {/* Card */}
        <div
          className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
          style={{ boxShadow: "var(--shadow-xl)" }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent" />

          <div className="px-8 pt-7 pb-8">
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
                Create an account
              </h1>
              <p className="text-[13px] text-[var(--text-tertiary)]">
                Choose how you want to join Privat
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/register/customer"
                className="flex items-center gap-4 w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] hover:border-[var(--primary)]/40 hover:bg-[var(--surface-elevated)] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)]/20 transition-colors">
                  <RiUserLine size={20} className="text-[var(--primary)]" />
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                    Customer
                  </p>
                  <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                    Request services from professionals
                  </p>
                </div>
              </Link>

              <Link
                href="/register/provider"
                className="flex items-center gap-4 w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] hover:border-[var(--primary)]/40 hover:bg-[var(--surface-elevated)] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)]/20 transition-colors">
                  <RiBriefcaseLine size={20} className="text-[var(--primary)]" />
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                    Service Provider
                  </p>
                  <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                    Offer your skills and grow your business
                  </p>
                </div>
              </Link>
            </div>

            <p className="text-center text-[13px] text-[var(--text-tertiary)] mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--primary)] hover:text-[var(--primary-light)] font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
