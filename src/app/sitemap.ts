import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://raulromero.es";

// Las páginas legales (/aviso-legal, /privacidad, /cookies) y las demos de
// negocio ficticio (web-profesional, web-captacion) se excluyen a propósito:
// están marcadas como `noindex` y listarlas en el sitemap sería una señal
// contradictoria para los buscadores. Siguen siendo accesibles
// permanentemente desde el footer / las tarjetas de servicios.
const INDEXABLE_PATHS = ["", "/demo/gestion-de-equipos"];

// El configurador tiene slugs distintos por idioma (/configurador vs.
// /en/project-builder), a diferencia del resto de rutas del sitio.
const INDEXABLE_ALIAS_PATHS: { es: string; en: string }[] = [
  { es: "/configurador", en: "/en/project-builder" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const mirrored = INDEXABLE_PATHS.flatMap((path) => [
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

  const aliased = INDEXABLE_ALIAS_PATHS.flatMap(({ es, en }) => [
    {
      url: `${siteUrl}${es}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: { es: `${siteUrl}${es}`, en: `${siteUrl}${en}` },
      },
    },
    {
      url: `${siteUrl}${en}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: { es: `${siteUrl}${es}`, en: `${siteUrl}${en}` },
      },
    },
  ]);

  return [...mirrored, ...aliased];
}
