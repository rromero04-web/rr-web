import { Search, Target, PenTool, Code2, Rocket } from "lucide-react";
import { getProcessSteps } from "@/content/process";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { AmbientDepth } from "@/components/ui/AmbientDepth";
import type { Locale } from "@/lib/i18n/config";

const STEP_ICONS = [Search, Target, PenTool, Code2, Rocket];
const STRINGS = {
  es: { eyebrow: "Proceso", title: "Cómo trabajamos, paso a paso." },
  en: { eyebrow: "Process", title: "How we work, step by step." },
};

export function Process({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  return (
    <section id="proceso" className="studio-process border-b border-line/70 bg-navy text-cream py-24 md:py-32">
      <AmbientDepth tone="dark" />
      <div className="container-page relative z-10">
        <p className="text-xs font-semibold tracking-[0.14em] text-cobalt-soft uppercase">{t.eyebrow}</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{t.title}</h2>
        <ol className="studio-process-steps mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {getProcessSteps(locale).map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <li key={step.number}>
                <RevealOnScroll delay={index * 0.04} className="h-full">
                  <article className="studio-process-step">
                    <div className="studio-process-step-top">
                      <span className="studio-process-icon"><Icon size={22} aria-hidden="true" /></span>
                      <span className="studio-process-number">{step.number}</span>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                </RevealOnScroll>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
