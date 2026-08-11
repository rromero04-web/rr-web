import { Modal } from "@/components/demo/ui/Modal";
import { Avatar } from "@/components/demo/ui/Avatar";
import { StatusBadge } from "@/components/demo/ui/StatusBadge";
import { EMPLOYEE_STATUS_LABEL, EMPLOYEE_STATUS_TONE, TASK_PRIORITY_LABEL, TASK_PRIORITY_TONE } from "@/lib/demo/labels";
import { useDemoData } from "@/components/demo/DemoDataProvider";
import type { Employee } from "@/lib/demo/types";

export function EmployeeDetailModal({
  employee,
  onClose,
}: {
  employee: Employee | null;
  onClose: () => void;
}) {
  const { state } = useDemoData();

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
    <Modal open={Boolean(employee)} onClose={onClose} title="Ficha de empleado" widthClassName="max-w-xl">
      {employee && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Avatar initials={employee.initials} />
            <div>
              <p className="text-base font-bold text-navy">{employee.name}</p>
              <p className="text-sm text-slate">{employee.department}</p>
            </div>
            <div className="ml-auto">
              <StatusBadge tone={EMPLOYEE_STATUS_TONE[employee.status]}>
                {EMPLOYEE_STATUS_LABEL[employee.status]}
              </StatusBadge>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
              Horario semanal
            </h3>
            <ul className="mt-2 divide-y divide-line/70 border border-line/70">
              {shifts.map((shift) => (
                <li key={shift.id} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="text-navy">{shift.day}</span>
                  <span className="font-mono text-xs text-slate">{shift.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
              Últimos fichajes
            </h3>
            {entries.length > 0 ? (
              <ul className="mt-2 divide-y divide-line/70 border border-line/70">
                {entries.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="text-navy">
                      {entry.type === "entrada" ? "Entrada" : "Salida"}
                    </span>
                    <span className="font-mono text-xs text-slate">
                      {new Date(entry.timestamp).toLocaleString("es-ES", {
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
              <p className="mt-2 text-sm text-slate">Sin fichajes registrados todavía hoy.</p>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
              Tareas asignadas
            </h3>
            {tasks.length > 0 ? (
              <ul className="mt-2 divide-y divide-line/70 border border-line/70">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                    <span className={task.status === "completada" ? "text-slate line-through" : "text-navy"}>
                      {task.title}
                    </span>
                    <StatusBadge tone={TASK_PRIORITY_TONE[task.priority]}>
                      {TASK_PRIORITY_LABEL[task.priority]}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate">Sin tareas asignadas.</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
