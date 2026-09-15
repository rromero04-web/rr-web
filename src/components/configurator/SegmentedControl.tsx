"use client";

import { cn } from "@/lib/utils";

interface SegmentedControlProps<Id extends string> {
  label: string;
  options: { id: Id; label: string }[];
  value: Id;
  onChange: (id: Id) => void;
}

export function SegmentedControl<Id extends string>({ label, options, value, onChange }: SegmentedControlProps<Id>) {
  return (
    <div role="radiogroup" aria-label={label} className="studio-segmented inline-flex border border-line/70 bg-cream p-1">
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
              active ? "bg-navy text-cream" : "text-navy hover:text-cobalt"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
