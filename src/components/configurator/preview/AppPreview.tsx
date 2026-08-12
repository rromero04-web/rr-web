"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { APP_MODULE_OPTIONS } from "@/lib/configurator/options";
import { APP_PREVIEW_STRINGS } from "@/lib/configurator/strings";
import type { ConfiguratorConfig } from "@/lib/configurator/types";
import { densityGap, densityRowPadding, softAccent } from "./previewStyle";

type RowStatus = "open" | "in-progress" | "done";
const ROW_STATUSES: RowStatus[] = ["open", "in-progress", "done", "done", "open", "in-progress"];

export function AppPreview({ config, locale }: { config: ConfiguratorConfig; locale: Locale }) {
  const t = APP_PREVIEW_STRINGS[locale];
  const { color, density } = config.style;
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");

  const modules = APP_MODULE_OPTIONS.filter((option) => config.modules.includes(option.id));
  const rows = useMemo(
    () =>
      ROW_STATUSES.map((status, index) => ({ id: index, name: t.rowName(index + 1), status, date: `0${(index % 9) + 1}/01` })),
    [t]
  );
  const visibleRows =
    filter === "all" ? rows : filter === "open" ? rows.filter((r) => r.status !== "done") : rows.filter((r) => r.status === "done");

  return (
    <div className="flex h-full w-full overflow-hidden bg-white text-slate-900">
      <aside className="hidden w-32 shrink-0 flex-col gap-1 border-r border-slate-100 bg-slate-50 p-3 sm:flex">
        <span className="mb-2 h-3 w-14 rounded-sm" style={{ backgroundColor: color }} />
        <motion.div layout className={`flex flex-col ${densityGap(density)}`}>
          <AnimatePresence initial={false}>
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  layout
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 rounded px-2 py-1.5 text-[10px] font-medium text-slate-600"
                >
                  <Icon size={12} aria-hidden="true" />
                  <span className="truncate">{module.label[locale]}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </aside>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-2">
          {t.metricLabels.map((label, index) => (
            <div key={label} className="border border-slate-100 p-2.5" style={{ backgroundColor: index === 0 ? softAccent(color, config.style.contrast) : undefined }}>
              <p className="text-[9px] text-slate-400">{label}</p>
              <p className="mt-1 text-sm font-extrabold text-slate-900">{12 + index * 7}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900">{t.tableTitle}</h4>
          <div className="flex gap-1">
            {(["all", "open", "done"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[9px] font-semibold transition-colors motion-reduce:transition-none",
                  filter === key ? "text-white" : "bg-slate-100 text-slate-500"
                )}
                style={filter === key ? { backgroundColor: color } : undefined}
              >
                {key === "all" ? t.filterAll : key === "open" ? t.filterOpen : t.filterDone}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 overflow-hidden border border-slate-100">
          <div className="grid grid-cols-3 bg-slate-50 text-[9px] font-semibold uppercase text-slate-400">
            {t.tableHeaders.map((header) => (
              <span key={header} className="px-3 py-1.5">
                {header}
              </span>
            ))}
          </div>
          <AnimatePresence initial={false}>
            {visibleRows.map((row) => (
              <motion.div
                layout
                key={row.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={`grid grid-cols-3 items-center border-t border-slate-100 text-[10px] text-slate-600 ${densityRowPadding(density)}`}
              >
                <span>{row.name}</span>
                <span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[9px] font-semibold",
                      row.status === "done" && "bg-success-soft text-success",
                      row.status === "open" && "bg-alert-soft text-alert",
                      row.status === "in-progress" && "bg-slate-100 text-slate-500"
                    )}
                  >
                    {row.status === "done" ? t.statusDone : row.status === "open" ? t.statusOpen : t.statusInProgress}
                  </span>
                </span>
                <span className="text-slate-400">{row.date}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
