import { Modal } from "@/components/demo/ui/Modal";
import { Avatar } from "@/components/demo/ui/Avatar";
import { StatusBadge } from "@/components/demo/ui/StatusBadge";
import type { Locale } from "@/lib/i18n/config";
import {
  DEPARTMENT_LABEL,
  EMPLOYEE_STATUS_LABEL,
  EMPLOYEE_STATUS_TONE,
  INTL_LOCALE,
  TASK_PRIORITY_LABEL,
  TASK_PRIORITY_TONE,
  TIME_ENTRY_TYPE_LABEL,
  WEEKDAY_LABEL,
} from "@/lib/demo/labels";
import { useDemoData } from "@/components/demo/DemoDataProvider";
import type { Employee } from "@/lib/demo/types";

const STRINGS: Record<
  Locale,
  {
    title: string;
    weeklySchedule: string;
    recentEntries: string;
    noEntries: string;
    assignedTasks: string;
    noTasks: string;
  }
> = {
  es: {
    title: "Ficha de empleado",
    weeklySchedule: "Horario semanal",
    recentEntries: "Últimos fichajes",
    noEntries: "Sin fichajes registrados todavía hoy.",
    assignedTasks: "Tareas asignadas",
    noTasks: "Sin tareas asignadas.",
  },
  en: {
    title: "Employee profile",
    weeklySchedule: "Weekly schedule",
    recentEntries: "Recent clock-ins",
    noEntries: "No clock-ins recorded yet today.",
    assignedTasks: "Assigned tasks",
    noTasks: "No tasks assigned.",
  },
};

export function EmployeeDetailModal({
  locale,
  employee,
  onClose,
}: {
  locale: Locale;
  employee: Employee | null;
  onClose: () => void;
}) {
  const { state } = useDemoData();
  const strings = STRINGS[locale];

  const shifts = employee
    ? state.shifts.filter((s) => s.employeeId === employee.id)
    : [];
  const entries = employee
    ? state.timeEntries
        .filter((entry) => entry.employeeId === employee.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)
    : [];
  const tasks = employee ? state.tasks.filter((t) => t.employeeId === employee.id) : [];

  return (
    <Modal
      open={Boolean(employee)}
      onClose={onClose}
      title={strings.title}
      widthClassName="max-w-xl"
      locale={locale}
    >
      {employee && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Avatar initials={employee.initials} />
            <div>
              <p className="text-base font-bold text-navy">{employee.name}</p>
              <p className="text-sm text-slate">{DEPARTMENT_LABEL[locale][employee.department]}</p>
            </div>
            <div className="ml-auto">
              <StatusBadge tone={EMPLOYEE_STATUS_TONE[employee.status]}>
                {EMPLOYEE_STATUS_LABEL[locale][employee.status]}
              </StatusBadge>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
              {strings.weeklySchedule}
            </h3>
            <ul className="mt-2 divide-y divide-line/70 border border-line/70">
              {shifts.map((shift) => (
                <li key={shift.id} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="text-navy">{WEEKDAY_LABEL[locale][shift.day]}</span>
                  <span className="font-mono text-xs text-slate">{shift.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
              {strings.recentEntries}
            </h3>
            {entries.length > 0 ? (
              <ul className="mt-2 divide-y divide-line/70 border border-line/70">
                {entries.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="text-navy">{TIME_ENTRY_TYPE_LABEL[locale][entry.type]}</span>
                    <span className="font-mono text-xs text-slate">
                      {new Date(entry.timestamp).toLocaleString(INTL_LOCALE[locale], {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate">{strings.noEntries}</p>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
              {strings.assignedTasks}
            </h3>
            {tasks.length > 0 ? (
              <ul className="mt-2 divide-y divide-line/70 border border-line/70">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                    <span className={task.status === "completada" ? "text-slate line-through" : "text-navy"}>
                      {task.title}
                    </span>
                    <StatusBadge tone={TASK_PRIORITY_TONE[task.priority]}>
                      {TASK_PRIORITY_LABEL[locale][task.priority]}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate">{strings.noTasks}</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
