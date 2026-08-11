import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 border-b border-cobalt/40 bg-navy px-4 py-2.5 text-center text-cream sm:flex-row sm:justify-between sm:text-left">
      <p className="text-xs font-semibold tracking-wide sm:text-sm">
        <span className="text-cobalt-soft">DEMO INTERACTIVA</span> · Todos los
        nombres, datos y registros son ficticios.
      </p>
      <Link
        href="/"
        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-cream/80 underline underline-offset-2 hover:text-cream"
      >
        <ArrowLeft size={13} aria-hidden="true" />
        Volver a raulromero.es
      </Link>
    </div>
  );
}
