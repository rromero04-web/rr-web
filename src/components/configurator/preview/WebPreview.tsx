"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { WEB_MODULE_OPTIONS } from "@/lib/configurator/options";
import { WEB_PREVIEW_STRINGS } from "@/lib/configurator/strings";
import type { ConfiguratorConfig, WebModuleId } from "@/lib/configurator/types";
import { densityCardPadding, densityGap, densitySectionSpacing, softAccent } from "./previewStyle";

export function WebPreview({ config, locale }: { config: ConfiguratorConfig; locale: Locale }) {
  const t = WEB_PREVIEW_STRINGS[locale];
  const { color, contrast, density } = config.style;
  const selectedOrder = WEB_MODULE_OPTIONS.filter((option) => config.modules.includes(option.id)).map(
    (option) => option.id
  );
  const navItems = selectedOrder.filter((id) => id !== "inicio" && id !== "contacto");

  return (
    <div className="h-full w-full overflow-y-auto bg-white text-slate-900">
      {/* Barra de navegador */}
      <div className="flex items-center gap-2 border-b border-line/70 bg-cream px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <div className="flex-1 truncate rounded-full border border-line/70 bg-white px-3 py-1 text-center text-[11px] text-slate-500">
          {t.addressBar}
        </div>
      </div>

      {/* Nav del sitio */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <span className="h-3 w-16 rounded-sm" style={{ backgroundColor: color }} />
        <motion.nav layout className="hidden gap-4 text-[11px] font-medium text-slate-500 sm:flex">
          <AnimatePresence initial={false}>
            {navItems.map((id) => (
              <motion.span
                key={id}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {t.sectionTitle[id as keyof typeof t.sectionTitle] ?? id}
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.nav>
        <span
          className="rounded-full px-3 py-1.5 text-[10px] font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {t.ctaPrimary}
        </span>
      </div>

      {/* Hero */}
      <div className="px-5 py-8 text-center sm:py-10">
        <span
          className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: softAccent(color, contrast), color }}
        >
          {t.heroEyebrow}
        </span>
        <h3 className="mx-auto mt-3 max-w-sm text-lg font-extrabold text-slate-900 sm:text-xl">
          {t.heroTitle}
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-500">{t.heroBody}</p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="rounded-full px-4 py-2 text-[11px] font-semibold text-white" style={{ backgroundColor: color }}>
            {t.ctaPrimary}
          </span>
          <span className="rounded-full border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-600">
            {t.ctaSecondary}
          </span>
        </div>
      </div>

      <motion.div layout>
        <AnimatePresence initial={false}>
          {selectedOrder
            .filter((id) => id !== "inicio")
            .map((id) => (
              <motion.section
                key={id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`overflow-hidden border-t border-slate-100 px-5 ${densitySectionSpacing(density)}`}
              >
                <SectionBody id={id} config={config} locale={locale} />
              </motion.section>
            ))}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-4 text-center text-[10px] text-slate-400">
        {t.footerText}
      </div>
    </div>
  );
}

function SectionBody({
  id,
  config,
  locale,
}: {
  id: WebModuleId;
  config: ConfiguratorConfig;
  locale: Locale;
}) {
  const t = WEB_PREVIEW_STRINGS[locale];
  const { color, density } = config.style;

  if (id === "contacto") {
    return (
      <div className="mx-auto max-w-xs">
        <h4 className="text-center text-xs font-bold text-slate-900">{t.contactTitle}</h4>
        <div className={`mt-3 flex flex-col ${densityGap(density)}`}>
          <span className="rounded border border-slate-200 px-3 py-2 text-[10px] text-slate-400">{t.contactName}</span>
          <span className="rounded border border-slate-200 px-3 py-2 text-[10px] text-slate-400">{t.contactEmail}</span>
          <span className="rounded border border-slate-200 px-3 py-2 text-[10px] text-slate-400">{t.contactMessage}</span>
          <span className="rounded px-3 py-2 text-center text-[10px] font-semibold text-white" style={{ backgroundColor: color }}>
            {t.contactSubmit}
          </span>
        </div>
      </div>
    );
  }

  if (id === "faq") {
    return (
      <div>
        <h4 className="text-xs font-bold text-slate-900">{t.sectionTitle.faq}</h4>
        <div className={`mt-3 flex flex-col ${densityGap(density)}`}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[11px] font-medium text-slate-700">{t.faqQuestion(n)}</span>
              <Plus size={12} className="text-slate-400" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (["casos", "portfolio", "catalogo", "blog"].includes(id)) {
    const title = t.sectionTitle[id as "casos" | "portfolio" | "catalogo" | "blog"];
    return (
      <div>
        <h4 className="text-xs font-bold text-slate-900">{title}</h4>
        <div className={`mt-3 grid grid-cols-3 ${densityGap(density)}`}>
          {[1, 2, 3].map((n) => (
            <div key={n} className={`border border-slate-100 ${densityCardPadding(density)}`}>
              <div className="mb-2 h-8 w-full rounded-sm bg-slate-100" />
              <p className="text-[10px] font-semibold text-slate-700">{t.cardTitle(n)}</p>
              <p className="mt-0.5 text-[9px] text-slate-400">{t.cardBody}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const label = t.sectionTitle[id as keyof typeof t.sectionTitle] ?? id;
  return (
    <div>
      <h4 className="text-xs font-bold text-slate-900">{label}</h4>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{t.cardBody}</p>
    </div>
  );
}
