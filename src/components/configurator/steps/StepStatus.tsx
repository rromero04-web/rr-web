"use client";

import type { Locale } from "@/lib/i18n/config";
import { READINESS_OPTIONS, URGENCY_OPTIONS } from "@/lib/configurator/options";
import { STEP_META } from "@/lib/configurator/strings";
import { useConfigurator } from "@/lib/configurator/state";
import { OptionGrid } from "@/components/configurator/OptionGrid";
import { SegmentedControl } from "@/components/configurator/SegmentedControl";
import { StepHeader } from "@/components/configurator/StepHeader";
import { StepNav } from "@/components/configurator/StepNav";

const URGENCY_LABEL: Record<Locale, string> = {
  es: "Plazo deseado",
  en: "Desired timeline",
};

export function StepStatus({ locale }: { locale: Locale }) {
  const { state, setReadiness, setUrgency } = useConfigurator();
  const { status } = state.config;

  return (
    <div>
      <StepHeader step="status" locale={locale} />

      <div className="mt-6">
        <OptionGrid
          options={READINESS_OPTIONS}
          locale={locale}
          label={STEP_META.status[locale].title}
          mode="single"
          selected={status.readiness}
          onSelect={setReadiness}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-bold text-navy">{URGENCY_LABEL[locale]}</h3>
        <div className="mt-3">
          <SegmentedControl
            label={URGENCY_LABEL[locale]}
            value={status.urgency ?? "unos-meses"}
            onChange={setUrgency}
            options={URGENCY_OPTIONS.map((option) => ({ id: option.id, label: option.label[locale] }))}
          />
        </div>
      </div>

      <StepNav locale={locale} canAdvance={Boolean(status.readiness)} />
    </div>
  );
}
