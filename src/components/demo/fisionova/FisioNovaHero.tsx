import { FISIONOVA_LOCATION } from "./content";

export function FisioNovaHero() {
  return (
    <section id="inicio" className="border-b border-[#E4DFD3] bg-[#FAF9F5] py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="inline-flex items-center gap-2 border border-[#0E6E64]/25 bg-[#0E6E64]/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-[#0B4F49] uppercase">
            Fisioterapia en {FISIONOVA_LOCATION}
          </p>
          <h1 className="mt-6 text-4xl leading-[1.1] font-extrabold tracking-tight text-[#123832] sm:text-5xl">
            Recupera tu movilidad. Vuelve a sentirte bien.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#5C726D]">
            Fisioterapia personalizada para aliviar el dolor, recuperar
            movimiento y ayudarte a retomar tu día a día.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contacto"
              className="inline-flex items-center justify-center bg-[#0E6E64] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B4F49]"
            >
              Solicitar una primera valoración
            </a>
            <a
              href="#tratamientos"
              className="inline-flex items-center justify-center border border-[#0E6E64]/30 px-6 py-3.5 text-sm font-semibold text-[#123832] transition-colors hover:border-[#0E6E64] hover:text-[#0E6E64]"
            >
              Conocer los tratamientos
            </a>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-sm" aria-hidden="true">
          <svg viewBox="0 0 400 400" className="h-full w-full">
            <circle cx="200" cy="200" r="180" fill="#0E6E64" opacity="0.06" />
            <path
              d="M70 250C70 160 140 90 230 90c30 0 58 8 82 22-40 8-72 34-84 72-14 46 8 94 54 116-52 34-118 40-176 14-64-28-102-90-108-160C68 190 68 220 70 250Z"
              fill="#0E6E64"
              opacity="0.85"
            />
            <path
              d="M150 300c40-10 70-42 78-84"
              stroke="#8FD6BE"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="255" cy="130" r="14" fill="#8FD6BE" />
          </svg>
        </div>
      </div>
    </section>
  );
}
