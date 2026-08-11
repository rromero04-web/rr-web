import { FisioNovaLogo } from "./FisioNovaLogo";
import { FISIONOVA_LOCATION } from "./content";

export function FisioNovaFooter() {
  return (
    <footer className="bg-[#0B4F49] py-10 text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <FisioNovaLogo variant="dark" />
          <p className="mt-2 text-xs text-white/60">
            Fisioterapia y recuperación funcional en {FISIONOVA_LOCATION}.
          </p>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-white/60">
          Esta es una demostración ficticia. Ningún dato introducido se
          envía, almacena ni utiliza para prestar un servicio.
        </p>
      </div>
    </footer>
  );
}
