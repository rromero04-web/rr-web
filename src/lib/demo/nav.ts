import {
  LayoutDashboard,
  Clock,
  Users,
  CalendarDays,
  ListChecks,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export type DemoSection =
  | "resumen"
  | "fichajes"
  | "empleados"
  | "horarios"
  | "tareas"
  | "incidencias";

const NAV_LABELS: Record<Locale, Record<DemoSection, string>> = {
  es: {
    resumen: "Resumen",
    fichajes: "Fichajes",
    empleados: "Empleados",
    horarios: "Horarios",
    tareas: "Tareas",
    incidencias: "Incidencias",
  },
  en: {
    resumen: "Overview",
    fichajes: "Clock-ins",
    empleados: "Employees",
    horarios: "Schedules",
    tareas: "Tasks",
    incidencias: "Incidents",
  },
};

const NAV_ORDER: DemoSection[] = [
  "resumen",
  "fichajes",
  "empleados",
  "horarios",
  "tareas",
  "incidencias",
];

const NAV_ICONS: Record<DemoSection, LucideIcon> = {
  resumen: LayoutDashboard,
  fichajes: Clock,
  empleados: Users,
  horarios: CalendarDays,
  tareas: ListChecks,
  incidencias: AlertTriangle,
};

export function getDemoNavItems(
  locale: Locale
): { id: DemoSection; label: string; icon: LucideIcon }[] {
  return NAV_ORDER.map((id) => ({
    id,
    label: NAV_LABELS[locale][id],
    icon: NAV_ICONS[id],
  }));
}
