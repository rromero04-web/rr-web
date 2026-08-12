import "client-only";
import type { Locale } from "@/lib/i18n/config";
import type { DemoState } from "./types";

// Persistencia puramente local (navegador). Nunca se envía nada a un
// servidor: esto es solo para que la demo recuerde tus cambios entre
// recargas de la misma pestaña/dispositivo.
//
// La clave se separa por idioma: los textos guardados (turnos editados,
// incidencias creadas...) están en el idioma en el que se escribieron, así
// que mezclar el estado guardado en español con la interfaz en inglés (o
// viceversa) daría una demo con textos en dos idiomas.
//
// La versión se sube a v2 (incluso para español) porque, al añadir el
// inglés, "Department"/"WeekDay" pasaron de palabras en español
// ("Administración", "Lunes") a identificadores estables ("administracion",
// "lunes"). Un visitante con estado guardado bajo v1 tendría esos campos en
// el formato antiguo, que ya no coincidiría con las comparaciones del
// código actual. Subir la versión hace que ese estado antiguo se ignore y
// la demo arranque limpia con los nuevos datos de ejemplo, en vez de
// arrastrar un estado con turnos/departamentos que dejan de filtrar bien.
function storageKey(locale: Locale): string {
  return locale === "es" ? "rr-demo-gestion-equipos-v2" : `rr-demo-gestion-equipos-v2-${locale}`;
}

export function loadDemoState(locale: Locale): DemoState | null {
  try {
    const raw = window.localStorage.getItem(storageKey(locale));
    if (!raw) return null;
    return JSON.parse(raw) as DemoState;
  } catch {
    return null;
  }
}

export function saveDemoState(locale: Locale, state: DemoState) {
  try {
    window.localStorage.setItem(storageKey(locale), JSON.stringify(state));
  } catch {
    // Almacenamiento no disponible (modo privado, cuota llena...): la demo
    // sigue funcionando en memoria, simplemente no persiste entre recargas.
  }
}

export function clearDemoState(locale: Locale) {
  try {
    window.localStorage.removeItem(storageKey(locale));
  } catch {
    // Ignorar: sin persistencia, no hay nada que limpiar.
  }
}
