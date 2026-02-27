import Link from "next/link";
import { SectionWrapper, SectionHeading, GoldDivider } from "@/components/marketing/SectionElements";
import { ShieldCheck, Target, TrendingUp, ArrowRight, Smartphone } from "lucide-react";

const benefits = [
  { icon: ShieldCheck, title: "Admin-Verified Listing", desc: "Stand out as a trusted professional. Every provider is manually reviewed and approved." },
  { icon: Smartphone, title: "Manage via App", desc: "Use the PRIVAT app on iOS or Android to receive leads, respond to requests, and grow your business." },
  { icon: Target, title: "High-Intent Leads", desc: "Every request is from someone ready to hire. No tyre-kickers or low-quality inquiries." },
  { icon: TrendingUp, title: "Grow on Your Terms", desc: "Target specific categories, areas, and budgets. Scale your pipeline at your pace." },
];

const howItWorks = [
  "Browse available service requests in your categories.",
  "Unlock full details and contact the customer directly.",
  "Send your best offer and win the job.",
  "Build your reputation with ratings and reviews.",
];

export default function ForProviders() {
  return (
    <>
      {/* Hero */}
      <section className="bg-subtle-texture py-24 lg:py-32">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h1 className="mx-auto max-w-2xl text-3xl font-heading font-semibold tracking-widest-marketing uppercase md:text-4xl lg:text-5xl">
            <span className="text-gold-gradient">Win premium jobs.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base text-[hsl(var(--muted-foreground-hsl))] lg:text-lg">
            Join a verified marketplace of high-intent clients. No monthly fees — pay only for leads you want.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-sm bg-gold-gradient px-8 text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--primary-foreground-hsl))] transition-all hover:shadow-lg"
          >
            Apply as a Provider <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <SectionWrapper>
        <SectionHeading title="Why Providers Choose PRIVAT" />
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-sm border border-[hsl(var(--border-hsl))/0.5] bg-[hsl(var(--card-hsl))] p-8 transition-all hover:border-[hsl(var(--primary-hsl))/0.3]">
              <b.icon size={28} className="mb-4 text-[hsl(var(--primary-hsl))]" strokeWidth={1.5} />
              <h3 className="mb-2 font-heading text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--foreground-hsl))]">{b.title}</h3>
              <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground-hsl))]">{b.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <GoldDivider />

      {/* How it works */}
      <SectionWrapper>
        <SectionHeading title="How It Works" subtitle="Simple, transparent, and fair." />
        <ol className="mx-auto max-w-lg space-y-4">
          {howItWorks.map((step, i) => (
            <li key={i} className="flex items-start gap-4 text-sm text-[hsl(var(--muted-foreground-hsl))]">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-[hsl(var(--primary-hsl))] font-heading text-xs font-semibold text-[hsl(var(--primary-foreground-hsl))]">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </SectionWrapper>

      {/* Quality Gate */}
      <SectionWrapper className="bg-[hsl(var(--muted-hsl))/0.3]">
        <div className="mx-auto max-w-2xl text-center">
          <ShieldCheck size={36} className="mx-auto mb-6 text-[hsl(var(--primary-hsl))]" strokeWidth={1.5} />
          <h2 className="text-2xl font-heading font-semibold tracking-widest-marketing uppercase md:text-3xl">
            <span className="text-gold-gradient">Quality Gate</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[hsl(var(--muted-foreground-hsl))]">
            Every provider application is reviewed by our team. We verify credentials, check references, and ensure only professionals who meet our standards are listed. This protects your reputation and the clients you serve.
          </p>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <section className="border-y border-[hsl(var(--border-hsl))/0.5] py-20">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h2 className="text-2xl font-heading font-semibold tracking-widest-marketing uppercase md:text-3xl">
            <span className="text-gold-gradient">Start winning jobs today.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[hsl(var(--muted-foreground-hsl))]">
            Submit your application and our team will review it within 48 hours.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-sm bg-gold-gradient px-8 text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--primary-foreground-hsl))] transition-all hover:shadow-lg"
          >
            Apply Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
