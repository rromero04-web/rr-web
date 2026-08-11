import { Users, Clock, AlertTriangle, CalendarClock } from "lucide-react";
import { useDemoData } from "@/components/demo/DemoDataProvider";
import { Avatar } from "@/components/demo/ui/Avatar";
import { StatusBadge } from "@/components/demo/ui/StatusBadge";
import { EMPLOYEE_STATUS_LABEL, EMPLOYEE_STATUS_TONE } from "@/lib/demo/labels";
import type { DemoSection } from "@/lib/demo/nav";

export function Overview({ onNavigate }: { onNavigate: (section: DemoSection) => void }) {
  const { state } = useDemoData();
  const { employees, incidents, timeEntries, shifts } = state;

  const working = employees.filter((e) => e.status === "trabajando").length;
  const pending = employees.filter((e) => e.status === "fuera").length;
  const openIncidents = incidents.filter((i) => i.status === "abierta").length;
  const weeklyHours = employees.reduce((sum, e) => sum + e.weeklyHours, 0);

  const upcomingShifts = shifts
    .filter((s) => !s.isAbsence && s.label !== "Libre")
    .slice(0, 5);

  const recentActivity = [...timeEntries]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  const stats = [
    { label: "Empleados", value: employees.length, icon: Users, onClick: () => onNavigate("empleados") },
    { label: "Trabajando ahora", value: working, icon: Clock, tone: "success" as const, onClick: () => onNavigate("empleados") },
    { label: "Pendiente de fichar", value: pending, icon: Clock, tone: "alert" as const, onClick: () => onNavigate("empleados") },
    { label: "Incidencias abiertas", value: openIncidents, icon: AlertTriangle, tone: "alert" as const, onClick: () => onNavigate("incidencias") },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              type="button"
              onClick={stat.onClick}
              className="border border-line/70 bg-cream p-5 text-left transition-colors hover:border-navy/30"
            >
              <Icon
                size={18}
                className={stat.tone === "alert" ? "text-alert" : stat.tone === "success" ? "text-success" : "text-cobalt"}
                aria-hidden="true"
              />
              <p className="mt-3 text-2xl font-extrabold text-navy">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-slate">{stat.label}</p>
            </button>
          );
        })}
      </div>

      <div className="border border-line/70 bg-cream p-5">
        <p className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
          Horas registradas esta semana
        </p>
        <p className="mt-2 text-3xl font-extrabold text-navy">{weeklyHours} h</p>
        <p className="mt-1 text-xs text-slate">Suma de horas semanales de todo el equipo.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-line/70 bg-cream">
          <div className="flex items-center gap-2 border-b border-line/70 p-4">
            <CalendarClock size={16} className="text-cobalt" aria-hidden="true" />
            <h2 className="text-sm font-bold text-navy">Próximos turnos</h2>
          </div>
          <ul className="divide-y divide-line/70">
            {upcomingShifts.map((shift) => {
              const employee = employees.find((e) => e.id === shift.employeeId);
              if (!employee) return null;
              return (
                <li key={shift.id} className="flex items-center gap-3 p-4">
                  <Avatar initials={employee.initials} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy">{employee.name}</p>
                    <p className="text-xs text-slate">{shift.day}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-slate">{shift.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border border-line/70 bg-cream">
          <div className="flex items-center gap-2 border-b border-line/70 p-4">
            <Clock size={16} className="text-cobalt" aria-hidden="true" />
            <h2 className="text-sm font-bold text-navy">Actividad reciente</h2>
          </div>
          <ul className="divide-y divide-line/70">
            {recentActivity.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 p-4 text-sm">
                <span className="text-navy">
                  <span className="font-semibold">{entry.employeeName}</span>{" "}
                  {entry.type === "entrada" ? "ha fichado entrada" : "ha fichado salida"}
                </span>
                <span className="shrink-0 font-mono text-xs text-slate">
                  {new Date(entry.timestamp).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border border-line/70 bg-cream p-5">
        <h2 className="text-sm font-bold text-navy">Estado del equipo hoy</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {employees.map((employee) => (
            <li
              key={employee.id}
              className="flex items-center gap-2 border border-line/70 px-3 py-2"
            >
              <Avatar initials={employee.initials} size="sm" />
              <span className="text-sm font-medium text-navy">{employee.name}</span>
              <StatusBadge tone={EMPLOYEE_STATUS_TONE[employee.status]}>
                {EMPLOYEE_STATUS_LABEL[employee.status]}
              </StatusBadge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
