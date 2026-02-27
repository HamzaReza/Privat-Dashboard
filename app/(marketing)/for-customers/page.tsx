import Link from "next/link";
import { SectionWrapper, SectionHeading, GoldDivider } from "@/components/marketing/SectionElements";
import { CheckCircle2, ArrowRight, FileText, MessageSquare, Clock } from "lucide-react";

const categories = [
  "Plumbing", "Electrical", "HVAC", "Painting", "Carpentry",
  "Cleaning", "Landscaping", "General Maintenance",
];

const steps = [
  { icon: FileText, title: "Describe your needs", desc: "Tell us what you need, add photos, and set your budget." },
  { icon: Clock, title: "Receive verified offers", desc: "Approved providers review and respond with competitive quotes." },
  { icon: MessageSquare, title: "Chat & compare", desc: "Message providers directly, ask questions, and review portfolios." },
  { icon: CheckCircle2, title: "Choose & confirm", desc: "Select the best offer and schedule at your convenience." },
];

const benefits = [
  "Only verified, admin-approved providers",
  "Transparent quotes with no hidden fees",
  "Real-time messaging and photo sharing",
  "Ratings and reviews for accountability",
  "Dedicated dispute resolution process",
];

export default function ForCustomers() {
  return (
    <>
      {/* Hero */}
      <section className="bg-subtle-texture py-24 lg:py-32">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h1 className="mx-auto max-w-2xl text-3xl font-heading font-semibold tracking-widest-marketing uppercase md:text-4xl lg:text-5xl">
            <span className="text-gold-gradient">Maintenance made effortless.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base text-[hsl(var(--muted-foreground-hsl))] lg:text-lg">
            Post a request, receive quotes from verified professionals, and choose with confidence.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-sm bg-gold-gradient px-8 text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--primary-foreground-hsl))] transition-all hover:shadow-lg"
          >
            Request a Service <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <SectionWrapper>
        <SectionHeading title="What You Can Request" subtitle="From routine upkeep to specialized tasks, PRIVAT covers it all." />
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((cat) => (
            <div
              key={cat}
              className="group relative flex items-center justify-center overflow-hidden rounded-sm border border-[hsl(var(--primary-hsl))/0.2] bg-[hsl(var(--muted-hsl))/0.3] px-5 py-5 text-center transition-all duration-300 hover:border-[hsl(var(--primary-hsl))/0.5] hover:bg-[hsl(var(--muted-hsl))/0.6] hover:shadow-[0_0_20px_-8px_hsl(var(--primary-hsl)/0.3)]"
            >
              <span className="text-sm font-heading font-medium tracking-wider uppercase text-[hsl(var(--foreground-hsl))/0.8] transition-colors group-hover:text-[hsl(var(--primary-hsl))]">
                {cat}
              </span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <GoldDivider />

      {/* Steps */}
      <SectionWrapper>
        <SectionHeading title="How It Works" subtitle="Four simple steps to quality maintenance." />
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
          {steps.map((step) => (
            <div key={step.title} className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-[hsl(var(--primary-hsl))/0.3] bg-[hsl(var(--muted-hsl))]">
                <step.icon size={22} className="text-[hsl(var(--primary-hsl))]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="mb-1 font-heading text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--foreground-hsl))]">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground-hsl))]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Benefits */}
      <SectionWrapper className="bg-[hsl(var(--muted-hsl))/0.3]">
        <SectionHeading title="What You'll Receive" subtitle="Transparency and quality at every step." />
        <ul className="mx-auto max-w-lg space-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm text-[hsl(var(--muted-foreground-hsl))]">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[hsl(var(--primary-hsl))]" />
              {b}
            </li>
          ))}
        </ul>
      </SectionWrapper>

      {/* CTA */}
      <section className="border-y border-[hsl(var(--border-hsl))/0.5] py-20">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h2 className="text-2xl font-heading font-semibold tracking-widest-marketing uppercase md:text-3xl">
            <span className="text-gold-gradient">Get started today.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[hsl(var(--muted-foreground-hsl))]">
            Your first request takes less than two minutes.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-sm bg-gold-gradient px-8 text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--primary-foreground-hsl))] transition-all hover:shadow-lg"
          >
            Request a Service <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
