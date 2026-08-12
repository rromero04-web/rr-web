import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://raulromero.es";

// Las páginas legales (/aviso-legal, /privacidad, /cookies) y las demos de
// negocio ficticio (web-profesional, web-captacion) se excluyen a propósito:
// están marcadas como `noindex` y listarlas en el sitemap sería una señal
// contradictoria para los buscadores. Siguen siendo accesibles
// permanentemente desde el footer / las tarjetas de servicios.
const INDEXABLE_PATHS = ["", "/demo/gestion-de-equipos"];

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_PATHS.flatMap((path) => [
    {
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: (path === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "" ? 1 : 0.6,
      alternates: {
        languages: {
          es: `${siteUrl}${path}`,
          en: `${siteUrl}/en${path}`,
        },
      },
    },
    {
      url: `${siteUrl}/en${path}`,
      lastModified: new Date(),
      changeFrequency: (path === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "" ? 1 : 0.6,
      alternates: {
        languages: {
          es: `${siteUrl}${path}`,
          en: `${siteUrl}/en${path}`,
        },
      },
    },
  ]);
}
