"use client";

import { useState, useEffect, useRef } from "react";
import * as FaIcons from "react-icons/fa";
import { ServiceCategory, CategoryFormData } from "@/types/category";
import { RiCloseLine, RiLoader4Line, RiImageLine } from "react-icons/ri";

// Converts stored name (e.g. "Hammer", "hammer", "paint-roller") to react-icons key (e.g. "FaHammer", "FaPaintRoller")
function toFaKey(name: string): string {
  if (!name) return "";
  if (/^Fa[A-Z]/.test(name)) return name; // already "FaPascalCase"
  return "Fa" + name.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join("");
}

interface CategoryModalProps {
  mode: "add" | "edit";
  category?: ServiceCategory;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY_FORM: Omit<CategoryFormData, "id"> = {
  name_en: "",
  name_it: "",
  icon: "",
  image_uri: "",
  credits: 0,
};

export function CategoryModal({
  mode,
  category,
  onClose,
  onSaved,
}: CategoryModalProps) {
  const [form, setForm] = useState<Omit<CategoryFormData, "id">>(
    mode === "edit" && category
      ? {
          name_en: category.name_en,
          name_it: category.name_it,
          icon: category.icon,
          image_uri: category.image_uri,
          credits: category.credits,
        }
      : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const set = (
    field: keyof Omit<CategoryFormData, "id">,
    value: string | number,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateIcon = (iconName: string): boolean => {
    const key = toFaKey(iconName);
    return key in FaIcons;
  };

  // Store icon without "Fa" prefix for DB / mobile (e.g. "Hammer", "paint-roller")
  // Store icon without "Fa" prefix, always lowercase (e.g. "hammer", "paint-roller")
  const iconForDb = (iconName: string): string => {
    const trimmed = iconName.trim().replace(/^Fa/i, "") || iconName.trim();
    return trimmed.toLowerCase();
  };

  const isUnsplashImageUrl = (url: string): boolean => {
    try {
      const u = new URL(url.trim());
      return u.hostname === "images.unsplash.com" && (u.protocol === "https:" || u.protocol === "http:");
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate icon exists in FA5
    if (!validateIcon(form.icon)) {
      setError(
        `Icon "${form.icon}" not found in FontAwesome 5. Please use a valid FA5 icon name.`,
      );
      return;
    }

    if (!form.image_uri?.trim()) {
      setError("Image URL is required.");
      return;
    }
    if (!isUnsplashImageUrl(form.image_uri)) {
      setError(
        'Image must be from images.unsplash.com (e.g. https://images.unsplash.com/photo-...)',
      );
      return;
    }

    setSaving(true);

    try {
      const url =
        mode === "edit" ? `/api/categories/${category!.id}` : "/api/categories";
      const method = mode === "edit" ? "PUT" : "POST";

      // Generate ID from name_en (lowercase). Store icon without "Fa" for DB/mobile.
      const payload: CategoryFormData = {
        ...form,
        icon: iconForDb(form.icon),
        id:
          mode === "edit"
            ? category!.id
            : form.name_en.toLowerCase().replace(/\s+/g, "_"),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save category");
      }

      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--glass-overlay)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
        style={{ boxShadow: "var(--shadow-xl)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            {mode === "add" ? "Add Category" : "Edit Category"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-alt)] transition-colors cursor-pointer"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name EN / IT side by side */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name (EN)">
              <input
                type="text"
                value={form.name_en}
                onChange={(e) => set("name_en", e.target.value)}
                placeholder="Cleaning"
                required
                className="input-field"
              />
            </Field>
            <Field label="Name (IT)">
              <input
                type="text"
                value={form.name_it}
                onChange={(e) => set("name_it", e.target.value)}
                placeholder="Pulizia"
                required
                className="input-field"
              />
            </Field>
          </div>

          {/* Icon */}
          <Field label="Icon" hint="FontAwesome5 name, e.g. FaBroom">
            <input
              type="text"
              value={form.icon}
              onChange={(e) => set("icon", e.target.value)}
              placeholder="FaBroom"
              required
              className="input-field"
            />
          </Field>

          {/* Image URI */}
          <Field label="Image URL" hint="Must be from images.unsplash.com">
            <input
              type="text"
              value={form.image_uri}
              onChange={(e) => set("image_uri", e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              required
              className="input-field"
            />
          </Field>

          {/* Image preview */}
          {form.image_uri && (
            <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-alt)] h-32 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.image_uri}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
              <div className="hidden flex-col items-center gap-1 text-[var(--text-tertiary)]">
                <RiImageLine size={24} />
                <span className="text-xs">Invalid URL</span>
              </div>
            </div>
          )}

          {/* Credits */}
          <Field label="Credits" hint="Default 0">
            <input
              type="number"
              value={form.credits}
              onChange={(e) =>
                set("credits", parseInt(e.target.value, 10) || 0)
              }
              min={0}
              required
              className="input-field"
            />
          </Field>

          {/* Error */}
          {error && (
            <p className="text-sm text-[var(--error)] bg-[var(--error-bg)] border border-[var(--error)]/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--surface-alt)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving && <RiLoader4Line className="animate-spin" size={15} />}
              {saving
                ? "Saving…"
                : mode === "add"
                  ? "Add Category"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--surface-alt);
          color: var(--text-primary);
          font-size: 0.875rem;
          transition:
            border-color 0.15s,
            box-shadow 0.15s;
        }
        .input-field::placeholder {
          color: var(--text-tertiary);
        }
        .input-field:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 1px var(--primary);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
        {hint && (
          <span className="text-xs text-[var(--text-tertiary)]">({hint})</span>
        )}
      </div>
      {children}
    </div>
  );
}
