"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SegmentedControlProps<Id extends string> {
  label: string;
  options: { id: Id; label: string }[];
  value: Id;
  onChange: (id: Id) => void;
}

export function SegmentedControl<Id extends string>({ label, options, value, onChange }: SegmentedControlProps<Id>) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex border border-line/70 bg-cream p-1">
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative px-4 py-2 text-xs font-semibold transition-colors motion-reduce:transition-none",
              active ? "text-cream" : "text-navy hover:text-cobalt"
            )}
          >
            {active && (
              <motion.span
                layoutId={`segmented-${label}`}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 -z-10 bg-navy"
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
