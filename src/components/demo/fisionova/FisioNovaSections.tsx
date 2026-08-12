"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import {
  getTrustSignals,
  getTreatments,
  getHowItWorks,
  getTeam,
  getFaqItems,
} from "./content";

const STRINGS: Record<Locale, {
  treatmentsEyebrow: string;
  treatmentsTitle: string;
  seeLess: string;
  seeMore: string;
  howItWorksEyebrow: string;
  howItWorksTitle: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutDisclaimer: string;
  faqEyebrow: string;
  faqTitle: string;
  faqDisclaimer: string;
}> = {
  es: {
    treatmentsEyebrow: "Tratamientos",
    treatmentsTitle: "Un plan pensado para tu caso, no una plantilla.",
    seeLess: "Ver menos",
    seeMore: "Ampliar información",
    howItWorksEyebrow: "Cómo funciona",
    howItWorksTitle: "Tres pasos, sin complicaciones.",
    aboutEyebrow: "La clínica",
    aboutTitle: "Un equipo cercano, centrado en tu recuperación.",
    aboutDisclaimer:
      "El equipo y los datos mostrados son ficticios, creados únicamente para esta demostración.",
    faqEyebrow: "Preguntas frecuentes",
    faqTitle: "Antes de escribirnos",
    faqDisclaimer:
      "Estas respuestas son orientativas y no constituyen consejo médico personalizado.",
  },
  en: {
    treatmentsEyebrow: "Treatments",
    treatmentsTitle: "A plan built for your case, not a template.",
    seeLess: "See less",
    seeMore: "Read more",
    howItWorksEyebrow: "How it works",
    howItWorksTitle: "Three steps, no complications.",
    aboutEyebrow: "The clinic",
    aboutTitle: "A close-knit team, focused on your recovery.",
    aboutDisclaimer:
      "The team and data shown are fictional, created solely for this demonstration.",
    faqEyebrow: "FAQ",
    faqTitle: "Before you reach out",
    faqDisclaimer:
      "These answers are for guidance only and do not constitute personalized medical advice.",
  },
};

export function TrustBar({ locale }: { locale: Locale }) {
  const trustSignals = getTrustSignals(locale);
  return (
    <section className="border-b border-[#E4DFD3] bg-[#0B4F49] py-10">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {trustSignals.map((item) => (
          <div key={item.title}>
            <p className="text-sm font-bold text-white">{item.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/70">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Treatments({ locale }: { locale: Locale }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const t = STRINGS[locale];
  const treatments = getTreatments(locale);

  return (
    <section id="tratamientos" className="border-b border-[#E4DFD3] bg-[#FAF9F5] py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#0E6E64] uppercase">
          {t.treatmentsEyebrow}
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-[#123832] sm:text-4xl">
          {t.treatmentsTitle}
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {treatments.map((treatment) => {
            const isOpen = openId === treatment.id;
            return (
              <div key={treatment.id} className="border border-[#E4DFD3] bg-white p-6">
                <h3 className="text-lg font-bold text-[#123832]">{treatment.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5C726D]">
                  {treatment.summary}
                </p>
                {isOpen && (
                  <p className="mt-3 border-t border-[#E4DFD3] pt-3 text-sm leading-relaxed text-[#5C726D]">
                    {treatment.detail}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : treatment.id)}
                  aria-expanded={isOpen}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E6E64] hover:text-[#0B4F49]"
                >
                  {isOpen ? t.seeLess : t.seeMore}
                  <ChevronDown
                    size={15}
                    aria-hidden="true"
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const steps = getHowItWorks(locale);

  return (
    <section className="border-b border-[#E4DFD3] bg-[#F1EFE7] py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#0E6E64] uppercase">
          {t.howItWorksEyebrow}
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-[#123832] sm:text-4xl">
          {t.howItWorksTitle}
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title}>
              <span className="font-mono text-sm text-[#0E6E64]">
                0{index + 1}
              </span>
              <h3 className="mt-2 text-lg font-bold text-[#123832]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5C726D]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const team = getTeam(locale);

  return (
    <section id="clinica" className="border-b border-[#E4DFD3] bg-[#FAF9F5] py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#0E6E64] uppercase">
          {t.aboutEyebrow}
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-[#123832] sm:text-4xl">
          {t.aboutTitle}
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {team.map((member) => (
            <div key={member.id} className="flex items-center gap-4 border border-[#E4DFD3] bg-white p-5">
              <span
                aria-hidden="true"
                className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0E6E64]/10 text-base font-bold text-[#0B4F49]"
              >
                {member.initials}
              </span>
              <div>
                <p className="text-base font-bold text-[#123832]">{member.name}</p>
                <p className="text-sm text-[#5C726D]">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 flex items-start gap-2 text-xs text-[#5C726D]/80">
          <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          {t.aboutDisclaimer}
        </p>
      </div>
    </section>
  );
}

export function Faq({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const faqItems = getFaqItems(locale);

  return (
    <section id="faq" className="border-b border-[#E4DFD3] bg-[#F1EFE7] py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#0E6E64] uppercase">
          {t.faqEyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#123832] sm:text-4xl">
          {t.faqTitle}
        </h2>

        <div className="mt-10 divide-y divide-[#E4DFD3] border-y border-[#E4DFD3]">
          {faqItems.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#123832] marker:content-none">
                {item.question}
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-[#0E6E64] transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#5C726D]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
        <p className="mt-4 text-xs text-[#5C726D]/70">
          {t.faqDisclaimer}
        </p>
      </div>
    </section>
  );
}
