"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useDemoData } from "@/components/demo/DemoDataProvider";
import { Avatar } from "@/components/demo/ui/Avatar";
import { StatusBadge } from "@/components/demo/ui/StatusBadge";
import type { Locale } from "@/lib/i18n/config";
import { DEPARTMENT_LABEL, EMPLOYEE_STATUS_LABEL, EMPLOYEE_STATUS_TONE } from "@/lib/demo/labels";
import { EmployeeDetailModal } from "@/components/demo/EmployeeDetailModal";
import type { Department, Employee } from "@/lib/demo/types";

const STRINGS: Record<
  Locale,
  {
    filterLabel: string;
    allDepartments: string;
    name: string;
    department: string;
    status: string;
    scheduleToday: string;
    hoursWeek: string;
    incidents: string;
    openProfile: string;
    viewProfileOf: (name: string) => string;
  }
> = {
  es: {
    filterLabel: "Filtrar por departamento",
    allDepartments: "Todos los departamentos",
    name: "Nombre",
    department: "Departamento",
    status: "Estado",
    scheduleToday: "Horario hoy",
    hoursWeek: "Horas/sem.",
    incidents: "Incidencias",
    openProfile: "Abrir ficha",
    viewProfileOf: (name) => `Ver ficha de ${name}`,
  },
  en: {
    filterLabel: "Filter by department",
    allDepartments: "All departments",
    name: "Name",
    department: "Department",
    status: "Status",
    scheduleToday: "Today's schedule",
    hoursWeek: "Hours/wk.",
    incidents: "Incidents",
    openProfile: "Open profile",
    viewProfileOf: (name) => `View profile of ${name}`,
  },
};

export function EmployeesSection({ locale }: { locale: Locale }) {
  const { state } = useDemoData();
  const strings = STRINGS[locale];
  const [department, setDepartment] = useState<Department | "todos">("todos");
  const [selected, setSelected] = useState<Employee | null>(null);

  const departments = useMemo(
    () => Array.from(new Set(state.employees.map((e) => e.department))),
    [state.employees]
  );

  const pendingIncidentsFor = (employeeId: string) =>
    state.incidents.filter((i) => i.employeeId === employeeId && i.status !== "resuelta").length;

  const filtered = state.employees.filter(
    (employee) => department === "todos" || employee.department === department
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="department-filter" className="text-xs font-semibold text-slate">
          {strings.filterLabel}
        </label>
        <select
          id="department-filter"
          value={department}
          onChange={(event) => setDepartment(event.target.value as Department | "todos")}
          className="border border-line/70 bg-cream px-3 py-1.5 text-sm text-navy"
        >
          <option value="todos">{strings.allDepartments}</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {DEPARTMENT_LABEL[locale][dept]}
            </option>
          ))}
        </select>
      </div>

      <div className="border border-line/70 bg-cream">
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line/70 text-left text-xs font-semibold tracking-wide text-slate uppercase">
                <th scope="col" className="p-4">{strings.name}</th>
                <th scope="col" className="p-4">{strings.department}</th>
                <th scope="col" className="p-4">{strings.status}</th>
                <th scope="col" className="p-4">{strings.scheduleToday}</th>
                <th scope="col" className="p-4">{strings.hoursWeek}</th>
                <th scope="col" className="p-4">{strings.incidents}</th>
                <th scope="col" className="p-4">
                  <span className="sr-only">{strings.openProfile}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {filtered.map((employee) => (
                <tr
                  key={employee.id}
                  tabIndex={0}
                  role="button"
                  onClick={() => setSelected(employee)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelected(employee);
                    }
                  }}
                  aria-label={strings.viewProfileOf(employee.name)}
                  className="cursor-pointer transition-colors hover:bg-navy/[0.03]"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={employee.initials} size="sm" />
                      <span className="font-medium text-navy">{employee.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate">{DEPARTMENT_LABEL[locale][employee.department]}</td>
                  <td className="p-4">
                    <StatusBadge tone={EMPLOYEE_STATUS_TONE[employee.status]}>
                      {EMPLOYEE_STATUS_LABEL[locale][employee.status]}
                    </StatusBadge>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate">{employee.todaySchedule}</td>
                  <td className="p-4 text-slate">{employee.weeklyHours} h</td>
                  <td className="p-4 text-slate">{pendingIncidentsFor(employee.id)}</td>
                  <td className="p-4 text-right">
                    <ChevronRight size={16} className="inline text-slate" aria-hidden="true" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="divide-y divide-line/70 md:hidden">
          {filtered.map((employee) => (
            <li key={employee.id}>
              <button
                type="button"
                onClick={() => setSelected(employee)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <Avatar initials={employee.initials} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{employee.name}</p>
                  <p className="text-xs text-slate">{DEPARTMENT_LABEL[locale][employee.department]}</p>
                  <div className="mt-1.5">
                    <StatusBadge tone={EMPLOYEE_STATUS_TONE[employee.status]}>
                      {EMPLOYEE_STATUS_LABEL[locale][employee.status]}
                    </StatusBadge>
                  </div>
                </div>
                <ChevronRight size={16} className="shrink-0 text-slate" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <EmployeeDetailModal locale={locale} employee={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
