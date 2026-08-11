"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView } from "motion/react";
import { Search, Target, PenTool, Code2, Rocket, type LucideIcon } from "lucide-react";
import { processSteps } from "@/content/process";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

const STEP_ICONS: LucideIcon[] = [Search, Target, PenTool, Code2, Rocket];

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeToHoverCapability(callback: () => void) {
  const mql = window.matchMedia(HOVER_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getHoverCapability() {
  return window.matchMedia(HOVER_QUERY).matches;
}

function getHoverCapabilityServerSnapshot() {
  return false;
}

// Detecta si el dispositivo tiene ratón (hover real) sin usar un efecto,
// para evitar renders en cascada: en escritorio activamos el giro por
// hover; en táctil, por aparición en pantalla (ver useInView más abajo).
function useHasHover() {
  return useSyncExternalStore(
    subscribeToHoverCapability,
    getHoverCapability,
    getHoverCapabilityServerSnapshot
  );
}

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
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { amount: 0.6 });
  const hasHover = useHasHover();
  const [hovered, setHovered] = useState(false);

  // Escritorio (con ratón): gira al pasar por encima o al llegar por teclado.
  // Móvil/táctil (sin ratón): gira sola al aparecer en pantalla durante el scroll.
  const flipped = hasHover ? hovered : inView;

  return (
    <div
      ref={cardRef}
      className="h-64 [perspective:1200px] sm:h-72"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="group"
      aria-label={`${step.title}: ${step.description}`}
    >
      <motion.div
        className="relative h-full w-full motion-reduce:transform-none"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
          // En móvil (sin hover), espera 2 s tras aparecer en pantalla antes
          // de girar; en escritorio y al volver a la cara frontal, sin retraso.
          delay: !hasHover && flipped ? 2 : 0,
        }}
      >
        {/* Cara frontal */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-start justify-between border bg-cream/[0.03] p-6 transition-colors duration-300 [backface-visibility:hidden]",
            flipped ? "border-cobalt/50" : "border-cream/15"
          )}
        >
          <div className="relative inline-flex h-14 w-14 items-center justify-center border border-cream/15 bg-cream/[0.03]">
            <Icon size={24} className="text-cobalt-soft" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute -right-2.5 -bottom-2.5 h-5 w-5 skew-x-[-12deg] bg-cobalt"
            />
          </div>
          <div>
            <span className="font-mono text-xs text-cream/30">{step.number}</span>
            <h3 className="mt-1 text-lg font-bold sm:text-xl">{step.title}</h3>
          </div>
        </div>

        {/* Cara trasera */}
        <div className="absolute inset-0 flex flex-col justify-center border border-cobalt/50 bg-navy-soft p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
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
