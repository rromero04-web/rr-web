import type { Locale } from "@/lib/i18n/config";
import { TaxCalendar } from "./TaxCalendar";

const STRINGS: Record<Locale, {
  audience: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  disclaimer: string;
}> = {
  es: {
    audience: "Asesoría fiscal para autónomos y pequeñas empresas",
    title: "Tus impuestos, claros y a tiempo.",
    subtitle:
      "Revisamos tu situación, ordenamos tu gestión y te decimos qué toca presentar y cuándo, antes de que llegue el plazo.",
    ctaPrimary: "Solicitar valoración inicial",
    ctaSecondary: "Ver cómo funciona",
    disclaimer: "Sin compromiso. Respuesta simulada con datos ficticios.",
  },
  en: {
    audience: "Tax advisory for freelancers and small businesses",
    title: "Your taxes, clear and on time.",
    subtitle:
      "We review your situation, organize your paperwork and tell you what to file and when, before the deadline arrives.",
    ctaPrimary: "Request an initial assessment",
    ctaSecondary: "See how it works",
    disclaimer: "No obligation. Simulated response with fictional data.",
  },
};

export function BalanceHero({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];

  return (
    <section id="hero" className="border-b border-[#CFE0D3] bg-[#F5F7F2] py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-base font-semibold text-[#1F6F4A]">{t.audience}</p>
          <h1 className="mt-4 text-[2.75rem] leading-[1.05] font-extrabold tracking-[-0.025em] text-[#14213D] sm:text-6xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-[32em] text-lg leading-relaxed text-[#4A5670]">{t.subtitle}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#valoracion"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#1F6F4A] px-6 text-base font-semibold text-white transition-colors hover:bg-[#185A3C]"
            >
              {t.ctaPrimary}
            </a>
            <a
              href="#como-funciona"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#14213D]/20 px-6 text-base font-semibold text-[#14213D] transition-colors hover:border-[#14213D]"
            >
              {t.ctaSecondary}
            </a>
          </div>
          <p className="mt-5 text-sm text-[#4A5670]">{t.disclaimer}</p>
        </div>

        <TaxCalendar locale={locale} />
      </div>
    </section>
  );
}
