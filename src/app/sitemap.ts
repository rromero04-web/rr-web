import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://raulromero.es";

// Las páginas legales (/aviso-legal, /privacidad, /cookies) se excluyen a
// propósito: están marcadas como `noindex` y listarlas en el sitemap sería
// una señal contradictoria para los buscadores. Siguen siendo accesibles
// permanentemente desde el footer.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
