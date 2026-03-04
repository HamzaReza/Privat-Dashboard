"use client";

import { createClient } from "@/lib/supabase/client";
import { ServiceAreaMapPicker } from "@/components/user-detail/ServiceAreaMapPicker";
import { ServiceCategory } from "@/types/category";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiBriefcaseLine,
  RiCheckLine,
  RiEyeLine,
  RiEyeOffLine,
  RiFileLine,
  RiLoader4Line,
  RiLockLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiUploadLine,
  RiUserLine,
} from "react-icons/ri";

function getPasswordStrength(pw: string): "weak" | "medium" | "strong" | null {
  if (!pw) return null;
  const score = [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /[a-z]/.test(pw),
    /\d/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ].filter(Boolean).length;
  if (score <= 2) return "weak";
  if (score <= 3) return "medium";
  return "strong";
}

const strengthColor = { weak: "var(--error)", medium: "var(--warning)", strong: "var(--success)" };
const strengthWidth = { weak: "33%", medium: "66%", strong: "100%" };

// ─── Step 1: Credentials ───────────────────────────────────────────────────

function Step1({
  data,
  onChange,
  onNext,
  error,
  setError,
}: {
  data: { email: string; password: string; confirmPassword: string };
  onChange: (k: string, v: string) => void;
  onNext: () => void;
  error: string | null;
  setError: (e: string | null) => void;
}) {
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const strength = getPasswordStrength(data.password);

  const handleNext = () => {
    setError(null);
    if (!data.email.trim()) return setError("Email is required.");
    if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) return setError("Enter a valid email.");
    if (data.password.length < 6) return setError("Password must be at least 6 characters.");
    if (data.password !== data.confirmPassword) return setError("Passwords do not match.");
    onNext();
  };

  return (
    <div className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Email</label>
        <div className="relative">
          <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={15} />
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="your@email.com"
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
            type={showPw ? "text" : "password"}
            value={data.password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
          />
          <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] cursor-pointer">
            {showPw ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
          </button>
        </div>
        {strength && (
          <div className="mt-1.5 space-y-1">
            <div className="h-1 rounded-full bg-[var(--surface-alt)] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: strengthWidth[strength], backgroundColor: strengthColor[strength] }} />
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
            type={showCPw ? "text" : "password"}
            value={data.confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
          />
          <button type="button" onClick={() => setShowCPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] cursor-pointer">
            {showCPw ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="px-3.5 py-3 rounded-xl bg-[var(--error-bg)] border border-[var(--error)]/20">
          <span className="text-[13px] text-[var(--error)]">{error}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleNext}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-semibold text-[15px] transition-colors cursor-pointer mt-1"
      >
        Continue <RiArrowRightLine size={16} />
      </button>
    </div>
  );
}

// ─── Step 2: Personal & Business Info ──────────────────────────────────────

function Step2({
  data,
  onChange,
  onNext,
  onBack,
  error,
  setError,
}: {
  data: {
    name: string; phone: string; businessName: string; businessPhone: string;
    samePhone: boolean; consent: boolean;
    profilePicture: File | null; profilePreview: string | null;
  };
  onChange: (k: string, v: unknown) => void;
  onNext: () => void;
  onBack: () => void;
  error: string | null;
  setError: (e: string | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange("profilePicture", file);
    const reader = new FileReader();
    reader.onload = (ev) => onChange("profilePreview", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    setError(null);
    if (!data.profilePicture && !data.profilePreview) return setError("Profile picture is required.");
    if (!data.name.trim()) return setError("Name is required.");
    if (!data.phone.trim()) return setError("Phone is required.");
    if (!data.businessName.trim()) return setError("Business name is required.");
    if (!data.samePhone && !data.businessPhone.trim()) return setError("Business phone is required.");
    if (!data.consent) return setError("You must consent to the background check.");
    onNext();
  };

  return (
    <div className="space-y-4">
      {/* Profile picture */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative w-20 h-20 rounded-full border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)]/60 bg-[var(--surface-alt)] flex items-center justify-center overflow-hidden transition-colors cursor-pointer group"
        >
          {data.profilePreview ? (
            <img src={data.profilePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <RiUploadLine size={20} className="text-[var(--text-tertiary)] group-hover:text-[var(--primary)] transition-colors" />
          )}
        </button>
        <span className="text-[11px] text-[var(--text-tertiary)]">
          {data.profilePreview ? "Tap to change photo" : "Add profile photo *"}
        </span>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Full name</label>
        <div className="relative">
          <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={15} />
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="John Doe"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Personal phone</label>
        <div className="relative">
          <RiPhoneLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={15} />
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+1 234 567 8900"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
          />
        </div>
      </div>

      {/* Business Name */}
      <div>
        <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Business name</label>
        <div className="relative">
          <RiBriefcaseLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={15} />
          <input
            type="text"
            value={data.businessName}
            onChange={(e) => onChange("businessName", e.target.value)}
            placeholder="Acme Services LLC"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
          />
        </div>
      </div>

      {/* Business Phone */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-[var(--text-tertiary)]">Business phone</label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={data.samePhone}
              onChange={(e) => onChange("samePhone", e.target.checked)}
              className="w-3.5 h-3.5 accent-[var(--primary)] cursor-pointer"
            />
            <span className="text-[11px] text-[var(--text-tertiary)]">Same as personal</span>
          </label>
        </div>
        {!data.samePhone && (
          <div className="relative">
            <RiPhoneLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={15} />
            <input
              type="tel"
              value={data.businessPhone}
              onChange={(e) => onChange("businessPhone", e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)]/60 focus:ring-1 focus:ring-[var(--primary)]/30 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(e) => onChange("consent", e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-[var(--primary)] cursor-pointer shrink-0"
        />
        <span className="text-[12px] text-[var(--text-tertiary)] leading-relaxed">
          I consent to a background check as part of the verification process.
        </span>
      </label>

      {error && (
        <div className="px-3.5 py-3 rounded-xl bg-[var(--error-bg)] border border-[var(--error)]/20">
          <span className="text-[13px] text-[var(--error)]">{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-[14px] font-medium hover:bg-[var(--surface-alt)] transition-colors cursor-pointer">
          <RiArrowLeftLine size={15} /> Back
        </button>
        <button type="button" onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-semibold text-[15px] transition-colors cursor-pointer">
          Continue <RiArrowRightLine size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Service Details ────────────────────────────────────────────────

function Step3({
  data,
  onChange,
  onNext,
  onBack,
  error,
  setError,
  categories,
}: {
  data: { categories: string[]; serviceArea: string; latitude: number | null; longitude: number | null };
  onChange: (k: string, v: unknown) => void;
  onNext: () => void;
  onBack: () => void;
  error: string | null;
  setError: (e: string | null) => void;
  categories: ServiceCategory[];
}) {
  const [mapOpen, setMapOpen] = useState(false);

  const toggleCategory = (id: string) => {
    const current = data.categories;
    if (current.includes(id)) {
      onChange("categories", current.filter((c) => c !== id));
    } else {
      onChange("categories", [...current, id]);
    }
  };

  const handleNext = () => {
    setError(null);
    if (data.categories.length === 0) return setError("Select at least one service category.");
    if (!data.serviceArea.trim()) return setError("Service area is required. Tap 'Pick on map' to select a location.");
    onNext();
  };

  return (
    <div className="space-y-4">
      {/* Categories */}
      <div>
        <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
          Service categories <span className="text-[var(--text-tertiary)]">({data.categories.length} selected)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const selected = data.categories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all cursor-pointer ${
                  selected
                    ? "bg-[var(--primary)] text-black border-[var(--primary)]"
                    : "bg-[var(--surface-alt)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary)]/40"
                }`}
              >
                {selected && <RiCheckLine className="inline mr-1" size={11} />}
                {cat.name_en}
              </button>
            );
          })}
          {categories.length === 0 && (
            <p className="text-[13px] text-[var(--text-tertiary)]">Loading categories…</p>
          )}
        </div>
      </div>

      {/* Service Area — map picker */}
      <div>
        <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Service area</label>
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border bg-[var(--surface-alt)] text-left transition-colors cursor-pointer ${
            data.serviceArea
              ? "border-[var(--primary)]/40 hover:border-[var(--primary)]/60"
              : "border-[var(--border)] hover:border-[var(--primary)]/40"
          }`}
        >
          <RiMapPinLine size={15} className={data.serviceArea ? "text-[var(--primary)] shrink-0" : "text-[var(--text-tertiary)] shrink-0"} />
          <span className={`text-[14px] truncate ${data.serviceArea ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>
            {data.serviceArea || "Pick on map…"}
          </span>
        </button>
      </div>

      {error && (
        <div className="px-3.5 py-3 rounded-xl bg-[var(--error-bg)] border border-[var(--error)]/20">
          <span className="text-[13px] text-[var(--error)]">{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-[14px] font-medium hover:bg-[var(--surface-alt)] transition-colors cursor-pointer">
          <RiArrowLeftLine size={15} /> Back
        </button>
        <button type="button" onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-semibold text-[15px] transition-colors cursor-pointer">
          Continue <RiArrowRightLine size={16} />
        </button>
      </div>

      {mapOpen && (
        <ServiceAreaMapPicker
          initialLocation={
            data.latitude != null && data.longitude != null
              ? { latitude: data.latitude, longitude: data.longitude }
              : undefined
          }
          initialServiceArea={data.serviceArea || undefined}
          onConfirm={(serviceArea, lat, lng) => {
            onChange("serviceArea", serviceArea);
            onChange("latitude", lat);
            onChange("longitude", lng);
            setMapOpen(false);
          }}
          onClose={() => setMapOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Step 4: Verification Document ─────────────────────────────────────────

function Step4({
  data,
  onChange,
  onSubmit,
  onBack,
  error,
  loading,
}: {
  data: { document: File | null; documentName: string };
  onChange: (k: string, v: unknown) => void;
  onSubmit: () => void;
  onBack: () => void;
  error: string | null;
  loading: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange("document", file);
    onChange("documentName", file.name);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">Verification document</label>
        <p className="text-[12px] text-[var(--text-tertiary)] mb-3">
          Upload a government-issued ID, business license, or trade certificate (PDF or image).
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)]/60 bg-[var(--surface-alt)] transition-colors cursor-pointer group"
        >
          {data.document ? (
            <>
              <RiFileLine size={28} className="text-[var(--primary)]" />
              <p className="text-[13px] text-[var(--text-primary)] font-medium">{data.documentName}</p>
              <p className="text-[11px] text-[var(--text-tertiary)]">Tap to change file</p>
            </>
          ) : (
            <>
              <RiUploadLine size={28} className="text-[var(--text-tertiary)] group-hover:text-[var(--primary)] transition-colors" />
              <p className="text-[13px] text-[var(--text-secondary)]">Click to upload document</p>
              <p className="text-[11px] text-[var(--text-tertiary)]">PDF, JPG, PNG up to 10MB</p>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <div className="px-3.5 py-3 rounded-xl bg-[var(--error-bg)] border border-[var(--error)]/20">
          <span className="text-[13px] text-[var(--error)]">{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onBack} disabled={loading} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-[14px] font-medium hover:bg-[var(--surface-alt)] transition-colors cursor-pointer disabled:opacity-60">
          <RiArrowLeftLine size={15} /> Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-semibold text-[15px] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && <RiLoader4Line className="animate-spin" size={16} />}
          {loading ? "Creating account…" : "Complete sign up"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

const STEP_LABELS = ["Account", "Profile", "Services", "Document"];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  // Step 1 data
  const [creds, setCreds] = useState({ email: "", password: "", confirmPassword: "" });
  // Step 2 data
  const [profile, setProfile] = useState({
    name: "", phone: "", businessName: "", businessPhone: "",
    samePhone: false, consent: false,
    profilePicture: null as File | null,
    profilePreview: null as string | null,
  });
  // Step 3 data
  const [services, setServices] = useState({ categories: [] as string[], serviceArea: "", latitude: null as number | null, longitude: null as number | null });
  // Step 4 data
  const [docData, setDocData] = useState({ document: null as File | null, documentName: "" });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (!docData.document) {
      setError("Verification document is required.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      const { error: signUpError } = await supabase.auth.signUp({
        email: creds.email.trim().toLowerCase(),
        password: creds.password,
        options: {
          data: {
            name: profile.name.trim(),
            phone: profile.phone.trim(),
            role: "service_provider",
            status: "pending",
            credits: 0,
            creditHistory: [],
            jobLeadsPaid: [],
            jobsQuoted: [],
            businessName: profile.businessName.trim(),
            businessPhone: profile.samePhone ? profile.phone.trim() : profile.businessPhone.trim(),
            consent_background_check: profile.consent,
            categories: services.categories,
            serviceArea: services.serviceArea.trim(),
            latitude: services.latitude ?? undefined,
            longitude: services.longitude ?? undefined,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Store files as base64 in sessionStorage for upload after verification
      if (profile.profilePicture && profile.profilePreview) {
        sessionStorage.setItem("pending_avatar_b64", profile.profilePreview);
        sessionStorage.setItem("pending_avatar_name", profile.profilePicture.name);
        sessionStorage.setItem("pending_avatar_type", profile.profilePicture.type);
      }

      if (docData.document) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          sessionStorage.setItem("pending_doc_b64", ev.target?.result as string);
          sessionStorage.setItem("pending_doc_name", docData.document!.name);
          sessionStorage.setItem("pending_doc_type", docData.document!.type);
        };
        reader.readAsDataURL(docData.document);
      }

      router.push(
        `/register/verify?email=${encodeURIComponent(creds.email.trim().toLowerCase())}&role=provider`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const stepTitle = ["Create your account", "Personal & business info", "Your services", "Verification document"];

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
            <div className="flex items-center gap-3 mb-5">
              <Link
                href="/register"
                className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
              >
                <RiArrowLeftLine size={18} />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-[var(--text-primary)]">Provider sign up</h1>
                <p className="text-[13px] text-[var(--text-tertiary)]">{stepTitle[step - 1]}</p>
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-1.5 mb-6">
              {STEP_LABELS.map((label, i) => {
                const n = i + 1;
                const done = n < step;
                const active = n === step;
                return (
                  <div key={n} className="flex items-center gap-1.5 flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 transition-all ${
                      done ? "bg-[var(--primary)] text-black" :
                      active ? "bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/40" :
                      "bg-[var(--surface-alt)] text-[var(--text-tertiary)] border border-[var(--border)]"
                    }`}>
                      {done ? <RiCheckLine size={12} /> : n}
                    </div>
                    <span className={`text-[10px] font-medium hidden sm:block ${active ? "text-[var(--primary)]" : done ? "text-[var(--text-secondary)]" : "text-[var(--text-tertiary)]"}`}>
                      {label}
                    </span>
                    {n < 4 && <div className={`flex-1 h-px ${done ? "bg-[var(--primary)]/40" : "bg-[var(--border)]"}`} />}
                  </div>
                );
              })}
            </div>

            {/* Step content */}
            {step === 1 && (
              <Step1
                data={creds}
                onChange={(k, v) => setCreds((p) => ({ ...p, [k]: v }))}
                onNext={() => { setError(null); setStep(2); }}
                error={error}
                setError={setError}
              />
            )}
            {step === 2 && (
              <Step2
                data={profile}
                onChange={(k, v) => setProfile((p) => ({ ...p, [k]: v }))}
                onNext={() => { setError(null); setStep(3); }}
                onBack={() => { setError(null); setStep(1); }}
                error={error}
                setError={setError}
              />
            )}
            {step === 3 && (
              <Step3
                data={services}
                onChange={(k, v) => setServices((p) => ({ ...p, [k]: v }))}
                onNext={() => { setError(null); setStep(4); }}
                onBack={() => { setError(null); setStep(2); }}
                error={error}
                setError={setError}
                categories={categories}
              />
            )}
            {step === 4 && (
              <Step4
                data={docData}
                onChange={(k, v) => setDocData((p) => ({ ...p, [k]: v }))}
                onSubmit={handleSubmit}
                onBack={() => { setError(null); setStep(3); }}
                error={error}
                loading={loading}
              />
            )}

            {step === 1 && (
              <p className="text-center text-[13px] text-[var(--text-tertiary)] mt-6">
                Already have an account?{" "}
                <Link href="/login?role=provider" className="text-[var(--primary)] hover:text-[var(--primary-light)] font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
