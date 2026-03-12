"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  RiEyeLine,
  RiEyeOffLine,
  RiLoader4Line,
  RiLockLine,
  RiMailLine,
} from "react-icons/ri";

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

const OAUTH_ERRORS: Record<string, string> = {
  oauth_failed: "Google sign-in failed. Please try again.",
  role_mismatch: "This Google account is registered with a different role.",
  account_pending:
    "Your account is pending approval. You'll be notified when it's approved.",
  account_blocked: "Your account has been blocked. Please contact support.",
};

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loginAs, setLoginAs] = useState<"customer" | "provider">(
    searchParams.get("role") === "provider" ? "provider" : "customer",
  );

  useEffect(() => {
    // Handle error/success params from OAuth callback
    const errorParam = searchParams.get("error");
    if (errorParam && OAUTH_ERRORS[errorParam]) {
      setError(OAUTH_ERRORS[errorParam]);
    }
    if (searchParams.get("registered") === "1") {
      setSuccessMessage(
        "Application submitted! We'll review it and notify you once approved.",
      );
    }

    // Always sign out any existing session so the form is always shown fresh
    const supabase = createClient();
    supabase.auth.signOut().catch(() => {});
  }, [searchParams]);

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
      const role =
        user?.user_metadata?.role === "customer"
          ? "customer"
          : user?.user_metadata?.role === "service_provider"
            ? "provider"
            : "admin";

      if (role === "admin") {
        await supabase.auth.signOut();
        setError("Invalid credentials.");
        return;
      }

      if (role && role !== loginAs) {
        await supabase.auth.signOut();
        setError(
          `This account is registered as a ${role}. Please switch to the correct role and try again.`,
        );
        return;
      }

      const status = user?.user_metadata?.status;
      if (loginAs === "provider" && status === "pending") {
        await supabase.auth.signOut();
        setError("Your account is pending approval. You'll be notified when it's approved.");
        return;
      }
      if (loginAs === "provider" && status === "blocked") {
        await supabase.auth.signOut();
        setError("Your account has been blocked. Please contact support.");
        return;
      }

      router.replace(`/profile/${user.id}?role=${loginAs}`);
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

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      localStorage.setItem("oauth_role", loginAs);
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

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
              <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
                Welcome back
              </h1>
              <p className="text-[13px] text-[var(--text-tertiary)]">
                Sign in to your account to continue
              </p>
            </div>

            {/* Success banner */}
            {successMessage && (
              <div className="px-3.5 py-3 rounded-xl bg-[var(--success-bg)] border border-[var(--success)]/20 mb-4">
                <span className="text-[13px] text-[var(--success)] leading-relaxed">
                  {successMessage}
                </span>
              </div>
            )}

            {/* Role toggle */}
            <div className="flex items-center p-1 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] mb-5">
              {(["customer", "provider"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setLoginAs(role)}
                  className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                    loginAs === role
                      ? "bg-[var(--primary)] text-black shadow-sm"
                      : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
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
                    placeholder="your@email.com"
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
                disabled={loading || googleLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-semibold text-[15px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1 cursor-pointer"
              >
                {loading && (
                  <RiLoader4Line className="animate-spin" size={16} />
                )}
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-[12px] text-[var(--text-tertiary)]">
                or
              </span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text-primary)] text-[14px] font-medium hover:bg-[var(--border)]/40 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {googleLoading ? (
                <RiLoader4Line className="animate-spin" size={16} />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>

            <p className="text-center text-[13px] text-[var(--text-tertiary)] mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href={`/register/${loginAs === "provider" ? "provider" : "customer"}`}
                className="text-[var(--primary)] hover:text-[var(--primary-light)] font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
