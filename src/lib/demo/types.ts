// Tipos de la demo "Gestión de equipos". Todo el contenido es ficticio y
// vive solo en el navegador (estado de React + localStorage). Este módulo
// está pensado para poder sustituirse más adelante por datos reales desde
// Supabase sin cambiar la forma en que los componentes consumen los datos.

export type Department =
  | "Administración"
  | "Operaciones"
  | "Atención al cliente"
  | "Mantenimiento"
  | "Coordinación";

export type EmployeeStatus = "trabajando" | "fuera" | "ausente";

export type WeekDay =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo";

export const WEEK_DAYS: WeekDay[] = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export interface Employee {
  id: string;
  name: string;
  initials: string;
  department: Department;
  status: EmployeeStatus;
  todaySchedule: string;
  weeklyHours: number;
}

export type TimeEntryType = "entrada" | "salida";

export interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  type: TimeEntryType;
  timestamp: string; // ISO 8601
  location: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  day: WeekDay;
  label: string; // p.ej. "09:00–17:00", "Libre", "Ausente"
  isAbsence: boolean;
}

export type TaskPriority = "alta" | "media" | "baja";
export type TaskStatus = "pendiente" | "completada";

export interface DemoTask {
  id: string;
  title: string;
  employeeId: string;
  priority: TaskPriority;
  dueDate: string; // texto legible, p.ej. "Hoy", "Mañana", "Vie 14"
  status: TaskStatus;
}

export type IncidentType = "material" | "equipo" | "turno" | "otro";
export type IncidentStatus = "abierta" | "en_proceso" | "resuelta";

export interface Incident {
  id: string;
  title: string;
  employeeId: string;
  type: IncidentType;
  status: IncidentStatus;
  createdAt: string; // texto legible
  description: string;
}

export interface DemoState {
  employees: Employee[];
  timeEntries: TimeEntry[];
  shifts: Shift[];
  tasks: DemoTask[];
  incidents: Incident[];
  visitorStatus: "fuera" | "trabajando";
}

export const DEMO_COMPANY_NAME = "Nexo Servicios";
export const DEMO_VISITOR_NAME = "Tú (usuario de la demo)";
