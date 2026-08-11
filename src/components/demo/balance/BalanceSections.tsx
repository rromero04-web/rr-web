import { ArrowRight, Check, X, ChevronDown } from "lucide-react";
import {
  PROBLEMS,
  SERVICES,
  BEFORE_ITEMS,
  AFTER_ITEMS,
  PROCESS_STEPS,
  FAQ_ITEMS,
} from "./content";

export function Problems() {
  return (
    <section id="para-quien" className="border-b border-[#16233A]/10 bg-[#F6F4EF] py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#2F8F5B] uppercase">
          Para quién
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-[#16233A] sm:text-4xl">
          Problemas que reconocerás si gestionas tu propia actividad.
        </h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {PROBLEMS.map((item) => (
            <div key={item.problem} className="border border-[#16233A]/10 bg-white p-5">
              <p className="flex items-start gap-2 text-sm font-semibold text-[#16233A]">
                <X size={16} className="mt-0.5 shrink-0 text-[#B4483A]" aria-hidden="true" />
                {item.problem}
              </p>
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-[#4B5568]">
                <Check size={16} className="mt-0.5 shrink-0 text-[#2F8F5B]" aria-hidden="true" />
                {item.solution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="servicios" className="border-b border-[#16233A]/10 bg-white py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#2F8F5B] uppercase">
          Servicios
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-[#16233A] sm:text-4xl">
          Lo que gestionamos por ti
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden border border-[#16233A]/10 bg-[#16233A]/10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div key={service.title} className="bg-white p-6">
              <h3 className="text-base font-bold text-[#16233A]">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4B5568]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Comparison() {
  return (
    <section className="border-b border-[#16233A]/10 bg-[#F6F4EF] py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#2F8F5B] uppercase">
          Antes y después
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-[#16233A] sm:text-4xl">
          De la gestión desordenada a la gestión centralizada.
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="border border-[#16233A]/10 bg-white p-6">
            <h3 className="text-sm font-bold tracking-wide text-[#4B5568] uppercase">
              Gestión desordenada
            </h3>
            <ul className="mt-4 space-y-3">
              {BEFORE_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#4B5568]">
                  <X size={15} className="mt-0.5 shrink-0 text-[#B4483A]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-[#2F8F5B]/40 bg-[#2F8F5B]/5 p-6">
            <h3 className="text-sm font-bold tracking-wide text-[#26744A] uppercase">
              Gestión centralizada
            </h3>
            <ul className="mt-4 space-y-3">
              {AFTER_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#16233A]">
                  <Check size={15} className="mt-0.5 shrink-0 text-[#2F8F5B]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="como-funciona" className="border-b border-[#16233A]/10 bg-white py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#2F8F5B] uppercase">
          Proceso
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-[#16233A] sm:text-4xl">
          Cómo funciona la primera valoración
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => (
            <div key={step.title}>
              <span className="font-mono text-sm text-[#2F8F5B]">0{index + 1}</span>
              <h3 className="mt-2 text-base font-bold text-[#16233A]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4B5568]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-xl text-xs leading-relaxed text-[#4B5568]/80">
          Se trata de una simulación con fines de demostración: no se está
          prestando asesoramiento fiscal real en ningún momento.
        </p>

        <a
          href="#valoracion"
          className="mt-6 inline-flex items-center gap-2 bg-[#2F8F5B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#26744A]"
        >
          Solicitar valoración inicial
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="border-b border-[#16233A]/10 bg-[#F6F4EF] py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#2F8F5B] uppercase">
          Preguntas frecuentes
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#16233A] sm:text-4xl">
          Antes de solicitar información
        </h2>

        <div className="mt-10 divide-y divide-[#16233A]/10 border-y border-[#16233A]/10">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#16233A] marker:content-none">
                {item.question}
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-[#2F8F5B] transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#4B5568]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
