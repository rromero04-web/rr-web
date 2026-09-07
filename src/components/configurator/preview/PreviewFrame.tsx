"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Laptop, Tablet, Smartphone, Layers } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { estimate } from "@/lib/configurator/engine";
import { PREVIEW_STRINGS } from "@/lib/configurator/strings";
import { useConfigurator } from "@/lib/configurator/state";
import type { PreviewDevice } from "@/lib/configurator/types";
import { WebPreview } from "./WebPreview";
import { AppPreview } from "./AppPreview";
import { AiPreview } from "./AiPreview";
import { ArchitectureModal } from "./ArchitectureModal";
import { ActionLog } from "./ActionLog";

const DEVICE_WIDTH: Record<PreviewDevice, number> = {
  desktop: 480,
  tablet: 380,
  mobile: 300,
};

const DEVICE_ICON: Record<PreviewDevice, typeof Laptop> = {
  desktop: Laptop,
  tablet: Tablet,
  mobile: Smartphone,
};

export function PreviewFrame({ locale }: { locale: Locale }) {
  const { state, setDevice, architectureOpened } = useConfigurator();
  const [architectureOpen, setArchitectureOpen] = useState(false);
  const t = PREVIEW_STRINGS[locale];
  const result = useMemo(() => estimate(state.config), [state.config]);
  const devices: PreviewDevice[] = ["desktop", "tablet", "mobile"];

  return (
    <div className="flex h-full flex-col border border-line/70 bg-cream">
      <div className="flex items-center justify-between gap-2 border-b border-line/70 px-4 py-3">
        <p className="text-xs font-semibold tracking-[0.1em] text-navy uppercase">{t.title}</p>
        <div role="radiogroup" aria-label={t.deviceLabel} className="flex items-center gap-1">
          {devices.map((device) => {
            const Icon = DEVICE_ICON[device];
            const active = state.device === device;
            const deviceLabel = device === "desktop" ? t.desktop : device === "tablet" ? t.tablet : t.mobile;
            return (
              <button
                key={device}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={deviceLabel}
                onClick={() => setDevice(device)}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center border transition-colors motion-reduce:transition-none",
                  active ? "border-cobalt bg-cobalt text-cream" : "border-line/70 text-slate hover:border-navy/30"
                )}
              >
                <Icon size={14} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 items-start justify-center overflow-hidden bg-navy/[0.03] p-4 sm:p-6">
        <motion.div
          animate={{ width: DEVICE_WIDTH[state.device] }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="h-[420px] max-h-full overflow-hidden border border-line/70 bg-white shadow-sm motion-reduce:transition-none"
        >
          {result.previewMode === "web" && <WebPreview config={state.config} locale={locale} />}
          {result.previewMode === "app" && <AppPreview config={state.config} locale={locale} />}
          {result.previewMode === "ia" && <AiPreview config={state.config} locale={locale} />}
        </motion.div>
      </div>

      <div className="border-t border-line/70 px-4 py-3">
        <button
          type="button"
          onClick={() => {
            setArchitectureOpen(true);
            architectureOpened();
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-navy hover:text-cobalt"
        >
          <Layers size={14} aria-hidden="true" />
          {t.architectureCta}
        </button>
      </div>

      <ActionLog log={state.log} locale={locale} />

      <ArchitectureModal
        open={architectureOpen}
        onClose={() => setArchitectureOpen(false)}
        technologies={result.technologies}
        locale={locale}
      />
    </div>
  );
}
