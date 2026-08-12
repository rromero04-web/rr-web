import type { Locale } from "@/lib/i18n/config";
import type {
  DemoState,
  DemoTask,
  Employee,
  Incident,
  Shift,
  TimeEntry,
  WeekDay,
} from "./types";
import { WEEK_DAYS } from "./types";
import { ABSENCE_SHIFT_LABEL, FREE_SHIFT_LABEL } from "./labels";

// Datos completamente ficticios para la demo interactiva de "Nexo Servicios".
// Ningún nombre, horario o incidencia corresponde a una empresa o persona
// real. Los identificadores (id, department, day...) son estables entre
// idiomas; solo el texto visible (títulos, descripciones, fechas legibles)
// cambia según el locale.

interface EmployeeSeed {
  id: string;
  name: string;
  initials: string;
  department: Employee["department"];
  status: Employee["status"];
  todaySchedule: Record<Locale, string>;
  weeklyHours: number;
}

const EMPLOYEE_SEEDS: EmployeeSeed[] = [
  {
    id: "lucia-martin",
    name: "Lucía Martín",
    initials: "LM",
    department: "administracion",
    status: "trabajando",
    todaySchedule: { es: "09:00–17:00", en: "09:00–17:00" },
    weeklyHours: 32,
  },
  {
    id: "javier-ortega",
    name: "Javier Ortega",
    initials: "JO",
    department: "operaciones",
    status: "trabajando",
    todaySchedule: { es: "08:00–16:00", en: "08:00–16:00" },
    weeklyHours: 36,
  },
  {
    id: "marta-ruiz",
    name: "Marta Ruiz",
    initials: "MR",
    department: "atencion_cliente",
    status: "trabajando",
    todaySchedule: { es: "10:00–18:00", en: "10:00–18:00" },
    weeklyHours: 30,
  },
  {
    id: "diego-navarro",
    name: "Diego Navarro",
    initials: "DN",
    department: "mantenimiento",
    status: "trabajando",
    todaySchedule: { es: "09:00–17:00", en: "09:00–17:00" },
    weeklyHours: 34,
  },
  {
    id: "elena-soto",
    name: "Elena Soto",
    initials: "ES",
    department: "coordinacion",
    status: "fuera",
    todaySchedule: { es: "09:00–17:00", en: "09:00–17:00" },
    weeklyHours: 28,
  },
  {
    id: "pablo-torres",
    name: "Pablo Torres",
    initials: "PT",
    department: "operaciones",
    status: "ausente",
    todaySchedule: ABSENCE_SHIFT_LABEL,
    weeklyHours: 20,
  },
];

function seedEmployees(locale: Locale): Employee[] {
  return EMPLOYEE_SEEDS.map((seed) => ({
    id: seed.id,
    name: seed.name,
    initials: seed.initials,
    department: seed.department,
    status: seed.status,
    todaySchedule: seed.todaySchedule[locale],
    weeklyHours: seed.weeklyHours,
  }));
}

type ShiftKind = "time" | "free" | "absence";

interface ShiftPatternEntry {
  kind: ShiftKind;
  time?: string; // solo cuando kind === "time"
}

function shiftsFor(
  locale: Locale,
  employeeId: string,
  pattern: Partial<Record<WeekDay, ShiftPatternEntry>>
): Shift[] {
  return WEEK_DAYS.map((day, index) => {
    const entry = pattern[day] ?? { kind: "free" };
    const isAbsence = entry.kind === "absence";
    const label =
      entry.kind === "time"
        ? (entry.time as string)
        : entry.kind === "absence"
          ? ABSENCE_SHIFT_LABEL[locale]
          : FREE_SHIFT_LABEL[locale];
    return {
      id: `${employeeId}-shift-${index}`,
      employeeId,
      day,
      label,
      isAbsence,
    };
  });
}

function time(value: string): ShiftPatternEntry {
  return { kind: "time", time: value };
}

const ABSENCE: ShiftPatternEntry = { kind: "absence" };

const WEEKDAY_9_17: Partial<Record<WeekDay, ShiftPatternEntry>> = {
  lunes: time("09:00–17:00"),
  martes: time("09:00–17:00"),
  miercoles: time("09:00–17:00"),
  jueves: time("09:00–17:00"),
  viernes: time("09:00–17:00"),
};

const WEEKDAY_8_16: Partial<Record<WeekDay, ShiftPatternEntry>> = {
  lunes: time("08:00–16:00"),
  martes: time("08:00–16:00"),
  miercoles: time("08:00–16:00"),
  jueves: time("08:00–16:00"),
  viernes: time("08:00–16:00"),
  sabado: time("08:00–13:00"),
};

const WEEKDAY_10_18: Partial<Record<WeekDay, ShiftPatternEntry>> = {
  lunes: time("10:00–18:00"),
  martes: time("10:00–18:00"),
  miercoles: { kind: "free" },
  jueves: time("10:00–18:00"),
  viernes: time("10:00–18:00"),
  sabado: time("10:00–14:00"),
};

function seedShifts(locale: Locale): Shift[] {
  return [
    ...shiftsFor(locale, "lucia-martin", WEEKDAY_9_17),
    ...shiftsFor(locale, "javier-ortega", WEEKDAY_8_16),
    ...shiftsFor(locale, "marta-ruiz", WEEKDAY_10_18),
    ...shiftsFor(locale, "diego-navarro", WEEKDAY_9_17),
    ...shiftsFor(locale, "elena-soto", WEEKDAY_9_17),
    ...shiftsFor(locale, "pablo-torres", {
      lunes: time("09:00–17:00"),
      martes: ABSENCE,
      miercoles: ABSENCE,
      jueves: time("09:00–17:00"),
      viernes: time("09:00–17:00"),
    }),
  ];
}

interface TaskSeed {
  id: string;
  title: Record<Locale, string>;
  employeeId: string;
  priority: DemoTask["priority"];
  dueDate: Record<Locale, string>;
  status: DemoTask["status"];
}

const TASK_SEEDS: TaskSeed[] = [
  {
    id: "task-1",
    title: {
      es: "Revisar pedido de material de limpieza",
      en: "Review the cleaning supplies order",
    },
    employeeId: "diego-navarro",
    priority: "alta",
    dueDate: { es: "Hoy", en: "Today" },
    status: "pendiente",
  },
  {
    id: "task-2",
    title: {
      es: "Actualizar cuadrante de turnos de la próxima semana",
      en: "Update next week's shift schedule",
    },
    employeeId: "elena-soto",
    priority: "alta",
    dueDate: { es: "Hoy", en: "Today" },
    status: "pendiente",
  },
  {
    id: "task-3",
    title: {
      es: "Llamar a cliente para confirmar visita",
      en: "Call client to confirm the visit",
    },
    employeeId: "marta-ruiz",
    priority: "media",
    dueDate: { es: "Mañana", en: "Tomorrow" },
    status: "pendiente",
  },
  {
    id: "task-4",
    title: {
      es: "Revisar extintores de la planta baja",
      en: "Check fire extinguishers on the ground floor",
    },
    employeeId: "diego-navarro",
    priority: "media",
    dueDate: { es: "Vie 14", en: "Fri 14" },
    status: "pendiente",
  },
  {
    id: "task-5",
    title: {
      es: "Preparar informe mensual de horas",
      en: "Prepare the monthly hours report",
    },
    employeeId: "lucia-martin",
    priority: "media",
    dueDate: { es: "Vie 14", en: "Fri 14" },
    status: "completada",
  },
  {
    id: "task-6",
    title: {
      es: "Reponer stock en almacén secundario",
      en: "Restock the secondary warehouse",
    },
    employeeId: "javier-ortega",
    priority: "baja",
    dueDate: { es: "Lun 17", en: "Mon 17" },
    status: "pendiente",
  },
  {
    id: "task-7",
    title: {
      es: "Formación breve sobre nuevo protocolo",
      en: "Short training on the new protocol",
    },
    employeeId: "pablo-torres",
    priority: "baja",
    dueDate: { es: "Lun 17", en: "Mon 17" },
    status: "completada",
  },
];

function seedTasks(locale: Locale): DemoTask[] {
  return TASK_SEEDS.map((seed) => ({
    id: seed.id,
    title: seed.title[locale],
    employeeId: seed.employeeId,
    priority: seed.priority,
    dueDate: seed.dueDate[locale],
    status: seed.status,
  }));
}

interface IncidentSeed {
  id: string;
  title: Record<Locale, string>;
  employeeId: string;
  type: Incident["type"];
  status: Incident["status"];
  createdAt: Record<Locale, string>;
  description: Record<Locale, string>;
}

const INCIDENT_SEEDS: IncidentSeed[] = [
  {
    id: "incident-1",
    title: {
      es: "Material de limpieza pendiente de reponer",
      en: "Cleaning supplies need restocking",
    },
    employeeId: "diego-navarro",
    type: "material",
    status: "abierta",
    createdAt: { es: "Hoy, 08:40", en: "Today, 08:40" },
    description: {
      es: "Falta material de limpieza en la planta 2. Se ha avisado al proveedor habitual pero aún no hay fecha de entrega confirmada.",
      en: "Cleaning supplies are running low on floor 2. The usual supplier has been notified but there is no confirmed delivery date yet.",
    },
  },
  {
    id: "incident-2",
    title: {
      es: "Equipo de climatización averiado",
      en: "Air conditioning unit malfunctioning",
    },
    employeeId: "javier-ortega",
    type: "equipo",
    status: "en_proceso",
    createdAt: { es: "Ayer, 17:10", en: "Yesterday, 17:10" },
    description: {
      es: "El equipo de climatización de la nave 1 hace un ruido anómalo desde ayer. Técnico avisado, pendiente de visita.",
      en: "The air conditioning unit in warehouse 1 has been making an unusual noise since yesterday. A technician has been notified and a visit is pending.",
    },
  },
  {
    id: "incident-3",
    title: {
      es: "Cambio de turno solicitado",
      en: "Shift change requested",
    },
    employeeId: "marta-ruiz",
    type: "turno",
    status: "resuelta",
    createdAt: { es: "Lun 10, 09:15", en: "Mon 10, 09:15" },
    description: {
      es: "Solicitud de cambio de turno del sábado por motivos personales. Cambio aprobado y reflejado en el cuadrante.",
      en: "Request to change Saturday's shift for personal reasons. The change was approved and reflected in the schedule.",
    },
  },
  {
    id: "incident-4",
    title: {
      es: "Duda sobre política de fichaje remoto",
      en: "Question about remote clock-in policy",
    },
    employeeId: "elena-soto",
    type: "otro",
    status: "resuelta",
    createdAt: { es: "Vie 7, 12:00", en: "Fri 7, 12:00" },
    description: {
      es: "Consulta sobre cómo fichar en una visita a cliente fuera del centro de trabajo. Resuelta por coordinación.",
      en: "Question about how to clock in during a client visit outside the workplace. Resolved by coordination.",
    },
  },
];

function seedIncidents(locale: Locale): Incident[] {
  return INCIDENT_SEEDS.map((seed) => ({
    id: seed.id,
    title: seed.title[locale],
    employeeId: seed.employeeId,
    type: seed.type,
    status: seed.status,
    createdAt: seed.createdAt[locale],
    description: seed.description[locale],
  }));
}

const WORKPLACE_LOCATION: Record<Locale, string> = {
  es: "Centro de trabajo",
  en: "Workplace",
};

interface TimeEntrySeed {
  id: string;
  employeeId: string;
  employeeName: string;
  type: TimeEntry["type"];
  hours: number;
  minutes: number;
}

const TIME_ENTRY_SEEDS: TimeEntrySeed[] = [
  { id: "entry-1", employeeId: "lucia-martin", employeeName: "Lucía Martín", type: "entrada", hours: 9, minutes: 2 },
  { id: "entry-2", employeeId: "javier-ortega", employeeName: "Javier Ortega", type: "entrada", hours: 7, minutes: 58 },
  { id: "entry-3", employeeId: "marta-ruiz", employeeName: "Marta Ruiz", type: "entrada", hours: 9, minutes: 55 },
  { id: "entry-4", employeeId: "diego-navarro", employeeName: "Diego Navarro", type: "entrada", hours: 9, minutes: 0 },
];

function todayAt(hours: number, minutes: number): string {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function seedTimeEntries(locale: Locale): TimeEntry[] {
  return TIME_ENTRY_SEEDS.map((seed) => ({
    id: seed.id,
    employeeId: seed.employeeId,
    employeeName: seed.employeeName,
    type: seed.type,
    timestamp: todayAt(seed.hours, seed.minutes),
    location: WORKPLACE_LOCATION[locale],
  }));
}

export function createInitialDemoState(locale: Locale): DemoState {
  return {
    employees: seedEmployees(locale),
    timeEntries: seedTimeEntries(locale),
    shifts: seedShifts(locale),
    tasks: seedTasks(locale),
    incidents: seedIncidents(locale),
    visitorStatus: "fuera",
  };
}
