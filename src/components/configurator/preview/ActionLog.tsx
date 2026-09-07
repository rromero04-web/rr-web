"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Locale } from "@/lib/i18n/config";
import { PREVIEW_STRINGS } from "@/lib/configurator/strings";
import type { LogEntry } from "@/lib/configurator/types";

export function ActionLog({ log, locale }: { log: LogEntry[]; locale: Locale }) {
  const t = PREVIEW_STRINGS[locale];
  const latest = log[0];

  return (
    <div className="border-t border-line/70 bg-navy-soft/[0.03] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate">{t.logTitle}</p>

      {/* Región accesible: anuncia solo la última acción a lectores de pantalla. */}
      <div aria-live="polite" className="sr-only">
        {latest?.message}
      </div>

      <ul className="mt-2 flex max-h-24 flex-col gap-1 overflow-y-auto">
        {log.length === 0 && <li className="text-[11px] text-slate/70">{t.logEmpty}</li>}
        <AnimatePresence initial={false}>
          {log.slice(0, 8).map((entry) => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] text-slate"
            >
              {entry.message}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
