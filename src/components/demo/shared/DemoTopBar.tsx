import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/config";

// Barra general para las demos de negocio ficticio (web-profesional,
// web-captacion). Deliberadamente distinta de DemoBanner (usada por la demo
// de gestión de equipos), que tiene su propio texto y no debe modificarse.

const STRINGS: Record<Locale, { badge: string; back: string; cta: string }> = {
  es: {
    badge: "DEMO CREADA POR RAÚL ROMERO · Negocio y datos ficticios",
    back: "Volver a raulromero.es",
    cta: "Quiero una web como esta",
  },
  en: {
    badge: "DEMO BY RAÚL ROMERO · Fictional business and data",
    back: "Back to raulromero.es",
    cta: "I want a website like this",
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
    >
      <p className="text-xs font-semibold tracking-wide sm:text-sm">
        {t.badge}
      </p>
      <div className="flex shrink-0 items-center gap-4">
        <Link
          href={localizePath("/", locale)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold underline underline-offset-2 opacity-90 hover:opacity-100"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          {t.back}
        </Link>
        <Link
          href={locale === "es" ? "/#contacto" : "/en#contacto"}
          className="inline-flex items-center border border-current px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
        >
          {t.cta}
        </Link>
      </div>
    </div>
  );
}
