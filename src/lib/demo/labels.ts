import type { EmployeeStatus, IncidentStatus, IncidentType, TaskPriority } from "./types";

export const EMPLOYEE_STATUS_LABEL: Record<EmployeeStatus, string> = {
  trabajando: "Trabajando",
  fuera: "Pendiente de fichar",
  ausente: "Ausente",
};

export const EMPLOYEE_STATUS_TONE: Record<EmployeeStatus, "success" | "alert" | "neutral"> = {
  trabajando: "success",
  fuera: "alert",
  ausente: "neutral",
};

export const INCIDENT_STATUS_LABEL: Record<IncidentStatus, string> = {
  abierta: "Abierta",
  en_proceso: "En proceso",
  resuelta: "Resuelta",
};

export const INCIDENT_STATUS_TONE: Record<IncidentStatus, "alert" | "cobalt" | "success"> = {
  abierta: "alert",
  en_proceso: "cobalt",
  resuelta: "success",
};

export const INCIDENT_TYPE_LABEL: Record<IncidentType, string> = {
  material: "Material",
  equipo: "Equipo averiado",
  turno: "Cambio de turno",
  otro: "Otro",
};

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export const TASK_PRIORITY_TONE: Record<TaskPriority, "alert" | "cobalt" | "neutral"> = {
  alta: "alert",
  media: "cobalt",
  baja: "neutral",
};
