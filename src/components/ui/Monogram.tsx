"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

type MonogramProps = {
  className?: string;
  interactive?: boolean;
};

export function Monogram({ className, interactive = true }: MonogramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 120, damping: 18, mass: 0.4 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn("flex items-center justify-center [perspective:900px]", className)}
    >
      <motion.div
        className="w-full max-w-[280px] motion-reduce:!transform-none"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <Image
          src="/brand/logo-mark.png"
          alt="Monograma RR de Raúl Romero"
          width={700}
          height={588}
          priority
          className="h-auto w-full drop-shadow-[0_30px_60px_rgba(8,27,46,0.18)]"
        />
      </motion.div>
    </motion.div>
  );
}
