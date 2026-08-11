import "client-only";
import type { DemoState } from "./types";

// Persistencia puramente local (navegador). Nunca se envía nada a un
// servidor: esto es solo para que la demo recuerde tus cambios entre
// recargas de la misma pestaña/dispositivo.
const STORAGE_KEY = "rr-demo-gestion-equipos-v1";

export function loadDemoState(): DemoState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoState;
  } catch {
    return null;
  }
}

export function saveDemoState(state: DemoState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Almacenamiento no disponible (modo privado, cuota llena...): la demo
    // sigue funcionando en memoria, simplemente no persiste entre recargas.
  }
}

export function clearDemoState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignorar: sin persistencia, no hay nada que limpiar.
  }
}
