import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/config";

// Barra general para las demos de negocio ficticio (web-profesional,
// web-captacion). Deliberadamente distinta de DemoBanner (usada por la demo
// de gestión de equipos), que tiene su propio texto y no debe modificarse.

const STRINGS: Record<Locale, { badge: string; back: string; cta: string; configuratorCta: string }> = {
  es: {
    badge: "Demo creada por Raúl Romero. Negocio y datos ficticios.",
    back: "Volver a raulromero.es",
    cta: "Quiero una web como esta",
    configuratorCta: "Configura tu proyecto",
  },
  en: {
    badge: "Demo by Raúl Romero. Fictional business and data.",
    back: "Back to raulromero.es",
    cta: "I want a website like this",
    configuratorCta: "Build your project",
  },
};

export function DemoTopBar({
  toneClassName,
  locale = "es",
}: {
  toneClassName: string;
  locale?: Locale;
}) {
  const t = STRINGS[locale];
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 px-4 py-2.5 text-center sm:flex-row sm:justify-between sm:text-left ${toneClassName}`}
      style={{ fontFamily: "var(--font-body), ui-sans-serif, system-ui, sans-serif" }}
    >
      <p className="text-sm font-medium">
        {t.badge}
      </p>
      <div className="flex flex-wrap shrink-0 items-center justify-center gap-3 sm:gap-4">
        <Link
          href={localizePath("/", locale)}
          className="inline-flex min-h-9 items-center gap-1.5 text-sm font-medium underline underline-offset-4 opacity-90 hover:opacity-100"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          {t.back}
        </Link>
        <Link
          href={localizePath("/configurador", locale)}
          className="inline-flex min-h-9 items-center rounded-md border border-current/40 px-3 text-sm font-medium transition-colors hover:border-current"
        >
          {t.configuratorCta}
        </Link>
        <Link
          href={locale === "es" ? "/#contacto" : "/en#contacto"}
          className="inline-flex min-h-9 items-center rounded-md bg-white px-3 text-sm font-semibold text-[#081B2E] transition-opacity hover:opacity-90"
        >
          {t.cta}
        </Link>
      </div>
    </div>
  );
}
