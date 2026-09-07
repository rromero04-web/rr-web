"use client";

import type { Locale } from "@/lib/i18n/config";
import { CLIENT_TYPE_OPTIONS } from "@/lib/configurator/options";
import { STEP_META } from "@/lib/configurator/strings";
import { useConfigurator } from "@/lib/configurator/state";
import { OptionGrid } from "@/components/configurator/OptionGrid";
import { StepHeader } from "@/components/configurator/StepHeader";
import { StepNav } from "@/components/configurator/StepNav";

export function StepClient({ locale }: { locale: Locale }) {
  const { state, setClient } = useConfigurator();

  return (
    <div>
      <StepHeader step="client" locale={locale} />
      <div className="mt-6">
        <OptionGrid
          options={CLIENT_TYPE_OPTIONS}
          locale={locale}
          label={STEP_META.client[locale].title}
          mode="single"
          selected={state.config.clientType}
          onSelect={setClient}
        />
      </div>
      <StepNav locale={locale} canAdvance={Boolean(state.config.clientType)} />
    </div>
  );
}
