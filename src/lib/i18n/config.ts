export type Locale = "es" | "en";

export const LOCALES: Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "es";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://raulromero.es";

// Rutas españolas actuales, sin prefijo. Las inglesas son exactamente las
// mismas rutas bajo /en (mismo slug), lo que permite calcular la ruta
// equivalente en el otro idioma con una simple operación de prefijo/recorte,
// sin necesidad de un mapa de traducciones de URL.
export function localizePath(pathname: string, locale: Locale): string {
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
