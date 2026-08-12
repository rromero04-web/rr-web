import { ArrowRight, Check, X, ChevronDown } from "lucide-react";
import {
  getProblems,
  getBalanceServices,
  getBeforeItems,
  getAfterItems,
  getProcessSteps,
  getFaqItems,
} from "./content";
import type { Locale } from "@/lib/i18n/config";

const PROBLEMS_STRINGS: Record<Locale, { eyebrow: string; title: string }> = {
  es: {
    eyebrow: "Para quién",
    title: "Problemas que reconocerás si gestionas tu propia actividad.",
  },
  en: {
    eyebrow: "Who it's for",
    title: "Problems you'll recognize if you manage your own activity.",
  },
};

export function Problems({ locale }: { locale: Locale }) {
  const t = PROBLEMS_STRINGS[locale];
  const problems = getProblems(locale);

  return (
    <section id="para-quien" className="border-b border-[#16233A]/10 bg-[#F6F4EF] py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#2F8F5B] uppercase">
          {t.eyebrow}
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-[#16233A] sm:text-4xl">
          {t.title}
        </h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {problems.map((item) => (
            <div key={item.problem} className="border border-[#16233A]/10 bg-white p-5">
              <p className="flex items-start gap-2 text-sm font-semibold text-[#16233A]">
                <X size={16} className="mt-0.5 shrink-0 text-[#B4483A]" aria-hidden="true" />
                {item.problem}
              </p>
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-[#4B5568]">
                <Check size={16} className="mt-0.5 shrink-0 text-[#2F8F5B]" aria-hidden="true" />
                {item.solution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICES_STRINGS: Record<Locale, { eyebrow: string; title: string }> = {
  es: {
    eyebrow: "Servicios",
    title: "Lo que gestionamos por ti",
  },
  en: {
    eyebrow: "Services",
    title: "What we manage for you",
  },
};

export function Services({ locale }: { locale: Locale }) {
  const t = SERVICES_STRINGS[locale];
  const services = getBalanceServices(locale);

  return (
    <section id="servicios" className="border-b border-[#16233A]/10 bg-white py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#2F8F5B] uppercase">
          {t.eyebrow}
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-[#16233A] sm:text-4xl">
          {t.title}
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden border border-[#16233A]/10 bg-[#16233A]/10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="bg-white p-6">
              <h3 className="text-base font-bold text-[#16233A]">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4B5568]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const COMPARISON_STRINGS: Record<Locale, {
  eyebrow: string;
  title: string;
  beforeHeading: string;
  afterHeading: string;
}> = {
  es: {
    eyebrow: "Antes y después",
    title: "De la gestión desordenada a la gestión centralizada.",
    beforeHeading: "Gestión desordenada",
    afterHeading: "Gestión centralizada",
  },
  en: {
    eyebrow: "Before and after",
    title: "From scattered management to centralized management.",
    beforeHeading: "Scattered management",
    afterHeading: "Centralized management",
  },
};

export function Comparison({ locale }: { locale: Locale }) {
  const t = COMPARISON_STRINGS[locale];
  const beforeItems = getBeforeItems(locale);
  const afterItems = getAfterItems(locale);

  return (
    <section className="border-b border-[#16233A]/10 bg-[#F6F4EF] py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#2F8F5B] uppercase">
          {t.eyebrow}
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-[#16233A] sm:text-4xl">
          {t.title}
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="border border-[#16233A]/10 bg-white p-6">
            <h3 className="text-sm font-bold tracking-wide text-[#4B5568] uppercase">
              {t.beforeHeading}
            </h3>
            <ul className="mt-4 space-y-3">
              {beforeItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#4B5568]">
                  <X size={15} className="mt-0.5 shrink-0 text-[#B4483A]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-[#2F8F5B]/40 bg-[#2F8F5B]/5 p-6">
            <h3 className="text-sm font-bold tracking-wide text-[#26744A] uppercase">
              {t.afterHeading}
            </h3>
            <ul className="mt-4 space-y-3">
              {afterItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#16233A]">
                  <Check size={15} className="mt-0.5 shrink-0 text-[#2F8F5B]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const PROCESS_STRINGS: Record<Locale, {
  eyebrow: string;
  title: string;
  disclaimer: string;
  cta: string;
}> = {
  es: {
    eyebrow: "Proceso",
    title: "Cómo funciona la primera valoración",
    disclaimer:
      "Se trata de una simulación con fines de demostración: no se está prestando asesoramiento fiscal real en ningún momento.",
    cta: "Solicitar valoración inicial",
  },
  en: {
    eyebrow: "Process",
    title: "How the first assessment works",
    disclaimer:
      "This is a simulation for demonstration purposes: no real tax advice is being provided at any point.",
    cta: "Request an initial assessment",
  },
};

export function Process({ locale }: { locale: Locale }) {
  const t = PROCESS_STRINGS[locale];
  const steps = getProcessSteps(locale);

  return (
    <section id="como-funciona" className="border-b border-[#16233A]/10 bg-white py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#2F8F5B] uppercase">
          {t.eyebrow}
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-[#16233A] sm:text-4xl">
          {t.title}
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title}>
              <span className="font-mono text-sm text-[#2F8F5B]">0{index + 1}</span>
              <h3 className="mt-2 text-base font-bold text-[#16233A]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4B5568]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-xl text-xs leading-relaxed text-[#4B5568]/80">
          {t.disclaimer}
        </p>

        <a
          href="#valoracion"
          className="mt-6 inline-flex items-center gap-2 bg-[#2F8F5B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#26744A]"
        >
          {t.cta}
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

const FAQ_STRINGS: Record<Locale, { eyebrow: string; title: string }> = {
  es: {
    eyebrow: "Preguntas frecuentes",
    title: "Antes de solicitar información",
  },
  en: {
    eyebrow: "FAQ",
    title: "Before you request information",
  },
};

export function Faq({ locale }: { locale: Locale }) {
  const t = FAQ_STRINGS[locale];
  const faqItems = getFaqItems(locale);

  return (
    <section id="faq" className="border-b border-[#16233A]/10 bg-[#F6F4EF] py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#2F8F5B] uppercase">
          {t.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#16233A] sm:text-4xl">
          {t.title}
        </h2>

        <div className="mt-10 divide-y divide-[#16233A]/10 border-y border-[#16233A]/10">
          {faqItems.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#16233A] marker:content-none">
                {item.question}
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-[#2F8F5B] transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#4B5568]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
