"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
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
    <motion.button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={() => onSelect(option.id)}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex h-full flex-col items-start gap-2.5 border p-4 text-left transition-colors motion-reduce:transition-none",
        selected
          ? "border-cobalt bg-cobalt/5"
          : "border-line/70 bg-cream hover:border-navy/30"
      )}
    >
      <div className="flex w-full items-start justify-between gap-2">
        <div
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center border transition-colors",
            selected ? "border-cobalt bg-cobalt text-cream" : "border-line/70 text-navy"
          )}
        >
          <Icon size={17} aria-hidden="true" />
        </div>
        {selected && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center bg-cobalt text-cream"
          >
            <Check size={12} aria-hidden="true" />
          </motion.span>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-navy">{option.label[locale]}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate">{option.description[locale]}</p>
      </div>
    </motion.button>
  );
}
