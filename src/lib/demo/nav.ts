import {
  LayoutDashboard,
  Clock,
  Users,
  CalendarDays,
  ListChecks,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

export type DemoSection =
  | "resumen"
  | "fichajes"
  | "empleados"
  | "horarios"
  | "tareas"
  | "incidencias";

export const DEMO_NAV_ITEMS: { id: DemoSection; label: string; icon: LucideIcon }[] = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "fichajes", label: "Fichajes", icon: Clock },
  { id: "empleados", label: "Empleados", icon: Users },
  { id: "horarios", label: "Horarios", icon: CalendarDays },
  { id: "tareas", label: "Tareas", icon: ListChecks },
  { id: "incidencias", label: "Incidencias", icon: AlertTriangle },
];
