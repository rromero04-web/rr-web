"use client";

import { RevealOnScroll } from "./RevealOnScroll";
import type { ReactNode } from "react";

type DepthRevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

// Keep content visible before hydration. A persistent filter, even blur(0),
// creates a backdrop root and prevents nested glass from blurring the page.
export function DepthReveal({ children, delay = 0, className }: DepthRevealProps) {
  return (
    <RevealOnScroll delay={delay} className={className}>
      {children}
    </RevealOnScroll>
  );
}
