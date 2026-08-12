import {
  Globe,
  TrendingUp,
  LayoutDashboard,
  Sparkles,
  HelpCircle,
  Briefcase,
  Mail,
  ShoppingCart,
  Users,
  Zap,
  FolderKanban,
  FlaskConical,
  MoreHorizontal,
  Building2,
  User,
  Camera,
  HeartHandshake,
  Rocket,
  Users2,
  Home,
  Newspaper,
  Info,
  BookOpen,
  Images,
  MessageCircleQuestion,
  PhoneCall,
  BookText,
  Grid3x3,
  Gauge,
  Shield,
  UserCog,
  Clock,
  CalendarClock,
  ListChecks,
  AlertTriangle,
  BarChart3,
  Bell,
  FileText,
  Settings,
  ClipboardList,
  KeyRound,
  ShieldCheck,
  Database,
  Radio,
  Send,
  FolderOpen,
  Search,
  PieChart,
  Plug,
  CreditCard,
  CalendarCheck,
  Bot,
  Languages,
  Landmark,
  PenTool,
  Cpu,
  Gem,
  Handshake,
  Flame,
} from "lucide-react";
import type {
  AppModuleId,
  ClientType,
  ContrastLevel,
  Density,
  FeatureId,
  Goal,
  OptionDef,
  ProjectType,
  ReadinessStatus,
  StyleTone,
  Urgency,
  WebModuleId,
} from "./types";

export const PROJECT_TYPE_OPTIONS: OptionDef<ProjectType>[] = [
  {
    id: "web-profesional",
    icon: Globe,
    label: { es: "Web profesional", en: "Professional website" },
    description: {
      es: "Presencia digital clara para negocios, autónomos y profesionales.",
      en: "A clear digital presence for businesses, freelancers and professionals.",
    },
  },
  {
    id: "web-captacion",
    icon: TrendingUp,
    label: { es: "Web de captación", en: "Lead-generation website" },
    description: {
      es: "Orientada a convertir visitas en consultas o ventas.",
      en: "Focused on turning visits into inquiries or sales.",
    },
  },
  {
    id: "app-interna",
    icon: LayoutDashboard,
    label: { es: "Aplicación interna", en: "Internal application" },
    description: {
      es: "Herramienta a medida para gestionar procesos de tu equipo.",
      en: "A custom tool for managing your team's processes.",
    },
  },
  {
    id: "ia-integracion",
    icon: Sparkles,
    label: { es: "Integración de IA", en: "AI integration" },
    description: {
      es: "Automatización o asistente inteligente conectado a tu negocio.",
      en: "Automation or a smart assistant connected to your business.",
    },
  },
  {
    id: "sin-definir",
    icon: HelpCircle,
    label: { es: "Aún no lo tengo claro", en: "Not defined yet" },
    description: {
      es: "Te ayudo a decidirlo según tu objetivo.",
      en: "I'll help you figure it out based on your goal.",
    },
  },
];

export const GOAL_OPTIONS: OptionDef<Goal>[] = [
  {
    id: "presentar-servicios",
    icon: Briefcase,
    label: { es: "Presentar servicios", en: "Present services" },
    description: {
      es: "Explicar quién eres y qué ofreces.",
      en: "Explain who you are and what you offer.",
    },
  },
  {
    id: "captar-contactos",
    icon: Mail,
    label: { es: "Captar contactos", en: "Generate contacts" },
    description: {
      es: "Convertir visitas en consultas cualificadas.",
      en: "Turn visits into qualified inquiries.",
    },
  },
  {
    id: "vender",
    icon: ShoppingCart,
    label: { es: "Vender", en: "Sell" },
    description: {
      es: "Facilitar la compra de productos o servicios.",
      en: "Make it easy to buy products or services.",
    },
  },
  {
    id: "gestionar-empleados",
    icon: Users,
    label: { es: "Gestionar empleados", en: "Manage employees" },
    description: {
      es: "Fichajes, horarios, tareas o incidencias del equipo.",
      en: "Clock-ins, schedules, tasks or incidents for your team.",
    },
  },
  {
    id: "automatizar",
    icon: Zap,
    label: { es: "Automatizar procesos", en: "Automate processes" },
    description: {
      es: "Sustituir tareas manuales repetitivas.",
      en: "Replace repetitive manual tasks.",
    },
  },
  {
    id: "organizar-informacion",
    icon: FolderKanban,
    label: { es: "Organizar información", en: "Organize information" },
    description: {
      es: "Centralizar datos que hoy están dispersos.",
      en: "Centralize data that's currently scattered.",
    },
  },
  {
    id: "validar-idea",
    icon: FlaskConical,
    label: { es: "Validar una idea", en: "Validate an idea" },
    description: {
      es: "Un primer producto sencillo para probar el mercado.",
      en: "A simple first product to test the market.",
    },
  },
  {
    id: "integrar-ia",
    icon: Sparkles,
    label: { es: "Integrar IA", en: "Integrate AI" },
    description: {
      es: "Añadir inteligencia artificial a un proceso existente.",
      en: "Add artificial intelligence to an existing process.",
    },
  },
  {
    id: "otro",
    icon: MoreHorizontal,
    label: { es: "Otro", en: "Other" },
    description: {
      es: "Cuéntamelo con tus propias palabras al final.",
      en: "Tell me in your own words at the end.",
    },
  },
];

export const CLIENT_TYPE_OPTIONS: OptionDef<ClientType>[] = [
  {
    id: "negocio",
    icon: Building2,
    label: { es: "Negocio", en: "Business" },
    description: { es: "Empresa con local o equipo.", en: "A company with a premises or team." },
  },
  {
    id: "autonomo",
    icon: User,
    label: { es: "Autónomo o profesional", en: "Freelancer or professional" },
    description: { es: "Trabajas por tu cuenta.", en: "You work for yourself." },
  },
  {
    id: "creador",
    icon: Camera,
    label: { es: "Creador de contenido", en: "Content creator" },
    description: { es: "Marca personal o audiencia propia.", en: "A personal brand or audience." },
  },
  {
    id: "asociacion",
    icon: HeartHandshake,
    label: { es: "Asociación u ONG", en: "Association or NGO" },
    description: { es: "Entidad sin ánimo de lucro.", en: "A non-profit organization." },
  },
  {
    id: "startup",
    icon: Rocket,
    label: { es: "Startup", en: "Startup" },
    description: { es: "Proyecto en fase de crecimiento.", en: "A project in a growth phase." },
  },
  {
    id: "equipo",
    icon: Users2,
    label: { es: "Equipo interno", en: "Internal team" },
    description: { es: "Necesitas una herramienta interna.", en: "You need an internal tool." },
  },
  {
    id: "personal",
    icon: Home,
    label: { es: "Proyecto personal", en: "Personal project" },
    description: { es: "Iniciativa propia, sin empresa detrás.", en: "Your own initiative, no company behind it." },
  },
  {
    id: "otro",
    icon: MoreHorizontal,
    label: { es: "Otro", en: "Other" },
    description: { es: "No encajas en ninguna categoría anterior.", en: "None of the above quite fits." },
  },
];

export const WEB_MODULE_OPTIONS: OptionDef<WebModuleId>[] = [
  { id: "inicio", icon: Home, label: { es: "Inicio", en: "Home" }, description: { es: "Página principal.", en: "Main landing page." } },
  { id: "servicios", icon: Briefcase, label: { es: "Servicios", en: "Services" }, description: { es: "Qué ofreces.", en: "What you offer." } },
  { id: "sobre-nosotros", icon: Info, label: { es: "Sobre nosotros", en: "About us" }, description: { es: "Quiénes sois.", en: "Who you are." } },
  { id: "casos", icon: Newspaper, label: { es: "Casos de éxito", en: "Case studies" }, description: { es: "Resultados de otros clientes.", en: "Results from other clients." } },
  { id: "portfolio", icon: Images, label: { es: "Portfolio", en: "Portfolio" }, description: { es: "Galería de trabajos.", en: "A gallery of work." } },
  { id: "faq", icon: MessageCircleQuestion, label: { es: "Preguntas frecuentes", en: "FAQ" }, description: { es: "Dudas habituales.", en: "Common questions." } },
  { id: "contacto", icon: PhoneCall, label: { es: "Contacto", en: "Contact" }, description: { es: "Formulario y datos de contacto.", en: "Form and contact details." } },
  { id: "blog", icon: BookText, label: { es: "Blog", en: "Blog" }, description: { es: "Artículos y novedades.", en: "Articles and updates." } },
  { id: "catalogo", icon: Grid3x3, label: { es: "Catálogo", en: "Catalog" }, description: { es: "Productos o servicios listados.", en: "Listed products or services." } },
];

export const APP_MODULE_OPTIONS: OptionDef<AppModuleId>[] = [
  { id: "dashboard", icon: Gauge, label: { es: "Dashboard", en: "Dashboard" }, description: { es: "Resumen general con métricas.", en: "General overview with metrics." } },
  { id: "usuarios", icon: Users, label: { es: "Usuarios", en: "Users" }, description: { es: "Gestión de cuentas de acceso.", en: "Manage access accounts." } },
  { id: "permisos", icon: Shield, label: { es: "Permisos", en: "Permissions" }, description: { es: "Roles y niveles de acceso.", en: "Roles and access levels." } },
  { id: "empleados", icon: UserCog, label: { es: "Empleados", en: "Employees" }, description: { es: "Ficha de cada miembro del equipo.", en: "A profile for each team member." } },
  { id: "fichajes", icon: Clock, label: { es: "Fichajes", en: "Clock-ins" }, description: { es: "Entradas y salidas.", en: "Clock-ins and clock-outs." } },
  { id: "horarios", icon: CalendarClock, label: { es: "Horarios", en: "Schedules" }, description: { es: "Turnos y planificación.", en: "Shifts and planning." } },
  { id: "tareas", icon: ListChecks, label: { es: "Tareas", en: "Tasks" }, description: { es: "Asignación y seguimiento.", en: "Assignment and tracking." } },
  { id: "incidencias", icon: AlertTriangle, label: { es: "Incidencias", en: "Incidents" }, description: { es: "Registro de imprevistos.", en: "Track unexpected issues." } },
  { id: "informes", icon: BarChart3, label: { es: "Informes", en: "Reports" }, description: { es: "Datos exportables y analizables.", en: "Exportable, analyzable data." } },
  { id: "notificaciones", icon: Bell, label: { es: "Notificaciones", en: "Notifications" }, description: { es: "Avisos en tiempo real.", en: "Real-time alerts." } },
  { id: "documentos", icon: FileText, label: { es: "Documentos", en: "Documents" }, description: { es: "Archivos asociados al negocio.", en: "Files tied to the business." } },
  { id: "ajustes", icon: Settings, label: { es: "Ajustes", en: "Settings" }, description: { es: "Configuración general.", en: "General configuration." } },
];

export const FEATURE_OPTIONS: OptionDef<FeatureId>[] = [
  { id: "formulario", icon: ClipboardList, label: { es: "Formulario de contacto", en: "Contact form" }, description: { es: "Un formulario simple de una página.", en: "A simple single-page form." } },
  { id: "formulario-pasos", icon: ListChecks, label: { es: "Formulario por pasos", en: "Multi-step form" }, description: { es: "Recogida de datos en varias fases.", en: "Data collection across several stages." } },
  { id: "login", icon: KeyRound, label: { es: "Inicio de sesión", en: "Login" }, description: { es: "Acceso privado con usuario y contraseña.", en: "Private access with username and password." } },
  { id: "administracion", icon: ShieldCheck, label: { es: "Panel de administración", en: "Admin panel" }, description: { es: "Zona privada para gestionar el contenido.", en: "A private area to manage content." } },
  { id: "base-datos", icon: Database, label: { es: "Base de datos", en: "Database" }, description: { es: "Datos que se guardan y consultan.", en: "Data that's stored and queried." } },
  { id: "usuarios", icon: Users, label: { es: "Gestión de usuarios", en: "User management" }, description: { es: "Alta, baja y edición de cuentas.", en: "Create, remove and edit accounts." } },
  { id: "roles", icon: Shield, label: { es: "Roles y permisos", en: "Roles and permissions" }, description: { es: "Distintos niveles de acceso.", en: "Different access levels." } },
  { id: "realtime", icon: Radio, label: { es: "Tiempo real", en: "Realtime" }, description: { es: "Cambios visibles al instante para todos.", en: "Changes visible instantly to everyone." } },
  { id: "correos", icon: Send, label: { es: "Envío de correos", en: "Email sending" }, description: { es: "Notificaciones automáticas por email.", en: "Automatic email notifications." } },
  { id: "archivos", icon: FolderOpen, label: { es: "Gestión de archivos", en: "File management" }, description: { es: "Subir y organizar documentos.", en: "Upload and organize documents." } },
  { id: "buscador", icon: Search, label: { es: "Buscador", en: "Search" }, description: { es: "Encontrar contenido rápidamente.", en: "Find content quickly." } },
  { id: "estadisticas", icon: PieChart, label: { es: "Estadísticas", en: "Statistics" }, description: { es: "Métricas de uso o negocio.", en: "Usage or business metrics." } },
  { id: "apis", icon: Plug, label: { es: "Integraciones con APIs", en: "API integrations" }, description: { es: "Conexión con servicios externos.", en: "Connection with external services." } },
  { id: "pagos", icon: CreditCard, label: { es: "Pagos online", en: "Online payments" }, description: { es: "Cobro directo desde la web o app.", en: "Direct payment from the website or app." } },
  { id: "reservas", icon: CalendarCheck, label: { es: "Reservas", en: "Bookings" }, description: { es: "Citas o disponibilidad en tiempo real.", en: "Appointments or real-time availability." } },
  { id: "ia", icon: Bot, label: { es: "Inteligencia artificial", en: "Artificial intelligence" }, description: { es: "Respuestas o automatización con IA.", en: "AI-driven responses or automation." } },
  { id: "bilingue", icon: Languages, label: { es: "Bilingüe (ES/EN)", en: "Bilingual (ES/EN)" }, description: { es: "Contenido en dos idiomas.", en: "Content in two languages." } },
];

export const STYLE_TONE_OPTIONS: OptionDef<StyleTone>[] = [
  { id: "corporativo", icon: Landmark, label: { es: "Corporativo", en: "Corporate" }, description: { es: "Serio, ordenado, confiable.", en: "Serious, orderly, trustworthy." } },
  { id: "minimalista", icon: Gem, label: { es: "Minimalista", en: "Minimalist" }, description: { es: "Poco ruido visual, mucho espacio.", en: "Little visual noise, lots of space." } },
  { id: "tecnologico", icon: Cpu, label: { es: "Tecnológico", en: "Tech-forward" }, description: { es: "Preciso, moderno, digital.", en: "Precise, modern, digital." } },
  { id: "elegante", icon: PenTool, label: { es: "Elegante", en: "Elegant" }, description: { es: "Cuidado, sobrio, premium.", en: "Refined, understated, premium." } },
  { id: "cercano", icon: Handshake, label: { es: "Cercano", en: "Approachable" }, description: { es: "Humano, cálido, accesible.", en: "Human, warm, accessible." } },
  { id: "creativo", icon: PenTool, label: { es: "Creativo", en: "Creative" }, description: { es: "Con personalidad y color.", en: "Full of personality and color." } },
  { id: "energico", icon: Flame, label: { es: "Enérgico", en: "Energetic" }, description: { es: "Dinámico, directo, con impacto.", en: "Dynamic, direct, high impact." } },
];

export const STYLE_COLOR_PRESETS: { id: string; value: string; label: { es: string; en: string } }[] = [
  { id: "navy", value: "#081b2e", label: { es: "Azul marino", en: "Navy" } },
  { id: "cobalt", value: "#2855ff", label: { es: "Azul eléctrico", en: "Electric blue" } },
  { id: "emerald", value: "#1f8a5f", label: { es: "Verde esmeralda", en: "Emerald green" } },
  { id: "amber", value: "#c9821a", label: { es: "Ámbar", en: "Amber" } },
  { id: "plum", value: "#6d3b8f", label: { es: "Ciruela", en: "Plum" } },
  { id: "slate", value: "#334155", label: { es: "Pizarra", en: "Slate" } },
  { id: "rose", value: "#b3405a", label: { es: "Granate", en: "Rose" } },
  { id: "teal", value: "#0f766e", label: { es: "Verde azulado", en: "Teal" } },
];

export const CONTRAST_OPTIONS: { id: ContrastLevel; label: { es: string; en: string } }[] = [
  { id: "suave", label: { es: "Suave", en: "Soft" } },
  { id: "medio", label: { es: "Medio", en: "Medium" } },
  { id: "alto", label: { es: "Alto", en: "High" } },
];

export const DENSITY_OPTIONS: { id: Density; label: { es: string; en: string } }[] = [
  { id: "comoda", label: { es: "Cómoda", en: "Comfortable" } },
  { id: "equilibrada", label: { es: "Equilibrada", en: "Balanced" } },
  { id: "compacta", label: { es: "Compacta", en: "Compact" } },
];

export const READINESS_OPTIONS: OptionDef<ReadinessStatus>[] = [
  { id: "idea-inicial", icon: FlaskConical, label: { es: "Solo tengo la idea", en: "Just an idea" }, description: { es: "Todavía no hay nada escrito.", en: "Nothing written down yet." } },
  { id: "textos", icon: BookOpen, label: { es: "Ya tengo los textos", en: "I already have the copy" }, description: { es: "Sé qué quiero decir.", en: "I know what I want to say." } },
  { id: "branding", icon: PenTool, label: { es: "Tengo la marca", en: "I have branding" }, description: { es: "Logo y colores definidos.", en: "Logo and colors defined." } },
  { id: "diseno", icon: Images, label: { es: "Tengo un diseño", en: "I have a design" }, description: { es: "Mockups o referencias visuales.", en: "Mockups or visual references." } },
  { id: "producto-existente", icon: LayoutDashboard, label: { es: "Ya tengo un producto", en: "I already have a product" }, description: { es: "Quiero mejorarlo o ampliarlo.", en: "I want to improve or extend it." } },
  { id: "ayuda-completa", icon: HeartHandshake, label: { es: "Necesito ayuda con todo", en: "I need full help" }, description: { es: "Desde cero, paso a paso.", en: "From scratch, step by step." } },
];

export const URGENCY_OPTIONS: { id: Urgency; label: { es: string; en: string } }[] = [
  { id: "flexible", label: { es: "Sin prisa", en: "No rush" } },
  { id: "unos-meses", label: { es: "En unos meses", en: "Within a few months" } },
  { id: "lo-antes-posible", label: { es: "Lo antes posible", en: "As soon as possible" } },
];

// Los tipos "web" muestran el catálogo de módulos de sitio web; los tipos
// orientados a herramienta interna (app interna, integración de IA y "aún
// no lo tengo claro") muestran el catálogo de módulos de aplicación.
export function getModuleGroup(projectType: ProjectType | null): "web" | "app" {
  return projectType === "app-interna" || projectType === "ia-integracion" ? "app" : "web";
}
