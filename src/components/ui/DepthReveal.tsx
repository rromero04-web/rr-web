"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type DepthRevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

// Revelado "cinematográfico": el contenido entra desde un ligero desenfoque
// y una escala reducida, como si enfocara al llegar a cuadro. Framer Motion
// respeta `prefers-reduced-motion` automáticamente vía MotionConfig en la
// raíz; aquí además se recorta la duración para no generar mareo.
export function DepthReveal({ children, delay = 0, className }: DepthRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
