"use client";

import type { Locale } from "@/lib/i18n/config";
import { PROJECT_TYPE_OPTIONS } from "@/lib/configurator/options";
import { STEP_META } from "@/lib/configurator/strings";
import { useConfigurator } from "@/lib/configurator/state";
import { OptionGrid } from "@/components/configurator/OptionGrid";
import { StepHeader } from "@/components/configurator/StepHeader";
import { StepNav } from "@/components/configurator/StepNav";

export function StepType({ locale }: { locale: Locale }) {
  const { state, setType } = useConfigurator();

  return (
    <div>
      <StepHeader step="type" locale={locale} />
      <div className="mt-6">
        <OptionGrid
          options={PROJECT_TYPE_OPTIONS}
          locale={locale}
          label={STEP_META.type[locale].title}
          mode="single"
          selected={state.config.projectType}
          onSelect={setType}
        />
      </div>
      <StepNav locale={locale} canAdvance={Boolean(state.config.projectType)} />
    </div>
  );
}
