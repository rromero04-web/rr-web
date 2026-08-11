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

// Datos completamente ficticios para la demo interactiva de "Nexo Servicios".
// Ningún nombre, horario o incidencia corresponde a una empresa o persona real.

export const SEED_EMPLOYEES: Employee[] = [
  {
    id: "lucia-martin",
    name: "Lucía Martín",
    initials: "LM",
    department: "Administración",
    status: "trabajando",
    todaySchedule: "09:00–17:00",
    weeklyHours: 32,
  },
  {
    id: "javier-ortega",
    name: "Javier Ortega",
    initials: "JO",
    department: "Operaciones",
    status: "trabajando",
    todaySchedule: "08:00–16:00",
    weeklyHours: 36,
  },
  {
    id: "marta-ruiz",
    name: "Marta Ruiz",
    initials: "MR",
    department: "Atención al cliente",
    status: "trabajando",
    todaySchedule: "10:00–18:00",
    weeklyHours: 30,
  },
  {
    id: "diego-navarro",
    name: "Diego Navarro",
    initials: "DN",
    department: "Mantenimiento",
    status: "trabajando",
    todaySchedule: "09:00–17:00",
    weeklyHours: 34,
  },
  {
    id: "elena-soto",
    name: "Elena Soto",
    initials: "ES",
    department: "Coordinación",
    status: "fuera",
    todaySchedule: "09:00–17:00",
    weeklyHours: 28,
  },
  {
    id: "pablo-torres",
    name: "Pablo Torres",
    initials: "PT",
    department: "Operaciones",
    status: "ausente",
    todaySchedule: "Ausencia programada",
    weeklyHours: 20,
  },
];

function shiftsFor(employeeId: string, pattern: Partial<Record<WeekDay, string>>): Shift[] {
  return WEEK_DAYS.map((day, index) => {
    const label = pattern[day] ?? "Libre";
    return {
      id: `${employeeId}-shift-${index}`,
      employeeId,
      day,
      label,
      isAbsence: label.toLowerCase().includes("ausen"),
    };
  });
}

const WEEKDAY_9_17: Partial<Record<WeekDay, string>> = {
  Lunes: "09:00–17:00",
  Martes: "09:00–17:00",
  Miércoles: "09:00–17:00",
  Jueves: "09:00–17:00",
  Viernes: "09:00–17:00",
};

const WEEKDAY_8_16: Partial<Record<WeekDay, string>> = {
  Lunes: "08:00–16:00",
  Martes: "08:00–16:00",
  Miércoles: "08:00–16:00",
  Jueves: "08:00–16:00",
  Viernes: "08:00–16:00",
  Sábado: "08:00–13:00",
};

const WEEKDAY_10_18: Partial<Record<WeekDay, string>> = {
  Lunes: "10:00–18:00",
  Martes: "10:00–18:00",
  Miércoles: "Libre",
  Jueves: "10:00–18:00",
  Viernes: "10:00–18:00",
  Sábado: "10:00–14:00",
};

export const SEED_SHIFTS: Shift[] = [
  ...shiftsFor("lucia-martin", WEEKDAY_9_17),
  ...shiftsFor("javier-ortega", WEEKDAY_8_16),
  ...shiftsFor("marta-ruiz", WEEKDAY_10_18),
  ...shiftsFor("diego-navarro", WEEKDAY_9_17),
  ...shiftsFor("elena-soto", WEEKDAY_9_17),
  ...shiftsFor("pablo-torres", {
    Lunes: "09:00–17:00",
    Martes: "Ausencia programada",
    Miércoles: "Ausencia programada",
    Jueves: "09:00–17:00",
    Viernes: "09:00–17:00",
  }),
];

export const SEED_TASKS: DemoTask[] = [
  {
    id: "task-1",
    title: "Revisar pedido de material de limpieza",
    employeeId: "diego-navarro",
    priority: "alta",
    dueDate: "Hoy",
    status: "pendiente",
  },
  {
    id: "task-2",
    title: "Actualizar cuadrante de turnos de la próxima semana",
    employeeId: "elena-soto",
    priority: "alta",
    dueDate: "Hoy",
    status: "pendiente",
  },
  {
    id: "task-3",
    title: "Llamar a cliente para confirmar visita",
    employeeId: "marta-ruiz",
    priority: "media",
    dueDate: "Mañana",
    status: "pendiente",
  },
  {
    id: "task-4",
    title: "Revisar extintores de la planta baja",
    employeeId: "diego-navarro",
    priority: "media",
    dueDate: "Vie 14",
    status: "pendiente",
  },
  {
    id: "task-5",
    title: "Preparar informe mensual de horas",
    employeeId: "lucia-martin",
    priority: "media",
    dueDate: "Vie 14",
    status: "completada",
  },
  {
    id: "task-6",
    title: "Reponer stock en almacén secundario",
    employeeId: "javier-ortega",
    priority: "baja",
    dueDate: "Lun 17",
    status: "pendiente",
  },
  {
    id: "task-7",
    title: "Formación breve sobre nuevo protocolo",
    employeeId: "pablo-torres",
    priority: "baja",
    dueDate: "Lun 17",
    status: "completada",
  },
];

export const SEED_INCIDENTS: Incident[] = [
  {
    id: "incident-1",
    title: "Material de limpieza pendiente de reponer",
    employeeId: "diego-navarro",
    type: "material",
    status: "abierta",
    createdAt: "Hoy, 08:40",
    description:
      "Falta material de limpieza en la planta 2. Se ha avisado al proveedor habitual pero aún no hay fecha de entrega confirmada.",
  },
  {
    id: "incident-2",
    title: "Equipo de climatización averiado",
    employeeId: "javier-ortega",
    type: "equipo",
    status: "en_proceso",
    createdAt: "Ayer, 17:10",
    description:
      "El equipo de climatización de la nave 1 hace un ruido anómalo desde ayer. Técnico avisado, pendiente de visita.",
  },
  {
    id: "incident-3",
    title: "Cambio de turno solicitado",
    employeeId: "marta-ruiz",
    type: "turno",
    status: "resuelta",
    createdAt: "Lun 10, 09:15",
    description:
      "Solicitud de cambio de turno del sábado por motivos personales. Cambio aprobado y reflejado en el cuadrante.",
  },
  {
    id: "incident-4",
    title: "Duda sobre política de fichaje remoto",
    employeeId: "elena-soto",
    type: "otro",
    status: "resuelta",
    createdAt: "Vie 7, 12:00",
    description:
      "Consulta sobre cómo fichar en una visita a cliente fuera del centro de trabajo. Resuelta por coordinación.",
  },
];

export const SEED_TIME_ENTRIES: TimeEntry[] = [
  {
    id: "entry-1",
    employeeId: "lucia-martin",
    employeeName: "Lucía Martín",
    type: "entrada",
    timestamp: todayAt(9, 2),
    location: "Centro de trabajo",
  },
  {
    id: "entry-2",
    employeeId: "javier-ortega",
    employeeName: "Javier Ortega",
    type: "entrada",
    timestamp: todayAt(7, 58),
    location: "Centro de trabajo",
  },
  {
    id: "entry-3",
    employeeId: "marta-ruiz",
    employeeName: "Marta Ruiz",
    type: "entrada",
    timestamp: todayAt(9, 55),
    location: "Centro de trabajo",
  },
  {
    id: "entry-4",
    employeeId: "diego-navarro",
    employeeName: "Diego Navarro",
    type: "entrada",
    timestamp: todayAt(9, 0),
    location: "Centro de trabajo",
  },
];

function todayAt(hours: number, minutes: number): string {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

export function createInitialDemoState(): DemoState {
  return {
    employees: SEED_EMPLOYEES,
    timeEntries: SEED_TIME_ENTRIES,
    shifts: SEED_SHIFTS,
    tasks: SEED_TASKS,
    incidents: SEED_INCIDENTS,
    visitorStatus: "fuera",
  };
}
