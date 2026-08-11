"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search, Target, PenTool, Code2, Rocket, type LucideIcon } from "lucide-react";
import { processSteps } from "@/content/process";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const STEP_ICONS: LucideIcon[] = [Search, Target, PenTool, Code2, Rocket];

export function Process() {
  return (
    <section id="proceso" className="border-b border-line/70 bg-navy text-cream py-24 md:py-32">
      <div className="container-page">
        <p className="text-xs font-semibold tracking-[0.14em] text-cobalt-soft uppercase">
          Proceso
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Cómo trabajamos, paso a paso.
        </h2>
        <p className="mt-4 max-w-xl text-base text-cream/60">
          Pasa el ratón por cada tarjeta (o tócala, en móvil) para ver de qué
          trata cada paso.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, index) => (
            <RevealOnScroll key={step.number} delay={index * 0.06}>
              <ProcessCard step={step} Icon={STEP_ICONS[index]} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessCard({
  step,
  Icon,
}: {
  step: (typeof processSteps)[number];
  Icon: LucideIcon;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group h-64 cursor-pointer [perspective:1200px] sm:h-72"
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${step.title}. Pulsa para ver el detalle.`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setFlipped((f) => !f);
        }
      }}
    >
      <motion.div
        className="relative h-full w-full motion-reduce:transform-none"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Cara frontal */}
        <div
          className="absolute inset-0 flex flex-col justify-between border border-cream/15 bg-cream/[0.03] p-6 [backface-visibility:hidden]"
        >
          <div className="flex items-start justify-between">
            <div className="relative inline-flex h-12 w-12 items-center justify-center border border-cream/15 bg-cream/[0.03]">
              <Icon size={22} className="text-cobalt-soft" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute -right-2 -bottom-2 h-4 w-4 skew-x-[-12deg] bg-cobalt"
              />
            </div>
            <span className="font-mono text-xs text-cream/30">{step.number}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold sm:text-xl">{step.title}</h3>
            <p className="mt-2 text-xs text-cream/40">
              Pasa el ratón o toca para ver más
            </p>
          </div>
        </div>

        {/* Cara trasera */}
        <div
          className="absolute inset-0 flex flex-col justify-center border border-cobalt/40 bg-navy-soft p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <span className="font-mono text-xs text-cobalt-soft">{step.number}</span>
          <h3 className="mt-1 text-base font-bold">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-cream/75">
            {step.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
