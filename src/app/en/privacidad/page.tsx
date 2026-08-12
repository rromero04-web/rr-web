import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Raúl Romero — Web & Growth.",
  alternates: {
    canonical: "/en/privacidad",
    languages: { es: "/privacidad", en: "/en/privacidad" },
  },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="container-page py-24 md:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
          Legal
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate">
          This document explains, in plain language, what personal data this
          website processes, for what purpose, for how long, and what
          rights you have. It does not replace professional legal advice
          and does not, by itself, guarantee compliance with any
          regulation.
        </p>
        <p className="mt-4 border border-line/70 bg-navy/[0.03] p-4 text-xs leading-relaxed text-slate">
          This English version is provided for informational purposes. In
          the event of any discrepancy, the{" "}
          <Link href="/privacidad">Spanish version</Link> shall prevail.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-navy [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_p]:mt-2 [&_a]:font-medium [&_a]:text-navy [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-cobalt">
          <section>
            <h2>1. Data controller</h2>
            <p>
              Data controller: Raúl Romero Agüera, Tax ID (NIF) 23312704L,
              with business address at Calle Milán, n.º 3, 30319 Cartagena,
              Murcia, Spain. Contact email for enquiries and the exercise of
              rights:{" "}
              <a href="mailto:info@raulromero.es">
                info@raulromero.es
              </a>
              .
            </p>
            <ul>
              <li>Trade name: Raúl Romero — Web & Growth.</li>
              <li>Website: https://raulromero.es</li>
              <li>
                Legal form: sole trader (self-employed individual,
                &quot;autónomo&quot; under Spanish law), with no company or agency
                behind it.
              </li>
              <li>Country of activity: Spain.</li>
              <li>No Data Protection Officer has been appointed.</li>
            </ul>
          </section>

          <section>
            <h2>2. Personal data processed</h2>
            <p>
              The only personal data processed by this website is the data
              you voluntarily enter in the contact form:
            </p>
            <ul>
              <li>Name (required).</li>
              <li>Company or project (optional).</li>
              <li>Email address (required).</li>
              <li>Type of service you&apos;re interested in (required).</li>
              <li>Estimated budget (optional).</li>
              <li>Message or project description (required).</li>
            </ul>
            <p>
              When the form is submitted, the following is also recorded
              automatically: the date and time of submission, an internal
              status for managing the request (for example, &quot;new&quot;, &quot;read&quot;
              or &quot;replied&quot;), and the source of the contact (currently
              always &quot;web&quot;, as it is the only form channel, distinguishing
              between the Spanish and English versions of the site).
            </p>
            <p>
              As a security measure against automated submissions (spam),
              the server temporarily keeps, in memory, a counter of
              submissions per IP address for a few minutes, to limit the
              number of consecutive requests. This counter{" "}
              <strong>is not stored in any database</strong>, is not linked
              to your name or message, and disappears when the server
              restarts.
            </p>
            <p>
              This website does not use cookies or tracking technologies,
              so no browsing, behavioral or usage-profile data is collected
              (see the{" "}
              <Link href="/en/cookies">Cookies Policy</Link> for more
              detail).
            </p>
          </section>

          <section>
            <h2>3. Source of the data</h2>
            <p>
              All data comes directly from you, as the data subject,
              through the contact form. No personal data is obtained from
              third-party sources or external databases.
            </p>
          </section>

          <section>
            <h2>4. Purposes of processing</h2>
            <p>Data from the form is used exclusively to:</p>
            <ul>
              <li>Respond to your enquiry.</li>
              <li>Assess the project or service you&apos;re requesting.</li>
              <li>Prepare and send you a proposal or quote.</li>
              <li>
                Carry out the pre-contractual steps you yourself request by
                getting in touch.
              </li>
            </ul>
            <p>
              The general contact form{" "}
              <strong>does not subscribe you to any newsletter or
              marketing list</strong>. If sending commercial communications
              is introduced in the future, a separate, optional, unchecked
              checkbox will be provided, with its own information and legal
              basis, independent of this purpose.
            </p>
          </section>

          <section>
            <h2>5. Legal bases</h2>
            <ul>
              <li>
                <strong>Contact form:</strong> application of
                pre-contractual measures at the request of the data subject
                (Article 6.1.b GDPR). It is not based on your consent,
                because its purpose is to respond to something you yourself
                have requested.
              </li>
              <li>
                <strong>Spam prevention (temporary submission counter):</strong>{" "}
                legitimate interest of the controller in protecting the
                service against abuse (Article 6.1.f GDPR).
              </li>
            </ul>
          </section>

          <section>
            <h2>6. Mandatory nature of the data</h2>
            <p>
              Name, email, service type and message are required: without
              them, the form cannot be submitted or, therefore, answered.
              Company/project and estimated budget are optional.
            </p>
          </section>

          <section>
            <h2>7. Retention periods</h2>
            <ul>
              <li>
                If your enquiry does not lead to a contractual relationship,
                data is kept for a maximum of 12 months from the last
                communication with you, unless it needs to be kept for
                longer to handle or defend against a claim.
              </li>
              <li>
                If a contractual relationship is established, data is kept
                for the duration of that relationship and, afterwards, for
                the legal periods applicable to the resulting
                responsibilities and obligations (for example, tax or
                commercial law).
              </li>
              <li>
                Where there is a legal obligation to retain certain data,
                it will be blocked and used only to comply with that
                obligation, with no other use.
              </li>
              <li>
                Once the above periods have elapsed, data is securely
                deleted or anonymized.
              </li>
            </ul>
            <p>
              As of today, there is no automated process for deleting old
              requests in Supabase yet: cleanup is carried out through
              periodic manual review by the controller, until an automated
              mechanism is implemented.
            </p>
          </section>

          <section>
            <h2>8. Recipients and data processors</h2>
            <p>
              Your data is <strong>never sold or shared with third parties
              for commercial purposes</strong>. It is only accessed by the
              technology providers strictly necessary to host the website
              and manage the form, acting as data processors (Article 28
              GDPR):
            </p>
            <ul>
              <li>
                <strong>Supabase</strong> — stores the database containing
                contact requests.
              </li>
              <li>
                <strong>Vercel</strong> — hosts and runs the website and its
                server functions.
              </li>
              <li>
                <strong>Resend</strong> — sends the controller an email
                notification every time a request is received, so it can be
                answered sooner. Resend processes the name, email, service,
                budget and message from the request for this purpose; you
                can consult its{" "}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  privacy policy
                </a>
                .
              </li>
            </ul>
            <p>
              No analytics, advertising or third-party CAPTCHA tool is used
              on this website: the anti-spam protection is a self-contained
              mechanism (see section 2).
            </p>
          </section>

          <section>
            <h2>9. International transfers</h2>
            <p>
              The Supabase project and the Vercel execution region used by
              this website are configured by the controller in{" "}
              <strong>Ireland (European Union)</strong>. Even so, both
              providers are companies with international infrastructure and
              support, so data may be processed or accessed outside the
              European Economic Area:
            </p>
            <ul>
              <li>
                <strong>Vercel Inc.</strong> is headquartered in the United
                States. Under its Data Processing Addendum, it may transfer
                data to its sub-processors (which include infrastructure on
                AWS, Azure and Google Cloud) outside the EEA when necessary,
                safeguarded with the EU Standard Contractual Clauses (2021)
                and the UK IDTA. You can consult its{" "}
                <a
                  href="https://vercel.com/legal/dpa"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Data Processing Addendum
                </a>{" "}
                and its{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  privacy policy
                </a>
                .
              </li>
              <li>
                <strong>Supabase</strong> contractually guarantees that,
                when the customer specifies a region (such as Ireland, in
                this case), data is stored and processed primarily in that
                region. However, its public documentation also references
                infrastructure and support in the United States, with
                safeguards through Standard Contractual Clauses. You can
                consult its{" "}
                <a
                  href="https://supabase.com/legal/dpa"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Data Processing Addendum
                </a>
                , its{" "}
                <a
                  href="https://supabase.com/legal/customer-resources/subprocessor-list"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  sub-processor list
                </a>{" "}
                and its{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  privacy policy
                </a>
                .
              </li>
              <li>
                <strong>Resend</strong> (Plus Five Five, Inc.) is
                headquartered in the United States and, per its own privacy
                policy, may transfer and maintain information on servers
                located in the United States. You can consult its{" "}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  privacy policy
                </a>
                .
              </li>
            </ul>
            <p>
              In all cases, any transfer outside the EEA is carried out
              under Standard Contractual Clauses approved by the European
              Commission, as a safeguard mechanism recognized by the GDPR.
            </p>
          </section>

          <section>
            <h2>10. Rights of data subjects</h2>
            <p>You can exercise, at any time, your rights to:</p>
            <ul>
              <li>Access your personal data.</li>
              <li>Rectify inaccurate data.</li>
              <li>Erasure of your data.</li>
              <li>Object to processing.</li>
              <li>Restrict processing.</li>
              <li>Portability, where applicable.</li>
              <li>
                Withdraw consent at any time, for processing based on it,
                without affecting the lawfulness of processing carried out
                before its withdrawal.
              </li>
            </ul>
            <p>
              You can exercise these rights by writing to{" "}
              <a href="mailto:info@raulromero.es">
                info@raulromero.es
              </a>
              . The request should allow you to be identified and the right
              you wish to exercise to be understood; additional
              identification information will only be requested when it is
              genuinely necessary and proportionate.
            </p>
          </section>

          <section>
            <h2>11. Complaints to the Spanish Data Protection Agency</h2>
            <p>
              If you believe that the processing of your data does not
              comply with applicable regulations, you can file a complaint
              with the Spanish Data Protection Agency (Agencia Española de
              Protección de Datos):{" "}
              <a
                href="https://www.aepd.es/"
                target="_blank"
                rel="noreferrer noopener"
              >
                www.aepd.es
              </a>
              .
            </p>
          </section>

          <section>
            <h2>12. Security</h2>
            <p>
              Reasonable technical and organizational measures are applied
              to protect your data: the form is validated both in the
              browser and on the server, the connection uses HTTPS, and
              public access to the database is restricted through Row Level
              Security policies that only allow inserting new requests,
              never reading, modifying or deleting them from the browser.
              No security measure is one hundred percent infallible, so
              absolute security cannot be guaranteed.
            </p>
          </section>

          <section>
            <h2>13. Minors</h2>
            <p>
              This website is not specifically aimed at minors. If you are
              a minor, please do not provide us with personal data without
              the authorization of your parent or legal guardian. If we
              become aware that a minor&apos;s data has been provided without
              such authorization, we will delete it as soon as we are made
              aware.
            </p>
          </section>

          <section>
            <h2>14. Automated decisions and profiling</h2>
            <p>
              No decisions are made based solely on automated processing,
              and no profiles are built from your data.
            </p>
          </section>

          <section>
            <h2>15. Changes to this policy</h2>
            <p>
              This policy may be updated when the services, providers or
              processing activities described in it change. Relevant
              changes will be reflected on this same page, along with its
              update date.
            </p>
          </section>

          <section>
            <h2>16. Last updated</h2>
            <p>August 10, 2026.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
