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
              operated by <strong className={fg}>MIK INTELLIGENCE FZCO</strong> (&quot;we&quot;, &quot;us&quot;).
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
              All payments on Privat are processed by <strong className={fg}>Paddle.com</strong>, who acts as the{" "}
              <strong className={fg}>Merchant of Record</strong> for all transactions. This means Paddle is the seller of
              record and is responsible for processing payments, issuing receipts, and handling refund requests in
              accordance with their{" "}
              <a
                href="https://www.paddle.com/legal/checkout-buyer-terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[hsl(var(--primary-hsl))] hover:underline"
              >
                Checkout Buyer Terms
              </a>.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>2) Refund eligibility</h2>
            <p>
              If you are not satisfied with your purchase, you may request a refund. Refund requests are handled by
              Paddle in accordance with their standard refund policy and applicable consumer protection laws.
            </p>
            <p className="mt-2">
              To request a refund, you can:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>
                Contact us at{" "}
                <a href="mailto:mik.intelligence@gmail.com" className="text-[hsl(var(--primary-hsl))] hover:underline">
                  mik.intelligence@gmail.com
                </a>{" "}
                with your order details, and we will process your request promptly.
              </li>
              <li>
                Use the refund link in your Paddle receipt email to submit a request directly through Paddle&apos;s support portal.
              </li>
            </ul>
          </section>

          <section>
            <h2 className={h2Class}>3) Consumer rights</h2>
            <p>
              Nothing in this policy limits or excludes any rights you have under applicable mandatory consumer protection
              laws, including any statutory right to cancel or receive a refund.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>4) Contact</h2>
            <p>
              For any questions about a purchase or refund request, please contact us at{" "}
              <a href="mailto:mik.intelligence@gmail.com" className="text-[hsl(var(--primary-hsl))] hover:underline">
                mik.intelligence@gmail.com
              </a>.<br />
              <strong className={fg}>MIK INTELLIGENCE FZCO</strong> — Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates
            </p>
          </section>
        </div>
      </SectionWrapper>
    </>
  );
}
