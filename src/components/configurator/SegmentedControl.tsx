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
    <div role="radiogroup" aria-label={label} className="rr-segmented">
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            className={cn(active && "is-active")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
