import type { Locale } from "@/lib/i18n/config";
import type { LucideIcon } from "lucide-react";

export type ProjectType =
  | "web-profesional"
  | "web-captacion"
  | "app-interna"
  | "ia-integracion"
  | "sin-definir";

export type Goal =
  | "presentar-servicios"
  | "captar-contactos"
  | "vender"
  | "gestionar-empleados"
  | "automatizar"
  | "organizar-informacion"
  | "validar-idea"
  | "integrar-ia"
  | "otro";

export type ClientType =
  | "negocio"
  | "autonomo"
  | "creador"
  | "asociacion"
  | "startup"
  | "equipo"
  | "personal"
  | "otro";

export type WebModuleId =
  | "inicio"
  | "servicios"
  | "sobre-nosotros"
  | "casos"
  | "portfolio"
  | "faq"
  | "contacto"
  | "blog"
  | "catalogo";

export type AppModuleId =
  | "dashboard"
  | "usuarios"
  | "permisos"
  | "empleados"
  | "fichajes"
  | "horarios"
  | "tareas"
  | "incidencias"
  | "informes"
  | "notificaciones"
  | "documentos"
  | "ajustes";

export type ModuleId = WebModuleId | AppModuleId;

export type FeatureId =
  | "formulario"
  | "formulario-pasos"
  | "login"
  | "administracion"
  | "base-datos"
  | "usuarios"
  | "roles"
  | "realtime"
  | "correos"
  | "archivos"
  | "buscador"
  | "estadisticas"
  | "apis"
  | "pagos"
  | "reservas"
  | "ia"
  | "bilingue";

export type StyleTone =
  | "corporativo"
  | "minimalista"
  | "tecnologico"
  | "elegante"
  | "cercano"
  | "creativo"
  | "energico";

export type ContrastLevel = "suave" | "medio" | "alto";
export type Density = "comoda" | "equilibrada" | "compacta";

export interface StyleChoice {
  tone: StyleTone | null;
  color: string;
  contrast: ContrastLevel;
  density: Density;
}

export type ReadinessStatus =
  | "idea-inicial"
  | "textos"
  | "branding"
  | "diseno"
  | "producto-existente"
  | "ayuda-completa";

export type Urgency = "flexible" | "unos-meses" | "lo-antes-posible";

export interface StatusChoice {
  readiness: ReadinessStatus | null;
  urgency: Urgency | null;
}

export type PreviewMode = "web" | "app" | "ia";
export type PreviewDevice = "desktop" | "tablet" | "mobile";

export type TechId =
  | "nextjs"
  | "supabase-postgres"
  | "auth"
  | "rls"
  | "realtime"
  | "resend"
  | "apis"
  | "vercel"
  | "ia";

export interface ConfiguratorConfig {
  projectType: ProjectType | null;
  goal: Goal | null;
  clientType: ClientType | null;
  modules: ModuleId[];
  features: FeatureId[];
  style: StyleChoice;
  status: StatusChoice;
}

export type StepId =
  | "type"
  | "goal"
  | "client"
  | "modules"
  | "features"
  | "style"
  | "status"
  | "result";

export interface LogEntry {
  id: string;
  ts: number;
  message: string;
}

export interface ConfiguratorState {
  currentStep: StepId;
  visitedSteps: StepId[];
  config: ConfiguratorConfig;
  device: PreviewDevice;
  log: LogEntry[];
}

export type Complexity = "simple" | "media" | "alta" | "muy-alta";

export interface EstimateResult {
  complexity: Complexity;
  complexityScore: number;
  timelineWeeks: { min: number; max: number };
  priceRangeEur: { min: number; max: number } | null;
  recommendedType: ProjectType;
  previewMode: PreviewMode;
  technologies: TechId[];
}

export interface LocalizedText {
  es: string;
  en: string;
}

export interface OptionDef<Id extends string> {
  id: Id;
  icon: LucideIcon;
  label: LocalizedText;
  description: LocalizedText;
}

export function t(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

export function initialConfig(): ConfiguratorConfig {
  return {
    projectType: null,
    goal: null,
    clientType: null,
    modules: [],
    features: [],
    style: { tone: null, color: "#2855ff", contrast: "medio", density: "equilibrada" },
    status: { readiness: null, urgency: null },
  };
}

// Normaliza un objeto de configuración potencialmente incompleto o no
// fiable (URL compartida, campo oculto del formulario) rellenando cualquier
// campo ausente con los valores por defecto. Sin dependencias de navegador
// para poder usarse también en el servidor (server action del envío).
export function normalizeConfig(parsed: unknown): ConfiguratorConfig {
  const raw = (parsed && typeof parsed === "object" ? parsed : {}) as Partial<ConfiguratorConfig>;
  const base = initialConfig();
  return {
    projectType: raw.projectType ?? base.projectType,
    goal: raw.goal ?? base.goal,
    clientType: raw.clientType ?? base.clientType,
    modules: Array.isArray(raw.modules) ? raw.modules : base.modules,
    features: Array.isArray(raw.features) ? raw.features : base.features,
    style: { ...base.style, ...(raw.style ?? {}) },
    status: { ...base.status, ...(raw.status ?? {}) },
  };
}
