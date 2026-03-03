import {
  RiBriefcaseLine,
  RiPhoneLine,
  RiMapPinLine,
  RiCoinLine,
  RiFileTextLine,
  RiShieldLine,
  RiExternalLinkLine,
} from "react-icons/ri";

interface ServiceProviderInfoProps {
  meta: Record<string, unknown>;
}

function FieldRow({
  icon,
  label,
  children,
  alignStart,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  alignStart?: boolean;
}) {
  return (
    <div
      className={`flex gap-4 px-6 py-3.5 border-t border-[var(--border)]/60 hover:bg-[var(--surface-alt)]/50 transition-colors ${alignStart ? "items-start" : "items-center"}`}
    >
      <div
        className={`w-7 h-7 rounded-lg bg-[var(--surface-alt)] flex items-center justify-center text-[var(--primary)] flex-shrink-0 ${alignStart ? "mt-0.5" : ""}`}
      >
        {icon}
      </div>
      <span
        className={`text-xs font-medium text-[var(--text-tertiary)] w-28 flex-shrink-0 ${alignStart ? "pt-1" : ""}`}
      >
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function ServiceProviderInfo({ meta }: ServiceProviderInfoProps) {
  return (
    <div
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {/* Gold accent top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent" />

      {/* Header */}
      <div className="flex items-center gap-2.5 px-6 pt-5 pb-4">
        <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center">
          <RiBriefcaseLine size={14} className="text-[var(--primary)]" />
        </div>
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
          Service Provider
        </h2>
      </div>

      {!!meta.businessName && (
        <FieldRow icon={<RiBriefcaseLine size={13} />} label="Business">
          <span className="text-[15px] text-[var(--text-primary)]">
            {meta.businessName as string}
          </span>
        </FieldRow>
      )}

      {!!meta.businessPhone && (
        <FieldRow icon={<RiPhoneLine size={13} />} label="Phone">
          <span className="text-[15px] text-[var(--text-primary)]">
            {meta.businessPhone as string}
          </span>
        </FieldRow>
      )}

      {!!meta.serviceArea && (
        <FieldRow icon={<RiMapPinLine size={13} />} label="Service Area">
          <span className="text-[15px] text-[var(--text-primary)]">
            {meta.serviceArea as string}
          </span>
        </FieldRow>
      )}

      {meta.credits !== undefined && (
        <FieldRow icon={<RiCoinLine size={13} />} label="Credits">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/25 text-[var(--primary)] text-xs font-bold">
            {meta.credits as number}
          </span>
        </FieldRow>
      )}

      {!!meta.categories && Array.isArray(meta.categories) && (
        <FieldRow
          icon={<RiFileTextLine size={13} />}
          label="Categories"
          alignStart
        >
          <div className="flex flex-wrap gap-1.5">
            {(meta.categories as string[]).map((cat: string) => (
              <span
                key={cat}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--surface-alt)] text-[var(--text-secondary)] border border-[var(--border)]"
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
            ))}
          </div>
        </FieldRow>
      )}

      {meta.consent_background_check !== undefined && (
        <FieldRow icon={<RiShieldLine size={13} />} label="Bg. Check">
          {(meta.consent_background_check as boolean) ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
              ✓ Consented
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
              ✗ Not Consented
            </span>
          )}
        </FieldRow>
      )}

      {!!meta.document_url && (
        <FieldRow icon={<RiFileTextLine size={13} />} label="Document">
          <a
            href={meta.document_url as string}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors"
          >
            View Document
            <RiExternalLinkLine size={13} />
          </a>
        </FieldRow>
      )}

      <div className="h-2" />
    </div>
  );
}
