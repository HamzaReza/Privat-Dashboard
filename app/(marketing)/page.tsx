"use client";

import Link from "next/link";
import { SectionWrapper, SectionHeading, GoldDivider } from "@/components/marketing/SectionElements";
import { Shield, Zap, Bell, Star, Lock, ArrowRight, Quote, Smartphone } from "lucide-react";
import { useState } from "react";

/* ─── Hero ─── */
const Hero = () => (
  <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-subtle-texture">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_-10%,hsl(42_70%_50%/0.08),transparent)]" />
    <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
      <h1 className="mx-auto max-w-3xl text-3xl font-heading font-semibold leading-tight tracking-widest-marketing uppercase slide-up md:text-5xl lg:text-6xl">
        Premium maintenance,{" "}
        <span className="text-gold-gradient">on demand.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[hsl(var(--muted-foreground-hsl))] fade-in lg:text-lg" style={{ animationDelay: "0.3s" }}>
        Request a service in minutes. Verified providers. Fast quotes. Full control.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 fade-in sm:flex-row" style={{ animationDelay: "0.5s" }}>
        <Link
          href="/login"
          className="inline-flex h-12 items-center gap-2 rounded-sm bg-gold-gradient px-8 text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--primary-foreground-hsl))] transition-all hover:shadow-lg hover:shadow-[hsl(42,60%,35%)/0.3]"
        >
          Request a Service
        </Link>
        <Link
          href="/login"
          className="inline-flex h-12 items-center gap-2 rounded-sm border border-[hsl(var(--primary-hsl))] px-8 text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--primary-hsl))] transition-all hover:bg-[hsl(var(--primary-hsl))/0.1]"
        >
          Join as a Provider
        </Link>
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-4 fade-in" style={{ animationDelay: "0.7s" }}>
        {["Verified providers", "Credit-based access", "Secure messaging"].map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-2 rounded-sm border border-[hsl(var(--border-hsl))] bg-[hsl(var(--muted-hsl))/0.5] px-4 py-2 text-xs tracking-wide text-[hsl(var(--muted-foreground-hsl))]"
          >
            <Shield size={14} className="text-[hsl(var(--primary-hsl))]" />
            {chip}
          </span>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Platform Description ─── */
const PlatformIntro = () => (
  <SectionWrapper className="border-y border-[hsl(var(--border-hsl))/0.4] bg-[hsl(var(--background-hsl))]">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-heading tracking-ultra uppercase text-[hsl(var(--muted-foreground-hsl))]">
        Platform overview
      </p>
      <h2 className="mt-3 text-2xl font-heading font-semibold tracking-widest-marketing text-[hsl(var(--foreground-hsl))] md:text-3xl lg:text-4xl">
        What is <span className="text-gold-gradient">Privat</span>
      </h2>
      <GoldDivider className="mt-6" />
      <div className="mt-8 mx-auto max-w-2xl space-y-4 text-center text-sm leading-relaxed text-[hsl(var(--muted-foreground-hsl))] lg:text-base">
        <p className="text-base leading-relaxed text-[hsl(var(--foreground-hsl))/0.9] lg:text-lg">
          Privat is a premium maintenance marketplace that quietly connects people and properties with trusted maintenance professionals.
        </p>
        <p>
          In just a few minutes, customers can submit a request and receive tailored offers from vetted providers. On the other side,
          professionals unlock only the leads they want through a clear, credit-based model — no subscriptions, no guesswork.
        </p>
        <p>
          The result is a calm, highly curated environment built on discretion, quality, and accountability, where every interaction is
          designed to feel considered rather than noisy.
        </p>
      </div>
    </div>
  </SectionWrapper>
);

/* ─── How It Works ─── */
const HowItWorks = () => {
  const [tab, setTab] = useState<"customers" | "providers">("customers");
  const steps = {
    customers: [
      { num: "01", title: "Post your request", desc: "Describe what you need, add photos, and set your preferences." },
      { num: "02", title: "Receive offers", desc: "Verified providers review your request and send competitive quotes." },
      { num: "03", title: "Choose & proceed", desc: "Compare offers, check ratings, and select the best provider." },
    ],
    providers: [
      { num: "01", title: "Apply & get verified", desc: "Submit your credentials. Our team reviews every application." },
      { num: "02", title: "Buy credits", desc: "Purchase credit packs to access high-intent service requests." },
      { num: "03", title: "Unlock leads & win jobs", desc: "Use credits to unlock full details and contact the customer directly." },
    ],
  };

  return (
    <SectionWrapper>
      <SectionHeading title="How It Works" subtitle="A streamlined experience for both sides of the marketplace." />
      <div className="mx-auto mb-10 flex max-w-xs overflow-hidden rounded-sm border border-[hsl(var(--border-hsl))]">
        {(["customers", "providers"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-medium tracking-widest-marketing uppercase transition-all ${
              tab === t
                ? "bg-[hsl(var(--primary-hsl))] text-[hsl(var(--primary-foreground-hsl))]"
                : "text-[hsl(var(--muted-foreground-hsl))] hover:text-[hsl(var(--foreground-hsl))]"
            }`}
          >
            {t === "customers" ? "Customers" : "Providers"}
          </button>
        ))}
      </div>
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
        {steps[tab].map((step, i) => (
          <div key={step.num} className="group text-center slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
            <span className="mb-3 inline-block font-heading text-3xl font-semibold text-gold-gradient">{step.num}</span>
            <h3 className="mb-2 font-heading text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--foreground-hsl))]">{step.title}</h3>
            <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground-hsl))]">{step.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

/* ─── Why PRIVAT ─── */
const whyCards = [
  { icon: Shield, title: "Verified Network", desc: "Every provider is vetted and admin-approved before joining the platform." },
  { icon: Zap, title: "High-Intent Requests", desc: "Providers only see genuine requests from people ready to hire." },
  { icon: Smartphone, title: "Available on Mobile", desc: "Download the app on iOS and Android. Manage everything from your phone." },
  { icon: Bell, title: "Fast Matching", desc: "Instant notifications. Respond first, win more jobs." },
  { icon: Star, title: "Quality & Accountability", desc: "Ratings, reviews, and a transparent feedback system." },
];

const WhyPrivat = () => (
  <SectionWrapper className="bg-[hsl(var(--muted-hsl))/0.3]">
    <SectionHeading title="Why PRIVAT" subtitle="A marketplace built on trust, efficiency, and mutual respect." />
    <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {whyCards.map((card) => (
        <div
          key={card.title}
          className="group rounded-sm border border-[hsl(var(--border-hsl))/0.5] bg-[hsl(var(--card-hsl))] p-8 transition-all duration-300 hover:border-[hsl(var(--primary-hsl))/0.3] hover:shadow-lg hover:shadow-[hsl(var(--gold-dark))/0.05]"
        >
          <card.icon size={28} className="mb-4 text-[hsl(var(--primary-hsl))]" strokeWidth={1.5} />
          <h3 className="mb-2 font-heading text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--foreground-hsl))]">{card.title}</h3>
          <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground-hsl))]">{card.desc}</p>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

/* ─── Discretion ─── */
const Discretion = () => (
  <SectionWrapper>
    <div className="mx-auto max-w-3xl text-center">
      <Lock size={36} className="mx-auto mb-6 text-[hsl(var(--primary-hsl))]" strokeWidth={1.5} />
      <h2 className="text-2xl font-heading font-semibold tracking-widest-marketing uppercase md:text-3xl">
        <span className="text-gold-gradient">Built for Discretion</span>
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[hsl(var(--muted-foreground-hsl))]">
        Your requests remain private until you choose to share them. Providers are verified, communication is secure, and your data stays protected. PRIVAT operates with the same confidentiality standards you&apos;d expect from a premium service.
      </p>
      <GoldDivider className="mt-10" />
    </div>
  </SectionWrapper>
);

/* ─── Download App ─── */
const DownloadApp = () => (
  <SectionWrapper className="bg-[hsl(var(--muted-hsl))/0.3]">
    <div className="mx-auto max-w-3xl text-center">
      <Smartphone size={36} className="mx-auto mb-6 text-[hsl(var(--primary-hsl))]" strokeWidth={1.5} />
      <h2 className="text-2xl font-heading font-semibold tracking-widest-marketing uppercase md:text-3xl">
        <span className="text-gold-gradient">Available on iOS & Android</span>
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[hsl(var(--muted-foreground-hsl))]">
        Download the PRIVAT app to request services, manage your bookings, and communicate with providers — all from your pocket.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
        <a href="#" className="transition-opacity hover:opacity-80">
          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="Download on the App Store"
            className="h-12"
          />
        </a>
        <a href="#" className="transition-opacity hover:opacity-80">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            alt="Get it on Google Play"
            className="h-12"
          />
        </a>
      </div>
    </div>
  </SectionWrapper>
);

/* ─── Testimonials ─── */
const testimonials = [
  { name: "Rami K.", role: "Property Manager", quote: "PRIVAT cut my vendor sourcing time in half. The quality of providers here is genuinely impressive." },
  { name: "Sarah L.", role: "Interior Designer", quote: "I love having a single platform where I can find verified tradespeople for my clients. Clean, professional, efficient." },
  { name: "Ahmed R.", role: "HVAC Provider", quote: "The credit model is fair. I only pay for leads I actually want to pursue. No wasted subscriptions." },
];

const Testimonials = () => (
  <SectionWrapper>
    <SectionHeading title="What People Say" />
    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
      {testimonials.map((t) => (
        <div key={t.name} className="rounded-sm border border-[hsl(var(--border-hsl))/0.5] bg-[hsl(var(--card-hsl))] p-8">
          <Quote size={20} className="mb-4 text-[hsl(var(--primary-hsl))]" strokeWidth={1.5} />
          <p className="mb-6 text-sm italic leading-relaxed text-[hsl(var(--muted-foreground-hsl))]">&ldquo;{t.quote}&rdquo;</p>
          <div>
            <p className="text-sm font-medium text-[hsl(var(--foreground-hsl))]">{t.name}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground-hsl))]">{t.role}</p>
          </div>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

/* ─── Final CTA ─── */
const FinalCTA = () => (
  <section className="border-y border-[hsl(var(--border-hsl))/0.5] bg-[hsl(var(--background-hsl))]">
    <div className="container mx-auto px-4 py-20 text-center lg:px-8">
      <h2 className="text-2xl font-heading font-semibold tracking-widest-marketing uppercase md:text-3xl">
        <span className="text-gold-gradient">Ready to get started?</span>
      </h2>
      <p className="mx-auto mt-4 max-w-md text-base text-[hsl(var(--muted-foreground-hsl))]">
        Whether you need a service or want to grow your business, PRIVAT is built for you.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/login"
          className="inline-flex h-12 items-center gap-2 rounded-sm bg-gold-gradient px-8 text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--primary-foreground-hsl))] transition-all hover:shadow-lg"
        >
          Request a Service <ArrowRight size={18} />
        </Link>
        <Link
          href="/login"
          className="inline-flex h-12 items-center gap-2 rounded-sm border border-[hsl(var(--primary-hsl))] px-8 text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--primary-hsl))] transition-all hover:bg-[hsl(var(--primary-hsl))/0.1]"
        >
          Join as a Provider
        </Link>
      </div>
    </div>
  </section>
);

/* ─── Page ─── */
export default function HomePage() {
  return (
    <>
      <Hero />
      <PlatformIntro />
      <HowItWorks />
      <WhyPrivat />
      <Discretion />
      <DownloadApp />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
