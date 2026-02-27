import { SectionWrapper, SectionHeading } from "@/components/marketing/SectionElements";

const faqs = [
  { category: "General", items: [
    { q: "What is PRIVAT?", a: "PRIVAT is a premium marketplace connecting people who need maintenance services with verified, professional service providers. We focus on quality, trust, and efficiency." },
    { q: "Is PRIVAT available in my area?", a: "PRIVAT is currently expanding. We're actively onboarding providers across the UAE. Check back soon or register to be notified when we launch in your area." },
    { q: "Is PRIVAT free for customers?", a: "Yes. Posting a service request is completely free. You'll receive offers from verified providers and choose the one that works best for you." },
  ]},
  { category: "For Customers", items: [
    { q: "How do I request a service?", a: "Click 'Request a Service', fill out a brief form describing what you need, and submit. Verified providers in your area will review your request and send quotes." },
    { q: "How are providers verified?", a: "Every provider undergoes a manual review by our team. We check credentials, experience, and references before approving any listing." },
    { q: "Can I choose my provider?", a: "Absolutely. You'll receive multiple offers and can compare ratings, pricing, and timelines before making a decision." },
  ]},
  { category: "For Providers", items: [
    { q: "How do I join as a provider?", a: "Submit an application through our 'Join as a Provider' form. Our team will review your credentials and notify you within 48 hours." },
    { q: "What are credits?", a: "Credits are the currency used to unlock service requests. One credit lets you view full details and contact information for a lead." },
    { q: "Do I need a subscription?", a: "No. PRIVAT operates on a pay-per-lead model. Purchase credit packs when you need them — no recurring charges." },
    { q: "Can I target specific categories or areas?", a: "Yes. You can filter available leads by service category and location to focus on the jobs that matter most to your business." },
  ]},
  { category: "Payments & Billing", items: [
    { q: "What payment methods are accepted?", a: "We accept major credit and debit cards, as well as bank transfers for larger credit pack purchases." },
    { q: "Are credits refundable?", a: "Credits used on valid leads are non-refundable. If you believe a lead was invalid, submit a dispute within 48 hours and our team will review it." },
  ]},
];

export default function FAQ() {
  return (
    <>
      <section className="bg-subtle-texture py-24 lg:py-32">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h1 className="text-3xl font-heading font-semibold tracking-widest-marketing uppercase md:text-4xl lg:text-5xl">
            <span className="text-gold-gradient">Frequently Asked Questions</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base text-[hsl(var(--muted-foreground-hsl))]">
            Everything you need to know about PRIVAT.
          </p>
        </div>
      </section>

      {faqs.map((group, idx) => (
        <SectionWrapper key={group.category} className={idx % 2 !== 0 ? "bg-[hsl(var(--muted-hsl))/0.3]" : ""}>
          <SectionHeading title={group.category} />
          <div className="mx-auto max-w-2xl space-y-8">
            {group.items.map((faq) => (
              <div key={faq.q} itemScope itemType="https://schema.org/Question">
                <h3 className="mb-2 font-heading text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--foreground-hsl))]" itemProp="name">{faq.q}</h3>
                <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground-hsl))]" itemProp="text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      ))}
    </>
  );
}
