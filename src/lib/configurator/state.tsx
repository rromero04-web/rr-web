"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/i18n/config";
import {
  APP_MODULE_OPTIONS,
  CLIENT_TYPE_OPTIONS,
  CONTRAST_OPTIONS,
  DENSITY_OPTIONS,
  FEATURE_OPTIONS,
  getModuleGroup,
  GOAL_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  READINESS_OPTIONS,
  STYLE_TONE_OPTIONS,
  URGENCY_OPTIONS,
  WEB_MODULE_OPTIONS,
} from "./options";
import { LOG_MESSAGES, STEP_META, STEP_ORDER } from "./strings";
import { initialConfig, normalizeConfig } from "./types";
import type {
  ClientType,
  ConfiguratorConfig,
  ConfiguratorState,
  ContrastLevel,
  Density,
  FeatureId,
  Goal,
  LogEntry,
  ModuleId,
  PreviewDevice,
  ProjectType,
  ReadinessStatus,
  StepId,
  StyleTone,
  Urgency,
} from "./types";

export { initialConfig, normalizeConfig };

const STORAGE_VERSION = "v1";

function storageKey(locale: Locale): string {
  return `rr-configurator-${locale}-${STORAGE_VERSION}`;
}

function initialState(): ConfiguratorState {
  return {
    currentStep: "type",
    visitedSteps: ["type"],
    config: initialConfig(),
    device: "desktop",
    log: [],
  };
}

interface PersistedShape {
  config: ConfiguratorConfig;
  device: PreviewDevice;
  currentStep: StepId;
  visitedSteps: StepId[];
}

export function loadPersistedState(locale: Locale): PersistedShape | null {
  try {
    const raw = window.localStorage.getItem(storageKey(locale));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedShape;
    if (!parsed || typeof parsed !== "object" || !parsed.config) return null;
    return parsed;
  } catch {
    return null;
  }
}

function savePersistedState(locale: Locale, state: ConfiguratorState) {
  try {
    const payload: PersistedShape = {
      config: state.config,
      device: state.device,
      currentStep: state.currentStep,
      visitedSteps: state.visitedSteps,
    };
    window.localStorage.setItem(storageKey(locale), JSON.stringify(payload));
  } catch {
    // Almacenamiento no disponible: el configurador sigue funcionando en
    // memoria, simplemente no recuerda el progreso entre visitas.
  }
}

export function clearPersistedState(locale: Locale) {
  try {
    window.localStorage.removeItem(storageKey(locale));
  } catch {
    // Nada que limpiar si no hay almacenamiento disponible.
  }
}

// El enlace para compartir solo codifica decisiones no personales (el
// propio `ConfiguratorConfig`): ningún dato de contacto forma parte de él.
export function encodeConfigToParam(config: ConfiguratorConfig): string {
  const json = JSON.stringify(config);
  const base64 = typeof window === "undefined" ? "" : window.btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeConfigFromParam(param: string): ConfiguratorConfig | null {
  try {
    const base64 = param.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(window.atob(base64)));
    return normalizeConfig(JSON.parse(json));
  } catch {
    return null;
  }
}

function findLabel<Id extends string>(
  options: { id: Id; label: { es: string; en: string } }[],
  id: Id,
  locale: Locale
): string {
  return options.find((option) => option.id === id)?.label[locale] ?? id;
}

type Action =
  | { type: "SET_TYPE"; value: ProjectType; locale: Locale }
  | { type: "SET_GOAL"; value: Goal; locale: Locale }
  | { type: "SET_CLIENT"; value: ClientType; locale: Locale }
  | { type: "TOGGLE_MODULE"; value: ModuleId; locale: Locale }
  | { type: "TOGGLE_FEATURE"; value: FeatureId; locale: Locale }
  | { type: "SET_STYLE_TONE"; value: StyleTone; locale: Locale }
  | { type: "SET_STYLE_COLOR"; value: string; label: string; locale: Locale }
  | { type: "SET_STYLE_CONTRAST"; value: ContrastLevel; locale: Locale }
  | { type: "SET_STYLE_DENSITY"; value: Density; locale: Locale }
  | { type: "SET_READINESS"; value: ReadinessStatus; locale: Locale }
  | { type: "SET_URGENCY"; value: Urgency; locale: Locale }
  | { type: "SET_DEVICE"; value: PreviewDevice; locale: Locale }
  | { type: "GO_NEXT"; locale: Locale }
  | { type: "GO_BACK"; locale: Locale }
  | { type: "GO_TO_STEP"; value: StepId; locale: Locale }
  | { type: "ARCHITECTURE_OPENED"; locale: Locale }
  | { type: "SHARED"; locale: Locale }
  | { type: "SUBMITTED"; locale: Locale }
  | { type: "RESET"; locale: Locale }
  | { type: "HYDRATE"; state: Partial<ConfiguratorState> };

function withLog(state: ConfiguratorState, message: string): LogEntry[] {
  const entry: LogEntry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ts: Date.now(), message };
  return [entry, ...state.log].slice(0, 30);
}

function markVisited(visited: StepId[], step: StepId): StepId[] {
  return visited.includes(step) ? visited : [...visited, step];
}

function reducer(state: ConfiguratorState, action: Action): ConfiguratorState {
  switch (action.type) {
    case "SET_TYPE": {
      const label = findLabel(PROJECT_TYPE_OPTIONS, action.value, action.locale);
      const groupChanged = getModuleGroup(state.config.projectType) !== getModuleGroup(action.value);
      return {
        ...state,
        config: {
          ...state.config,
          projectType: action.value,
          // El catálogo de módulos depende del tipo (web vs. app): si cambia
          // de grupo, los módulos ya elegidos dejarían de tener sentido.
          modules: groupChanged ? [] : state.config.modules,
        },
        log: withLog(state, LOG_MESSAGES[action.locale].type(label)),
      };
    }
    case "SET_GOAL": {
      const label = findLabel(GOAL_OPTIONS, action.value, action.locale);
      return {
        ...state,
        config: { ...state.config, goal: action.value },
        log: withLog(state, LOG_MESSAGES[action.locale].goal(label)),
      };
    }
    case "SET_CLIENT": {
      const label = findLabel(CLIENT_TYPE_OPTIONS, action.value, action.locale);
      return {
        ...state,
        config: { ...state.config, clientType: action.value },
        log: withLog(state, LOG_MESSAGES[action.locale].client(label)),
      };
    }
    case "TOGGLE_MODULE": {
      const has = state.config.modules.includes(action.value);
      const allOptions = [...WEB_MODULE_OPTIONS, ...APP_MODULE_OPTIONS];
      const label = findLabel(allOptions, action.value, action.locale);
      return {
        ...state,
        config: {
          ...state.config,
          modules: has
            ? state.config.modules.filter((id) => id !== action.value)
            : [...state.config.modules, action.value],
        },
        log: withLog(
          state,
          has ? LOG_MESSAGES[action.locale].moduleRemoved(label) : LOG_MESSAGES[action.locale].moduleAdded(label)
        ),
      };
    }
    case "TOGGLE_FEATURE": {
      const has = state.config.features.includes(action.value);
      const label = findLabel(FEATURE_OPTIONS, action.value, action.locale);
      return {
        ...state,
        config: {
          ...state.config,
          features: has
            ? state.config.features.filter((id) => id !== action.value)
            : [...state.config.features, action.value],
        },
        log: withLog(
          state,
          has ? LOG_MESSAGES[action.locale].featureRemoved(label) : LOG_MESSAGES[action.locale].featureAdded(label)
        ),
      };
    }
    case "SET_STYLE_TONE": {
      const label = findLabel(STYLE_TONE_OPTIONS, action.value, action.locale);
      return {
        ...state,
        config: { ...state.config, style: { ...state.config.style, tone: action.value } },
        log: withLog(state, LOG_MESSAGES[action.locale].style(label)),
      };
    }
    case "SET_STYLE_COLOR": {
      return {
        ...state,
        config: { ...state.config, style: { ...state.config.style, color: action.value } },
        log: withLog(state, LOG_MESSAGES[action.locale].color(action.label)),
      };
    }
    case "SET_STYLE_CONTRAST": {
      const label = findLabel(CONTRAST_OPTIONS, action.value, action.locale);
      return {
        ...state,
        config: { ...state.config, style: { ...state.config.style, contrast: action.value } },
        log: withLog(state, LOG_MESSAGES[action.locale].contrast(label)),
      };
    }
    case "SET_STYLE_DENSITY": {
      const label = findLabel(DENSITY_OPTIONS, action.value, action.locale);
      return {
        ...state,
        config: { ...state.config, style: { ...state.config.style, density: action.value } },
        log: withLog(state, LOG_MESSAGES[action.locale].density(label)),
      };
    }
    case "SET_READINESS": {
      const label = findLabel(READINESS_OPTIONS, action.value, action.locale);
      return {
        ...state,
        config: { ...state.config, status: { ...state.config.status, readiness: action.value } },
        log: withLog(state, LOG_MESSAGES[action.locale].readiness(label)),
      };
    }
    case "SET_URGENCY": {
      const label = findLabel(URGENCY_OPTIONS, action.value, action.locale);
      return {
        ...state,
        config: { ...state.config, status: { ...state.config.status, urgency: action.value } },
        log: withLog(state, LOG_MESSAGES[action.locale].urgency(label)),
      };
    }
    case "SET_DEVICE": {
      const label = { desktop: { es: "escritorio", en: "desktop" }, tablet: { es: "tablet", en: "tablet" }, mobile: { es: "móvil", en: "mobile" } }[action.value][action.locale];
      return {
        ...state,
        device: action.value,
        log: withLog(state, LOG_MESSAGES[action.locale].device(label)),
      };
    }
    case "GO_NEXT": {
      const index = STEP_ORDER.indexOf(state.currentStep);
      const next = STEP_ORDER[Math.min(index + 1, STEP_ORDER.length - 1)];
      return {
        ...state,
        currentStep: next,
        visitedSteps: markVisited(state.visitedSteps, next),
        log: withLog(state, LOG_MESSAGES[action.locale].stepNext(STEP_META[next][action.locale].title)),
      };
    }
    case "GO_BACK": {
      const index = STEP_ORDER.indexOf(state.currentStep);
      const prev = STEP_ORDER[Math.max(index - 1, 0)];
      return {
        ...state,
        currentStep: prev,
        log: withLog(state, LOG_MESSAGES[action.locale].stepBack(STEP_META[prev][action.locale].title)),
      };
    }
    case "GO_TO_STEP": {
      return {
        ...state,
        currentStep: action.value,
        visitedSteps: markVisited(state.visitedSteps, action.value),
        log: withLog(state, LOG_MESSAGES[action.locale].stepNext(STEP_META[action.value][action.locale].title)),
      };
    }
    case "ARCHITECTURE_OPENED": {
      return { ...state, log: withLog(state, LOG_MESSAGES[action.locale].architectureOpened) };
    }
    case "SHARED": {
      return { ...state, log: withLog(state, LOG_MESSAGES[action.locale].shared) };
    }
    case "SUBMITTED": {
      return { ...state, log: withLog(state, LOG_MESSAGES[action.locale].submitted) };
    }
    case "RESET": {
      const fresh = initialState();
      return { ...fresh, log: withLog(fresh, LOG_MESSAGES[action.locale].reset) };
    }
    case "HYDRATE": {
      return { ...state, ...action.state };
    }
    default:
      return state;
  }
}

interface ConfiguratorContextValue {
  state: ConfiguratorState;
  setType: (value: ProjectType) => void;
  setGoal: (value: Goal) => void;
  setClient: (value: ClientType) => void;
  toggleModule: (value: ModuleId) => void;
  toggleFeature: (value: FeatureId) => void;
  setStyleTone: (value: StyleTone) => void;
  setStyleColor: (value: string, label: string) => void;
  setStyleContrast: (value: ContrastLevel) => void;
  setStyleDensity: (value: Density) => void;
  setReadiness: (value: ReadinessStatus) => void;
  setUrgency: (value: Urgency) => void;
  setDevice: (value: PreviewDevice) => void;
  goNext: () => void;
  goBack: () => void;
  goToStep: (value: StepId) => void;
  architectureOpened: () => void;
  shared: () => void;
  submitted: () => void;
  reset: () => void;
}

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

export function ConfiguratorProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // La primera renderización (servidor y cliente) usa siempre el estado
  // inicial para que coincidan; tras montar, recuperamos progreso guardado
  // (localStorage) o compartido por URL (?c=...), dando prioridad al enlace.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("c");
    if (shared) {
      const config = decodeConfigFromParam(shared);
      if (config) {
        dispatch({ type: "HYDRATE", state: { config } });
        return;
      }
    }
    const persisted = loadPersistedState(locale);
    if (persisted) {
      dispatch({
        type: "HYDRATE",
        state: {
          config: persisted.config,
          device: persisted.device,
          currentStep: persisted.currentStep,
          visitedSteps: persisted.visitedSteps,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    savePersistedState(locale, state);
  }, [locale, state]);

  const value = useMemo<ConfiguratorContextValue>(
    () => ({
      state,
      setType: (value) => dispatch({ type: "SET_TYPE", value, locale }),
      setGoal: (value) => dispatch({ type: "SET_GOAL", value, locale }),
      setClient: (value) => dispatch({ type: "SET_CLIENT", value, locale }),
      toggleModule: (value) => dispatch({ type: "TOGGLE_MODULE", value, locale }),
      toggleFeature: (value) => dispatch({ type: "TOGGLE_FEATURE", value, locale }),
      setStyleTone: (value) => dispatch({ type: "SET_STYLE_TONE", value, locale }),
      setStyleColor: (value, label) => dispatch({ type: "SET_STYLE_COLOR", value, label, locale }),
      setStyleContrast: (value) => dispatch({ type: "SET_STYLE_CONTRAST", value, locale }),
      setStyleDensity: (value) => dispatch({ type: "SET_STYLE_DENSITY", value, locale }),
      setReadiness: (value) => dispatch({ type: "SET_READINESS", value, locale }),
      setUrgency: (value) => dispatch({ type: "SET_URGENCY", value, locale }),
      setDevice: (value) => dispatch({ type: "SET_DEVICE", value, locale }),
      goNext: () => dispatch({ type: "GO_NEXT", locale }),
      goBack: () => dispatch({ type: "GO_BACK", locale }),
      goToStep: (value) => dispatch({ type: "GO_TO_STEP", value, locale }),
      architectureOpened: () => dispatch({ type: "ARCHITECTURE_OPENED", locale }),
      shared: () => dispatch({ type: "SHARED", locale }),
      submitted: () => dispatch({ type: "SUBMITTED", locale }),
      reset: () => {
        clearPersistedState(locale);
        dispatch({ type: "RESET", locale });
      },
    }),
    [state, locale]
  );

  return <ConfiguratorContext.Provider value={value}>{children}</ConfiguratorContext.Provider>;
}

export function useConfigurator() {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) {
    throw new Error("useConfigurator debe usarse dentro de ConfiguratorProvider");
  }
  return ctx;
}

export function useCanJumpToStep() {
  const { state } = useConfigurator();
  return useCallback(
    (step: StepId) => {
      const targetIndex = STEP_ORDER.indexOf(step);
      const currentIndex = STEP_ORDER.indexOf(state.currentStep);
      return targetIndex <= currentIndex || state.visitedSteps.includes(step);
    },
    [state.currentStep, state.visitedSteps]
  );
}
