"use client";

import { motion } from "motion/react";
import type { Locale } from "@/lib/i18n/config";
import { APP_MODULE_OPTIONS, WEB_MODULE_OPTIONS, getModuleGroup } from "@/lib/configurator/options";
import { STEP_META } from "@/lib/configurator/strings";
import { useConfigurator } from "@/lib/configurator/state";
import { OptionGrid } from "@/components/configurator/OptionGrid";
import { StepHeader } from "@/components/configurator/StepHeader";
import { StepNav } from "@/components/configurator/StepNav";

export function StepModules({ locale }: { locale: Locale }) {
  const { state, toggleModule } = useConfigurator();
  const group = getModuleGroup(state.config.projectType);
  const options = group === "web" ? WEB_MODULE_OPTIONS : APP_MODULE_OPTIONS;

  return (
    <div>
      <StepHeader step="modules" locale={locale} />
      <motion.div layout className="mt-6">
        <OptionGrid
          options={options}
          locale={locale}
          label={STEP_META.modules[locale].title}
          mode="multi"
          selected={state.config.modules}
          onSelect={toggleModule}
        />
      </motion.div>
      <StepNav locale={locale} canAdvance={state.config.modules.length > 0} />
    </div>
  );
}
