import { ArrowRight } from "lucide-react";
import { Monogram } from "@/components/ui/Monogram";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-line/70 pt-32 pb-20 md:pt-44 md:pb-28"
    >
      <div className="container-page grid items-center gap-16 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <RevealOnScroll>
            <p className="inline-flex items-center gap-2 border border-navy/15 px-3 py-1.5 text-xs font-semibold tracking-[0.14em] text-slate uppercase">
              Marketing + Diseño + Desarrollo
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.08}>
            <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-navy sm:text-5xl md:text-6xl">
              Webs y aplicaciones que hacen avanzar tu negocio.
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
              Combino estrategia, diseño y desarrollo para crear soluciones
              digitales que captan clientes, simplifican procesos y ayudan a
              crecer.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.24}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#contacto"
                className="group inline-flex items-center justify-center gap-2 bg-navy px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-cobalt"
              >
                Cuéntame tu proyecto
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
              <a
                href="#servicios"
                className="inline-flex items-center justify-center gap-2 border border-navy/20 px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-cobalt hover:text-cobalt"
              >
                Probar las demos
              </a>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.2}>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,transparent_49%,var(--color-line)_49%,var(--color-line)_51%,transparent_51%)] bg-[length:28px_28px] opacity-40"
            />
            <Monogram className="h-full w-full" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
