"use client";

import { useState, type JSX } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { MonitorSmartphone } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { ConfiguratorProvider, useConfigurator } from "@/lib/configurator/state";
import { CTA_STRINGS, PREVIEW_STRINGS } from "@/lib/configurator/strings";
import type { StepId } from "@/lib/configurator/types";
import { Modal } from "@/components/demo/ui/Modal";
import { StepProgress } from "./StepNav";
import { StepType } from "./steps/StepType";
import { StepGoal } from "./steps/StepGoal";
import { StepClient } from "./steps/StepClient";
import { StepModules } from "./steps/StepModules";
import { StepFeatures } from "./steps/StepFeatures";
import { StepStyle } from "./steps/StepStyle";
import { StepStatus } from "./steps/StepStatus";
import { StepResult } from "./steps/StepResult";
import { PreviewFrame } from "./preview/PreviewFrame";

const STEP_COMPONENTS: Record<StepId, (props: { locale: Locale }) => JSX.Element> = {
  type: StepType,
  goal: StepGoal,
  client: StepClient,
  modules: StepModules,
  features: StepFeatures,
  style: StepStyle,
  status: StepStatus,
  result: StepResult,
};

function ConfiguratorLayout({ locale }: { locale: Locale }) {
  const { state } = useConfigurator();
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const t = PREVIEW_STRINGS[locale];
  const StepComponent = STEP_COMPONENTS[state.currentStep];

  return (
    <div className="rr-configurator container-page">
      <div className="mx-auto max-w-6xl">
        <header className="rr-configurator-head">
          <h1 className="rr-display rr-configurator-title">{CTA_STRINGS[locale].label}</h1>
          <p>{CTA_STRINGS[locale].supportingText}</p>
        </header>
        <StepProgress locale={locale} />

        <div className="mt-8 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-start">
          <div className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={state.currentStep}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <StepComponent locale={locale} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden md:sticky md:top-24 md:block md:h-[560px]">
            <PreviewFrame locale={locale} />
          </div>
        </div>
      </div>

      {/* Botón flotante para ver el preview en móvil/tablet */}
      <div className="fixed bottom-5 right-5 z-40 md:hidden">
        <button type="button" onClick={() => setMobilePreviewOpen(true)} className="rr-button shadow-lg">
          <MonitorSmartphone size={16} aria-hidden="true" />
          {t.title}
        </button>
      </div>

      <Modal
        open={mobilePreviewOpen}
        onClose={() => setMobilePreviewOpen(false)}
        title={t.title}
        locale={locale}
        widthClassName="max-w-full sm:max-w-md"
      >
        <div className="h-[70vh]">
          <PreviewFrame locale={locale} />
        </div>
      </Modal>
    </div>
  );
}

export function ConfiguratorApp({ locale }: { locale: Locale }) {
  return (
    <MotionConfig reducedMotion="user">
      <ConfiguratorProvider locale={locale}>
        <ConfiguratorLayout locale={locale} />
      </ConfiguratorProvider>
    </MotionConfig>
  );
}
