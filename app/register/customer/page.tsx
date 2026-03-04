"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  RiArrowLeftLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLoader4Line,
  RiLockLine,
  RiMailLine,
  RiPhoneLine,
  RiUploadLine,
  RiUserLine,
} from "react-icons/ri";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function getPasswordStrength(pw: string): "weak" | "medium" | "strong" | null {
  if (!pw) return null;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = [pw.length >= 8, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  if (score <= 2) return "weak";
  if (score <= 3) return "medium";
  return "strong";
}

const strengthColor = { weak: "var(--error)", medium: "var(--warning)", strong: "var(--success)" };
const strengthWidth = { weak: "33%", medium: "66%", strong: "100%" };

export default function CustomerRegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = getPasswordStrength(password);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePicture(file);
    const reader = new FileReader();
    reader.onload = (ev) => setProfilePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Name is required.");
    if (!email.trim()) return setError("Email is required.");
    if (!phone.trim()) return setError("Phone is required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim(),
            role: "customer",
          },
        },
      });

      if (signUpError) {
        if (signUpError.status === 429) {
          setError("Too many signup attempts. Please wait a few minutes and try again.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      // Store file in sessionStorage as base64 for upload after verification
      if (profilePicture && profilePreview) {
        sessionStorage.setItem("pending_avatar_b64", profilePreview);
        sessionStorage.setItem("pending_avatar_name", profilePicture.name);
        sessionStorage.setItem("pending_avatar_type", profilePicture.type);
      }

      router.push(
        `/register/verify?email=${encodeURIComponent(email.trim().toLowerCase())}&role=customer`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?role=customer`,
        },
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-10 relative overflow-hidden">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[var(--primary)]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative slide-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/privat-logo-rect.png" alt="PRIVAT" width={280} height={60} className="h-10 w-auto" />
        </div>

        <div
          className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
          style={{ boxShadow: "var(--shadow-xl)" }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent" />

          <div className="px-8 pt-7 pb-8">
            {/* Back + Header */}
            <div className="flex items-center gap-3 mb-6">
              <Link
                href="/register"
                className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
              >
                <RiArrowLeftLine size={18} />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-[var(--text-primary)]">Customer sign up</h1>
                <p className="text-[13px] text-[var(--text-tertiary)]">Create your customer account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile picture */}
              <div className="flex flex-col items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-20 h-20 rounded-full border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)]/60 bg-[var(--surface-alt)] flex items-center justify-center overflow-hidden transition-colors cursor-pointer group"
                >
                  {profilePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <RiUploadLine size={20} className="text-[var(--text-tertiary)] group-hover:text-[var(--primary)] transition-colors" />
                    </div>
                  )}
                </button>
                <span className="text-[11px] text-[var(--text-tertiary)]">
                  {profilePreview ? "Tap to change photo" : "Add photo (optional)"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Full name</label>
                <div className="relative">
                  <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={15} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Email</label>
                <div className="relative">
                  <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={15} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Phone</label>
                <div className="relative">
                  <RiPhoneLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={15} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={15} />
                  <input
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
                    {showPassword ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
                  </button>
                </div>
                {strength && (
                  <div className="mt-1.5 space-y-1">
                    <div className="h-1 rounded-full bg-[var(--surface-alt)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: strengthWidth[strength], backgroundColor: strengthColor[strength] }}
                      />
                    </div>
                    <p className="text-[11px]" style={{ color: strengthColor[strength] }}>
                      {strength.charAt(0).toUpperCase() + strength.slice(1)} password
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Confirm password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={15} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="px-3.5 py-3 rounded-xl bg-[var(--error-bg)] border border-[var(--error)]/20">
                  <span className="text-[13px] text-[var(--error)] leading-relaxed">{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-semibold text-[15px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1 cursor-pointer"
              >
                {loading && <RiLoader4Line className="animate-spin" size={16} />}
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-[12px] text-[var(--text-tertiary)]">or</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text-primary)] text-[14px] font-medium hover:bg-[var(--border)]/40 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {googleLoading ? <RiLoader4Line className="animate-spin" size={16} /> : <GoogleIcon />}
              Continue with Google
            </button>

            <p className="text-center text-[13px] text-[var(--text-tertiary)] mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--primary)] hover:text-[var(--primary-light)] font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
