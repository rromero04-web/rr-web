import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ConversionCta() {
  return (
    <div className="mt-10 border border-line/70 bg-navy/[0.03] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div>
        <p className="text-sm font-bold text-navy">
          ¿Te gustaría una aplicación adaptada a tu empresa?
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate">
          Esta demostración es solo un ejemplo. Las funciones, permisos y
          flujos se adaptarían a las necesidades reales de cada empresa.
        </p>
      </div>
      <Link
        href="/#contacto"
        className="mt-4 inline-flex shrink-0 items-center gap-2 bg-navy px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cobalt sm:mt-0"
      >
        Cuéntame qué necesitas
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  );
}
