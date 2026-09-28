"use client";

import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import { NAV_STRINGS, STEP_ORDER } from "@/lib/configurator/strings";
import { useCanJumpToStep, useConfigurator } from "@/lib/configurator/state";

export function StepProgress({ locale }: { locale: Locale }) {
  const { state, goToStep } = useConfigurator();
  const canJumpTo = useCanJumpToStep();
  const currentIndex = STEP_ORDER.indexOf(state.currentStep);

  return (
    <nav
      aria-label={NAV_STRINGS[locale].progressLabel}
      className="rr-step-progress"
    >
      {STEP_ORDER.map((step, index) => {
        const active = step === state.currentStep;
        const jumpable = canJumpTo(step);
        return (
          <button
            key={step}
            type="button"
            disabled={!jumpable}
            onClick={() => jumpable && goToStep(step)}
            aria-current={active ? "step" : undefined}
            aria-label={NAV_STRINGS[locale].stepOf(index + 1, STEP_ORDER.length)}
            className={cn(active ? "is-current" : index < currentIndex ? "is-complete" : "")}
          ><span aria-hidden="true" /></button>
        );
      })}
    </nav>
  );
}

export function StepNav({
  locale,
  canAdvance,
  hideNext,
}: {
  locale: Locale;
  canAdvance: boolean;
  hideNext?: boolean;
}) {
  const { state, goNext, goBack, reset } = useConfigurator();
  const t = NAV_STRINGS[locale];
  const isFirst = state.currentStep === STEP_ORDER[0];

  return (
    <div className="mt-8 flex flex-col gap-3">
      {!canAdvance && !hideNext && (
        <p aria-live="polite" className="text-xs text-slate">
          {t.requiredHint}
        </p>
      )}
      <div className="rr-step-actions">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            disabled={isFirst}
            className="rr-button rr-button-outline"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            {t.back}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center gap-2 px-3 text-sm font-medium text-slate transition-colors hover:text-navy"
          >
            <RotateCcw size={14} aria-hidden="true" />
            {t.restart}
          </button>
        </div>

        {!hideNext && (
          <button
            type="button"
            onClick={goNext}
            disabled={!canAdvance}
            className="rr-button"
          >
            {t.next}
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
