"use client";

import { motion } from "motion/react";
import type { Locale } from "@/lib/i18n/config";
import { FEATURE_OPTIONS } from "@/lib/configurator/options";
import { STEP_META } from "@/lib/configurator/strings";
import { useConfigurator } from "@/lib/configurator/state";
import { OptionGrid } from "@/components/configurator/OptionGrid";
import { StepHeader } from "@/components/configurator/StepHeader";
import { StepNav } from "@/components/configurator/StepNav";

export function StepFeatures({ locale }: { locale: Locale }) {
  const { state, toggleFeature } = useConfigurator();

  return (
    <div>
      <StepHeader step="features" locale={locale} />
      <motion.div layout className="mt-6">
        <OptionGrid
          options={FEATURE_OPTIONS}
          locale={locale}
          label={STEP_META.features[locale].title}
          mode="multi"
          selected={state.config.features}
          onSelect={toggleFeature}
        />
      </motion.div>
      <StepNav locale={locale} canAdvance />
    </div>
  );
}
