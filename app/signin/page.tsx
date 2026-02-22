"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLoader4Line,
} from "react-icons/ri";

export default function SignInPage() {
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
            router.replace("/dashboard");
            return;
          }

          // Regular users go to their detail page
          router.replace(`/dashboard/users/${session.user.id}`);
          return;
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

      // Redirect admins to dashboard
      if (role === "admin") {
        await supabase.auth.signOut();
        setError("Access denied. This is an admin account.");
        return;
      }

      // Regular users go to their detail page
      router.replace(`/dashboard/users/${user.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)] mb-4">
            <span className="text-2xl font-bold text-black">P</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Privat
          </h1>
        </div>

        {/* Card */}
        <div
          className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)]"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <RiMailLine
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                  size={17}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <RiLockLine
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                  size={17}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showPassword ? (
                    <RiEyeOffLine size={17} />
                  ) : (
                    <RiEyeLine size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--error-bg)] border border-[var(--error)]/20">
                <span className="text-sm text-[var(--error)]">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading && <RiLoader4Line className="animate-spin" size={16} />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Link to admin login */}
          <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
            <p className="text-sm text-[var(--text-secondary)] mb-2">
              Admin user?
            </p>
            <button
              onClick={() => router.push("/login")}
              className="text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium transition-colors"
            >
              Sign in to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
