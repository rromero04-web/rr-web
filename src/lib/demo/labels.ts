import type { Locale } from "@/lib/i18n/config";
import type {
  Department,
  EmployeeStatus,
  IncidentStatus,
  IncidentType,
  TaskPriority,
  TimeEntryType,
  WeekDay,
} from "./types";

export const EMPLOYEE_STATUS_LABEL: Record<Locale, Record<EmployeeStatus, string>> = {
  es: {
    trabajando: "Trabajando",
    fuera: "Pendiente de fichar",
    ausente: "Ausente",
  },
  en: {
    trabajando: "Working",
    fuera: "Not clocked in",
    ausente: "Absent",
  },
};

export const EMPLOYEE_STATUS_TONE: Record<EmployeeStatus, "success" | "alert" | "neutral"> = {
  trabajando: "success",
  fuera: "alert",
  ausente: "neutral",
};

export const INCIDENT_STATUS_LABEL: Record<Locale, Record<IncidentStatus, string>> = {
  es: {
    abierta: "Abierta",
    en_proceso: "En proceso",
    resuelta: "Resuelta",
  },
  en: {
    abierta: "Open",
    en_proceso: "In progress",
    resuelta: "Resolved",
  },
};

export const INCIDENT_STATUS_TONE: Record<IncidentStatus, "alert" | "cobalt" | "success"> = {
  abierta: "alert",
  en_proceso: "cobalt",
  resuelta: "success",
};

export const INCIDENT_TYPE_LABEL: Record<Locale, Record<IncidentType, string>> = {
  es: {
    material: "Material",
    equipo: "Equipo averiado",
    turno: "Cambio de turno",
    otro: "Otro",
  },
  en: {
    material: "Supplies",
    equipo: "Equipment fault",
    turno: "Shift change",
    otro: "Other",
  },
};

export const TASK_PRIORITY_LABEL: Record<Locale, Record<TaskPriority, string>> = {
  es: {
    alta: "Alta",
    media: "Media",
    baja: "Baja",
  },
  en: {
    alta: "High",
    media: "Medium",
    baja: "Low",
  },
};

export const TASK_PRIORITY_TONE: Record<TaskPriority, "alert" | "cobalt" | "neutral"> = {
  alta: "alert",
  media: "cobalt",
  baja: "neutral",
};

export const TIME_ENTRY_TYPE_LABEL: Record<Locale, Record<TimeEntryType, string>> = {
  es: {
    entrada: "Entrada",
    salida: "Salida",
  },
  en: {
    entrada: "Clock-in",
    salida: "Clock-out",
  },
};

export const DEPARTMENT_LABEL: Record<Locale, Record<Department, string>> = {
  es: {
    administracion: "Administración",
    operaciones: "Operaciones",
    atencion_cliente: "Atención al cliente",
    mantenimiento: "Mantenimiento",
    coordinacion: "Coordinación",
  },
  en: {
    administracion: "Administration",
    operaciones: "Operations",
    atencion_cliente: "Customer service",
    mantenimiento: "Maintenance",
    coordinacion: "Coordination",
  },
};

export const WEEKDAY_LABEL: Record<Locale, Record<WeekDay, string>> = {
  es: {
    lunes: "Lunes",
    martes: "Martes",
    miercoles: "Miércoles",
    jueves: "Jueves",
    viernes: "Viernes",
    sabado: "Sábado",
    domingo: "Domingo",
  },
  en: {
    lunes: "Monday",
    martes: "Tuesday",
    miercoles: "Wednesday",
    jueves: "Thursday",
    viernes: "Friday",
    sabado: "Saturday",
    domingo: "Sunday",
  },
};

export const WEEKDAY_SHORT_LABEL: Record<Locale, Record<WeekDay, string>> = {
  es: {
    lunes: "Lun",
    martes: "Mar",
    miercoles: "Mié",
    jueves: "Jue",
    viernes: "Vie",
    sabado: "Sáb",
    domingo: "Dom",
  },
  en: {
    lunes: "Mon",
    martes: "Tue",
    miercoles: "Wed",
    jueves: "Thu",
    viernes: "Fri",
    sabado: "Sat",
    domingo: "Sun",
  },
};

// Etiquetas de texto libre para los turnos que además se usan para derivar
// estilos (turno libre) — el estado de ausencia real se guarda aparte en
// `Shift.isAbsence`, esta etiqueta es solo el texto sugerido por defecto.
export const FREE_SHIFT_LABEL: Record<Locale, string> = {
  es: "Libre",
  en: "Free",
};

export const ABSENCE_SHIFT_LABEL: Record<Locale, string> = {
  es: "Ausencia programada",
  en: "Scheduled absence",
};

// Locale de Intl para formatear fechas/horas ("es-ES" / "en-GB").
export const INTL_LOCALE: Record<Locale, string> = {
  es: "es-ES",
  en: "en-GB",
};
