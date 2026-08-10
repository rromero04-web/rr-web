import { Plus } from "lucide-react";
import { faqItems } from "@/content/faq";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function Faq() {
  return (
    <section id="faq" className="border-b border-line/70 py-24 md:py-32">
      <div className="container-page">
        <RevealOnScroll>
          <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
            Preguntas frecuentes
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Lo que sueles preguntarme antes de empezar
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
