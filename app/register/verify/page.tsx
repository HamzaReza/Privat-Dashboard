"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { RiLoader4Line, RiMailLine } from "react-icons/ri";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

async function b64ToFile(b64: string, name: string, type: string): Promise<File> {
  const res = await fetch(b64);
  const blob = await res.blob();
  return new File([blob], name, { type });
}

async function uploadViaProxy(b64: string, name: string, type: string, endpoint: string, accessToken: string): Promise<string> {
  const file = await b64ToFile(b64, name, type);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("endpoint", endpoint);
  formData.append("access_token", accessToken);
  const res = await fetch("/api/auth/upload", { method: "POST", body: formData });
  const data = await res.json() as { publicUrl?: string; error?: string };
  if (!res.ok) throw new Error(data.error ?? "Upload failed");
  return data.publicUrl!;
}

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const role = searchParams.get("role") ?? "customer";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleDigitChange = (index: number, value: string) => {
    // Handle paste
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
      const newDigits = [...digits];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[index + i] = pasted[i] ?? "";
      }
      setDigits(newDigits);
      const next = Math.min(index + pasted.length, OTP_LENGTH - 1);
      inputRefs.current[next]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, "");
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleUploadFiles = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (!accessToken) return;

    const avatarB64 = sessionStorage.getItem("pending_avatar_b64");
    const avatarName = sessionStorage.getItem("pending_avatar_name");
    const avatarType = sessionStorage.getItem("pending_avatar_type");
    const docB64 = sessionStorage.getItem("pending_doc_b64");
    const docName = sessionStorage.getItem("pending_doc_name");
    const docType = sessionStorage.getItem("pending_doc_type");

    const updates: Record<string, string> = {};

    if (avatarB64 && avatarName && avatarType) {
      try {
        updates.avatar_url = await uploadViaProxy(avatarB64, avatarName, avatarType, "upload-avatar", accessToken);
      } catch {
        // non-fatal
      }
    }

    if (docB64 && docName && docType) {
      try {
        updates.document_url = await uploadViaProxy(docB64, docName, docType, "upload-document", accessToken);
      } catch {
        // non-fatal
      }
    }

    if (Object.keys(updates).length > 0) {
      await supabase.auth.updateUser({ data: updates });
    }

    ["pending_avatar_b64", "pending_avatar_name", "pending_avatar_type",
      "pending_doc_b64", "pending_doc_name", "pending_doc_type"].forEach((k) =>
      sessionStorage.removeItem(k)
    );
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code,
        type: "email",
      });

      if (otpError) {
        setError(otpError.message);
        return;
      }

      // Upload pending files
      setUploading(true);
      try {
        await handleUploadFiles();
      } catch {
        // non-fatal
      } finally {
        setUploading(false);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/login?role=${role}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-verify when all digits filled
  useEffect(() => {
    if (digits.every((d) => d !== "") && !loading && !success) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      const supabase = createClient();
      await supabase.auth.resend({ type: "signup", email: email.trim().toLowerCase() });
      setResendCooldown(RESEND_COOLDOWN);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 relative overflow-hidden">
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
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                <RiMailLine size={28} className="text-[var(--primary)]" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-1">Check your email</h1>
              <p className="text-[13px] text-[var(--text-tertiary)]">
                We sent a 6-digit code to
              </p>
              <p className="text-[13px] font-medium text-[var(--text-primary)] mt-0.5">{email}</p>
            </div>

            {success ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[var(--success-bg)] flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[15px] font-semibold text-[var(--text-primary)] mb-1">Email verified!</p>
                <p className="text-[13px] text-[var(--text-tertiary)]">Redirecting to sign in…</p>
              </div>
            ) : (
              <>
                {/* OTP inputs */}
                <div className="flex gap-2 justify-center mb-5">
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      disabled={loading || uploading}
                      className="w-11 h-12 text-center text-[18px] font-semibold rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors disabled:opacity-60"
                    />
                  ))}
                </div>

                {error && (
                  <div className="px-3.5 py-3 rounded-xl bg-[var(--error-bg)] border border-[var(--error)]/20 mb-4">
                    <span className="text-[13px] text-[var(--error)]">{error}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={loading || uploading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-semibold text-[15px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {(loading || uploading) && <RiLoader4Line className="animate-spin" size={16} />}
                  {uploading ? "Uploading files…" : loading ? "Verifying…" : "Verify email"}
                </button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className="text-[13px] text-[var(--text-tertiary)] hover:text-[var(--primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {resendCooldown > 0
                      ? `Resend code in ${resendCooldown}s`
                      : "Didn't receive it? Resend code"}
                  </button>
                </div>
              </>
            )}

            <p className="text-center text-[13px] text-[var(--text-tertiary)] mt-6">
              <Link href={`/login?role=${role}`} className="text-[var(--primary)] hover:text-[var(--primary-light)] font-medium transition-colors">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
