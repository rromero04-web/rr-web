export type Locale = "es" | "en";

export const LOCALES: Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "es";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://raulromero.es";

// Casi todas las rutas inglesas son exactamente las rutas españolas bajo
// /en (mismo slug), lo que permite calcular la ruta equivalente en el otro
// idioma con una simple operación de prefijo/recorte. Las pocas
// excepciones con slugs distintos por idioma se listan aquí explícitamente.
const ROUTE_ALIASES: [string, string][] = [["/configurador", "/en/project-builder"]];

export function localizePath(pathname: string, locale: Locale): string {
  for (const [es, en] of ROUTE_ALIASES) {
    if (pathname === es || pathname === en) {
      return locale === "es" ? es : en;
    }
  }
  const bare = pathname.startsWith("/en")
    ? pathname.slice(3) || "/"
    : pathname;
  if (locale === "es") return bare;
  return bare === "/" ? "/en" : `/en${bare}`;
}

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname.startsWith("/en") ? "en" : "es";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

// Antepone la URL absoluta del sitio a una ruta ya localizada, para usar en
// canonical/hreflang/Open Graph.
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}
