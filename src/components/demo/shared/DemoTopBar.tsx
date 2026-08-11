import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Barra general para las demos de negocio ficticio (web-profesional,
// web-captacion). Deliberadamente distinta de DemoBanner (usada por la demo
// de gestión de equipos), que tiene su propio texto y no debe modificarse.
export function DemoTopBar({ toneClassName }: { toneClassName: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 px-4 py-2.5 text-center sm:flex-row sm:justify-between sm:text-left ${toneClassName}`}
    >
      <p className="text-xs font-semibold tracking-wide sm:text-sm">
        DEMO CREADA POR RAÚL ROMERO · Negocio y datos ficticios
      </p>
      <div className="flex shrink-0 items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold underline underline-offset-2 opacity-90 hover:opacity-100"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          Volver a raulromero.es
        </Link>
        <Link
          href="/#contacto"
          className="inline-flex items-center border border-current px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
        >
          Quiero una web como esta
        </Link>
      </div>
    </div>
  );
}
