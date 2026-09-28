import { getProcessSteps } from "@/content/process";
import type { Locale } from "@/lib/i18n/config";

const STRINGS = {
  es: { title: "Cómo trabajamos, paso a paso.", intro: "Cinco fases, siempre en el mismo orden. Ves avances reales desde las primeras semanas y nada se cierra sin que lo hayas revisado." },
  en: { title: "How we work, step by step.", intro: "Five phases, always in the same order. You see real progress from the first weeks, and nothing is final until you've reviewed it." },
};

export function Process({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  return (
    <section id="proceso" className="rr-section rr-process">
      <div className="container-page">
        <div className="rr-section-head">
          <h2 className="rr-display rr-section-title">{t.title}</h2>
          <p className="rr-section-intro">{t.intro}</p>
        </div>
        <ol className="rr-steps">
          {getProcessSteps(locale).map((step) => (
            <li key={step.number}>
              <span className="rr-step-number" aria-hidden="true">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
