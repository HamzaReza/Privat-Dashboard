import {
  RiBriefcaseLine,
  RiPhoneLine,
  RiMapPinLine,
  RiCoinLine,
  RiFileTextLine,
  RiShieldLine,
} from "react-icons/ri";

interface ServiceProviderInfoProps {
  meta: Record<string, unknown>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <h2 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function ServiceProviderInfo({ meta }: ServiceProviderInfoProps) {
  return (
    <Section title="Service Provider Information">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!!meta.businessName && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
              <RiBriefcaseLine size={14} />
              <span className="text-xs font-medium uppercase tracking-wider">
                Business Name
              </span>
            </div>
            <span className="text-sm text-[var(--text-primary)]">
              {meta.businessName as string}
            </span>
          </div>
        )}
        {!!meta.businessPhone && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
              <RiPhoneLine size={14} />
              <span className="text-xs font-medium uppercase tracking-wider">
                Business Phone
              </span>
            </div>
            <span className="text-sm text-[var(--text-primary)]">
              {meta.businessPhone as string}
            </span>
          </div>
        )}
        {!!meta.serviceArea && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
              <RiMapPinLine size={14} />
              <span className="text-xs font-medium uppercase tracking-wider">
                Service Area
              </span>
            </div>
            <span className="text-sm text-[var(--text-primary)]">
              {meta.serviceArea as string}
            </span>
          </div>
        )}
        {meta.credits !== undefined && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
              <RiCoinLine size={14} />
              <span className="text-xs font-medium uppercase tracking-wider">
                Credits
              </span>
            </div>
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {meta.credits as number}
            </span>
          </div>
        )}
        {!!meta.categories && Array.isArray(meta.categories) && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
              <RiFileTextLine size={14} />
              <span className="text-xs font-medium uppercase tracking-wider">
                Categories
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {(meta.categories as string[]).map((cat: string) => (
                <span
                  key={cat}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[var(--surface-alt)] text-[var(--text-secondary)] border border-[var(--border)]"
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}
        {meta.consent_background_check !== undefined && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
              <RiShieldLine size={14} />
              <span className="text-xs font-medium uppercase tracking-wider">
                Background Check Consent
              </span>
            </div>
            <span
              className={`text-sm font-medium ${
                (meta.consent_background_check as boolean)
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {(meta.consent_background_check as boolean) ? "✓ Consented" : "✗ Not Consented"}
            </span>
          </div>
        )}
        {!!meta.document_url && (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
              <RiFileTextLine size={14} />
              <span className="text-xs font-medium uppercase tracking-wider">
                Document
              </span>
            </div>
            <a
              href={meta.document_url as string}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--primary)] hover:underline break-all"
            >
              View Document
            </a>
          </div>
        )}
      </div>
    </Section>
  );
}
