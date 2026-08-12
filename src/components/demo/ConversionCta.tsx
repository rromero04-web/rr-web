import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/config";

const STRINGS: Record<Locale, { title: string; body: string; cta: string }> = {
  es: {
    title: "¿Te gustaría una aplicación adaptada a tu empresa?",
    body: "Esta demostración es solo un ejemplo. Las funciones, permisos y flujos se adaptarían a las necesidades reales de cada empresa.",
    cta: "Cuéntame qué necesitas",
  },
  en: {
    title: "Would you like an application tailored to your business?",
    body: "This demo is just an example. Features, permissions and flows would be adapted to each business's actual needs.",
    cta: "Tell me what you need",
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
      <Link
        href={localizePath("/#contacto", locale)}
        className="mt-4 inline-flex shrink-0 items-center gap-2 bg-navy px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cobalt sm:mt-0"
      >
        {strings.cta}
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  );
}
