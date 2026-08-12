import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description: "Cookies Policy for Raúl Romero — Web & Growth.",
  alternates: {
    canonical: "/en/cookies",
    languages: { es: "/cookies", en: "/en/cookies" },
  },
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <div className="container-page py-24 md:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
          Legal
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          Cookies Policy
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate">
          This policy is based on an actual technical review of this
          website&apos;s code, not a generic template. It will be updated
          whenever anything described here changes.
        </p>
        <p className="mt-4 border border-line/70 bg-navy/[0.03] p-4 text-xs leading-relaxed text-slate">
          This English version is provided for informational purposes. In
          the event of any discrepancy, the{" "}
          <Link href="/cookies">Spanish version</Link> shall prevail.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-navy [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_p]:mt-2 [&_a]:font-medium [&_a]:text-navy [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-cobalt">
          <section>
            <h2>1. What are cookies?</h2>
            <p>
              Cookies are small files that a website can store in your
              browser to remember information about your visit, such as
              preferences, sessions or browsing data. Equivalent
              technologies exist, such as browser local storage (
              <code>localStorage</code>, <code>sessionStorage</code>), which
              serve similar functions.
            </p>
          </section>

          <section>
            <h2>2. Cookies and storage used by this website</h2>
            <p>
              <strong>
                This website, in its current version, does not set any
                cookies, either first-party or third-party.
              </strong>{" "}
              There are no analytics cookies (such as Google Analytics), no
              advertising cookies, no social media cookies, and not even
              first-party technical cookies: the site works without needing
              any of them.
            </p>
            <p>
              Fonts are served directly from this domain (not loaded from
              Google&apos;s servers in real time), so their use does not
              generate cookies or third-party connections either.
            </p>
            <p>
              The contact form sends data directly to the server through a
              secure request, without leaving any cookie or persistent
              storage in your browser. The links to Instagram and WhatsApp
              are regular outbound links: they do not load any content from
              those services within this website, nor do they set cookies
              while you browse it.
            </p>
            <p>
              The only exception is the interactive demo at{" "}
              <Link href="/en/demo/gestion-de-equipos">
                /en/demo/gestion-de-equipos
              </Link>
              , which uses <code>localStorage</code> (browser local storage,
              not a cookie) solely to remember, on your own device, the
              changes you make within that simulation (fictional clock-ins,
              tasks, incidents). This data never leaves your browser, is
              never sent to any server, and you can delete it at any time
              using the &quot;Reset demo data&quot; button or by clearing this site&apos;s
              data in your browser.
            </p>
            <p>
              Since no non-essential cookie is used, this website does not
              display any cookie consent banner: showing one without any
              need would be as confusing as failing to inform users when it
              actually is needed.
            </p>
          </section>

          <section>
            <h2>3. If this changes in the future</h2>
            <p>
              If a tool that sets non-essential cookies or equivalent
              technologies (for example, visit analytics) is introduced in
              the future, before activating it:
            </p>
            <ul>
              <li>This policy will be updated with the exact details: name, provider, purpose, type, duration, and whether it involves any data transfer.</li>
              <li>
                That technology will be blocked by default until you decide
                whether to accept it.
              </li>
              <li>
                A notice will be shown with equally visible options to
                accept or reject it, with no pre-checked boxes, and with the
                ability to change your choice at any time from a permanent
                link in the footer.
              </li>
            </ul>
            <p>Until that happens, none of this is necessary.</p>
          </section>

          <section>
            <h2>4. More information</h2>
            <p>
              To find out what personal data is processed through the
              contact form and for what purpose, see the{" "}
              <Link href="/en/privacidad">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2>5. Last updated</h2>
            <p>August 10, 2026.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
