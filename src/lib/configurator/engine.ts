import type {
  Complexity,
  ConfiguratorConfig,
  EstimateResult,
  FeatureId,
  Goal,
  PreviewMode,
  ProjectType,
  TechId,
} from "./types";

// Mostrar precio orientativo solo cuando esto sea `true`. Con `false`
// (estado actual), el resultado se limita a complejidad y plazo, más el
// aviso de que el alcance y presupuesto definitivos se confirman después.
export const SHOW_PRICE_ESTIMATE = false;

// --- Pesos centralizados del motor de estimación -------------------------
// Cualquier ajuste de "cuánto suma" cada elección se hace aquí, no en los
// componentes de UI. La escala es arbitraria (puntos de complejidad); solo
// importa la posición relativa entre pesos.

const BASE_SCORE_BY_TYPE: Record<ProjectType, number> = {
  "web-profesional": 1,
  "web-captacion": 2,
  "app-interna": 4,
  "ia-integracion": 4,
  "sin-definir": 2,
};

const MODULE_SCORE = 0.5;

const FEATURE_SCORE: Record<FeatureId, number> = {
  formulario: 0.3,
  "formulario-pasos": 0.6,
  login: 1.5,
  administracion: 1.5,
  "base-datos": 1,
  usuarios: 1,
  roles: 1.5,
  realtime: 2,
  correos: 0.5,
  archivos: 1,
  buscador: 1,
  estadisticas: 1.5,
  apis: 2,
  pagos: 2.5,
  reservas: 2,
  ia: 2.5,
  bilingue: 1,
};

const URGENCY_TIMELINE_FACTOR = {
  flexible: 1.15,
  "unos-meses": 1,
  "lo-antes-posible": 0.8,
} as const;

const COMPLEXITY_THRESHOLDS: { max: number; complexity: Complexity }[] = [
  { max: 3, complexity: "simple" },
  { max: 6, complexity: "media" },
  { max: 10, complexity: "alta" },
  { max: Infinity, complexity: "muy-alta" },
];

const TIMELINE_WEEKS_BY_COMPLEXITY: Record<Complexity, { min: number; max: number }> = {
  simple: { min: 1, max: 2 },
  media: { min: 2, max: 4 },
  alta: { min: 4, max: 8 },
  "muy-alta": { min: 8, max: 14 },
};

// Precios orientativos centralizados. Solo se usan si SHOW_PRICE_ESTIMATE
// es true; hoy no se muestran en ningún sitio.
const BASE_PRICE_EUR_BY_TYPE: Record<ProjectType, number> = {
  "web-profesional": 600,
  "web-captacion": 900,
  "app-interna": 1800,
  "ia-integracion": 1800,
  "sin-definir": 700,
};
const PRICE_PER_COMPLEXITY_POINT_EUR = 140;
const PRICE_RANGE_SPREAD = 0.35;

const GOAL_TO_RECOMMENDED_TYPE: Record<Goal, ProjectType> = {
  "presentar-servicios": "web-profesional",
  "captar-contactos": "web-captacion",
  vender: "web-captacion",
  "gestionar-empleados": "app-interna",
  automatizar: "app-interna",
  "organizar-informacion": "app-interna",
  "validar-idea": "web-profesional",
  "integrar-ia": "ia-integracion",
  otro: "web-profesional",
};

function computeComplexityScore(config: ConfiguratorConfig): number {
  const typeScore = BASE_SCORE_BY_TYPE[config.projectType ?? "sin-definir"];
  const modulesScore = config.modules.length * MODULE_SCORE;
  const featuresScore = config.features.reduce(
    (sum, feature) => sum + (FEATURE_SCORE[feature] ?? 0),
    0
  );
  return typeScore + modulesScore + featuresScore;
}

function scoreToComplexity(score: number): Complexity {
  return (
    COMPLEXITY_THRESHOLDS.find((bucket) => score <= bucket.max)?.complexity ?? "muy-alta"
  );
}

function computeTimelineWeeks(
  complexity: Complexity,
  urgency: ConfiguratorConfig["status"]["urgency"]
): { min: number; max: number } {
  const base = TIMELINE_WEEKS_BY_COMPLEXITY[complexity];
  const factor = URGENCY_TIMELINE_FACTOR[urgency ?? "unos-meses"];
  return {
    min: Math.max(1, Math.round(base.min * factor)),
    max: Math.max(1, Math.round(base.max * factor)),
  };
}

function computePriceRange(
  config: ConfiguratorConfig,
  score: number
): { min: number; max: number } | null {
  if (!SHOW_PRICE_ESTIMATE) return null;
  const base = BASE_PRICE_EUR_BY_TYPE[config.projectType ?? "sin-definir"];
  const center = base + score * PRICE_PER_COMPLEXITY_POINT_EUR;
  return {
    min: Math.round((center * (1 - PRICE_RANGE_SPREAD)) / 50) * 50,
    max: Math.round((center * (1 + PRICE_RANGE_SPREAD)) / 50) * 50,
  };
}

function computeRecommendedType(config: ConfiguratorConfig): ProjectType {
  if (config.projectType && config.projectType !== "sin-definir") {
    return config.projectType;
  }
  if (config.goal) {
    return GOAL_TO_RECOMMENDED_TYPE[config.goal];
  }
  return "web-profesional";
}

function computePreviewMode(recommendedType: ProjectType): PreviewMode {
  if (recommendedType === "ia-integracion") return "ia";
  if (recommendedType === "app-interna") return "app";
  return "web";
}

function computeRelevantTechnologies(config: ConfiguratorConfig): TechId[] {
  const features = new Set(config.features);
  const modules = new Set(config.modules);
  const appish =
    modules.has("dashboard") ||
    modules.has("empleados") ||
    modules.has("fichajes") ||
    modules.has("tareas") ||
    modules.has("incidencias") ||
    modules.has("informes") ||
    modules.has("documentos");

  const needsAuth = features.has("login") || features.has("administracion") || features.has("roles") || features.has("usuarios");
  const needsDb =
    features.has("base-datos") ||
    features.has("administracion") ||
    features.has("usuarios") ||
    features.has("estadisticas") ||
    features.has("reservas") ||
    features.has("pagos") ||
    appish;
  const needsRealtime = features.has("realtime") || modules.has("fichajes") || modules.has("notificaciones");
  const needsEmail = features.has("correos") || features.has("formulario") || features.has("formulario-pasos") || features.has("reservas");
  const needsApis = features.has("apis") || features.has("pagos") || features.has("reservas") || config.projectType === "ia-integracion";
  const needsIa = features.has("ia") || config.projectType === "ia-integracion" || config.goal === "integrar-ia";

  const technologies: TechId[] = ["nextjs", "vercel"];
  if (needsDb) technologies.push("supabase-postgres");
  if (needsAuth) technologies.push("auth");
  if (needsAuth && needsDb) technologies.push("rls");
  if (needsRealtime) technologies.push("realtime");
  if (needsEmail) technologies.push("resend");
  if (needsApis) technologies.push("apis");
  if (needsIa) technologies.push("ia");

  return technologies;
}

export function estimate(config: ConfiguratorConfig): EstimateResult {
  const score = computeComplexityScore(config);
  const complexity = scoreToComplexity(score);
  const recommendedType = computeRecommendedType(config);

  return {
    complexity,
    complexityScore: Math.round(score * 10) / 10,
    timelineWeeks: computeTimelineWeeks(complexity, config.status.urgency),
    priceRangeEur: computePriceRange(config, score),
    recommendedType,
    previewMode: computePreviewMode(recommendedType),
    technologies: computeRelevantTechnologies(config),
  };
}

export const TECHNOLOGY_INFO: Record<TechId, { label: { es: string; en: string }; description: { es: string; en: string } }> = {
  nextjs: {
    label: { es: "Next.js", en: "Next.js" },
    description: { es: "Framework React para el sitio o la aplicación.", en: "React framework for the site or application." },
  },
  "supabase-postgres": {
    label: { es: "Supabase / PostgreSQL", en: "Supabase / PostgreSQL" },
    description: { es: "Base de datos y backend gestionado.", en: "Managed database and backend." },
  },
  auth: {
    label: { es: "Autenticación", en: "Auth" },
    description: { es: "Inicio de sesión y control de acceso.", en: "Login and access control." },
  },
  rls: {
    label: { es: "Row Level Security", en: "Row Level Security" },
    description: { es: "Reglas de seguridad a nivel de fila en la base de datos.", en: "Row-level database security rules." },
  },
  realtime: {
    label: { es: "Realtime", en: "Realtime" },
    description: { es: "Actualizaciones instantáneas entre usuarios.", en: "Instant updates across users." },
  },
  resend: {
    label: { es: "Resend", en: "Resend" },
    description: { es: "Envío de notificaciones por correo.", en: "Email notification delivery." },
  },
  apis: {
    label: { es: "APIs externas", en: "External APIs" },
    description: { es: "Conexión con servicios de terceros.", en: "Connection with third-party services." },
  },
  vercel: {
    label: { es: "Vercel", en: "Vercel" },
    description: { es: "Despliegue y hosting.", en: "Deployment and hosting." },
  },
  ia: {
    label: { es: "Inteligencia artificial", en: "Artificial intelligence" },
    description: { es: "Modelos de IA integrados en el producto.", en: "AI models integrated into the product." },
  },
};
