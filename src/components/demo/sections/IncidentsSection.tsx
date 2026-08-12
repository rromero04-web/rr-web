"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useDemoData } from "@/components/demo/DemoDataProvider";
import { StatusBadge } from "@/components/demo/ui/StatusBadge";
import type { Locale } from "@/lib/i18n/config";
import { INCIDENT_STATUS_LABEL, INCIDENT_STATUS_TONE, INCIDENT_TYPE_LABEL } from "@/lib/demo/labels";
import { IncidentDetailModal } from "@/components/demo/IncidentDetailModal";
import { NewIncidentModal } from "@/components/demo/NewIncidentModal";
import type { Incident } from "@/lib/demo/types";

const STRINGS: Record<Locale, { newIncident: string; unassigned: string }> = {
  es: {
    newIncident: "Nueva incidencia",
    unassigned: "Sin asignar",
  },
  en: {
    newIncident: "New incident",
    unassigned: "Unassigned",
  },
};

export function IncidentsSection({ locale }: { locale: Locale }) {
  const { state, setIncidentStatus, createIncident } = useDemoData();
  const strings = STRINGS[locale];
  const [selected, setSelected] = useState<Incident | null>(null);
  const [creating, setCreating] = useState(false);

  const sorted = [...state.incidents].sort((a, b) => {
    if (a.status === "abierta" && b.status !== "abierta") return -1;
    if (b.status === "abierta" && a.status !== "abierta") return 1;
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 bg-navy px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cobalt"
        >
          <Plus size={16} aria-hidden="true" />
          {strings.newIncident}
        </button>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {sorted.map((incident) => {
          const employee = state.employees.find((e) => e.id === incident.employeeId);
          return (
            <li key={incident.id}>
              <button
                type="button"
                onClick={() => setSelected(incident)}
                className="flex w-full flex-col items-start gap-3 border border-line/70 bg-cream p-4 text-left transition-colors hover:border-navy/30"
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <p className="text-sm font-bold text-navy">{incident.title}</p>
                  <StatusBadge tone={INCIDENT_STATUS_TONE[incident.status]}>
                    {INCIDENT_STATUS_LABEL[locale][incident.status]}
                  </StatusBadge>
                </div>
                <p className="text-xs text-slate">
                  {INCIDENT_TYPE_LABEL[locale][incident.type]} · {employee?.name ?? strings.unassigned} ·{" "}
                  {incident.createdAt}
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      <IncidentDetailModal
        locale={locale}
        incident={selected}
        employeeName={state.employees.find((e) => e.id === selected?.employeeId)?.name}
        onClose={() => setSelected(null)}
        onChangeStatus={(status) => {
          if (selected) {
            setIncidentStatus(selected.id, status);
            setSelected({ ...selected, status });
          }
        }}
      />

      <NewIncidentModal
        locale={locale}
        open={creating}
        employees={state.employees}
        onClose={() => setCreating(false)}
        onCreate={createIncident}
      />
    </div>
  );
}
