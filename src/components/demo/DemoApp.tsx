"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { DemoDataProvider, useDemoData } from "@/components/demo/DemoDataProvider";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { DemoSidebar, DemoMobileTabs } from "@/components/demo/DemoNav";
import { ConversionCta } from "@/components/demo/ConversionCta";
import { DEMO_NAV_ITEMS, type DemoSection } from "@/lib/demo/nav";
import { Overview } from "@/components/demo/sections/Overview";
import { ClockInOut } from "@/components/demo/sections/ClockInOut";
import { EmployeesSection } from "@/components/demo/sections/EmployeesSection";
import { ScheduleSection } from "@/components/demo/sections/ScheduleSection";
import { TasksSection } from "@/components/demo/sections/TasksSection";
import { IncidentsSection } from "@/components/demo/sections/IncidentsSection";

export function DemoApp() {
  return (
    <DemoDataProvider>
      <DemoShell />
    </DemoDataProvider>
  );
}

function DemoShell() {
  const [section, setSection] = useState<DemoSection>("resumen");
  const { resetDemo } = useDemoData();
  const activeLabel = DEMO_NAV_ITEMS.find((item) => item.id === section)?.label ?? "";

  return (
    <div className="flex min-h-svh flex-col bg-cream text-navy">
      <DemoBanner />
      <div className="flex flex-1 flex-col md:flex-row">
        <DemoSidebar active={section} onChange={setSection} />
        <DemoMobileTabs active={section} onChange={setSection} />

        <main className="flex-1">
          <div className="container-page py-8 md:py-10">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                {activeLabel}
              </h1>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("¿Restablecer todos los datos de la demo a su estado inicial?")) {
                    resetDemo();
                    setSection("resumen");
                  }
                }}
                className="inline-flex shrink-0 items-center gap-1.5 border border-line/70 px-3 py-2 text-xs font-semibold text-slate transition-colors hover:border-navy/40 hover:text-navy"
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span className="hidden sm:inline">Restablecer datos de la demo</span>
                <span className="sm:hidden">Restablecer</span>
              </button>
            </div>

            <div className="mt-8">
              {section === "resumen" && <Overview onNavigate={setSection} />}
              {section === "fichajes" && <ClockInOut />}
              {section === "empleados" && <EmployeesSection />}
              {section === "horarios" && <ScheduleSection />}
              {section === "tareas" && <TasksSection />}
              {section === "incidencias" && <IncidentsSection />}
            </div>

            <ConversionCta />
          </div>
        </main>
      </div>
    </div>
  );
}
