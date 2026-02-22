"use client";

import { useState, useEffect, useCallback } from "react";
import { ServiceCategory } from "@/types/category";
import { CategoryModal } from "@/components/dashboard/CategoryModal";
import {
  RiLoader4Line,
  RiAppsLine,
  RiRefreshLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";

export function CategoriesTab() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<
    { mode: "add" } | { mode: "edit"; category: ServiceCategory } | null
  >(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data: ServiceCategory[] = await res.json();
      setCategories(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string) => {
    setActionLoading(id + "-delete");
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      // silently refetch
      fetchCategories();
    } finally {
      setActionLoading(null);
      setDeleteConfirm(null);
    }
  };

  const handleToggleHidden = async (cat: ServiceCategory) => {
    const id = cat.id;
    setActionLoading(id + "-hide");
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !cat.hidden }),
      });
      if (!res.ok) throw new Error("Update failed");
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, hidden: !c.hidden } : c)),
      );
    } catch {
      fetchCategories();
    } finally {
      setActionLoading(null);
    }
  };

  const onModalSaved = () => {
    setModal(null);
    fetchCategories();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Categories
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Manage service categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCategories}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
          >
            <RiRefreshLine size={16} />
          </button>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black text-sm font-semibold transition-colors cursor-pointer"
          >
            <RiAddLine size={16} />
            Add Category
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <RiLoader4Line
            className="animate-spin text-[var(--primary)]"
            size={32}
          />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <p className="text-[var(--error)] text-sm">{error}</p>
          <button
            onClick={fetchCategories}
            className="text-sm text-[var(--primary)] underline underline-offset-2 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3 text-[var(--text-tertiary)]">
          <RiAppsLine size={40} />
          <p className="text-sm">No categories yet</p>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="text-sm text-[var(--primary)] underline underline-offset-2 cursor-pointer"
          >
            Add the first one
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              actionLoading={actionLoading}
              deleteConfirm={deleteConfirm}
              onEdit={() => setModal({ mode: "edit", category: cat })}
              onDelete={() => setDeleteConfirm(cat.id)}
              onDeleteConfirm={() => handleDelete(cat.id)}
              onDeleteCancel={() => setDeleteConfirm(null)}
              onToggleHidden={() => handleToggleHidden(cat)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <CategoryModal
          mode={modal.mode}
          category={modal.mode === "edit" ? modal.category : undefined}
          onClose={() => setModal(null)}
          onSaved={onModalSaved}
        />
      )}
    </div>
  );
}

interface CategoryCardProps {
  category: ServiceCategory;
  actionLoading: string | null;
  deleteConfirm: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  onToggleHidden: () => void;
}

function CategoryCard({
  category,
  actionLoading,
  deleteConfirm,
  onEdit,
  onDelete,
  onDeleteConfirm,
  onDeleteCancel,
  onToggleHidden,
}: CategoryCardProps) {
  const isDeleting = actionLoading === category.id + "-delete";
  const isHiding = actionLoading === category.id + "-hide";
  const confirmingDelete = deleteConfirm === category.id;

  return (
    <div
      className={`group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all duration-200 hover:border-[var(--primary)]/50 hover:shadow-md ${
        category.hidden ? "opacity-50" : ""
      }`}
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {/* Image */}
      <div className="relative aspect-square bg-[var(--surface-alt)] overflow-hidden">
        {category.image_uri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.image_uri}
            alt={category.name_en}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {category.icon}
          </div>
        )}

        {/* Hidden badge */}
        {category.hidden && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 text-white text-xs font-medium">
            <RiEyeOffLine size={11} />
            Hidden
          </div>
        )}

        {/* Hover action buttons */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          {confirmingDelete ? (
            <div className="flex flex-col items-center gap-2 px-3">
              <p className="text-white text-xs text-center font-medium">
                Delete?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCancel();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs transition-colors cursor-pointer"
                >
                  No
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConfirm();
                  }}
                  disabled={isDeleting}
                  className="px-2.5 py-1 rounded-lg bg-[var(--error)] hover:bg-[var(--error)]/80 text-white text-xs transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {isDeleting ? (
                    <RiLoader4Line className="animate-spin" size={12} />
                  ) : (
                    "Yes"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              <ActionBtn
                onClick={onEdit}
                title="Edit"
                icon={<RiEditLine size={15} />}
              />
              <ActionBtn
                onClick={onDelete}
                title="Delete"
                icon={<RiDeleteBinLine size={15} />}
                danger
              />
              <ActionBtn
                onClick={onToggleHidden}
                title={category.hidden ? "Show" : "Hide"}
                icon={
                  isHiding ? (
                    <RiLoader4Line className="animate-spin" size={15} />
                  ) : category.hidden ? (
                    <RiEyeLine size={15} />
                  ) : (
                    <RiEyeOffLine size={15} />
                  )
                }
              />
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-base leading-none">{category.icon}</span>
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {category.name_en}
          </p>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] truncate">
          {category.name_it}
        </p>
        {category.credits > 0 && (
          <p className="text-xs text-[var(--primary)] font-medium mt-1">
            {category.credits} credits
          </p>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  onClick,
  title,
  icon,
  danger,
}: {
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={title}
      className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl text-white text-xs font-medium transition-colors cursor-pointer ${
        danger
          ? "bg-[var(--error)]/80 hover:bg-[var(--error)]"
          : "bg-white/20 hover:bg-white/30"
      }`}
    >
      {icon}
      {title}
    </button>
  );
}
