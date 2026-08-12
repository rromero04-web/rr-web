"use client";

import { OptionCard } from "./OptionCard";
import type { OptionDef } from "@/lib/configurator/types";
import type { Locale } from "@/lib/i18n/config";

interface OptionGridSingleProps<Id extends string> {
  options: OptionDef<Id>[];
  locale: Locale;
  label: string;
  mode: "single";
  selected: Id | null;
  onSelect: (id: Id) => void;
}

interface OptionGridMultiProps<Id extends string> {
  options: OptionDef<Id>[];
  locale: Locale;
  label: string;
  mode: "multi";
  selected: Id[];
  onSelect: (id: Id) => void;
}

type OptionGridProps<Id extends string> = OptionGridSingleProps<Id> | OptionGridMultiProps<Id>;

export function OptionGrid<Id extends string>(props: OptionGridProps<Id>) {
  const { options, locale, label, mode, selected, onSelect } = props;

  return (
    <div
      role={mode === "single" ? "radiogroup" : "group"}
      aria-label={label}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          locale={locale}
          role={mode === "single" ? "radio" : "checkbox"}
          selected={mode === "single" ? selected === option.id : selected.includes(option.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
