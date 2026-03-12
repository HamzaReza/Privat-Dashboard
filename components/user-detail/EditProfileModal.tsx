"use client";

import { createClient } from "@/lib/supabase/client";
import { ServiceCategory } from "@/types/category";
import { useEffect, useRef, useState } from "react";
import {
  RiCheckLine,
  RiCloseLine,
  RiLoader4Line,
  RiMapPinLine,
  RiUploadLine,
  RiUserLine,
} from "react-icons/ri";
import { ServiceAreaMapPicker } from "./ServiceAreaMapPicker";
import Image from "next/image";

// ── Validation (matches mobile app rules) ──────────────────────────────────────

function validateFullName(v: string): string | null {
  const s = v.trim();
  if (!s) return "Name is required";
  if (s.length < 2) return "Name must be at least 2 characters";
  if (s.length > 50) return "Name must be at most 50 characters";
  if (!/^[a-zA-Z\s'-]+$/.test(s))
    return "Name can only contain letters, spaces, hyphens and apostrophes";
  return null;
}

function validatePhone(v: string): string | null {
  const s = v.trim();
  if (!s) return "Phone is required";
  if (!/^[0-9+\-\s()]+$/.test(s))
    return "Phone can only contain numbers, +, -, spaces and parentheses";
  const digits = s.replace(/\D/g, "");
  if (digits.length < 10) return "Phone must have at least 10 digits";
  if (digits.length > 15) return "Phone must have at most 15 digits";
  return null;
}

function validateBusinessName(v: string): string | null {
  const s = v.trim();
  if (!s) return "Business name is required";
  if (s.length < 2) return "Business name must be at least 2 characters";
  if (s.length > 100) return "Business name must be at most 100 characters";
  return null;
}

function validateBusinessPhone(v: string): string | null {
  if (!v.trim()) return null; // optional
  const s = v.trim();
  if (!/^[0-9+\-\s()]+$/.test(s))
    return "Phone can only contain numbers, +, -, spaces and parentheses";
  const digits = s.replace(/\D/g, "");
  if (digits.length < 10) return "Phone must have at least 10 digits";
  if (digits.length > 15) return "Phone must have at most 15 digits";
  return null;
}

function validateServiceArea(v: string): string | null {
  const s = v.trim();
  if (!s) return "Service area is required";
  if (s.length < 3) return "Service area must be at least 3 characters";
  return null;
}

function validateCategories(cats: string[]): string | null {
  if (cats.length === 0) return "At least one category is required";
  return null;
}

type FieldErrors = Partial<
  Record<
    | "fullName"
    | "phone"
    | "businessName"
    | "businessPhone"
    | "serviceArea"
    | "categories",
    string | null
  >
>;

function runValidation(
  isProvider: boolean,
  values: {
    fullName: string;
    phone: string;
    businessName: string;
    businessPhone: string;
    serviceArea: string;
    selectedCategories: string[];
  }
): FieldErrors {
  return {
    fullName: validateFullName(values.fullName),
    phone: validatePhone(values.phone),
    ...(isProvider && {
      businessName: validateBusinessName(values.businessName),
      businessPhone: validateBusinessPhone(values.businessPhone),
      serviceArea: validateServiceArea(values.serviceArea),
      categories: validateCategories(values.selectedCategories),
    }),
  };
}

function hasAnyError(errors: FieldErrors): boolean {
  return Object.values(errors).some((e) => e != null);
}

// ── Component ──────────────────────────────────────────────────────────────────

interface EditProfileModalProps {
  userId: string;
  role: string;
  currentValues: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
    businessName?: string;
    businessPhone?: string;
    serviceArea?: string;
    latitude?: number;
    longitude?: number;
    categories?: string[];
  };
  onClose: () => void;
  onSaved: () => void;
}

export function EditProfileModal({
  userId,
  role,
  currentValues,
  onClose,
  onSaved,
}: EditProfileModalProps) {
  const isProvider = role === "service_provider";

  const [fullName, setFullName] = useState(currentValues.full_name ?? "");
  const [phone, setPhone] = useState(currentValues.phone ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    currentValues.avatar_url ?? null
  );

  const [businessName, setBusinessName] = useState(
    currentValues.businessName ?? ""
  );
  const [businessPhone, setBusinessPhone] = useState(
    currentValues.businessPhone ?? ""
  );
  const [serviceArea, setServiceArea] = useState(
    currentValues.serviceArea ?? ""
  );
  const [latitude, setLatitude] = useState<number | undefined>(
    currentValues.latitude
  );
  const [longitude, setLongitude] = useState<number | undefined>(
    currentValues.longitude
  );
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentValues.categories ?? []
  );

  const [allCategories, setAllCategories] = useState<ServiceCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [statusChangedToReview, setStatusChangedToReview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isProvider) return;
    setCategoriesLoading(true);
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setAllCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setCategoriesLoading(false));
  }, [isProvider]);

  // Re-validate touched fields on each change so errors clear as the user fixes them
  useEffect(() => {
    if (!submitted) return;
    setFieldErrors(
      runValidation(isProvider, {
        fullName,
        phone,
        businessName,
        businessPhone,
        serviceArea,
        selectedCategories,
      })
    );
  }, [
    submitted,
    isProvider,
    fullName,
    phone,
    businessName,
    businessPhone,
    serviceArea,
    selectedCategories,
  ]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleSave = async () => {
    setSubmitted(true);
    const errors = runValidation(isProvider, {
      fullName,
      phone,
      businessName,
      businessPhone,
      serviceArea,
      selectedCategories,
    });
    setFieldErrors(errors);
    if (hasAnyError(errors)) return;

    setSaving(true);
    setSaveError(null);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not authenticated");

      let finalAvatarUrl = currentValues.avatar_url ?? "";

      // Upload new avatar via the edge function
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/upload-avatar`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );
        if (!uploadRes.ok) {
          const json = await uploadRes.json().catch(() => ({}));
          throw new Error(
            (json as { error?: string }).error ??
              `Avatar upload failed (${uploadRes.status})`
          );
        }
        const json = (await uploadRes.json()) as { publicUrl?: string };
        if (!json.publicUrl) throw new Error("No public URL returned");
        finalAvatarUrl = json.publicUrl;
      }

      const body: Record<string, unknown> = {
        full_name: fullName.trim(),
        phone: phone.trim(),
        avatar_url: finalAvatarUrl,
      };

      if (isProvider) {
        body.businessName = businessName.trim();
        body.businessPhone = businessPhone.trim();
        body.serviceArea = serviceArea.trim();
        body.latitude = latitude;
        body.longitude = longitude;
        body.categories = selectedCategories;
      }

      const res = await fetch(`/api/users/${userId}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Save failed");
      }

      const json = await res.json();
      setStatusChangedToReview(!!json.statusChanged);
      setSaved(true);
      setTimeout(() => onSaved(), 1200);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Helper: error message element
  const FieldError = ({ msg }: { msg?: string | null }) =>
    msg ? (
      <p className="mt-1 text-[11px] text-[var(--error)]">{msg}</p>
    ) : null;

  // Helper: input class with error state
  const inputCls = (hasError: boolean) =>
    `w-full px-3 py-2.5 rounded-lg bg-[var(--surface-alt)] border text-[var(--text-primary)] text-sm focus:outline-none transition-colors ${
      hasError
        ? "border-[var(--error)]/60 focus:border-[var(--error)]"
        : "border-[var(--border)] focus:border-[var(--primary)]/60"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {showMapPicker && (
        <ServiceAreaMapPicker
          initialLocation={
            latitude != null && longitude != null
              ? { latitude, longitude }
              : undefined
          }
          initialServiceArea={serviceArea}
          onConfirm={(area, lat, lng) => {
            setServiceArea(area);
            setLatitude(lat);
            setLongitude(lng);
            setShowMapPicker(false);
          }}
          onClose={() => setShowMapPicker(false)}
        />
      )}
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xl">
        {/* Gold accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary)]/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]/60">
          <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--surface-alt)] transition-colors cursor-pointer"
          >
            <RiCloseLine size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2 pb-2">
            <div
              className="w-20 h-20 rounded-full bg-[var(--surface-alt)] border-2 border-[var(--primary)]/35 overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              style={{ boxShadow: "0 0 0 4px rgba(212,175,55,0.1)" }}
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <RiUserLine size={32} className="text-[var(--text-tertiary)]" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-[var(--primary)] hover:underline cursor-pointer"
            >
              <RiUploadLine size={12} />
              Upload photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputCls(!!fieldErrors.fullName)}
              placeholder="Your full name"
              maxLength={50}
            />
            <FieldError msg={fieldErrors.fullName} />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputCls(!!fieldErrors.phone)}
              placeholder="+1 234 567 8900"
            />
            <FieldError msg={fieldErrors.phone} />
          </div>

          {/* Provider-only business fields */}
          {isProvider && (
            <>
              <div className="h-px bg-[var(--border)]/60 my-1" />
              <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                Business Details
              </p>

              {/* Business Name */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={inputCls(!!fieldErrors.businessName)}
                  placeholder="Your business name"
                  maxLength={100}
                />
                <FieldError msg={fieldErrors.businessName} />
              </div>

              {/* Business Phone */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">
                  Business Phone{" "}
                  <span className="text-[var(--text-tertiary)] font-normal">
                    (optional)
                  </span>
                </label>
                <input
                  type="tel"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className={inputCls(!!fieldErrors.businessPhone)}
                  placeholder="+1 234 567 8900"
                />
                <FieldError msg={fieldErrors.businessPhone} />
              </div>

              {/* Service Area */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-1.5">
                  Service Area
                </label>
                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className={`w-full px-3 py-2.5 rounded-lg bg-[var(--surface-alt)] border text-sm text-left flex items-center gap-2 transition-colors cursor-pointer hover:border-[var(--primary)]/60 ${
                    fieldErrors.serviceArea
                      ? "border-[var(--error)]/60"
                      : "border-[var(--border)]"
                  }`}
                >
                  <RiMapPinLine
                    size={14}
                    className="text-[var(--primary)] flex-shrink-0"
                  />
                  <span
                    className={
                      serviceArea
                        ? "text-[var(--text-primary)] truncate"
                        : "text-[var(--text-tertiary)]"
                    }
                  >
                    {serviceArea || "Tap to select on map"}
                  </span>
                </button>
                <FieldError msg={fieldErrors.serviceArea} />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
                  Categories
                </label>
                {categoriesLoading ? (
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Loading…
                  </p>
                ) : allCategories.length === 0 ? (
                  <p className="text-xs text-[var(--text-tertiary)]">
                    No categories available.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map((cat) => {
                      const selected = selectedCategories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            selected
                              ? "bg-[var(--primary)]/15 text-[var(--primary)] border-[var(--primary)]/40"
                              : "bg-[var(--surface-alt)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary)]/30"
                          }`}
                        >
                          {cat.name_en}
                        </button>
                      );
                    })}
                  </div>
                )}
                <FieldError msg={fieldErrors.categories} />
              </div>

              {/* Review notice */}
              <p className="text-[11px] text-[var(--text-tertiary)] bg-[var(--surface-alt)] rounded-lg px-3 py-2 border border-[var(--border)]/60">
                Changing business details will set your account status to{" "}
                <strong className="text-[var(--text-secondary)]">pending</strong>{" "}
                until reviewed by an admin.
              </p>
            </>
          )}

          {/* Save error */}
          {saveError && (
            <p className="text-xs text-[var(--error)] bg-[var(--error)]/10 rounded-lg px-3 py-2">
              {saveError}
            </p>
          )}

          {/* Success */}
          {saved && (
            <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2 flex items-start gap-1.5">
              <RiCheckLine size={14} className="flex-shrink-0 mt-0.5" />
              <span>
                Saved!
                {statusChangedToReview &&
                  " Your account is now pending review."}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border)]/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-alt)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-black text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
          >
            {saving && <RiLoader4Line className="animate-spin" size={14} />}
            {saved ? "Saved" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
