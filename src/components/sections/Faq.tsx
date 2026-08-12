import { Plus } from "lucide-react";
import { getFaqItems } from "@/content/faq";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import type { Locale } from "@/lib/i18n/config";

const STRINGS: Record<Locale, { eyebrow: string; title: string }> = {
  es: {
    eyebrow: "Preguntas frecuentes",
    title: "Lo que sueles preguntarme antes de empezar",
  },
  en: {
    eyebrow: "Frequently asked questions",
    title: "What people usually ask me before getting started",
  },
};

export function Faq({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const faqItems = getFaqItems(locale);

  return (
    <section id="faq" className="border-b border-line/70 py-24 md:py-32">
      <div className="container-page">
        <RevealOnScroll>
          <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
            {t.eyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {t.title}
          </h2>
        </RevealOnScroll>

        <div className="mt-12 max-w-3xl divide-y divide-line/70 border-y border-line/70">
          {faqItems.map((item, index) => (
            <RevealOnScroll key={item.question} delay={index * 0.04}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-navy marker:content-none">
                  {item.question}
                  <Plus
                    size={18}
                    className="shrink-0 text-cobalt transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate">
                  {item.answer}
                </p>
              </details>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
