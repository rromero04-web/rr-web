"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { DemoDataProvider, useDemoData } from "@/components/demo/DemoDataProvider";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { DemoSidebar, DemoMobileTabs } from "@/components/demo/DemoNav";
import { ConversionCta } from "@/components/demo/ConversionCta";
import { getDemoNavItems, type DemoSection } from "@/lib/demo/nav";
import { Overview } from "@/components/demo/sections/Overview";
import { ClockInOut } from "@/components/demo/sections/ClockInOut";
import { EmployeesSection } from "@/components/demo/sections/EmployeesSection";
import { ScheduleSection } from "@/components/demo/sections/ScheduleSection";
import { TasksSection } from "@/components/demo/sections/TasksSection";
import { IncidentsSection } from "@/components/demo/sections/IncidentsSection";

const STRINGS: Record<Locale, { resetLong: string; resetShort: string; resetConfirm: string }> = {
  es: {
    resetLong: "Restablecer datos de la demo",
    resetShort: "Restablecer",
    resetConfirm: "¿Restablecer todos los datos de la demo a su estado inicial?",
  },
  en: {
    resetLong: "Reset demo data",
    resetShort: "Reset",
    resetConfirm: "Reset all demo data to its initial state?",
  },
};

export function DemoApp({ locale }: { locale: Locale }) {
  return (
    <DemoDataProvider locale={locale}>
      <DemoShell locale={locale} />
    </DemoDataProvider>
  );
}

function DemoShell({ locale }: { locale: Locale }) {
  const [section, setSection] = useState<DemoSection>("resumen");
  const { resetDemo } = useDemoData();
  const strings = STRINGS[locale];
  const navItems = getDemoNavItems(locale);
  const activeLabel = navItems.find((item) => item.id === section)?.label ?? "";

  return (
    <div className="flex min-h-svh flex-col bg-cream text-navy">
      <DemoBanner locale={locale} />
      <div className="flex flex-1 flex-col md:flex-row">
        <DemoSidebar locale={locale} active={section} onChange={setSection} />
        <DemoMobileTabs locale={locale} active={section} onChange={setSection} />

        <main className="flex-1">
          <div className="container-page py-8 md:py-10">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                {activeLabel}
              </h1>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(strings.resetConfirm)) {
                    resetDemo();
                    setSection("resumen");
                  }
                }}
                className="inline-flex shrink-0 items-center gap-1.5 border border-line/70 px-3 py-2 text-xs font-semibold text-slate transition-colors hover:border-navy/40 hover:text-navy"
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span className="hidden sm:inline">{strings.resetLong}</span>
                <span className="sm:hidden">{strings.resetShort}</span>
              </button>
            </div>

            <div className="mt-8">
              {section === "resumen" && <Overview locale={locale} onNavigate={setSection} />}
              {section === "fichajes" && <ClockInOut locale={locale} />}
              {section === "empleados" && <EmployeesSection locale={locale} />}
              {section === "horarios" && <ScheduleSection locale={locale} />}
              {section === "tareas" && <TasksSection locale={locale} />}
              {section === "incidencias" && <IncidentsSection locale={locale} />}
            </div>

            <ConversionCta locale={locale} />
          </div>
        </main>
      </div>
    </div>
  );
}
