import Link from "next/link";
import { ArrowRight, Sliders } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/config";

const STRINGS: Record<Locale, { title: string; body: string; cta: string; configuratorCta: string }> = {
  es: {
    title: "¿Te gustaría una aplicación adaptada a tu empresa?",
    body: "Esta demostración es solo un ejemplo. Las funciones, permisos y flujos se adaptarían a las necesidades reales de cada empresa.",
    cta: "Cuéntame qué necesitas",
    configuratorCta: "Configura tu proyecto",
  },
  en: {
    title: "Would you like an application tailored to your business?",
    body: "This demo is just an example. Features, permissions and flows would be adapted to each business's actual needs.",
    cta: "Tell me what you need",
    configuratorCta: "Build your project",
  },
};

export function ConversionCta({ locale }: { locale: Locale }) {
  const strings = STRINGS[locale];
  return (
    <div className="mt-10 border border-line/70 bg-navy/[0.03] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div>
        <p className="text-sm font-bold text-navy">{strings.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate">{strings.body}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 sm:mt-0 sm:shrink-0">
        <Link
          href={localizePath("/configurador", locale)}
          className="inline-flex items-center gap-2 border border-navy px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-cobalt hover:text-cobalt"
        >
          <Sliders size={15} aria-hidden="true" />
          {strings.configuratorCta}
        </Link>
        <Link
          href={localizePath("/#contacto", locale)}
          className="inline-flex items-center gap-2 bg-navy px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cobalt"
        >
          {strings.cta}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
