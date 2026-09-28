"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { OptionDef } from "@/lib/configurator/types";
import type { Locale } from "@/lib/i18n/config";

interface OptionCardProps<Id extends string> {
  option: OptionDef<Id>;
  locale: Locale;
  selected: boolean;
  onSelect: (id: Id) => void;
  role: "radio" | "checkbox";
}

export function OptionCard<Id extends string>({ option, locale, selected, onSelect, role }: OptionCardProps<Id>) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={() => onSelect(option.id)}
      className="rr-option flex h-full flex-col items-start gap-3 text-left"
    >
      <div className="flex w-full items-start justify-between gap-2">
        <Icon size={20} strokeWidth={1.6} className="rr-option-icon" aria-hidden="true" />
        {selected && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cobalt text-cream"
          >
            <Check size={12} aria-hidden="true" />
          </motion.span>
        )}
      </div>
      <div>
        <p className="text-base font-semibold text-navy">{option.label[locale]}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate">{option.description[locale]}</p>
      </div>
    </button>
  );
}
