import Link from "next/link";
import { PACKAGES } from "@/constants/packages";
import { GoldDivider } from "@/components/marketing/SectionElements";
import { ArrowRight, Check, Zap, Clock, ShieldCheck } from "lucide-react";

const packageMeta: Record<
  string,
  { tagline: string; desc: string; featured?: boolean }
> = {
  starter: {
    tagline: "Just getting started",
    desc: "Explore the platform and unlock your first leads with no commitment.",
  },
  small: {
    tagline: "Occasional projects",
    desc: "Pick up a handful of jobs per month at a better rate.",
  },
  medium: {
    tagline: "Most popular",
    desc: "The sweet spot for growing providers who want a consistent pipeline.",
    featured: true,
  },
  pro: {
    tagline: "Serious growth",
    desc: "For established professionals handling high lead volume regularly.",
  },
  business: {
    tagline: "Maximum value",
    desc: "The ultimate pack for teams and providers operating at scale.",
  },
};

const guarantees = [
  {
    icon: Clock,
    label: "Credits never expire",
    desc: "Use them at your own pace — no monthly reset, no pressure.",
  },
  {
    icon: ShieldCheck,
    label: "One-time payment",
    desc: "No subscriptions. Pay once, use when you need.",
  },
  {
    icon: Zap,
    label: "Instant activation",
    desc: "Credits are added to your account immediately after purchase.",
  },
];

export default function PricingPage() {
  const savingVsStarter = (perCredit: number) => {
    const starterRate = 1.4;
    const saving = Math.round(((starterRate - perCredit) / starterRate) * 100);
    return saving > 0 ? saving : null;
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex min-h-[52vh] items-center justify-center overflow-hidden bg-subtle-texture">
        {/* ambient glows */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,hsl(42_70%_50%/0.09),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_80%_80%,hsl(42_70%_50%/0.04),transparent)]" />

        {/* subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(42,70%,50%) 1px,transparent 1px),linear-gradient(90deg,hsl(42,70%,50%) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative z-10 mx-auto px-4 py-24 text-center lg:px-8">
          <p className="mb-4 text-xs font-heading tracking-ultra uppercase text-[hsl(var(--primary-hsl))] opacity-70">
            Transparent Pricing
          </p>
          <h1 className="mx-auto max-w-2xl text-3xl font-heading font-semibold leading-tight tracking-widest-marketing uppercase md:text-5xl lg:text-6xl slide-up">
            Pay only for{" "}
            <span className="text-gold-gradient">leads you want.</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-[hsl(var(--muted-foreground-hsl))] fade-in lg:text-lg"
            style={{ animationDelay: "0.3s" }}
          >
            No monthly fees. No subscriptions. Buy a credit pack once and unlock
            high-intent service requests whenever you&apos;re ready.
          </p>
          <GoldDivider className="mt-10" />
        </div>
      </section>

      {/* ── What is a credit ── */}
      <section className="border-y border-[hsl(var(--border-hsl))/0.4] bg-[hsl(var(--background-hsl))] py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-xl font-heading font-semibold tracking-widest-marketing uppercase text-[hsl(var(--foreground-hsl))] md:text-2xl">
              What is a{" "}
              <span className="text-gold-gradient">credit?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[hsl(var(--muted-foreground-hsl))] lg:text-base">
              Credits are your access tokens. Each time you find a service
              request you want to pursue, you spend a credit to unlock the
              customer&apos;s contact details and full brief — then reach out
              directly. You only spend on leads you choose.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-3">
            {[
              { num: "01", title: "Browse requests", desc: "See all open service requests in your categories — for free." },
              { num: "02", title: "Spend a credit", desc: "Unlock the customer's contact info and full job details." },
              { num: "03", title: "Win the job", desc: "Reach out directly, send your quote, and close the deal." },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <span className="text-3xl font-heading font-semibold text-gold-gradient">
                  {step.num}
                </span>
                <h3 className="mt-2 text-sm font-heading font-semibold tracking-widest-marketing uppercase text-[hsl(var(--foreground-hsl))]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground-hsl))]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* faint background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[hsl(42_70%_50%/0.04)] blur-3xl" />

        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <h2 className="text-2xl font-heading font-semibold tracking-widest-marketing uppercase md:text-3xl lg:text-4xl">
              <span className="text-gold-gradient">Credit Packs</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground-hsl))] lg:text-base">
              Choose the pack that fits your pipeline. Bigger packs unlock a
              better rate per credit.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PACKAGES.map((pkg) => {
              const meta = packageMeta[pkg.id];
              const saving = savingVsStarter(pkg.perCredit);
              const isFeatured = meta?.featured;

              return (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col rounded-sm transition-all duration-300 ${
                    isFeatured
                      ? "border border-[hsl(var(--primary-hsl))/0.6] bg-[hsl(var(--card-hsl))] shadow-[0_0_40px_hsl(42_70%_50%/0.12)] hover:shadow-[0_0_60px_hsl(42_70%_50%/0.2)]"
                      : "border border-[hsl(var(--border-hsl))/0.5] bg-[hsl(var(--card-hsl))] hover:border-[hsl(var(--primary-hsl))/0.3] hover:shadow-lg hover:shadow-[hsl(42_70%_50%/0.05)]"
                  }`}
                >
                  {/* featured top bar */}
                  {isFeatured && (
                    <div className="h-px bg-gradient-to-r from-transparent via-[hsl(var(--primary-hsl))] to-transparent" />
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    {/* badge */}
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <span
                        className={`text-xs font-heading font-medium tracking-widest-marketing uppercase ${
                          isFeatured
                            ? "text-[hsl(var(--primary-hsl))]"
                            : "text-[hsl(var(--muted-foreground-hsl))]"
                        }`}
                      >
                        {meta?.tagline}
                      </span>
                      {saving && (
                        <span className="flex-shrink-0 rounded-sm bg-[hsl(var(--primary-hsl))/0.12] px-2 py-0.5 text-xs font-semibold text-[hsl(var(--primary-hsl))]">
                          -{saving}%
                        </span>
                      )}
                    </div>

                    {/* name */}
                    <h3 className="font-heading text-base font-semibold tracking-widest-marketing uppercase text-[hsl(var(--foreground-hsl))]">
                      {pkg.name.replace(" (Best Value)", "")}
                    </h3>

                    {/* credits */}
                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className="text-4xl font-heading font-semibold text-gold-gradient leading-none">
                        {pkg.credits}
                      </span>
                      <span className="text-sm text-[hsl(var(--muted-foreground-hsl))]">
                        credits
                      </span>
                    </div>

                    {/* price */}
                    <div className="mt-3">
                      <span className="text-2xl font-semibold text-[hsl(var(--foreground-hsl))]">
                        €{pkg.price % 1 === 0 ? pkg.price : pkg.price.toFixed(2)}
                      </span>
                      <span className="ml-2 text-xs text-[hsl(var(--muted-foreground-hsl))]">
                        one-time
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-[hsl(var(--muted-foreground-hsl))]">
                      €{pkg.perCredit.toFixed(2)} per credit
                    </p>

                    {/* divider */}
                    <div className="my-5 h-px bg-[hsl(var(--border-hsl))/0.5]" />

                    {/* description */}
                    <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground-hsl))] flex-1">
                      {meta?.desc}
                    </p>

                    {/* highlights */}
                    <ul className="mt-5 space-y-2">
                      {[
                        `${pkg.credits} lead unlocks`,
                        "Credits never expire",
                        "All service categories",
                      ].map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground-hsl))]"
                        >
                          <Check
                            size={13}
                            className="shrink-0 text-[hsl(var(--primary-hsl))]"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      href="/login?role=provider"
                      className={`mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm text-xs font-semibold tracking-widest-marketing uppercase transition-all ${
                        isFeatured
                          ? "bg-gold-gradient text-[hsl(var(--primary-foreground-hsl))] hover:shadow-lg hover:shadow-[hsl(42_60%_35%/0.3)]"
                          : "border border-[hsl(var(--primary-hsl))/0.5] text-[hsl(var(--primary-hsl))] hover:bg-[hsl(var(--primary-hsl))/0.08]"
                      }`}
                    >
                      Get started <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* featured bottom glow line */}
                  {isFeatured && (
                    <div className="h-px bg-gradient-to-r from-transparent via-[hsl(var(--primary-hsl))/0.4] to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Guarantees ── */}
      <section className="border-y border-[hsl(var(--border-hsl))/0.4] bg-[hsl(var(--muted-hsl))/0.3] py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {guarantees.map((g) => (
              <div key={g.label} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[hsl(var(--primary-hsl))/0.25] bg-[hsl(var(--primary-hsl))/0.08]">
                  <g.icon
                    size={18}
                    className="text-[hsl(var(--primary-hsl))]"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <p className="text-sm font-heading font-semibold tracking-wide uppercase text-[hsl(var(--foreground-hsl))]">
                    {g.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[hsl(var(--muted-foreground-hsl))]">
                    {g.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-10 text-center text-xl font-heading font-semibold tracking-widest-marketing uppercase md:text-2xl">
              <span className="text-gold-gradient">Common Questions</span>
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "Do credits expire?",
                  a: "No. Credits never expire. Buy when you want and use them at your own pace — no monthly resets, no pressure.",
                },
                {
                  q: "Can I browse requests without spending credits?",
                  a: "Yes. You can see available service requests in your categories for free. Credits are only spent when you choose to unlock a specific lead.",
                },
                {
                  q: "What happens if I run out of credits?",
                  a: "Simply purchase another pack. Your account stays active and you can top up at any time.",
                },
                {
                  q: "Are refunds available?",
                  a: "Unused credits can be refunded within 14 days of purchase. Once a credit is used to unlock a lead, it cannot be refunded.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-sm border border-[hsl(var(--border-hsl))/0.5] bg-[hsl(var(--card-hsl))] p-6"
                >
                  <p className="text-sm font-heading font-semibold tracking-wide uppercase text-[hsl(var(--foreground-hsl))]">
                    {faq.q}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground-hsl))]">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-[hsl(var(--border-hsl))/0.5] bg-[hsl(var(--background-hsl))] py-20">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h2 className="text-2xl font-heading font-semibold tracking-widest-marketing uppercase md:text-3xl">
            <span className="text-gold-gradient">Ready to unlock leads?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-[hsl(var(--muted-foreground-hsl))]">
            Create an account, get verified, and choose the pack that fits your
            goals.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login?role=provider"
              className="inline-flex h-12 items-center gap-2 rounded-sm bg-gold-gradient px-8 text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--primary-foreground-hsl))] transition-all hover:shadow-lg hover:shadow-[hsl(42_60%_35%/0.3)]"
            >
              Join as a Provider <ArrowRight size={18} />
            </Link>
            <Link
              href="/for-providers"
              className="inline-flex h-12 items-center gap-2 rounded-sm border border-[hsl(var(--primary-hsl))] px-8 text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--primary-hsl))] transition-all hover:bg-[hsl(var(--primary-hsl))/0.08]"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
