"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealOnScrollProps = { children: ReactNode; delay?: number; className?: string };

// Content stays visible in server HTML and with reduced motion. The observer
// adds a short entrance only when the element actually enters the viewport.
export function RevealOnScroll({ children, delay = 0, className }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      element.animate([{ opacity: 0.65, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], {
        duration: 380, delay: Math.min(delay * 1000, 160), easing: "cubic-bezier(.16,1,.3,1)",
      });
      observer.disconnect();
    }, { threshold: 0.08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}
