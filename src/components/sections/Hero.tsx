import Link from "next/link";
import { ArrowRight, Sliders } from "lucide-react";
import { Monogram } from "@/components/ui/Monogram";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { localizePath, type Locale } from "@/lib/i18n/config";

const STRINGS: Record<Locale, {
  eyebrow: string;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaConfigurator: string;
}> = {
  es: {
    eyebrow: "Marketing + Diseño + Desarrollo",
    title: "Webs y aplicaciones que hacen avanzar tu negocio.",
    description:
      "Combino estrategia, diseño y desarrollo para crear soluciones digitales que captan clientes, simplifican procesos y ayudan a crecer.",
    ctaPrimary: "Cuéntame tu proyecto",
    ctaSecondary: "Probar las demos",
    ctaConfigurator: "Configura tu proyecto",
  },
  en: {
    eyebrow: "Marketing + Design + Development",
    title: "Websites and applications that move your business forward.",
    description:
      "I combine strategy, design and development to create digital solutions that attract customers, simplify processes and support business growth.",
    ctaPrimary: "Tell me about your project",
    ctaSecondary: "View live demos",
    ctaConfigurator: "Build your project",
  },
};

export function Hero({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];

  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-line/70 pt-32 pb-20 md:pt-44 md:pb-28"
    >
      <div className="container-page grid items-center gap-16 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <RevealOnScroll>
            <p className="inline-flex items-center gap-2 border border-navy/15 px-3 py-1.5 text-xs font-semibold tracking-[0.14em] text-slate uppercase">
              {t.eyebrow}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.08}>
            <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-navy sm:text-5xl md:text-6xl">
              {t.title}
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
              {t.description}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.24}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#contacto"
                className="group inline-flex items-center justify-center gap-2 bg-navy px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-cobalt"
              >
                {t.ctaPrimary}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
              <a
                href="#servicios"
                className="inline-flex items-center justify-center gap-2 border border-navy/20 px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-cobalt hover:text-cobalt"
              >
                {t.ctaSecondary}
              </a>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <Link
              href={localizePath("/configurador", locale)}
              className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cobalt hover:text-navy"
            >
              <Sliders size={15} aria-hidden="true" />
              {t.ctaConfigurator}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.2}>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,transparent_49%,var(--color-line)_49%,var(--color-line)_51%,transparent_51%)] bg-[length:28px_28px] opacity-40"
            />
            <Monogram className="h-full w-full" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
