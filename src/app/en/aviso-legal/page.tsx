import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legal Notice",
  description: "Legal notice for Raúl Romero — Web & Growth.",
  alternates: {
    canonical: "/en/aviso-legal",
    languages: { es: "/aviso-legal", en: "/en/aviso-legal" },
  },
  robots: { index: false, follow: true },
};

export default function LegalNoticePage() {
  return (
    <div className="container-page py-24 md:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
          Legal
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          Legal Notice
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate">
          In compliance with the information duties applicable to providers
          of information society services under Spanish law (articles 10 and
          22.2 of Law 34/2002, on Information Society Services and Electronic
          Commerce), the following identification details of the owner of
          this website are provided.
        </p>
        <p className="mt-4 border border-line/70 bg-navy/[0.03] p-4 text-xs leading-relaxed text-slate">
          This English version is provided for informational purposes. In
          the event of any discrepancy, the{" "}
          <Link href="/aviso-legal">Spanish version</Link> shall prevail.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-navy [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_p]:mt-2 [&_a]:font-medium [&_a]:text-navy [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-cobalt">
          <section>
            <h2>1. Identification details of the owner</h2>
            <ul>
              <li>Owner: Raúl Romero Agüera.</li>
              <li>Tax ID (NIF): 23312704L</li>
              <li>Trade name: Raúl Romero — Web & Growth.</li>
              <li>
                Business address: Calle Milán, n.º 3, 30319 Cartagena,
                Murcia, Spain.
              </li>
              <li>
                Email:{" "}
                <a href="mailto:info@raulromero.es">
                  info@raulromero.es
                </a>
              </li>
              <li>Website: https://raulromero.es</li>
              <li>Country of activity: Spain.</li>
              <li>
                Legal form: sole trader (self-employed individual, &quot;autónomo&quot;
                under Spanish law). There is no company, agency or team
                behind this brand.
              </li>
              <li>Companies Register entry: not applicable.</li>
              <li>Professional association membership: not applicable.</li>
              <li>Special administrative authorization: not applicable.</li>
            </ul>
          </section>

          <section>
            <h2>2. Purpose of the website</h2>
            <p>
              This website presents the professional web design, application
              development and process digitization services offered by
              Raúl Romero, and allows visitors to request information or a
              proposal through the contact form.
            </p>
          </section>

          <section>
            <h2>3. Conditions of use</h2>
            <p>
              Access to this website is free and does not require prior
              registration. Simply accessing and using the site grants the
              visitor the status of user and implies acceptance of the
              conditions set out in this legal notice.
            </p>
            <p>
              The user agrees to use the website and its content diligently,
              correctly and lawfully, and in particular not to use them for
              fraudulent purposes, nor to introduce or spread computer
              viruses or other systems that could damage the website or
              third parties&apos; systems.
            </p>
          </section>

          <section>
            <h2>4. Intellectual and industrial property</h2>
            <p>
              The design of the website, its source code, texts, visual
              identity (including the logo and the &quot;RR&quot; monogram) and other
              original content are the property of Raúl Romero, unless
              expressly stated otherwise, and are protected under
              intellectual and industrial property law.
            </p>
            <p>
              Reproduction, distribution, public communication or
              transformation of this content, in whole or in part, is
              prohibited without the express authorization of the owner,
              except where permitted by law.
            </p>
          </section>

          <section>
            <h2>5. Liability for content and availability</h2>
            <p>
              Reasonable efforts are made to keep the information on this
              website accurate and up to date, but the absence of errors or
              continuous, uninterrupted availability of the site cannot be
              guaranteed. The owner is not liable for damages arising from
              interruptions, connection errors, service malfunctions or
              causes beyond their control (for example, hosting provider
              incidents).
            </p>
            <p>
              The projects shown in the &quot;Projects&quot; section marked as
              &quot;concept project&quot; are illustrative examples of the type of
              work carried out and do not represent real clients, results or
              figures.
            </p>
          </section>

          <section>
            <h2>6. External links</h2>
            <p>
              This website may include links to third-party sites (for
              example, social media or WhatsApp). The owner does not control
              and is not responsible for the content, policies or practices
              of those external sites. The inclusion of a link does not
              imply any relationship with, recommendation of, or endorsement
              by the owner of the linked site.
            </p>
          </section>

          <section>
            <h2>7. Prices and taxes</h2>
            <p>
              This website does not currently publish fixed prices or rates
              for its services. If prices are published in the future, it
              will be expressly stated whether or not applicable taxes are
              included.
            </p>
          </section>

          <section>
            <h2>8. Governing law and jurisdiction</h2>
            <p>
              These conditions are governed by Spanish law. Any dispute
              arising from access to or use of this website, without
              prejudice to any consumer rights that may apply to the user
              under consumer protection regulations, shall be subject to the
              courts and tribunals determined by law.
            </p>
          </section>

          <section>
            <h2>9. More information</h2>
            <p>
              To find out how personal data collected through this website
              is handled, see the{" "}
              <Link href="/en/privacidad">Privacy Policy</Link>. For details
              on the use of cookies and similar technologies, see the{" "}
              <Link href="/en/cookies">Cookies Policy</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
