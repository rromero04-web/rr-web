"use client";

import type { Locale } from "@/lib/i18n/config";
import { GOAL_OPTIONS } from "@/lib/configurator/options";
import { STEP_META } from "@/lib/configurator/strings";
import { useConfigurator } from "@/lib/configurator/state";
import { OptionGrid } from "@/components/configurator/OptionGrid";
import { StepHeader } from "@/components/configurator/StepHeader";
import { StepNav } from "@/components/configurator/StepNav";

export function StepGoal({ locale }: { locale: Locale }) {
  const { state, setGoal } = useConfigurator();

  return (
    <div>
      <StepHeader step="goal" locale={locale} />
      <div className="mt-6">
        <OptionGrid
          options={GOAL_OPTIONS}
          locale={locale}
          label={STEP_META.goal[locale].title}
          mode="single"
          selected={state.config.goal}
          onSelect={setGoal}
        />
      </div>
      <StepNav locale={locale} canAdvance={Boolean(state.config.goal)} />
    </div>
  );
}
