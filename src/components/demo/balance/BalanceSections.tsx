import { Check, X, Plus } from "lucide-react";
import {
  getProblems,
  getBalanceServices,
  getBeforeItems,
  getAfterItems,
  getProcessSteps,
  getFaqItems,
} from "./content";
import type { Locale } from "@/lib/i18n/config";

const SECTION_TITLE = "text-3xl leading-[1.1] font-extrabold tracking-[-0.02em] text-[#14213D] sm:text-[2.5rem]";

const PROBLEMS_STRINGS: Record<Locale, { title: string }> = {
  es: { title: "Problemas que reconocerás si gestionas tu propia actividad." },
  en: { title: "Problems you'll recognize if you manage your own activity." },
};

export function Problems({ locale }: { locale: Locale }) {
  const t = PROBLEMS_STRINGS[locale];
  const problems = getProblems(locale);

  return (
    <section id="para-quien" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className={`max-w-2xl ${SECTION_TITLE}`}>{t.title}</h2>

        <ul className="mt-12 grid gap-x-12 border-t-2 border-[#14213D] sm:grid-cols-2">
          {problems.map((item) => (
            <li key={item.problem} className="border-b border-[#CFE0D3] py-6">
              <p className="flex items-start gap-3 text-lg font-semibold text-[#14213D]">
                <X size={18} className="mt-1 shrink-0 text-[#B4483A]" aria-hidden="true" />
                {item.problem}
              </p>
              <p className="mt-2 flex items-start gap-3 text-base leading-relaxed text-[#4A5670]">
                <Check size={18} className="mt-0.5 shrink-0 text-[#1F6F4A]" aria-hidden="true" />
                {item.solution}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const SERVICES_STRINGS: Record<Locale, { title: string }> = {
  es: { title: "Lo que gestionamos por ti" },
  en: { title: "What we manage for you" },
};

export function Services({ locale }: { locale: Locale }) {
  const t = SERVICES_STRINGS[locale];
  const services = getBalanceServices(locale);

  return (
    <section id="servicios" className="scroll-mt-20 bg-[#F5F7F2] py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className={SECTION_TITLE}>{t.title}</h2>
        <dl className="border-t-2 border-[#14213D]">
          {services.map((service) => (
            <div key={service.title} className="grid gap-1 border-b border-[#CFE0D3] py-5 sm:grid-cols-[1fr_1.3fr] sm:gap-8">
              <dt className="text-lg font-semibold text-[#14213D]">{service.title}</dt>
              <dd className="text-base leading-relaxed text-[#4A5670]">{service.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const COMPARISON_STRINGS: Record<Locale, {
  title: string;
  caption: string;
  beforeHeading: string;
  afterHeading: string;
}> = {
  es: {
    title: "De la gestión desordenada a la gestión centralizada.",
    caption: "Cómo cambia tu gestión al trabajar con una asesoría",
    beforeHeading: "Gestión desordenada",
    afterHeading: "Gestión centralizada",
  },
  en: {
    title: "From scattered management to centralized management.",
    caption: "How your paperwork changes when you work with an advisor",
    beforeHeading: "Scattered management",
    afterHeading: "Centralized management",
  },
};

// Antes y después como una hoja de libro contable: dos columnas enfrentadas,
// fila a fila, con el "saldo" a favor en la columna verde.
export function Comparison({ locale }: { locale: Locale }) {
  const t = COMPARISON_STRINGS[locale];
  const beforeItems = getBeforeItems(locale);
  const afterItems = getAfterItems(locale);
  const rows = Math.max(beforeItems.length, afterItems.length);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <h2 className={`max-w-2xl ${SECTION_TITLE}`}>{t.title}</h2>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">{t.caption}</caption>
            <thead>
              <tr className="border-b-2 border-[#14213D]">
                <th scope="col" className="w-1/2 py-3 pr-6 text-base font-semibold text-[#4A5670]">{t.beforeHeading}</th>
                <th scope="col" className="w-1/2 bg-[#EAF3EC] px-5 py-3 text-base font-semibold text-[#1F6F4A]">{t.afterHeading}</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }, (_, index) => (
                <tr key={index} className="border-b border-[#CFE0D3] align-top">
                  <td className="py-4 pr-6 text-base text-[#4A5670]">
                    {beforeItems[index] && (
                      <span className="flex items-start gap-3">
                        <X size={17} className="mt-1 shrink-0 text-[#B4483A]" aria-hidden="true" />
                        {beforeItems[index]}
                      </span>
                    )}
                  </td>
                  <td className="bg-[#EAF3EC] px-5 py-4 text-base text-[#14213D]">
                    {afterItems[index] && (
                      <span className="flex items-start gap-3">
                        <Check size={17} className="mt-1 shrink-0 text-[#1F6F4A]" aria-hidden="true" />
                        {afterItems[index]}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const PROCESS_STRINGS: Record<Locale, {
  title: string;
  disclaimer: string;
  cta: string;
}> = {
  es: {
    title: "Cómo funciona la primera valoración",
    disclaimer:
      "Se trata de una simulación con fines de demostración: no se está prestando asesoramiento fiscal real en ningún momento.",
    cta: "Solicitar valoración inicial",
  },
  en: {
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
    <section id="como-funciona" className="scroll-mt-20 bg-[#14213D] py-24 text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="max-w-2xl text-3xl leading-[1.1] font-extrabold tracking-[-0.02em] sm:text-[2.5rem]">{t.title}</h2>

        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-[#7FC4A0] pt-5">
              <span className="text-4xl font-extrabold text-[#7FC4A0] tabular-nums" aria-hidden="true">{index + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-white/75">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-white/65">{t.disclaimer}</p>
          <a
            href="#valoracion"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-md bg-white px-6 text-base font-semibold text-[#14213D] transition-colors hover:bg-[#EAF3EC]"
          >
            {t.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

const FAQ_STRINGS: Record<Locale, { title: string }> = {
  es: { title: "Antes de solicitar información" },
  en: { title: "Before you request information" },
};

export function Faq({ locale }: { locale: Locale }) {
  const t = FAQ_STRINGS[locale];
  const faqItems = getFaqItems(locale);

  return (
    <section id="faq" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h2 className={SECTION_TITLE}>{t.title}</h2>

        <div className="mt-10 border-t-2 border-[#14213D]">
          {faqItems.map((item) => (
            <details key={item.question} className="group border-b border-[#CFE0D3]">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold text-[#14213D] marker:content-none">
                {item.question}
                <Plus
                  size={20}
                  aria-hidden="true"
                  className="shrink-0 text-[#1F6F4A] transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="pb-6 text-base leading-relaxed text-[#4A5670]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
