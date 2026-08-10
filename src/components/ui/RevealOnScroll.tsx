"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function RevealOnScroll({ children, delay = 0, className }: RevealOnScrollProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
