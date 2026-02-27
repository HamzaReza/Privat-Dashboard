"use client";

import { useState } from "react";
import { SectionWrapper } from "@/components/marketing/SectionElements";
import { Send, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = "w-full rounded-sm border border-[hsl(var(--border-hsl))] bg-[hsl(var(--muted-hsl))] px-4 py-2.5 text-sm text-[hsl(var(--foreground-hsl))] placeholder:text-[hsl(var(--muted-foreground-hsl))] focus:border-[hsl(var(--primary-hsl))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary-hsl))]";

  return (
    <>
      <section className="bg-subtle-texture py-24 lg:py-32">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h1 className="text-3xl font-heading font-semibold tracking-widest-marketing uppercase md:text-4xl lg:text-5xl">
            <span className="text-gold-gradient">Contact Us</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base text-[hsl(var(--muted-foreground-hsl))]">
            Have a question or partnership enquiry? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <SectionWrapper>
        <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-5">
          {/* Info */}
          <div className="space-y-8 md:col-span-2">
            <div>
              <h3 className="mb-2 font-heading text-xs font-semibold tracking-widest-marketing uppercase text-[hsl(var(--foreground-hsl))]">Email</h3>
              <a href="mailto:mik.intelligence@gmail.com" className="text-sm text-[hsl(var(--primary-hsl))] hover:underline">mik.intelligence@gmail.com</a>
            </div>
            <div>
              <h3 className="mb-2 font-heading text-xs font-semibold tracking-widest-marketing uppercase text-[hsl(var(--foreground-hsl))]">Location</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground-hsl))]">Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates</p>
            </div>
            <div>
              <h3 className="mb-2 font-heading text-xs font-semibold tracking-widest-marketing uppercase text-[hsl(var(--foreground-hsl))]">Business Hours</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground-hsl))]">Sunday – Thursday, 9 AM – 6 PM GST</p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="rounded-sm border border-[hsl(var(--primary-hsl))/0.3] bg-[hsl(var(--card-hsl))] p-10 text-center">
                <CheckCircle2 size={36} className="mx-auto mb-4 text-[hsl(var(--primary-hsl))]" />
                <h3 className="font-heading text-lg font-semibold tracking-widest-marketing uppercase text-[hsl(var(--foreground-hsl))]">Message Sent</h3>
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground-hsl))]">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium tracking-wide text-[hsl(var(--foreground-hsl))]">Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium tracking-wide text-[hsl(var(--foreground-hsl))]">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium tracking-wide text-[hsl(var(--foreground-hsl))]">Subject</label>
                  <input
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={inputClass}
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium tracking-wide text-[hsl(var(--foreground-hsl))]">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={inputClass}
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-sm bg-gold-gradient px-6 text-sm font-semibold tracking-widest-marketing uppercase text-[hsl(var(--primary-foreground-hsl))] transition-all hover:shadow-lg"
                >
                  Send Message <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
