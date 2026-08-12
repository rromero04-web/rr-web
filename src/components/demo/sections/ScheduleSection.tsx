"use client";

import { useState } from "react";
import { useDemoData } from "@/components/demo/DemoDataProvider";
import { Avatar } from "@/components/demo/ui/Avatar";
import { ShiftEditorModal } from "@/components/demo/ShiftEditorModal";
import type { Locale } from "@/lib/i18n/config";
import { FREE_SHIFT_LABEL, WEEKDAY_SHORT_LABEL } from "@/lib/demo/labels";
import { WEEK_DAYS, type Shift } from "@/lib/demo/types";
import { cn } from "@/lib/utils";

const STRINGS: Record<Locale, { intro: string; employee: string }> = {
  es: {
    intro:
      "Pulsa cualquier turno para cambiarlo, asignar un horario nuevo o marcar una ausencia. Los cambios solo afectan a esta demostración.",
    employee: "Empleado",
  },
  en: {
    intro:
      "Tap any shift to change it, assign a new schedule or mark an absence. Changes only affect this demo.",
    employee: "Employee",
  },
};

export function ScheduleSection({ locale }: { locale: Locale }) {
  const { state, updateShift } = useDemoData();
  const strings = STRINGS[locale];
  const [editing, setEditing] = useState<(Shift & { employeeName: string }) | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate">{strings.intro}</p>

      <div className="overflow-x-auto border border-line/70 bg-cream">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line/70 text-left text-xs font-semibold tracking-wide text-slate uppercase">
              <th scope="col" className="sticky left-0 bg-cream p-4">{strings.employee}</th>
              {WEEK_DAYS.map((day) => (
                <th key={day} scope="col" className="p-3 text-center">
                  {WEEKDAY_SHORT_LABEL[locale][day]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {state.employees.map((employee) => (
              <tr key={employee.id}>
                <th
                  scope="row"
                  className="sticky left-0 bg-cream p-4 text-left font-normal"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={employee.initials} size="sm" />
                    <span className="font-medium text-navy">{employee.name}</span>
                  </div>
                </th>
                {WEEK_DAYS.map((day) => {
                  const shift = state.shifts.find(
                    (s) => s.employeeId === employee.id && s.day === day
                  );
                  if (!shift) return <td key={day} className="p-2 text-center" />;
                  return (
                    <td key={day} className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({ ...shift, employeeName: employee.name })
                        }
                        className={cn(
                          "w-full border px-2 py-1.5 font-mono text-xs transition-colors",
                          shift.isAbsence
                            ? "border-alert/30 bg-alert-soft text-alert"
                            : shift.label === FREE_SHIFT_LABEL[locale]
                              ? "border-line/70 text-slate/60"
                              : "border-line/70 text-navy hover:border-navy/40"
                        )}
                      >
                        {shift.label}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ShiftEditorModal
        locale={locale}
        shift={editing}
        onClose={() => setEditing(null)}
        onSave={(label, isAbsence) => {
          if (editing) updateShift(editing.employeeId, editing.day, label, isAbsence);
        }}
      />
    </div>
  );
}
