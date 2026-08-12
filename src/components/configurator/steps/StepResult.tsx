"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link2, Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import {
  APP_MODULE_OPTIONS,
  CLIENT_TYPE_OPTIONS,
  FEATURE_OPTIONS,
  GOAL_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  WEB_MODULE_OPTIONS,
  getModuleGroup,
} from "@/lib/configurator/options";
import { estimate, SHOW_PRICE_ESTIMATE } from "@/lib/configurator/engine";
import { RESULT_STRINGS } from "@/lib/configurator/strings";
import { encodeConfigToParam, useConfigurator } from "@/lib/configurator/state";
import { StepHeader } from "@/components/configurator/StepHeader";
import { ConfiguratorForm } from "@/components/configurator/ConfiguratorForm";

function labelFor<Id extends string>(
  options: { id: Id; label: { es: string; en: string } }[],
  id: Id | null,
  locale: Locale,
  fallback: string
) {
  if (!id) return fallback;
  return options.find((option) => option.id === id)?.label[locale] ?? id;
}

function labelListFor<Id extends string>(
  options: { id: Id; label: { es: string; en: string } }[],
  ids: Id[],
  locale: Locale,
  fallback: string
) {
  if (ids.length === 0) return fallback;
  return ids.map((id) => options.find((option) => option.id === id)?.label[locale] ?? id).join(", ");
}

export function StepResult({ locale }: { locale: Locale }) {
  const { state, shared } = useConfigurator();
  const t = RESULT_STRINGS[locale];
  const result = useMemo(() => estimate(state.config), [state.config]);
  const [copied, setCopied] = useState(false);

  const moduleOptions = getModuleGroup(state.config.projectType) === "web" ? WEB_MODULE_OPTIONS : APP_MODULE_OPTIONS;

  const rows: { label: string; value: string }[] = [
    { label: t.recommendedType, value: labelFor(PROJECT_TYPE_OPTIONS, result.recommendedType, locale, t.none) },
    { label: t.goal, value: labelFor(GOAL_OPTIONS, state.config.goal, locale, t.none) },
    { label: locale === "es" ? "Cliente" : "Client", value: labelFor(CLIENT_TYPE_OPTIONS, state.config.clientType, locale, t.none) },
    { label: t.modules, value: labelListFor(moduleOptions, state.config.modules, locale, t.none) },
    { label: t.features, value: labelListFor(FEATURE_OPTIONS, state.config.features, locale, t.none) },
  ];

  async function handleShare() {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("c", encodeConfigToParam(state.config));
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      shared();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Portapapeles no disponible: sin acción visible adicional.
    }
  }

  return (
    <div>
      <StepHeader step="result" locale={locale} />

      <motion.div layout className="mt-6 border border-line/70 bg-cream">
        <dl className="divide-y divide-line/70">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate">{row.label}</dt>
              <dd className="text-sm font-medium text-navy sm:text-right">{row.value}</dd>
            </div>
          ))}

          <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate">{t.complexity}</dt>
            <dd className="text-sm font-medium text-navy sm:text-right">{t.complexityLabel[result.complexity]}</dd>
          </div>
          <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate">{t.timeline}</dt>
            <dd className="text-sm font-medium text-navy sm:text-right">
              {t.weeks(result.timelineWeeks.min, result.timelineWeeks.max)}
            </dd>
          </div>
          {SHOW_PRICE_ESTIMATE && result.priceRangeEur && (
            <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate">{t.priceEstimate}</dt>
              <dd className="text-sm font-medium text-navy sm:text-right">
                {result.priceRangeEur.min}–{result.priceRangeEur.max} €
              </dd>
            </div>
          )}
        </dl>
      </motion.div>

      <p className="mt-3 text-xs leading-relaxed text-slate">{t.priceDisclaimer}</p>

      <div className="mt-5 flex flex-col gap-4 border border-cobalt/30 bg-cobalt/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-navy">{t.nextStep}</p>
          <p className="mt-1 text-sm text-slate">{t.nextStepBody}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-navy hover:text-cobalt"
      >
        {copied ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}
        {copied ? t.shareCopied : t.share}
      </button>

      <div className="mt-8">
        <ConfiguratorForm locale={locale} />
      </div>
    </div>
  );
}
