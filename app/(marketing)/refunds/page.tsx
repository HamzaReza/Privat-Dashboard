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
          <p className={`mt-4 text-sm ${muted}`}>Last updated: 11 March 2026</p>
        </div>
      </section>

      <SectionWrapper className="pt-10 pb-16 lg:pt-12 lg:pb-20">
        <div className={`mx-auto max-w-3xl space-y-8 text-sm leading-relaxed ${muted}`}>
          <section className="space-y-3">
            <p>
              This Refund Policy applies to purchases made on <strong className={fg}>Privat</strong> (standardprivat.com),
              operated by <strong className={fg}>MIK INTELLIGENCE FZCO</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
            </p>
            <p>
              <strong className={fg}>Legal address:</strong> Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates<br />
              <strong className={fg}>Support email:</strong>{" "}
              <a href="mailto:mik.intelligence@gmail.com" className="text-[hsl(var(--primary-hsl))] hover:underline">
                mik.intelligence@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className={h2Class}>1) Paddle as Merchant of Record</h2>
            <p>
              All payments on Privat are processed by <strong className={fg}>Paddle</strong>, which acts as the{" "}
              <strong className={fg}>Merchant of Record</strong> for all transactions. This means that customers purchase
              the relevant digital product or service from Paddle, and Paddle is responsible for payment processing,
              invoicing, receipts, and refunds.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>2) Refunds</h2>
            <p>Refunds are handled by Paddle in accordance with Paddle&apos;s applicable terms and policies.</p>
            <p>
              If technical problems prevent or unreasonably delay delivery of the purchased digital product or service,
              the customer&apos;s sole remedy will be either replacement of the product or service, or a refund of the price
              paid, as determined by Paddle.
            </p>
            <p>To request a refund or assistance with an order, customers may:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Contact us at <a href="mailto:mik.intelligence@gmail.com" className="text-[hsl(var(--primary-hsl))] hover:underline">mik.intelligence@gmail.com</a> with their order details; or</li>
              <li>Use the support or refund options provided in their Paddle receipt or invoice.</li>
            </ul>
          </section>

          <section>
            <h2 className={h2Class}>3) Digital Content and Right of Withdrawal</h2>
            <p>
              Where the purchased product or service is digital content that is made available immediately after
              purchase, by completing the purchase and accessing, downloading, or otherwise receiving that digital
              content, the customer consents to immediate performance and acknowledges that any applicable right of
              withdrawal is lost once the download or transmission has begun.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>4) Consumer Rights</h2>
            <p>
              Nothing in this Refund Policy limits or excludes any mandatory rights that customers may have under
              applicable consumer protection laws.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>5) Contact</h2>
            <p>For any questions about a purchase or refund request, please contact:</p>
            <p>
              <strong className={fg}>MIK INTELLIGENCE FZCO</strong>
              <br />
              Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates
              <br />
              <a href="mailto:mik.intelligence@gmail.com" className="text-[hsl(var(--primary-hsl))] hover:underline">
                mik.intelligence@gmail.com
              </a>
            </p>
          </section>
        </div>
      </SectionWrapper>
    </>
  );
}
