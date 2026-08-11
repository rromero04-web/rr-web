import Link from "next/link";
import { ArrowRight, Check, MonitorPlay } from "lucide-react";
import { services } from "@/content/services";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function Services() {
  return (
    <section id="servicios" className="border-b border-line/70 py-24 md:py-32">
      <div className="container-page">
        <RevealOnScroll>
          <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
            Servicios
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Tres formas de ayudarte a crecer, según dónde estés ahora mismo.
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-slate">
            Prueba ejemplos interactivos del tipo de solución que puedo crear
            para tu negocio.
          </p>
        </RevealOnScroll>

        <div className="mt-14 grid gap-px overflow-hidden border border-line/70 bg-line/70 md:grid-cols-3">
          {services.map((service, index) => (
            <RevealOnScroll key={service.slug} delay={index * 0.08} className="h-full">
              <article className="flex h-full flex-col bg-cream p-8">
                <span className="font-mono text-sm text-slate">
                  {service.number}
                </span>
                <h3 className="mt-4 text-xl font-bold text-navy">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  <span className="font-semibold text-navy">Para quién:</span>{" "}
                  {service.audience}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate">
                  <span className="font-semibold text-navy">Resuelve:</span>{" "}
                  {service.problem}
                </p>

                <ul className="mt-5 flex flex-col gap-2.5">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate">
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-cobalt"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col items-start gap-3 pt-8">
                  <a
                    href="#contacto"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-cobalt"
                  >
                    {service.nextStep}
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>

                  {service.demoHref && (
                    <Link
                      href={service.demoHref}
                      className="inline-flex items-center gap-2 bg-navy px-4 py-2.5 text-xs font-semibold text-cream transition-colors hover:bg-cobalt"
                    >
                      <MonitorPlay size={14} aria-hidden="true" />
                      {service.demoLabel}
                    </Link>
                  )}
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
