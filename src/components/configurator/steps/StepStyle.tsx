"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import {
  CONTRAST_OPTIONS,
  DENSITY_OPTIONS,
  STYLE_COLOR_PRESETS,
  STYLE_TONE_OPTIONS,
} from "@/lib/configurator/options";
import { useConfigurator } from "@/lib/configurator/state";
import { OptionGrid } from "@/components/configurator/OptionGrid";
import { SegmentedControl } from "@/components/configurator/SegmentedControl";
import { StepHeader } from "@/components/configurator/StepHeader";
import { StepNav } from "@/components/configurator/StepNav";

const FIELD_LABELS: Record<Locale, { tone: string; color: string; contrast: string; density: string }> = {
  es: { tone: "Tono", color: "Color principal", contrast: "Contraste", density: "Densidad" },
  en: { tone: "Tone", color: "Main color", contrast: "Contrast", density: "Density" },
};

export function StepStyle({ locale }: { locale: Locale }) {
  const { state, setStyleTone, setStyleColor, setStyleContrast, setStyleDensity } = useConfigurator();
  const labels = FIELD_LABELS[locale];
  const { style } = state.config;

  return (
    <div>
      <StepHeader step="style" locale={locale} />

      <div className="mt-6 flex flex-col gap-8">
        <div>
          <h3 className="text-sm font-bold text-navy">{labels.tone}</h3>
          <div className="mt-3">
            <OptionGrid
              options={STYLE_TONE_OPTIONS}
              locale={locale}
              label={labels.tone}
              mode="single"
              selected={style.tone}
              onSelect={setStyleTone}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-navy">{labels.color}</h3>
          <div role="radiogroup" aria-label={labels.color} className="mt-3 flex flex-wrap gap-3">
            {STYLE_COLOR_PRESETS.map((preset) => {
              const active = style.color === preset.value;
              return (
                <motion.button
                  key={preset.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={preset.label[locale]}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setStyleColor(preset.value, preset.label[locale])}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors motion-reduce:transition-none",
                    active ? "border-navy" : "border-transparent hover:border-line"
                  )}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: preset.value }}
                  >
                    {active && <Check size={14} className="text-cream" aria-hidden="true" />}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-8">
          <div>
            <h3 className="text-sm font-bold text-navy">{labels.contrast}</h3>
            <div className="mt-3">
              <SegmentedControl
                label={labels.contrast}
                value={style.contrast}
                onChange={setStyleContrast}
                options={CONTRAST_OPTIONS.map((option) => ({ id: option.id, label: option.label[locale] }))}
              />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-navy">{labels.density}</h3>
            <div className="mt-3">
              <SegmentedControl
                label={labels.density}
                value={style.density}
                onChange={setStyleDensity}
                options={DENSITY_OPTIONS.map((option) => ({ id: option.id, label: option.label[locale] }))}
              />
            </div>
          </div>
        </div>
      </div>

      <StepNav locale={locale} canAdvance={Boolean(style.tone)} />
    </div>
  );
}
