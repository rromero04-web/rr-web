import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/config";

const STRINGS: Record<Locale, { badge: string; notice: string; back: string; configuratorCta: string }> = {
  es: {
    badge: "DEMO INTERACTIVA",
    notice: "Todos los nombres, datos y registros son ficticios.",
    back: "Volver a raulromero.es",
    configuratorCta: "Configura tu proyecto",
  },
  en: {
    badge: "INTERACTIVE DEMO",
    notice: "All names, data and records are fictional.",
    back: "Back to raulromero.es",
    configuratorCta: "Build your project",
  },
};

export function DemoBanner({ locale }: { locale: Locale }) {
  const strings = STRINGS[locale];
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 border-b border-cobalt/40 bg-navy px-4 py-2.5 text-center text-cream sm:flex-row sm:justify-between sm:text-left">
      <p className="text-xs font-semibold tracking-wide sm:text-sm">
        <span className="text-cobalt-soft">{strings.badge}</span> · {strings.notice}
      </p>
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
        <Link
          href={localizePath("/configurador", locale)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cream/80 underline underline-offset-2 hover:text-cream"
        >
          {strings.configuratorCta}
        </Link>
        <Link
          href={localizePath("/", locale)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cream/80 underline underline-offset-2 hover:text-cream"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          {strings.back}
        </Link>
      </div>
    </div>
  );
}
