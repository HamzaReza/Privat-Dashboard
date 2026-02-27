import { SectionWrapper } from "@/components/marketing/SectionElements";

const fg = "text-[hsl(var(--foreground-hsl))]";
const muted = "text-[hsl(var(--muted-foreground-hsl))]";
const h2Class = `mb-3 font-heading text-sm font-semibold tracking-widest-marketing uppercase ${fg}`;
const h3Class = `mt-4 font-heading text-xs font-semibold uppercase tracking-widest-marketing ${fg}`;

export default function Privacy() {
  return (
    <>
      <section className="bg-subtle-texture py-20 lg:py-24">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h1 className="text-3xl font-heading font-semibold tracking-widest-marketing uppercase md:text-4xl">
            <span className="text-gold-gradient">Privacy Policy</span>
          </h1>
          <p className={`mt-4 text-sm ${muted}`}>Last updated: 26 February 2026</p>
        </div>
      </section>
      <SectionWrapper className="pt-10 pb-16 lg:pt-12 lg:pb-20">
        <div className={`mx-auto max-w-3xl space-y-8 text-sm leading-relaxed ${muted}`}>
          <section className="space-y-3">
            <p>
              This Privacy Policy explains how we collect, use, disclose, and protect personal data when you use Privat (the &quot;Platform&quot;),
              including the website standardprivat.com and any related apps, dashboards, and services (collectively, the &quot;Services&quot;).
            </p>
            <p>
              <strong className={fg}>Data Controller:</strong> MIK INTELLIGENCE FZCO (&quot;we&quot;, &quot;us&quot;)<br />
              <strong className={fg}>Legal address:</strong> Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates<br />
              <strong className={fg}>Privacy contact:</strong> <a href="mailto:mik.intelligence@gmail.com" className="text-[hsl(var(--primary-hsl))] hover:underline">mik.intelligence@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className={h2Class}>1) Scope</h2>
            <p>This Policy applies to:</p>
            <ul className="list-disc pl-6">
              <li>visitors to our website(s),</li>
              <li>Customers submitting service requests (Leads),</li>
              <li>Providers using the Platform (including purchasing and using Credits),</li>
              <li>communications with Support and operational messages.</li>
            </ul>
          </section>

          <section>
            <h2 className={h2Class}>2) Data We Collect</h2>
            <h3 className={h3Class}>A) Data you provide</h3>
            <p className={`mt-2 font-semibold ${fg}`}>Customers</p>
            <ul className="list-disc pl-6">
              <li>name (if provided), phone number, email address,</li>
              <li>address/location for the job,</li>
              <li>request details (category, description, photos, preferred timing).</li>
            </ul>
            <p className={`mt-3 font-semibold ${fg}`}>Providers</p>
            <ul className="list-disc pl-6">
              <li>name, email, phone number,</li>
              <li>business name and profile information,</li>
              <li>service categories, service areas, pricing information (if any),</li>
              <li>verification information you submit (where applicable).</li>
            </ul>
            <p className={`mt-3 font-semibold ${fg}`}>Support</p>
            <ul className="list-disc pl-6">
              <li>messages you send to Support and any attachments.</li>
            </ul>
            <h3 className={h3Class}>B) Data collected automatically</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>device and browser information, IP address, logs,</li>
              <li>usage data (pages viewed, actions, timestamps),</li>
              <li>approximate location derived from IP (non-precise).</li>
            </ul>
            <h3 className={h3Class}>C) Payment-related data</h3>
            <p className="mt-2">
              We do not store full payment card details. Payments for Provider Credit purchases may be processed by Paddle as Merchant of
              Record and its payment partners. We may receive transaction references such as:
            </p>
            <ul className="list-disc pl-6">
              <li>order IDs, timestamps,</li>
              <li>product purchased, amount, currency,</li>
              <li>payment status (successful/refunded/charged back).</li>
            </ul>
          </section>

          <section>
            <h2 className={h2Class}>3) How We Use Personal Data (Purposes)</h2>
            <p>We use personal data to:</p>
            <ol className="list-decimal pl-6">
              <li>Provide and operate the Platform, including creating accounts and enabling Leads and communications.</li>
              <li>Enable Providers to respond to Customers and perform services.</li>
              <li>Process Provider purchases (Credits) and maintain transaction records.</li>
              <li>Provide customer support and resolve disputes.</li>
              <li>Protect the Platform (security, fraud prevention, abuse detection).</li>
              <li>Improve the Platform (analytics, troubleshooting, performance).</li>
              <li>Comply with legal obligations and enforce our Terms/Policies.</li>
            </ol>
          </section>

          <section>
            <h2 className={h2Class}>4) Legal Bases (where applicable)</h2>
            <p>Depending on the applicable law in your location, we rely on one or more of:</p>
            <ul className="list-disc pl-6">
              <li><strong className={fg}>Contract / performance of a contract</strong> (providing the Platform features you request),</li>
              <li><strong className={fg}>Legitimate interests</strong> (security, fraud prevention, platform improvement),</li>
              <li><strong className={fg}>Consent</strong> (where required for certain cookies/marketing),</li>
              <li><strong className={fg}>Legal obligation</strong> (compliance, tax/accounting, lawful requests).</li>
            </ul>
          </section>

          <section>
            <h2 className={h2Class}>5) Sharing and Disclosure</h2>
            <p>We may share data with:</p>
            <ol className="list-decimal pl-6">
              <li><strong className={fg}>Other users</strong> – When a Provider unlocks a Lead, the Provider may receive Customer contact details and request information required to respond.</li>
              <li><strong className={fg}>Service providers (processors)</strong> – hosting, infrastructure, analytics, communications tools, customer support tools.</li>
              <li><strong className={fg}>Payments &amp; billing</strong> – Paddle (Merchant of Record) and related payment partners for processing transactions and handling refunds/chargebacks.</li>
              <li><strong className={fg}>Legal and safety</strong> – authorities or advisors where required by law or to protect rights, safety, and security.</li>
              <li><strong className={fg}>Business transfers</strong> – in connection with a merger, acquisition, or asset transfer (with appropriate safeguards).</li>
            </ol>
            <p className="mt-2">We do not sell personal data.</p>
          </section>

          <section>
            <h2 className={h2Class}>6) International Data Transfers</h2>
            <p>
              The Platform may be used globally and our service providers may process data in multiple countries. Where required by applicable
              law (e.g., EEA/UK), we implement appropriate safeguards for international transfers (such as contractual protections and/or other legal mechanisms).
            </p>
          </section>

          <section>
            <h2 className={h2Class}>7) Data Retention</h2>
            <p>We retain personal data only as long as necessary for the purposes above, including:</p>
            <ul className="list-disc pl-6">
              <li>active accounts: while the account is active and as needed for platform operations,</li>
              <li>transaction records: as required for accounting/audit and legal compliance,</li>
              <li>security logs: for a limited period to protect the Platform,</li>
              <li>support tickets: for reasonable periods to resolve issues and improve support.</li>
            </ul>
            <p className="mt-2">We may anonymize or aggregate data for analytics and reporting.</p>
          </section>

          <section>
            <h2 className={h2Class}>8) Security</h2>
            <p>
              We implement reasonable administrative, technical, and organizational measures to protect data against unauthorized access, loss,
              misuse, or alteration. No system is 100% secure, and you use the Platform at your own risk.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>9) Cookies and Similar Technologies</h2>
            <p>We may use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6">
              <li>essential website functionality,</li>
              <li>security and fraud-prevention,</li>
              <li>analytics and performance.</li>
            </ul>
            <p className="mt-2">Where required by law, we will request consent for non-essential cookies.</p>
          </section>

          <section>
            <h2 className={h2Class}>10) Your Rights (where applicable)</h2>
            <p>Depending on your location, you may have rights to:</p>
            <ul className="list-disc pl-6">
              <li>access your data,</li>
              <li>correct inaccurate data,</li>
              <li>delete data,</li>
              <li>object to or restrict processing,</li>
              <li>data portability,</li>
              <li>withdraw consent (where processing is based on consent).</li>
            </ul>
            <p className="mt-2">
              To exercise rights, contact us at <strong className={fg}>mik.intelligence@gmail.com</strong>. We may need to verify your identity.
            </p>
          </section>

          <section>
            <h2 className={h2Class}>11) Children</h2>
            <p>The Platform is not intended for children under 18. We do not knowingly collect personal data from children.</p>
          </section>

          <section>
            <h2 className={h2Class}>12) Changes</h2>
            <p>We may update this Policy from time to time. The &quot;Last updated&quot; date reflects the effective date.</p>
          </section>

          <section>
            <h2 className={h2Class}>13) Contact</h2>
            <p>
              For privacy questions or requests:<br />
              <strong className={fg}>mik.intelligence@gmail.com</strong>
            </p>
            <p>
              <strong className={fg}>MIK INTELLIGENCE FZCO</strong> — Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates
            </p>
          </section>
        </div>
      </SectionWrapper>
    </>
  );
}
