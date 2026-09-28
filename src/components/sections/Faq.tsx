import { Plus } from "lucide-react";
import { getFaqItems } from "@/content/faq";
import type { Locale } from "@/lib/i18n/config";

const STRINGS: Record<Locale, { title: string; intro: string }> = {
  es: {
    title: "Lo que sueles preguntarme antes de empezar.",
    intro: "Si tu duda no está aquí, escríbeme y te respondo personalmente.",
  },
  en: {
    title: "What people usually ask me before getting started.",
    intro: "If your question isn't here, write to me and I'll answer personally.",
  },
};

export function Faq({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];

  return (
    <section id="faq" className="rr-section">
      <div className="container-page rr-faq">
        <div className="rr-faq-head">
          <h2 className="rr-display rr-section-title">{t.title}</h2>
          <p className="rr-section-intro mt-6">{t.intro}</p>
        </div>
        <div className="rr-faq-list">
          {getFaqItems(locale).map((item) => (
            <details key={item.question}>
              <summary>
                {item.question}
                <Plus size={20} aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
