"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bot, Check, Loader2, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { AI_PREVIEW_STRINGS } from "@/lib/configurator/strings";
import type { ConfiguratorConfig } from "@/lib/configurator/types";

const STEP_DELAY_MS = 550;

export function AiPreview({ config, locale }: { config: ConfiguratorConfig; locale: Locale }) {
  const t = AI_PREVIEW_STRINGS[locale];
  const { color } = config.style;
  const [completedSteps, setCompletedSteps] = useState(0);
  const [showResponse, setShowResponse] = useState(false);

  // Simulación puramente local y determinista: una secuencia fija de
  // temporizadores, sin llamadas a ninguna API de IA. El estado ya arranca
  // en 0/false (useState), así que el efecto solo programa los
  // temporizadores; no hace falta reasignar el estado inicial aquí.
  useEffect(() => {
    const timers = t.processingSteps.map((_, index) =>
      setTimeout(() => setCompletedSteps(index + 1), STEP_DELAY_MS * (index + 1))
    );
    const responseTimer = setTimeout(
      () => setShowResponse(true),
      STEP_DELAY_MS * (t.processingSteps.length + 1)
    );
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(responseTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white p-4 text-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          <Bot size={14} aria-hidden="true" />
        </span>
        <span className="text-xs font-bold text-slate-900">{t.inputLabel}</span>
      </div>

      <div className="mt-3 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
        {t.inputValue}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {t.processingSteps.map((step, index) => {
          const done = completedSteps > index;
          const active = completedSteps === index;
          return (
            <div key={step} className="flex items-center gap-2 text-[11px]">
              {done ? (
                <Check size={13} className="text-success" aria-hidden="true" />
              ) : active ? (
                <Loader2 size={13} className="animate-spin text-slate-400" aria-hidden="true" />
              ) : (
                <span className="h-3 w-3 rounded-full border border-slate-200" aria-hidden="true" />
              )}
              <span className={done ? "text-slate-700" : "text-slate-400"}>{step}</span>
            </div>
          );
        })}
      </div>

      {showResponse && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 border border-slate-100 bg-slate-50 p-3"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} style={{ color }} aria-hidden="true" />
            <span className="text-[11px] font-bold text-slate-900">{t.responseTitle}</span>
          </div>
          <ul className="mt-2 flex flex-col gap-1.5">
            {t.responseBullets.map((bullet) => (
              <li key={bullet} className="text-[10px] leading-relaxed text-slate-600">
                {bullet}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {t.actions.map((action) => (
              <span
                key={action}
                className="rounded-full px-2.5 py-1 text-[9px] font-semibold text-white"
                style={{ backgroundColor: color }}
              >
                {action}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{t.historyTitle}</p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {t.historyItems.map((item) => (
            <li key={item} className="text-[10px] text-slate-500">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
