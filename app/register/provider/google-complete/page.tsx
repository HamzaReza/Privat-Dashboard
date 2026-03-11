"use client";

import { createClient } from "@/lib/supabase/client";
import { ServiceAreaMapPicker } from "@/components/user-detail/ServiceAreaMapPicker";
import { ServiceCategory } from "@/types/category";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiBriefcaseLine,
  RiCheckLine,
  RiFileLine,
  RiLoader4Line,
  RiMapPinLine,
  RiPhoneLine,
  RiUploadLine,
  RiUserLine,
} from "react-icons/ri";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function b64ToFile(b64: string, name: string, type: string): Promise<File> {
  const res = await fetch(b64);
  const blob = await res.blob();
  return new File([blob], name, { type });
}

async function uploadViaProxy(
  b64: string,
  name: string,
  type: string,
  endpoint: string,
  accessToken: string
): Promise<string> {
  const file = await b64ToFile(b64, name, type);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("endpoint", endpoint);
  formData.append("access_token", accessToken);
  const res = await fetch("/api/auth/upload", { method: "POST", body: formData });
  const data = (await res.json()) as { publicUrl?: string; error?: string };
  if (!res.ok) throw new Error(data.error ?? "Upload failed");
  return data.publicUrl!;
}

// ─── Progress bar ────────────────────────────────────────────────────────────

const STEPS = ["Profile", "Services", "Document"];

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold transition-all ${
                i < step
                  ? "bg-[var(--primary)] text-black"
                  : i === step
                  ? "bg-[var(--primary)]/20 border border-[var(--primary)] text-[var(--primary)]"
                  : "bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text-tertiary)]"
              }`}
            >
              {i < step ? <RiCheckLine size={13} /> : i + 1}
            </div>
            <span
              className={`text-[10px] font-medium ${
                i <= step ? "text-[var(--primary)]" : "text-[var(--text-tertiary)]"
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-px mb-4 transition-all ${
                i < step ? "bg-[var(--primary)]" : "bg-[var(--border)]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Profile ────────────────────────────────────────────────────────

function Step1({
  data,
  onChange,
  onNext,
  error,
  setError,
  googleAvatarUrl,
}: {
  data: {
    name: string;
    phone: string;
    businessName: string;
    businessPhone: string;
    samePhone: boolean;
    consent: boolean;
    profilePicture: File | null;
    profilePreview: string | null;
  };
  onChange: (k: string, v: unknown) => void;
  onNext: () => void;
  error: string | null;
  setError: (e: string | null) => void;
  googleAvatarUrl: string;
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

  const previewSrc = data.profilePreview || googleAvatarUrl || null;

  const handleNext = () => {
    setError(null);
    if (!previewSrc) return setError("Profile picture is required.");
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
          {previewSrc ? (
            <Image
              src={previewSrc}
              alt="Preview"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <RiUploadLine size={20} className="text-[var(--text-tertiary)] group-hover:text-[var(--primary)] transition-colors" />
          )}
        </button>
        <span className="text-[11px] text-[var(--text-tertiary)]">
          {previewSrc ? "Tap to change photo" : "Add profile photo *"}
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
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            checked={data.consent}
            onChange={(e) => onChange("consent", e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded border transition-all ${
              data.consent
                ? "bg-[var(--primary)] border-[var(--primary)]"
                : "bg-[var(--surface-alt)] border-[var(--border)] group-hover:border-[var(--primary)]/50"
            }`}
          >
            {data.consent && <RiCheckLine size={12} className="text-black absolute top-0.5 left-0" />}
          </div>
        </div>
        <span className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
          I consent to a background check being conducted as part of the service provider verification process.
        </span>
      </label>

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

// ─── Step 2: Services ────────────────────────────────────────────────────────

function Step2({
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
          Service categories <span className="text-[var(--error)]">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const selected = data.categories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-all cursor-pointer ${
                  selected
                    ? "bg-[var(--primary)]/15 border-[var(--primary)]/50 text-[var(--primary)]"
                    : "bg-[var(--surface-alt)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/40"
                }`}
              >
                {selected && <RiCheckLine size={12} />}
                {cat.name_en}
              </button>
            );
          })}
          {categories.length === 0 && (
            <p className="text-[13px] text-[var(--text-tertiary)]">Loading categories…</p>
          )}
        </div>
      </div>

      {/* Service Area */}
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

// ─── Step 3: Document ────────────────────────────────────────────────────────

function Step3({
  data,
  onChange,
  onBack,
  onSubmit,
  error,
  loading,
}: {
  data: { document: File | null; documentName: string };
  onChange: (k: string, v: unknown) => void;
  onBack: () => void;
  onSubmit: () => void;
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
        <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">
          Verification document <span className="text-[var(--error)]">*</span>
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)]/60 bg-[var(--surface-alt)] transition-colors cursor-pointer group"
        >
          {data.documentName ? (
            <>
              <RiFileLine size={24} className="text-[var(--primary)]" />
              <span className="text-[13px] text-[var(--text-primary)] font-medium max-w-full truncate px-4">{data.documentName}</span>
              <span className="text-[11px] text-[var(--text-tertiary)]">Tap to change</span>
            </>
          ) : (
            <>
              <RiUploadLine size={24} className="text-[var(--text-tertiary)] group-hover:text-[var(--primary)] transition-colors" />
              <span className="text-[13px] text-[var(--text-secondary)]">Upload ID or business license</span>
              <span className="text-[11px] text-[var(--text-tertiary)]">PDF, JPG, PNG accepted</span>
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
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-semibold text-[15px] transition-colors disabled:opacity-60 cursor-pointer"
        >
          {loading && <RiLoader4Line className="animate-spin" size={16} />}
          {loading ? "Submitting…" : "Submit Application"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

function GoogleCompleteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleName = searchParams.get("googleName") ?? "";
  const googleAvatarUrl = searchParams.get("googleAvatar") ?? "";

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  const [profile, setProfile] = useState({
    name: googleName,
    phone: "",
    businessName: "",
    businessPhone: "",
    samePhone: false,
    consent: false,
    profilePicture: null as File | null,
    profilePreview: null as string | null,
  });

  const [services, setServices] = useState({
    categories: [] as string[],
    serviceArea: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const [docData, setDocData] = useState({ document: null as File | null, documentName: "" });

  // Check session on mount — if not authenticated, redirect
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/register/provider");
    });
  }, [router]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  }, []);

  const profileChange = (k: string, v: unknown) => setProfile((p) => ({ ...p, [k]: v }));
  const servicesChange = (k: string, v: unknown) => setServices((s) => ({ ...s, [k]: v }));
  const docChange = (k: string, v: unknown) => setDocData((d) => ({ ...d, [k]: v }));

  const handleSubmit = async () => {
    setError(null);
    if (!docData.document) return setError("Verification document is required.");

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        setError("Session expired. Please sign in again.");
        return;
      }

      // Determine avatar: if user picked a new file, upload it; otherwise use Google avatar URL
      let avatarUrl: string | undefined = googleAvatarUrl || undefined;
      if (profile.profilePicture && profile.profilePreview) {
        try {
          avatarUrl = await uploadViaProxy(
            profile.profilePreview,
            profile.profilePicture.name,
            profile.profilePicture.type,
            "upload-avatar",
            accessToken
          );
        } catch {
          // non-fatal, use Google avatar
        }
      }

      // Upload document
      const docReader = new FileReader();
      const docB64 = await new Promise<string>((resolve, reject) => {
        docReader.onload = (e) => resolve(e.target?.result as string);
        docReader.onerror = reject;
        docReader.readAsDataURL(docData.document!);
      });

      let documentUrl: string | undefined;
      try {
        documentUrl = await uploadViaProxy(
          docB64,
          docData.document.name,
          docData.document.type,
          "upload-document",
          accessToken
        );
      } catch {
        setError("Failed to upload verification document. Please try again.");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          role: "service_provider",
          status: "pending",
          credits: 0,
          creditHistory: [],
          jobLeadsPaid: [],
          jobsQuoted: [],
          name: profile.name.trim(),
          phone: profile.phone.trim(),
          avatar_url: avatarUrl,
          businessName: profile.businessName.trim(),
          businessPhone: profile.samePhone ? profile.phone.trim() : profile.businessPhone.trim(),
          consent_background_check: profile.consent,
          categories: services.categories,
          serviceArea: services.serviceArea.trim(),
          latitude: services.latitude ?? undefined,
          longitude: services.longitude ?? undefined,
          document_url: documentUrl,
        },
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      // Notify admin about the new pending provider (fire-and-forget)
      if (accessToken && session?.user) {
        fetch("/api/notify-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: session.user.id,
            providerName: profile.name.trim(),
            providerEmail: session.user.email ?? "",
            businessName: profile.businessName.trim(),
            phone: profile.phone.trim(),
            serviceArea: services.serviceArea.trim(),
            event: "registration",
          }),
        }).catch(() => {});
      }

      await supabase.auth.signOut();
      router.replace("/login?role=provider&registered=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
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
            <div className="mb-5">
              <h1 className="text-xl font-semibold text-[var(--text-primary)]">Complete your profile</h1>
              <p className="text-[13px] text-[var(--text-tertiary)] mt-0.5">Tell us about your business</p>
            </div>

            <ProgressBar step={step} />

            {step === 0 && (
              <Step1
                data={profile}
                onChange={profileChange}
                onNext={() => { setError(null); setStep(1); }}
                error={error}
                setError={setError}
                googleAvatarUrl={googleAvatarUrl}
              />
            )}
            {step === 1 && (
              <Step2
                data={services}
                onChange={servicesChange}
                onNext={() => { setError(null); setStep(2); }}
                onBack={() => { setError(null); setStep(0); }}
                error={error}
                setError={setError}
                categories={categories}
              />
            )}
            {step === 2 && (
              <Step3
                data={docData}
                onChange={docChange}
                onBack={() => { setError(null); setStep(1); }}
                onSubmit={handleSubmit}
                error={error}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GoogleCompletePage() {
  return (
    <Suspense>
      <GoogleCompleteForm />
    </Suspense>
  );
}
