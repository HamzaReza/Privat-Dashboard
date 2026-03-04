import { SectionWrapper } from "@/components/marketing/SectionElements";

const fg = "text-[hsl(var(--foreground-hsl))]";
const muted = "text-[hsl(var(--muted-foreground-hsl))]";
const h2Class = `mb-3 font-heading text-sm font-semibold tracking-widest-marketing uppercase ${fg}`;

export default function RefundPolicy() {
  return (
    <>
      <section className="bg-subtle-texture py-20 lg:py-24">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h1 className="text-3xl font-heading font-semibold tracking-widest-marketing uppercase md:text-4xl">
            <span className="text-gold-gradient">Refund Policy</span>
          </h1>
          <p className={`mt-4 text-sm ${muted}`}>Last updated: 26 February 2026</p>
        </div>
      </section>

      <SectionWrapper className="pt-10 pb-16 lg:pt-12 lg:pb-20">
        <div className={`mx-auto max-w-3xl space-y-8 text-sm leading-relaxed ${muted}`}>
          <section className="space-y-3">
            <p>
              This Refund Policy explains how refunds and credits adjustments work on <strong className={fg}>Privat</strong> (the &quot;Platform&quot;),
              including standardprivat.com and any related apps and services.
            </p>
            <p>
              <strong className={fg}>Operator / Platform Provider:</strong> MIK INTELLIGENCE FZCO (&quot;we&quot;, &quot;us&quot;)<br />
              <strong className={fg}>Legal address:</strong> Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates<br />
              <strong className={fg}>Support email:</strong>{" "}
              <a href="mailto:mik.intelligence@gmail.com" className="text-[hsl(var(--primary-hsl))] hover:underline">
                mik.intelligence@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className={h2Class}>1) Important: Who pays on Privat</h2>
            <p>Privat is a marketplace that connects Customers with independent service Providers.</p>
            <ul className="mt-2 list-disc pl-6">
              <li>
                <strong className={fg}>Customers</strong> generally are <strong className={fg}>not charged</strong> for submitting service
                requests (&quot;Leads&quot;), unless expressly stated on the Platform.
              </li>
              <li>
                <strong className={fg}>Only Providers</strong> may purchase <strong className={fg}>Credits</strong> (provider-only digital
                units) to unlock Leads and access provider features.
              </li>
            </ul>
            <p className="mt-2">Accordingly, this Refund Policy primarily applies to <strong className={fg}>Provider Credit purchases</strong>.</p>
          </section>

          <section>
            <h2 className={h2Class}>2) Merchant of Record (Paddle) and how refunds are processed</h2>
            <p>
              Where available, Provider Credit purchases are processed by <strong className={fg}>Paddle</strong> acting as{" "}
              <strong className={fg}>Merchant of Record (&quot;MoR&quot;)</strong>. This means:
            </p>
            <ul className="mt-2 list-disc pl-6">
              <li>Paddle handles payment processing and receipts/invoices; and</li>
              <li>
                when a refund is approved, it is generally <strong className={fg}>issued via Paddle</strong> and returned to the original
                payment method (processing times depend on the payment method and banking networks).
              </li>
            </ul>
          </section>

          <section>
            <h2 className={h2Class}>3) General rule: Digital credits, immediate availability</h2>
            <p>
              Credits are delivered digitally and may become available immediately after successful payment. Because Credits can be used right
              away to unlock Leads, refunds are <strong className={fg}>limited once Credits are used</strong>.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>4) Refund eligibility for Credit purchases (Providers)</h2>
            <p>A refund request may be considered if <strong className={fg}>all</strong> of the following conditions are met:</p>
            <ol className="mt-2 list-decimal pl-6 space-y-1">
              <li>The request is submitted within <strong className={fg}>14 days</strong> of the purchase date; and</li>
              <li><strong className={fg}>No Credits have been used</strong>; and</li>
              <li>There is no evidence of fraud, abuse, excessive disputes, or chargeback misuse.</li>
            </ol>
            <p className="mt-3">
              If Credits were partially used, refunds are generally <strong className={fg}>not available</strong>. In limited cases we may
              offer a discretionary <strong className={fg}>Credits adjustment</strong> (see Section 5) rather than a monetary refund.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>5) Lead Unlock adjustments (Credits credited back)</h2>
            <p>
              In limited situations, we may—at our discretion—credit back Credits for a specific Unlock if the issue is caused by the Platform
              (not by marketplace dynamics), for example:
            </p>
            <ul className="mt-2 list-disc pl-6">
              <li><strong className={fg}>Duplicate Leads</strong> caused by a Platform error;</li>
              <li><strong className={fg}>Technical fault</strong> that prevents access to the Lead after Unlock (reported promptly);</li>
              <li><strong className={fg}>Materially invalid contact data</strong> due to a Platform issue (not merely customer non-response).</li>
            </ul>
            <p className="mt-3">We do <strong className={fg}>not</strong> typically refund or credit back for:</p>
            <ul className="mt-2 list-disc pl-6">
              <li>the Customer not responding, canceling, changing their mind, or choosing another Provider;</li>
              <li>disputes about pricing, scope, or service outcomes;</li>
              <li>normal marketplace competition or low conversion results.</li>
            </ul>
          </section>

          <section>
            <h2 className={h2Class}>6) How to request a refund or adjustment</h2>
            <p>You can request a refund/adjustment in either of these ways:</p>

            <p className={`mt-4 font-semibold ${fg}`}>A) Contact us (recommended first)</p>
            <p className="mt-1">
              Email <a href="mailto:mik.intelligence@gmail.com" className="text-[hsl(var(--primary-hsl))] hover:underline">mik.intelligence@gmail.com</a> with:
            </p>
            <ul className="mt-2 list-disc pl-6">
              <li>your account email,</li>
              <li>your order reference/receipt (from Paddle if applicable),</li>
              <li>date of purchase,</li>
              <li>the reason for the request,</li>
              <li>if relevant, the Lead ID(s) and a brief description.</li>
            </ul>

            <p className={`mt-4 font-semibold ${fg}`}>B) Paddle Order Support (for purchases processed by Paddle)</p>
            <p className="mt-1">
              If your purchase was processed by Paddle as MoR, you can also request help and refunds via Paddle&apos;s Order Support, using the
              support/refund link in your receipt email or via Paddle&apos;s support portal.
            </p>
            <p className="mt-2">
              We may request additional information to investigate and may need to verify identity/account ownership.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>7) Chargebacks and payment disputes</h2>
            <p>
              If you believe there is a billing issue, please contact Support first. Unjustified chargebacks or refund abuse may result in
              account limitations, suspension, or termination, as permitted by law and our Terms.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>8) Exceptions: Fraud, abuse, and enforcement</h2>
            <p>We may refuse refunds or adjustments if we reasonably believe there is:</p>
            <ul className="mt-2 list-disc pl-6">
              <li>fraudulent activity,</li>
              <li>abuse of the refund process,</li>
              <li>violation of our Terms/Policies,</li>
              <li>repeated excessive disputes suggesting misuse.</li>
            </ul>
          </section>

          <section>
            <h2 className={h2Class}>9) Mandatory legal rights</h2>
            <p>
              Nothing in this Refund Policy limits rights that cannot be waived under applicable mandatory laws.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>10) Changes to this Policy</h2>
            <p>
              We may update this Refund Policy from time to time. The &quot;Last updated&quot; date reflects the effective date.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>11) Contact</h2>
            <p>
              For refunds and billing questions:<br />
              <a href="mailto:mik.intelligence@gmail.com" className="text-[hsl(var(--primary-hsl))] hover:underline">
                mik.intelligence@gmail.com
              </a>
            </p>
            <p className="mt-2">
              <strong className={fg}>MIK INTELLIGENCE FZCO</strong> — Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates
            </p>
          </section>
        </div>
      </SectionWrapper>
    </>
  );
}
