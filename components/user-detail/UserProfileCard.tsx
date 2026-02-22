import { RiUserLine, RiShieldLine } from "react-icons/ri";

interface UserProfileCardProps {
  user: {
    id: string;
    created_at: string;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
  };
  isCurrentUserAdmin: boolean;
}

export function UserProfileCard({
  user,
  isCurrentUserAdmin,
}: UserProfileCardProps) {
  const meta = user.user_metadata ?? {};
  const fullName = (meta.full_name ?? meta.name ?? "—") as string;
  const avatarUrl = meta.avatar_url as string | undefined;
  const role = (meta.role ?? user.app_metadata?.role ?? "user") as string;
  const status = meta.status as string | undefined;

  return (
    <div
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[var(--surface-alt)] border border-[var(--border)] overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <RiUserLine size={28} className="text-[var(--text-tertiary)]" />
          )}
        </div>

        {/* Name & badge */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-[var(--text-primary)] truncate">
            {fullName}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                role === "service_provider"
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                  : role === "customer"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    : role === "admin"
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30"
                      : "bg-[var(--surface-alt)] text-[var(--text-secondary)] border-[var(--border)]"
              }`}
            >
              <RiShieldLine size={11} />
              {role === "service_provider"
                ? "Service Provider"
                : role === "customer"
                  ? "Customer"
                  : role}
            </span>
            {status && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  status === "active"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                    : "bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            )}
          </div>
        </div>

        {/* User ID (admin only) */}
        {isCurrentUserAdmin && (
          <div className="text-right hidden sm:block">
            <p className="text-xs text-[var(--text-tertiary)] mb-1">User ID</p>
            <code className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--surface-alt)] px-2 py-1 rounded-lg border border-[var(--border)]">
              {user.id}
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
