"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { processSteps } from "@/content/process";

export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="proceso" className="border-b border-line/70 bg-navy text-cream">
      <div className="container-page py-24 md:py-32">
        <p className="text-xs font-semibold tracking-[0.14em] text-cobalt-soft uppercase">
          Proceso
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Cómo trabajamos, paso a paso.
        </h2>
      </div>

      <div ref={sectionRef} className="relative">
        {processSteps.map((step, index) => (
          <div
            key={step.number}
            className="sticky top-0 flex min-h-screen items-center border-t border-cream/10 bg-navy py-16"
            style={{ zIndex: index + 1 }}
          >
            <div className="container-page grid w-full items-center gap-10 md:grid-cols-[auto_1fr]">
              <span
                aria-hidden="true"
                className="font-mono text-[clamp(4rem,14vw,9rem)] leading-none font-bold text-cream/10"
              >
                {step.number}
              </span>
              <div className="max-w-xl">
                <h3 className="text-2xl font-bold sm:text-3xl">{step.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-cream/70 sm:text-lg">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-6 hidden w-px bg-cream/10 md:block"
        >
          <motion.div
            className="w-px bg-cobalt"
            style={{ height: lineHeight, transformOrigin: "top" }}
          />
        </div>
      </div>
    </section>
  );
}
