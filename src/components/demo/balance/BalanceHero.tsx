export function BalanceHero() {
  return (
    <section id="hero" className="border-b border-[#16233A]/10 bg-[#F6F4EF] py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#2F8F5B] uppercase">
          Asesoría fiscal para autónomos y pequeñas empresas
        </p>
        <h1 className="mt-5 text-4xl leading-[1.1] font-extrabold tracking-tight text-[#16233A] sm:text-5xl">
          Tus obligaciones fiscales, explicadas con claridad y sin sorpresas.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#4B5568]">
          Revisamos tu situación, te ayudamos a ordenar la gestión y te
          indicamos cuáles deberían ser tus próximos pasos.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#valoracion"
            className="inline-flex items-center justify-center bg-[#2F8F5B] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#26744A]"
          >
            Solicitar valoración inicial
          </a>
          <a
            href="#como-funciona"
            className="inline-flex items-center justify-center border border-[#16233A]/20 px-6 py-3.5 text-sm font-semibold text-[#16233A] transition-colors hover:border-[#16233A]/50"
          >
            Ver cómo funciona
          </a>
        </div>

        <p className="mt-5 text-xs font-medium tracking-wide text-[#4B5568]">
          Sin compromiso · Respuesta simulada · Datos ficticios
        </p>
      </div>
    </section>
  );
}
