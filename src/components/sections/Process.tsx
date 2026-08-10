"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Search, Target, PenTool, Code2, Rocket, type LucideIcon } from "lucide-react";
import { processSteps } from "@/content/process";

const STEP_ICONS: LucideIcon[] = [Search, Target, PenTool, Code2, Rocket];

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
        {processSteps.map((step, index) => {
          const Icon = STEP_ICONS[index];
          return (
            <div
              key={step.number}
              className="sticky top-0 flex min-h-screen items-center overflow-hidden border-t border-cream/10 bg-navy py-16"
              style={{ zIndex: index + 1 }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-[4vw] top-1/2 -translate-y-1/2 font-mono text-[clamp(10rem,32vw,26rem)] leading-none font-bold text-cream/[0.04]"
              >
                {step.number}
              </span>

              <div className="container-page relative w-full">
                <div className="max-w-xl">
                  <div className="relative inline-flex h-14 w-14 items-center justify-center border border-cream/15 bg-cream/[0.03]">
                    <Icon size={24} className="text-cobalt-soft" aria-hidden="true" />
                    <span
                      aria-hidden="true"
                      className="absolute -right-2.5 -bottom-2.5 h-5 w-5 skew-x-[-12deg] bg-cobalt"
                    />
                  </div>

                  <p className="mt-6 font-mono text-sm text-cream/40">
                    Paso {step.number}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold sm:text-3xl">{step.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-cream/70 sm:text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

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
