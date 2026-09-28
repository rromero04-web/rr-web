"use client";

import { useState } from "react";
import { Check, Info, Plus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import {
  getTrustSignals,
  getTreatments,
  getHowItWorks,
  getTeam,
  getFaqItems,
} from "./content";

const STRINGS: Record<Locale, {
  treatmentsTitle: string;
  treatmentsIntro: string;
  seeLess: string;
  seeMore: string;
  howItWorksTitle: string;
  aboutTitle: string;
  aboutIntro: string;
  aboutDisclaimer: string;
  faqTitle: string;
  faqDisclaimer: string;
}> = {
  es: {
    treatmentsTitle: "Un plan pensado para tu caso, no una plantilla.",
    treatmentsIntro: "Estas son las molestias que más tratamos. Si la tuya no aparece, cuéntanosla igualmente.",
    seeLess: "Ver menos",
    seeMore: "Ampliar información",
    howItWorksTitle: "Tu primera visita, paso a paso.",
    aboutTitle: "Un equipo cercano, centrado en tu recuperación.",
    aboutIntro: "Te atiende siempre el mismo fisioterapeuta, que conoce tu historia y tu evolución.",
    aboutDisclaimer:
      "El equipo y los datos mostrados son ficticios, creados únicamente para esta demostración.",
    faqTitle: "Antes de escribirnos",
    faqDisclaimer:
      "Estas respuestas son orientativas y no constituyen consejo médico personalizado.",
  },
  en: {
    treatmentsTitle: "A plan built for your case, not a template.",
    treatmentsIntro: "These are the problems we treat most often. If yours isn't listed, tell us about it anyway.",
    seeLess: "See less",
    seeMore: "Read more",
    howItWorksTitle: "Your first visit, step by step.",
    aboutTitle: "A close-knit team, focused on your recovery.",
    aboutIntro: "You're always seen by the same physiotherapist, who knows your history and your progress.",
    aboutDisclaimer:
      "The team and data shown are fictional, created solely for this demonstration.",
    faqTitle: "Before you reach out",
    faqDisclaimer:
      "These answers are for guidance only and do not constitute personalized medical advice.",
  },
};

const SECTION_TITLE = "text-3xl leading-[1.1] font-bold tracking-[-0.015em] text-[#0F4C45] sm:text-[2.75rem]";

export function TrustBar({ locale }: { locale: Locale }) {
  const trustSignals = getTrustSignals(locale);
  return (
    <section className="border-y border-[#D6E2DD] bg-[#F2F7F4] py-12">
      <ul className="mx-auto grid max-w-6xl gap-8 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {trustSignals.map((item) => (
          <li key={item.title} className="flex gap-3">
            <Check size={20} className="mt-0.5 shrink-0 text-[#1C7F9C]" aria-hidden="true" />
            <div>
              <p className="text-base font-bold text-[#0F4C45]">{item.title}</p>
              <p className="mt-1 text-base leading-relaxed text-[#5E716C]">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Treatments({ locale }: { locale: Locale }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const t = STRINGS[locale];
  const treatments = getTreatments(locale);

  return (
    <section id="tratamientos" className="scroll-mt-20 bg-[#FBFCFA] py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className={SECTION_TITLE}>{t.treatmentsTitle}</h2>
          <p className="mt-5 max-w-[30em] text-lg leading-relaxed text-[#5E716C]">{t.treatmentsIntro}</p>
        </div>

        <ul className="border-t border-[#0F4C45]">
          {treatments.map((treatment) => {
            const isOpen = openId === treatment.id;
            const panelId = `fn-treatment-${treatment.id}`;
            return (
              <li key={treatment.id} className="border-b border-[#D6E2DD] py-6">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : treatment.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-start justify-between gap-6 text-left"
                >
                  <span>
                    <span className="block text-xl font-bold text-[#0F4C45]">{treatment.title}</span>
                    <span className="mt-1.5 block text-base leading-relaxed text-[#5E716C]">{treatment.summary}</span>
                  </span>
                  <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D6E2DD] text-[#0F4C45]">
                    <Plus size={18} aria-hidden="true" className={`transition-transform ${isOpen ? "rotate-45" : ""}`} />
                    <span className="sr-only">{isOpen ? t.seeLess : t.seeMore}</span>
                  </span>
                </button>
                {isOpen && (
                  <p id={panelId} className="mt-4 max-w-[36em] text-base leading-relaxed text-[#3F5752]">
                    {treatment.detail}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function HowItWorks({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const steps = getHowItWorks(locale);

  return (
    <section className="bg-[#0F4C45] py-24 text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="max-w-xl text-3xl leading-[1.1] font-bold tracking-[-0.015em] sm:text-[2.75rem]">
          {t.howItWorksTitle}
        </h2>

        <ol className="mt-14 grid gap-10 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-[#1C9CC0] pt-6">
              <span className="text-5xl font-bold text-[#8CCFE0] tabular-nums" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-white/80">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function About({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const team = getTeam(locale);

  return (
    <section id="clinica" className="scroll-mt-20 bg-[#FBFCFA] py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className={SECTION_TITLE}>{t.aboutTitle}</h2>
          <p className="mt-5 max-w-[30em] text-lg leading-relaxed text-[#5E716C]">{t.aboutIntro}</p>
        </div>

        <div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {team.map((member) => (
              <li key={member.id} className="rounded-2xl bg-[#F2F7F4] p-6">
                <span
                  aria-hidden="true"
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#DDEDE6] text-xl font-bold text-[#0F4C45]"
                >
                  {member.initials}
                </span>
                <p className="mt-5 text-xl font-bold text-[#0F4C45]">{member.name}</p>
                <p className="mt-1 text-base text-[#5E716C]">{member.role}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-start gap-2 text-sm text-[#5E716C]">
            <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            {t.aboutDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Faq({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const faqItems = getFaqItems(locale);

  return (
    <section id="faq" className="scroll-mt-20 border-t border-[#D6E2DD] bg-[#FBFCFA] py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h2 className={SECTION_TITLE}>{t.faqTitle}</h2>

        <div className="mt-10 border-t border-[#0F4C45]">
          {faqItems.map((item) => (
            <details key={item.question} className="group border-b border-[#D6E2DD]">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-bold text-[#0F4C45] marker:content-none">
                {item.question}
                <Plus
                  size={20}
                  aria-hidden="true"
                  className="shrink-0 text-[#1C7F9C] transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="pb-6 text-base leading-relaxed text-[#3F5752]">{item.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-5 text-sm text-[#5E716C]">{t.faqDisclaimer}</p>
      </div>
    </section>
  );
}
