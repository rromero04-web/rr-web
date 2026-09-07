"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  lift?: boolean;
};

// Profundidad de dos capas:
// 1) Entrada por scroll (rotateX + escala): funciona igual en cualquier
//    dispositivo, incluido táctil, sin depender del ratón.
// 2) Tilt de puntero (rotateY): solo en escritorio, se suma encima sin
//    pisar el eje de la entrada.
// El resultado es una tarjeta que llega "en perspectiva" y responde al
// cursor una vez asentada — se desactiva por completo con reduced motion.
export function TiltCard({ children, className, maxTilt = 7, glare = true, lift = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const hover = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 20, mass: 0.6 };
  const springX = useSpring(pointerX, springConfig);
  const springY = useSpring(pointerY, springConfig);
  const springHover = useSpring(hover, { stiffness: 220, damping: 24 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "start 55%"] });
  const entryRotateX = useTransform(scrollYProgress, [0, 1], [7, 0]);
  const entryY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const entryScale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  const entryOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const pointerRotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt]);
  const pointerRotateXOffset = useTransform(springY, [0, 1], [maxTilt * 0.4, -maxTilt * 0.4]);
  const rotateX = useTransform([entryRotateX, pointerRotateXOffset], ([a, b]) => Number(a) + Number(b));
  const liftScale = useTransform(springHover, [0, 1], [1, lift ? 1.035 : 1]);
  const scale = useTransform([entryScale, liftScale], ([a, b]) => Number(a) * Number(b));
  const shadowOpacity = useTransform(springHover, [0, 1], [0.08, 0.28]);
  const boxShadow = useTransform(shadowOpacity, (v) => `0 ${24 + v * 60}px ${40 + v * 40}px -${20}px rgba(8,27,46,${v})`);

  const glareX = useTransform(springX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(springY, [0, 1], ["0%", "100%"]);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(460px circle at ${x} ${y}, rgba(255,255,255,0.22), transparent 60%)`
  );

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
    hover.set(1);
  }

  function handlePointerLeave() {
    pointerX.set(0.5);
    pointerY.set(0.5);
    hover.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX,
        rotateY: pointerRotateY,
        y: entryY,
        scale,
        opacity: entryOpacity,
        transformPerspective: 2200,
        boxShadow: lift ? boxShadow : undefined,
      }}
      className={`studio-tilt motion-reduce:!transform-none motion-reduce:!opacity-100 ${className ?? ""}`}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden="true"
          className="studio-tilt-glare motion-reduce:!hidden"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
}
