import type { Locale } from "@/lib/i18n/config";
import {
  APP_MODULE_OPTIONS,
  CLIENT_TYPE_OPTIONS,
  FEATURE_OPTIONS,
  GOAL_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  READINESS_OPTIONS,
  URGENCY_OPTIONS,
  WEB_MODULE_OPTIONS,
  getModuleGroup,
} from "./options";
import { estimate, SHOW_PRICE_ESTIMATE, TECHNOLOGY_INFO } from "./engine";
import { RESULT_STRINGS } from "./strings";
import type { ConfiguratorConfig } from "./types";

function label<Id extends string>(options: { id: Id; label: { es: string; en: string } }[], id: Id | null, locale: Locale): string {
  if (!id) return RESULT_STRINGS[locale].none;
  return options.find((option) => option.id === id)?.label[locale] ?? id;
}

function labelList<Id extends string>(options: { id: Id; label: { es: string; en: string } }[], ids: Id[], locale: Locale): string {
  if (ids.length === 0) return RESULT_STRINGS[locale].none;
  return ids
    .map((id) => options.find((option) => option.id === id)?.label[locale] ?? id)
    .join(", ");
}

// Texto plano legible, usado tanto en el resumen visual del paso de
// resultado como en el email de notificación, para no mantener dos
// descripciones distintas de la misma configuración.
export function buildConfigSummaryText(config: ConfiguratorConfig, locale: Locale): string {
  const t = RESULT_STRINGS[locale];
  const result = estimate(config);
  const moduleOptions = getModuleGroup(config.projectType) === "web" ? WEB_MODULE_OPTIONS : APP_MODULE_OPTIONS;

  const lines = [
    `${t.recommendedType}: ${label(PROJECT_TYPE_OPTIONS, result.recommendedType, locale)}`,
    `${t.goal}: ${label(GOAL_OPTIONS, config.goal, locale)}`,
    `${locale === "es" ? "Cliente" : "Client"}: ${label(CLIENT_TYPE_OPTIONS, config.clientType, locale)}`,
    `${t.modules}: ${labelList(moduleOptions, config.modules, locale)}`,
    `${t.features}: ${labelList(FEATURE_OPTIONS, config.features, locale)}`,
    `${locale === "es" ? "Punto de partida" : "Starting point"}: ${label(READINESS_OPTIONS, config.status.readiness, locale)}`,
    `${locale === "es" ? "Plazo deseado" : "Desired timeline"}: ${config.status.urgency ? URGENCY_OPTIONS.find((o) => o.id === config.status.urgency)?.label[locale] : t.none}`,
    `${t.complexity}: ${t.complexityLabel[result.complexity]}`,
    `${t.timeline}: ${t.weeks(result.timelineWeeks.min, result.timelineWeeks.max)}`,
    `${locale === "es" ? "Arquitectura orientativa" : "High-level architecture"}: ${result.technologies.map((id) => TECHNOLOGY_INFO[id].label[locale]).join(", ")}`,
  ];

  if (SHOW_PRICE_ESTIMATE && result.priceRangeEur) {
    lines.push(`${t.priceEstimate}: ${result.priceRangeEur.min}–${result.priceRangeEur.max} €`);
  }
  lines.push(t.noPriceNote);

  return lines.join("\n");
}
