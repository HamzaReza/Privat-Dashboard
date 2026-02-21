"use client";

import { useState, useEffect, useRef } from "react";
import { ServiceCategory, CategoryFormData } from "@/types/category";
import { RiCloseLine, RiLoader4Line, RiImageLine } from "react-icons/ri";

interface CategoryModalProps {
  mode: "add" | "edit";
  category?: ServiceCategory;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY_FORM: CategoryFormData = {
  id: "",
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
  const [form, setForm] = useState<CategoryFormData>(
    mode === "edit" && category
      ? {
          id: category.id,
          name_en: category.name_en,
          name_it: category.name_it,
          icon: category.icon,
          image_uri: category.image_uri,
          credits: category.credits,
        }
      : EMPTY_FORM
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

  const set = (field: keyof CategoryFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const url =
        mode === "edit"
          ? `/api/categories/${category!.id}`
          : "/api/categories";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
          {/* ID */}
          <Field label="ID" hint="Unique identifier, e.g. cleaning">
            <input
              type="text"
              value={form.id}
              onChange={(e) => set("id", e.target.value)}
              placeholder="e.g. cleaning"
              required
              disabled={mode === "edit"}
              className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </Field>

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
          <Field label="Icon" hint="Emoji or icon name">
            <input
              type="text"
              value={form.icon}
              onChange={(e) => set("icon", e.target.value)}
              placeholder="🧹"
              required
              className="input-field"
            />
          </Field>

          {/* Image URI */}
          <Field label="Image URL">
            <input
              type="text"
              value={form.image_uri}
              onChange={(e) => set("image_uri", e.target.value)}
              placeholder="https://…"
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
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
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
              onChange={(e) => set("credits", parseInt(e.target.value, 10) || 0)}
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
              {saving ? "Saving…" : mode === "add" ? "Add Category" : "Save Changes"}
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
          transition: border-color 0.15s, box-shadow 0.15s;
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
