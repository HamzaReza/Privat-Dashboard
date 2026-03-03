"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  RiEyeLine,
  RiEyeOffLine,
  RiLoader4Line,
  RiLockLine,
  RiMailLine,
  RiShieldLine,
} from "react-icons/ri";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const role =
            session.user.user_metadata?.role || session.user.app_metadata?.role;

          if (role === "admin") {
            router.replace("/admin-dashboard");
            return;
          }
          await supabase.auth.signOut();
        }
      } catch {
        // ignore
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: email.trim(),
          password,
        },
      );

      if (authError) {
        setError(authError.message);
        return;
      }

      const user = data.user;
      const role = user?.user_metadata?.role || user?.app_metadata?.role;

      if (role !== "admin") {
        await supabase.auth.signOut();
        setError("Access denied. Admin accounts only.");
        return;
      }

      router.replace("/admin-dashboard");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
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
      {/* Ambient gold glow */}
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
          {/* Gold accent top line */}
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent" />

          <div className="px-8 pt-7 pb-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <RiShieldLine size={16} className="text-[var(--primary)]" />
                <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                  Admin access
                </h1>
              </div>
              <p className="text-[13px] text-[var(--text-tertiary)]">
                Restricted to authorised administrators only
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <RiMailLine
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                    size={15}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <RiLockLine
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                    size={15}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <RiEyeOffLine size={15} />
                    ) : (
                      <RiEyeLine size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="px-3.5 py-3 rounded-xl bg-[var(--error-bg)] border border-[var(--error)]/20">
                  <span className="text-[13px] text-[var(--error)] leading-relaxed">
                    {error}
                  </span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-semibold text-[15px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1 cursor-pointer"
              >
                {loading && (
                  <RiLoader4Line className="animate-spin" size={16} />
                )}
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
