"use client";

import { useState } from "react";
import { getSituations, type SituationId } from "./content";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

const STRINGS: Record<Locale, { heading: string; cta: string }> = {
  es: {
    heading: "¿Cuál describe mejor tu situación?",
    cta: "Solicitar valoración",
  },
  en: {
    heading: "Which one best describes your situation?",
    cta: "Request an assessment",
  },
};

export function SituationSelector({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState<SituationId | null>(null);
  const t = STRINGS[locale];
  const situations = getSituations(locale);
  const active = situations.find((s) => s.id === selected);

  return (
    <section className="border-b border-[#CFE0D3] bg-white py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h2 className="text-2xl leading-tight font-extrabold tracking-[-0.02em] text-[#14213D] sm:text-3xl">
          {t.heading}
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {situations.map((situation) => {
            const isActive = situation.id === selected;
            return (
              <button
                key={situation.id}
                type="button"
                onClick={() => setSelected(situation.id)}
                aria-pressed={isActive}
                className={cn(
                  "min-h-14 rounded-md border px-5 py-3.5 text-left text-base font-semibold transition-colors",
                  isActive
                    ? "border-[#1F6F4A] bg-[#EAF3EC] text-[#14213D] shadow-[inset_0_0_0_1px_#1F6F4A]"
                    : "border-[#14213D]/15 text-[#14213D] hover:border-[#14213D]/50"
                )}
              >
                {situation.label}
              </button>
            );
          })}
        </div>

        {active && (
          <div role="status" className="mt-6 flex flex-col items-start gap-4 rounded-md border-l-4 border-[#1F6F4A] bg-[#EAF3EC] p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base leading-relaxed text-[#14213D]">{active.message}</p>
            <a
              href="#valoracion"
              className="inline-flex min-h-11 shrink-0 items-center rounded-md bg-[#1F6F4A] px-5 text-base font-semibold text-white transition-colors hover:bg-[#185A3C]"
            >
              {t.cta}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
