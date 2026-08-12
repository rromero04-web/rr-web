"use client";

import { motion } from "motion/react";
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
    <div
      role="progressbar"
      aria-label={NAV_STRINGS[locale].progressLabel}
      aria-valuemin={1}
      aria-valuemax={STEP_ORDER.length}
      aria-valuenow={currentIndex + 1}
      className="flex items-center gap-1.5"
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
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors motion-reduce:transition-none",
              active ? "bg-cobalt" : index < currentIndex ? "bg-cobalt/40" : "bg-line",
              jumpable && !active && "cursor-pointer hover:bg-cobalt/60",
              !jumpable && "cursor-not-allowed"
            )}
          />
        );
      })}
    </div>
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
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            disabled={isFirst}
            className="inline-flex items-center gap-2 border border-navy/20 px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-cobalt hover:text-cobalt disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            {t.back}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate transition-colors hover:text-navy"
          >
            <RotateCcw size={14} aria-hidden="true" />
            {t.restart}
          </button>
        </div>

        {!hideNext && (
          <motion.button
            type="button"
            onClick={goNext}
            disabled={!canAdvance}
            whileTap={canAdvance ? { scale: 0.97 } : undefined}
            className="inline-flex items-center gap-2 bg-navy px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cobalt disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.next}
            <ArrowRight size={15} aria-hidden="true" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
