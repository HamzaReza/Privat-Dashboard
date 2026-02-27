import { SectionWrapper } from "@/components/marketing/SectionElements";

const fg = "text-[hsl(var(--foreground-hsl))]";
const muted = "text-[hsl(var(--muted-foreground-hsl))]";
const h2Class = `mb-3 font-heading text-sm font-semibold tracking-widest-marketing uppercase ${fg}`;
const h3Class = `mt-4 font-heading text-xs font-semibold uppercase tracking-widest-marketing ${fg}`;

export default function Cookies() {
  return (
    <>
      <section className="bg-subtle-texture py-20 lg:py-24">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h1 className="text-3xl font-heading font-semibold tracking-widest-marketing uppercase md:text-4xl">
            <span className="text-gold-gradient">Cookie Policy</span>
          </h1>
          <p className={`mt-4 text-sm ${muted}`}>Last updated: 26 February 2026</p>
        </div>
      </section>
      <SectionWrapper className="pt-10 pb-16 lg:pt-12 lg:pb-20">
        <div className={`mx-auto max-w-3xl space-y-8 text-sm leading-relaxed ${muted}`}>
          <section>
            <p>
              This Cookie Policy explains how <strong className={fg}>Privat</strong> (&quot;we&quot;, &quot;us&quot;) uses cookies and similar technologies on{" "}
              <strong className={fg}>standardprivat.com</strong> and related pages (the &quot;Website&quot;). This Policy should be read together with our{" "}
              <strong className={fg}>Privacy Policy</strong>.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>1) What are cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. We also use similar technologies such as pixels, SDKs, and local storage (together, &quot;cookies&quot;) to operate and improve the Website.</p>
          </section>

          <section>
            <h2 className={h2Class}>2) Types of cookies we use</h2>
            <p>We use the following categories (depending on your settings and local law requirements):</p>

            <h3 className={h3Class}>A) Strictly Necessary Cookies</h3>
            <p>These cookies are required for the Website to function and cannot be switched off in our systems. They are generally set in response to actions you take (e.g., logging in, security settings, session management).</p>
            <p className="mt-1"><strong className={fg}>Legal basis (where applicable):</strong> legitimate interests / necessary to provide the service.</p>

            <h3 className={h3Class}>B) Analytics / Performance Cookies</h3>
            <p>These help us understand how visitors use the Website (e.g., pages visited, time on site, errors) so we can improve performance and user experience.</p>
            <p className="mt-1"><strong className={fg}>Legal basis (where applicable):</strong> consent (in the EEA/UK) or legitimate interests where permitted.</p>

            <h3 className={h3Class}>C) Functional Cookies</h3>
            <p>These remember choices you make (e.g., language, region) to provide enhanced and more personalized features.</p>
            <p className="mt-1"><strong className={fg}>Legal basis (where applicable):</strong> consent (in the EEA/UK) or legitimate interests where permitted.</p>

            <h3 className={h3Class}>D) Marketing Cookies (if enabled)</h3>
            <p>These may be used to measure advertising effectiveness or deliver relevant ads. <strong className={fg}>We only use marketing cookies if enabled and where permitted by law.</strong></p>
            <p className="mt-1"><strong className={fg}>Legal basis (where applicable):</strong> consent.</p>

            <p className={`mt-3 text-xs italic ${muted}`}>
              Note: If the Platform uses third-party services (e.g., analytics providers, payment-related tools, customer support tools), those providers may set their own cookies or identifiers.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>3) How we use cookies</h2>
            <p>We use cookies to:</p>
            <ul className="list-disc pl-6">
              <li>operate core Website functionality (security, session, load balancing),</li>
              <li>prevent fraud and abuse,</li>
              <li>remember preferences,</li>
              <li>measure Website performance and improve our Services,</li>
              <li>(if enabled) support marketing measurement.</li>
            </ul>
          </section>

          <section>
            <h2 className={h2Class}>4) Managing your cookie preferences</h2>
            <h3 className={h3Class}>A) Cookie banner / consent tool (EEA/UK and where required)</h3>
            <p>Where required by law, we show a cookie banner that lets you accept or reject non-essential cookies. You can update preferences at any time via the cookie settings link (if available on the Website).</p>
            <h3 className={h3Class}>B) Browser controls</h3>
            <p>You can also control cookies via your browser settings (block, delete, or restrict cookies). Note that blocking strictly necessary cookies may impact Website functionality.</p>
            <p className="mt-1">
              Common browser help pages:<br />
              - Chrome: cookie settings in Privacy &amp; Security<br />
              - Safari: Privacy settings<br />
              - Firefox: Privacy &amp; Security settings<br />
              - Edge: Cookies and site permissions
            </p>
          </section>

          <section>
            <h2 className={h2Class}>5) Third-party cookies</h2>
            <p>Some cookies may be placed by third parties we use to operate the Website (e.g., analytics, support widgets). We do not control third-party cookies and their use is governed by the third party&apos;s privacy/cookie policies.</p>
          </section>

          <section>
            <h2 className={h2Class}>6) Cookie retention</h2>
            <p>Cookie retention depends on the type:</p>
            <ul className="list-disc pl-6">
              <li><strong className={fg}>Session cookies</strong> expire when you close your browser.</li>
              <li><strong className={fg}>Persistent cookies</strong> remain until they expire or you delete them.</li>
            </ul>
            <p className="mt-2">Where possible, we limit retention to what is necessary for the purpose.</p>
          </section>

          <section>
            <h2 className={h2Class}>7) Updates to this Cookie Policy</h2>
            <p>We may update this Policy from time to time. The &quot;Last updated&quot; date reflects the effective date.</p>
          </section>

          <section>
            <h2 className={h2Class}>8) Contact</h2>
            <p>
              If you have questions about this Cookie Policy, contact:<br />
              <strong className={fg}>mik.intelligence@gmail.com</strong>
            </p>
            <p><strong className={fg}>MIK INTELLIGENCE FZCO</strong> — Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates</p>
          </section>
        </div>
      </SectionWrapper>
    </>
  );
}
