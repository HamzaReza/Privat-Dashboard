import { SectionWrapper } from "@/components/marketing/SectionElements";

const fg = "text-[hsl(var(--foreground-hsl))]";
const muted = "text-[hsl(var(--muted-foreground-hsl))]";
const h2Class = `mb-2 font-heading text-sm font-semibold tracking-widest-marketing uppercase ${fg}`;
const h3Class = `mt-2 font-heading text-xs font-semibold uppercase tracking-widest-marketing ${fg}`;

export default function Terms() {
  return (
    <>
      <section className="bg-subtle-texture py-20 lg:py-24">
        <div className="container mx-auto px-4 text-center lg:px-8">
          <h1 className="text-3xl font-heading font-semibold tracking-widest-marketing uppercase md:text-4xl">
            <span className="text-gold-gradient">Terms of Service</span>
          </h1>
          <p className={`mt-4 text-sm ${muted}`}>Last updated: 26 February 2026</p>
        </div>
      </section>
      <SectionWrapper className="pt-10 pb-16 lg:pt-12 lg:pb-20">
        <div className={`mx-auto max-w-3xl space-y-8 text-sm leading-relaxed ${muted}`}>
          <section className="rounded-sm border border-[hsl(var(--border-hsl))/0.6] bg-[hsl(var(--card-hsl))/0.4] p-4 text-left space-y-3">
            <p>
              These Terms of Service (the &quot;Terms&quot;) govern access to and use of StandardPrivat (the &quot;Platform&quot;), including
              standardprivat.com, any subdomains, and any related mobile applications, dashboards, and services (collectively, the &quot;Services&quot;).
            </p>
            <p>
              The Services are operated by MIK INTELLIGENCE FZCO (the &quot;Company&quot;, &quot;we&quot;, &quot;us&quot;).<br />
              Legal address: Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates<br />
              Support email: <a href="mailto:mik.intelligence@gmail.com" className="text-[hsl(var(--primary-hsl))] hover:underline">mik.intelligence@gmail.com</a>
            </p>
            <p>By accessing or using the Services, you agree to these Terms and all Policies incorporated by reference.</p>
          </section>

          <section>
            <h2 className={h2Class}>1) Definitions</h2>
            <p><strong className={fg}>Customer / End User</strong>: a user requesting services (e.g., maintenance) via the Platform.</p>
            <p><strong className={fg}>Business User / Provider (&quot;Provider&quot;)</strong>: a professional or business user offering services via the Platform.</p>
            <p><strong className={fg}>Lead</strong>: a service request submitted by a Customer through the Platform.</p>
            <p><strong className={fg}>Credits</strong>: non-monetary units available only to Providers, purchased to unlock Leads and/or access specific provider features.</p>
            <p><strong className={fg}>Unlock</strong>: using Credits to access Lead details and/or engage with the Customer.</p>
            <p><strong className={fg}>Policies</strong>: additional rules incorporated by reference, including the Credits &amp; Lead Unlock Policy, the Privacy Policy/Notice, and any refund rules (as applicable).</p>
            <p><strong className={fg}>Merchant of Record (&quot;MoR&quot;)</strong>: Paddle, acting as seller of record for online payments (where applicable).</p>
          </section>

          <section>
            <h2 className={h2Class}>2) Eligibility</h2>
            <p>You must be at least 18 years old and able to form a binding contract to use the Services. If you use the Services on behalf of a company, you represent that you have authority to bind that company.</p>
          </section>

          <section>
            <h2 className={h2Class}>3) Platform Role — Marketplace Disclaimer</h2>
            <p>The Platform is a marketplace that facilitates connections between Customers and independent Providers. We are not a party to any agreement, contract, or dispute between Customers and Providers, unless expressly stated otherwise in writing.</p>
            <p>Providers are independent third parties, not employees, agents, partners, or representatives of the Company. We do not control, and do not guarantee: the quality, safety, legality, or suitability of Provider services; Customer cooperation; or the outcome of any job.</p>
            <p><strong className={fg}>No fees to Customers.</strong> Customers may submit Leads and use Customer-facing features free of charge, unless expressly stated on the Platform. Only Providers may purchase Credits and pay for provider-only features (if any).</p>
            <p>The Company does not provide, perform, supervise, control, or manage any services offered by Providers. The Company does not employ Providers and does not act as contractor, subcontractor, agent, joint venture partner, or representative of any Provider. All service agreements are entered into directly between Customers and Providers, and the Company has no responsibility for the execution, quality, legality, safety, or outcome of any service.</p>
          </section>

          <section>
            <h2 className={h2Class}>4) Accounts and Security</h2>
            <p>You may need to create an account to use some features. You agree to provide accurate information and keep it updated. You are responsible for maintaining the confidentiality of login credentials and for activity under your account. We may suspend or terminate accounts for suspected fraud, abuse, or violations of these Terms or Policies.</p>
          </section>

          <section>
            <h2 className={h2Class}>5) Customer Obligations</h2>
            <p>Customers agree to:</p>
            <ul className="list-disc pl-6">
              <li>Provide accurate information in requests (location, scope, constraints, timing).</li>
              <li>Use the Platform lawfully and respectfully, and not request illegal services.</li>
              <li>Ensure the job site is reasonably safe and accessible for Providers.</li>
            </ul>
          </section>

          <section>
            <h2 className={h2Class}>6) Provider Obligations</h2>
            <p>Providers agree to:</p>
            <ul className="list-disc pl-6">
              <li>Provide accurate business identity information and, where required, evidence of licensing, permits, insurance, or certifications.</li>
              <li>Comply with all applicable laws and regulations (including labor, tax, safety, consumer protection, and data protection).</li>
              <li>Communicate transparently about pricing, availability, and scope, and perform services professionally and safely.</li>
              <li>Use Lead information solely for legitimate service-related purposes and not for spam, harassment, unrelated marketing, or resale.</li>
              <li>Maintain adequate records and documentation as required by law and as reasonably necessary to support dispute resolution.</li>
            </ul>
          </section>

          <section>
            <h2 className={h2Class}>7) Leads, Messaging, and Communications</h2>
            <p>Customers may submit Leads; Providers may respond and/or Unlock Leads depending on Platform functionality. We do not guarantee that any Lead will result in business, or that any Customer will respond, accept an offer, or proceed with a job. We may apply reasonable security, fraud-prevention, and compliance measures (including monitoring or review of activity) as permitted by applicable law and our Privacy Notice.</p>
          </section>

          <section>
            <h2 className={h2Class}>8) Credits and Fees (Providers Only)</h2>
            <h3 className={h3Class}>8.1 Credits policy incorporated by reference</h3>
            <p>Where the Platform uses Credits, Provider purchase and use of Credits is governed by our Credits &amp; Lead Unlock Policy (the &quot;Credits Policy&quot;), incorporated into these Terms by reference. In case of conflict, the Credits Policy prevails for Credits-related matters.</p>
            <h3 className={h3Class}>8.2 Nature of Credits</h3>
            <p>Credits are not money, not stored value, and have no cash value. Credits provide a limited right to use certain Platform functions (including Unlocking Leads), as described in the Credits Policy.</p>
            <h3 className={h3Class}>8.3 Lead Unlock is generally irreversible</h3>
            <p>Unlocking a Lead typically consumes Credits and is generally non-reversible, except where the Credits Policy expressly provides for adjustments (e.g., duplicates due to Platform error, technical faults preventing access).</p>
            <h3 className={h3Class}>8.4 Provider-only charges</h3>
            <p>Any provider-side fees (including Credits required per Lead) are shown on the Platform at the time of purchase/use and may change as described in Section 20 (Changes).</p>
          </section>

          <section>
            <h2 className={h2Class}>9) Payments, Paddle as Merchant of Record, and Taxes</h2>
            <p>Where available, Provider Credit purchases are processed by Paddle acting as the Merchant of Record. This means Paddle may handle payment processing, invoicing/receipts, charge management, and (where applicable) tax calculation/collection depending on transaction details and location.</p>
            <p>Taxes may apply based on the purchaser&apos;s location and status (business vs consumer) and applicable law. You agree to comply with the checkout/payment terms presented by Paddle at the time of purchase.</p>
          </section>

          <section>
            <h2 className={h2Class}>10) Refunds and Disputes (Credits)</h2>
            <p>Refunds, if any, for Credits purchases and Lead Unlock disputes are governed by the Credits Policy and are processed in accordance with the applicable MoR/payment procedures (e.g., Paddle). Because Credits and Unlocks may be delivered and used immediately, refunds are typically limited once performance begins, subject to mandatory legal rights that cannot be waived.</p>
            <p>Refund rules in relation to Credits apply to Providers as purchasing users. Mandatory consumer rights may apply only where a purchaser qualifies as a consumer under applicable law.</p>
          </section>

          <section>
            <h2 className={h2Class}>11) App Stores and External Purchase Flows</h2>
            <p>Where the Platform is accessible through a native mobile application, certain purchases (including Credits) may be completed outside the native app (e.g., via web checkout). Your ability to use purchased Credits within the app remains governed by these Terms and the Credits Policy.</p>
          </section>

          <section>
            <h2 className={h2Class}>12) Reviews, Ratings, and User Content</h2>
            <p>Users may submit reviews/ratings, messages, photos, or other content. You must ensure content is accurate, lawful, and not misleading, defamatory, or infringing.</p>
            <p>You grant the Company a non-exclusive, worldwide, royalty-free license to use, reproduce, display, and distribute your content to operate, improve, and market the Services, including for moderation and support. We may remove or restrict content that violates these Terms, Policies, or applicable law.</p>
          </section>

          <section>
            <h2 className={h2Class}>13) Acceptable Use (Prohibited Conduct)</h2>
            <p>You must not:</p>
            <ul className="list-disc pl-6">
              <li>use the Services for unlawful purposes;</li>
              <li>attempt unauthorized access, scraping, reverse engineering, or interference with Platform security;</li>
              <li>harass, spam, threaten, or exploit other users;</li>
              <li>submit false Leads, fake identities, or manipulate pricing/credit mechanics;</li>
              <li>misuse personal data obtained via Leads (including unauthorized marketing or resale);</li>
              <li>circumvent restrictions, create duplicate accounts to avoid enforcement, or engage in refund/chargeback abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className={h2Class}>14) Intellectual Property</h2>
            <p>All Platform software, design, trademarks, and content (excluding user content) are owned by the Company and/or its licensors. You receive a limited, non-exclusive, non-transferable, revocable license to use the Services as intended.</p>
          </section>

          <section>
            <h2 className={h2Class}>15) Privacy and Data Protection</h2>
            <p>Our collection and use of personal data is described in our Privacy Policy/Notice, incorporated by reference. Providers must handle any Customer personal data obtained through the Platform in compliance with applicable data protection laws and solely for legitimate service-related purposes.</p>
          </section>

          <section>
            <h2 className={h2Class}>16) Suspension, Termination, and Enforcement</h2>
            <p>We may suspend or terminate your access if you breach these Terms, the Policies, or for fraud, security, or legal reasons. If your account is suspended or terminated for cause (e.g., fraud/abuse), you may lose access to unused Credits and/or Leads as permitted by law and as described in the Credits Policy. We may take steps to protect users, including limiting communications, restricting access to Leads, or reporting unlawful activity to competent authorities where appropriate.</p>
          </section>

          <section>
            <h2 className={h2Class}>17) Disclaimers</h2>
            <p>To the maximum extent permitted by law: The Services are provided &quot;as is&quot; and &quot;as available.&quot; We do not guarantee uninterrupted operation, error-free functionality, or that Leads will result in successful jobs. We do not warrant the quality, safety, legality, or suitability of Provider services or Customer requests.</p>
          </section>

          <section>
            <h2 className={h2Class}>18) Limitation of Liability</h2>
            <p>To the maximum extent permitted by law: The Company will not be liable for indirect, incidental, special, consequential, or punitive damages, or loss of profits, revenue, goodwill, or data.</p>
            <p>Our total aggregate liability arising out of or related to the Services will not exceed the greater of the amount you paid for Credits in the three (3) months preceding the event giving rise to the claim.</p>
            <p>Nothing in these Terms limits liability that cannot be limited under applicable law (including liability for fraud or intentional misconduct).</p>
          </section>

          <section>
            <h2 className={h2Class}>19) Indemnity (Providers and Business Users)</h2>
            <p>To the maximum extent permitted by law, you agree to defend, indemnify, and hold harmless the Company from claims, damages, liabilities, and expenses arising from: your breach of these Terms/Policies; your use of the Services; your services (Provider performance, safety incidents, licensing/tax non-compliance); content you submit; disputes between Customers and Providers.</p>
          </section>

          <section>
            <h2 className={h2Class}>20) International Availability and Mandatory Local Laws</h2>
            <p>The Services may be available internationally. If you access the Services from outside the United Arab Emirates, you are responsible for compliance with applicable local laws. Nothing in these Terms limits rights that cannot be waived under mandatory applicable laws (including consumer protection and data protection rules where applicable).</p>
          </section>

          <section>
            <h2 className={h2Class}>21) Changes to the Services or Terms</h2>
            <p>We may update the Services, these Terms, and/or Policies for business, security, fraud-prevention, or legal reasons. Changes apply from the &quot;Last updated&quot; date. Material changes may be notified via the Platform or other reasonable means.</p>
          </section>

          <section>
            <h2 className={h2Class}>22) Governing Law and Jurisdiction (UAE)</h2>
            <p>These Terms, and any dispute or claim arising out of or in connection with them, are governed by the laws of the United Arab Emirates. The courts of the United Arab Emirates shall have exclusive jurisdiction, unless mandatory laws provide otherwise.</p>
          </section>

          <section>
            <h2 className={h2Class}>23) Contact</h2>
            <p>
              For questions, complaints, or legal notices:<br />
              <a href="mailto:mik.intelligence@gmail.com" className="text-[hsl(var(--primary-hsl))] hover:underline">mik.intelligence@gmail.com</a>
            </p>
            <p>MIK INTELLIGENCE FZCO — Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates</p>
          </section>
        </div>
      </SectionWrapper>
    </>
  );
}
