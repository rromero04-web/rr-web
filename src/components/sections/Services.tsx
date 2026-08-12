import Link from "next/link";
import { ArrowRight, Check, MonitorPlay, Sliders } from "lucide-react";
import { getServices } from "@/content/services";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { CTA_STRINGS } from "@/lib/configurator/strings";

const STRINGS: Record<Locale, {
  eyebrow: string;
  title: string;
  subtitle: string;
  audienceNote?: string;
  demosCtaTitle?: string;
  demosCtaBody?: string;
}> = {
  es: {
    eyebrow: "Servicios",
    title: "Tres formas de ayudarte a crecer, según dónde estés ahora mismo.",
    subtitle: "Prueba ejemplos interactivos del tipo de solución que puedo crear para tu negocio.",
  },
  en: {
    eyebrow: "Services",
    title: "Three ways to help you grow, wherever you are right now.",
    subtitle: "Try interactive examples of the kind of solution I can build for your business.",
    audienceNote:
      "I work with businesses, freelancers, professionals, creators, startups, small projects and teams that need internal tools — not just large enterprises.",
    demosCtaTitle: "Explore the live demos",
    demosCtaBody:
      "Test three interactive examples and see how a professional website, a lead-generation experience and a custom internal application could work.",
  },
};

const LABELS: Record<Locale, { audience: string; problem: string }> = {
  es: { audience: "Para quién:", problem: "Resuelve:" },
  en: { audience: "Who it's for:", problem: "Solves:" },
};

export function Services({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const labels = LABELS[locale];
  const services = getServices(locale);

  return (
    <section id="servicios" className="border-b border-line/70 py-24 md:py-32">
      <div className="container-page">
        <RevealOnScroll>
          <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
            {t.eyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-slate">{t.subtitle}</p>
          {t.audienceNote && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate">
              {t.audienceNote}
            </p>
          )}
        </RevealOnScroll>

        {t.demosCtaTitle && t.demosCtaBody && (
          <RevealOnScroll delay={0.06}>
            <div className="mt-8 flex flex-col gap-2 border border-cobalt/30 bg-cobalt/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="text-sm font-bold text-navy">{t.demosCtaTitle}</p>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate">
                  {t.demosCtaBody}
                </p>
              </div>
              <a
                href="#servicios"
                className="inline-flex shrink-0 items-center gap-2 self-start bg-navy px-4 py-2.5 text-xs font-semibold text-cream transition-colors hover:bg-cobalt sm:self-auto"
              >
                <MonitorPlay size={14} aria-hidden="true" />
                {t.demosCtaTitle}
              </a>
            </div>
          </RevealOnScroll>
        )}

        <div className="mt-14 grid gap-px overflow-hidden border border-line/70 bg-line/70 md:grid-cols-3">
          {services.map((service, index) => (
            <RevealOnScroll key={service.slug} delay={index * 0.08} className="h-full">
              <article className="flex h-full flex-col bg-cream p-8">
                <span className="font-mono text-sm text-slate">
                  {service.number}
                </span>
                <h3 className="mt-4 text-xl font-bold text-navy">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  <span className="font-semibold text-navy">{labels.audience}</span>{" "}
                  {service.audience}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate">
                  <span className="font-semibold text-navy">{labels.problem}</span>{" "}
                  {service.problem}
                </p>

                <ul className="mt-5 flex flex-col gap-2.5">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate">
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-cobalt"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col items-start gap-3 pt-8">
                  <a
                    href="#contacto"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-cobalt"
                  >
                    {service.nextStep}
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>

                  {service.demoHref && (
                    <Link
                      href={localizePath(service.demoHref, locale)}
                      className="inline-flex items-center gap-2 bg-navy px-4 py-2.5 text-xs font-semibold text-cream transition-colors hover:bg-cobalt"
                    >
                      <MonitorPlay size={14} aria-hidden="true" />
                      {service.demoLabel}
                    </Link>
                  )}
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.1}>
          <div className="mt-8 flex flex-col gap-3 border border-navy/15 bg-navy p-6 text-cream sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-base font-bold">{CTA_STRINGS[locale].label}</p>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-cream/75">
                {CTA_STRINGS[locale].supportingText}
              </p>
            </div>
            <Link
              href={localizePath("/configurador", locale)}
              className="inline-flex shrink-0 items-center gap-2 self-start bg-cream px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-cobalt hover:text-cream sm:self-auto"
            >
              <Sliders size={15} aria-hidden="true" />
              {CTA_STRINGS[locale].label}
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
