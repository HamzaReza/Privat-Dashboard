"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { User } from "@/types/user";
import {
  RiSearchLine,
  RiLoader4Line,
  RiUserLine,
  RiRefreshLine,
  RiArrowRightSLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiCalendarLine,
} from "react-icons/ri";

const PAGE_SIZE = 10;

type RoleFilter = "all" | "customer" | "service_provider";
type DateFilter = "all" | "today" | "current_week" | "current_month" | "custom";

function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function UsersTab() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Close calendar on outside click
  useEffect(() => {
    if (!calendarOpen) return;
    const handler = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [calendarOpen]);

  // Apply all filters whenever any filter or users change
  useEffect(() => {
    const q = search.toLowerCase().trim();
    const now = new Date();

    const result = users.filter((u) => {
      // Search filter
      if (q) {
        const matchSearch =
          u.email?.toLowerCase().includes(q) ||
          u.full_name?.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q) ||
          u.businessName?.toLowerCase().includes(q) ||
          u.phone?.includes(q) ||
          u.businessPhone?.includes(q);
        if (!matchSearch) return false;
      }

      // Role filter
      if (roleFilter !== "all") {
        if (u.role !== roleFilter) return false;
      }

      // Date filter (on created_at)
      const joined = new Date(u.created_at);
      if (dateFilter === "today") {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        if (joined < start || joined > end) return false;
      } else if (dateFilter === "current_week") {
        const daysSinceMonday = (now.getDay() + 6) % 7;
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - daysSinceMonday);
        startOfWeek.setHours(0, 0, 0, 0);
        if (joined < startOfWeek || joined > now) return false;
      } else if (dateFilter === "current_month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        if (joined < startOfMonth || joined > now) return false;
      } else if (dateFilter === "custom") {
        if (!customStart || !customEnd) return false;
        const start = new Date(customStart);
        start.setHours(0, 0, 0, 0);
        const end = new Date(customEnd);
        end.setHours(23, 59, 59, 999);
        if (joined < start || joined > end) return false;
      }

      return true;
    });

    setFiltered(result);
    setPage(1);
  }, [search, roleFilter, dateFilter, customStart, customEnd, users]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const ROLE_TABS: { value: RoleFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "customer", label: "Customer" },
    { value: "service_provider", label: "Provider" },
  ];

  const DATE_TABS: { value: DateFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "today", label: "Today" },
    { value: "current_week", label: "This week" },
    { value: "current_month", label: "This month" },
  ];

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Users</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {filtered.length} of {users.length} users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <RiSearchLine
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
              size={15}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users…"
              className="pl-9 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors w-52"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
          >
            <RiRefreshLine size={15} />
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Role filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-wider">
            Role
          </span>
          <div className="flex gap-1 bg-[var(--surface-alt)] rounded-xl p-1 border border-[var(--border)]">
            {ROLE_TABS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setRoleFilter(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  roleFilter === value
                    ? "bg-[var(--primary)] text-black shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-5 bg-[var(--border)] hidden sm:block" />

        {/* Date filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-wider">
            Joined
          </span>
          <div className="flex gap-1 bg-[var(--surface-alt)] rounded-xl p-1 border border-[var(--border)]">
            {DATE_TABS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => {
                  setDateFilter(value);
                  setCalendarOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  dateFilter === value
                    ? "bg-[var(--primary)] text-black shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Custom date range picker */}
          <div ref={calendarRef} className="relative">
            {dateFilter === "custom" && customStart && customEnd && !calendarOpen ? (
              <button
                onClick={() => setCalendarOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--primary)] bg-[var(--primary)] text-black text-xs font-semibold hover:bg-[var(--primary-dark)] transition-colors cursor-pointer"
              >
                <RiCalendarLine size={13} />
                {formatDateShort(customStart)} – {formatDateShort(customEnd)}
              </button>
            ) : (
              <button
                onClick={() => setCalendarOpen((v) => !v)}
                title="Custom date range"
                className={`flex items-center justify-center w-8 h-8 rounded-xl border transition-colors cursor-pointer ${
                  calendarOpen
                    ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--surface)]"
                    : "border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                <RiCalendarLine size={14} />
              </button>
            )}

            {calendarOpen && (
              <div
                className="absolute left-0 top-full z-50 mt-2 p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
                style={{ boxShadow: "var(--shadow-xl)" }}
              >
                <DatePicker
                  inline
                  selectsRange
                  startDate={customStart ? new Date(customStart) : null}
                  endDate={customEnd ? new Date(customEnd) : null}
                  onChange={(dates) => {
                    const [start, end] = dates ?? [null, null];
                    setCustomStart(start ? toYYYYMMDD(start) : "");
                    setCustomEnd(end ? toYYYYMMDD(end) : "");
                    if (start && end) {
                      setDateFilter("custom");
                      setCalendarOpen(false);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <RiLoader4Line className="animate-spin text-[var(--primary)]" size={28} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-[var(--error)] text-sm">{error}</p>
            <button
              onClick={fetchUsers}
              className="text-sm text-[var(--primary)] underline underline-offset-2 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-[var(--text-tertiary)]">
            <RiUserLine size={36} />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-alt)]">
                    {["Email", "Name", "Role", "Status", "Credits", "Joined"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((user, i) => (
                    <tr
                      key={user.id}
                      onClick={() => router.push(`/dashboard/users/${user.id}`)}
                      className={`border-b border-[var(--border-light)] hover:bg-[var(--surface-alt)] transition-colors cursor-pointer group ${
                        i % 2 === 1 ? "bg-[var(--surface-alt)]/30" : ""
                      }`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-[var(--text-primary)]">
                            {user.email ?? "—"}
                          </span>
                          {user.email_verified !== undefined && (
                            <span
                              className={`text-xs ${
                                user.email_verified
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-yellow-600 dark:text-yellow-400"
                              }`}
                            >
                              {user.email_verified ? "✓ Verified" : "⚠ Unverified"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)]">
                        <div className="flex items-center gap-2">
                          {user.avatar_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.avatar_url}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                            />
                          )}
                          <span>{user.full_name ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            user.role === "service_provider"
                              ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                              : user.role === "customer"
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                              : "bg-[var(--surface-alt)] text-[var(--text-secondary)] border-[var(--border)]"
                          }`}
                        >
                          {user.role === "service_provider"
                            ? "Provider"
                            : user.role === "customer"
                            ? "Customer"
                            : user.role ?? "user"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {user.status ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === "active"
                                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                : "bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        ) : (
                          <span className="text-[var(--text-tertiary)]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {user.credits !== undefined ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {user.credits}
                          </span>
                        ) : (
                          <span className="text-[var(--text-tertiary)]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[var(--text-secondary)] text-xs whitespace-nowrap">
                        {formatDateShort(user.created_at)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <RiArrowRightSLine
                          className="text-[var(--text-tertiary)] group-hover:text-[var(--primary)] transition-colors ml-auto"
                          size={18}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--border)] bg-[var(--surface-alt)]/50">
              <p className="text-xs text-[var(--text-tertiary)]">
                Showing{" "}
                <span className="font-medium text-[var(--text-secondary)]">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[var(--text-secondary)]">
                  {filtered.length}
                </span>{" "}
                users
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--primary)] hover:bg-[var(--surface-alt)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="First page"
                >
                  <RiArrowLeftSLine size={16} style={{ transform: "scaleX(-1)" }} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--primary)] hover:bg-[var(--surface-alt)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Previous page"
                >
                  <RiArrowLeftSLine size={16} />
                </button>

                <div className="flex items-center gap-1 mx-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === totalPages ||
                        (p >= page - 1 && p <= page + 1)
                    )
                    .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span
                          key={`dots-${idx}`}
                          className="px-1.5 text-xs text-[var(--text-tertiary)]"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item as number)}
                          className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            page === item
                              ? "bg-[var(--primary)] text-black"
                              : "text-[var(--text-secondary)] hover:bg-[var(--surface-alt)]"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--primary)] hover:bg-[var(--surface-alt)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Next page"
                >
                  <RiArrowRightSLine size={16} />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--primary)] hover:bg-[var(--surface-alt)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Last page"
                >
                  <RiArrowRightDoubleLine size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
