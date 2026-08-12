"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/i18n/config";
import type {
  DemoState,
  DemoTask,
  Incident,
  IncidentStatus,
  WeekDay,
} from "@/lib/demo/types";
import { DEMO_VISITOR_NAME } from "@/lib/demo/types";
import { INTL_LOCALE } from "@/lib/demo/labels";
import { createInitialDemoState } from "@/lib/demo/seed-data";
import { clearDemoState, loadDemoState, saveDemoState } from "@/lib/demo/storage";

const WORKPLACE_LOCATION: Record<Locale, string> = {
  es: "Centro de trabajo",
  en: "Workplace",
};

const TODAY_LABEL: Record<Locale, string> = {
  es: "Hoy",
  en: "Today",
};

type Action =
  | { type: "CLOCK_IN"; locale: Locale }
  | { type: "CLOCK_OUT"; locale: Locale }
  | { type: "TOGGLE_TASK"; taskId: string }
  | { type: "SET_INCIDENT_STATUS"; incidentId: string; status: IncidentStatus }
  | { type: "CREATE_INCIDENT"; incident: Omit<Incident, "id" | "createdAt">; locale: Locale }
  | { type: "UPDATE_SHIFT"; employeeId: string; day: WeekDay; label: string; isAbsence: boolean }
  | { type: "RESET"; state: DemoState };

function nowLabel(locale: Locale) {
  return new Date().toLocaleTimeString(INTL_LOCALE[locale], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "CLOCK_IN": {
      if (state.visitorStatus === "trabajando") return state;
      return {
        ...state,
        visitorStatus: "trabajando",
        timeEntries: [
          {
            id: `visitor-${Date.now()}`,
            employeeId: "visitor",
            employeeName: DEMO_VISITOR_NAME[action.locale],
            type: "entrada",
            timestamp: new Date().toISOString(),
            location: WORKPLACE_LOCATION[action.locale],
          },
          ...state.timeEntries,
        ],
      };
    }
    case "CLOCK_OUT": {
      if (state.visitorStatus === "fuera") return state;
      return {
        ...state,
        visitorStatus: "fuera",
        timeEntries: [
          {
            id: `visitor-${Date.now()}`,
            employeeId: "visitor",
            employeeName: DEMO_VISITOR_NAME[action.locale],
            type: "salida",
            timestamp: new Date().toISOString(),
            location: WORKPLACE_LOCATION[action.locale],
          },
          ...state.timeEntries,
        ],
      };
    }
    case "TOGGLE_TASK": {
      return {
        ...state,
        tasks: state.tasks.map((task: DemoTask) =>
          task.id === action.taskId
            ? {
                ...task,
                status: task.status === "completada" ? "pendiente" : "completada",
              }
            : task
        ),
      };
    }
    case "SET_INCIDENT_STATUS": {
      return {
        ...state,
        incidents: state.incidents.map((incident) =>
          incident.id === action.incidentId
            ? { ...incident, status: action.status }
            : incident
        ),
      };
    }
    case "CREATE_INCIDENT": {
      const incident: Incident = {
        ...action.incident,
        id: `incident-${Date.now()}`,
        createdAt: `${TODAY_LABEL[action.locale]}, ${nowLabel(action.locale)}`,
      };
      return { ...state, incidents: [incident, ...state.incidents] };
    }
    case "UPDATE_SHIFT": {
      return {
        ...state,
        shifts: state.shifts.map((shift) =>
          shift.employeeId === action.employeeId && shift.day === action.day
            ? {
                ...shift,
                label: action.label,
                isAbsence: action.isAbsence,
              }
            : shift
        ),
      };
    }
    case "RESET":
      return action.state;
    default:
      return state;
  }
}

interface DemoDataContextValue {
  state: DemoState;
  clockIn: () => void;
  clockOut: () => void;
  toggleTask: (taskId: string) => void;
  setIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  createIncident: (incident: Omit<Incident, "id" | "createdAt">) => void;
  updateShift: (employeeId: string, day: WeekDay, label: string, isAbsence: boolean) => void;
  resetDemo: () => void;
}

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

export function DemoDataProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, locale, createInitialDemoState);

  // Al montar en el navegador, si hay cambios guardados de una visita
  // anterior a esta demo (en este mismo idioma), los recuperamos. La primera
  // renderización (servidor y cliente) siempre usa los datos semilla para
  // que coincidan y no haya parpadeos de hidratación.
  useEffect(() => {
    const saved = loadDemoState(locale);
    if (saved) {
      dispatch({ type: "RESET", state: saved });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveDemoState(locale, state);
  }, [locale, state]);

  const value = useMemo<DemoDataContextValue>(
    () => ({
      state,
      clockIn: () => dispatch({ type: "CLOCK_IN", locale }),
      clockOut: () => dispatch({ type: "CLOCK_OUT", locale }),
      toggleTask: (taskId) => dispatch({ type: "TOGGLE_TASK", taskId }),
      setIncidentStatus: (incidentId, status) =>
        dispatch({ type: "SET_INCIDENT_STATUS", incidentId, status }),
      createIncident: (incident) => dispatch({ type: "CREATE_INCIDENT", incident, locale }),
      updateShift: (employeeId, day, label, isAbsence) =>
        dispatch({ type: "UPDATE_SHIFT", employeeId, day, label, isAbsence }),
      resetDemo: () => {
        clearDemoState(locale);
        dispatch({ type: "RESET", state: createInitialDemoState(locale) });
      },
    }),
    [state, locale]
  );

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) {
    throw new Error("useDemoData debe usarse dentro de DemoDataProvider");
  }
  return ctx;
}
