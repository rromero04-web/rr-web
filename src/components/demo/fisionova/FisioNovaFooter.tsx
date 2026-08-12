import type { Locale } from "@/lib/i18n/config";
import { FisioNovaLogo } from "./FisioNovaLogo";
import { FISIONOVA_LOCATION } from "./content";

const STRINGS: Record<Locale, { tagline: string; disclaimer: string }> = {
  es: {
    tagline: `Fisioterapia y recuperación funcional en ${FISIONOVA_LOCATION}.`,
    disclaimer:
      "Esta es una demostración ficticia. Ningún dato introducido se envía, almacena ni utiliza para prestar un servicio.",
  },
  en: {
    tagline: `Physiotherapy and functional recovery in ${FISIONOVA_LOCATION}.`,
    disclaimer:
      "This is a fictional demonstration. No data entered is sent, stored or used to provide a service.",
  },
};

export function FisioNovaFooter({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  return (
    <footer className="bg-[#0B4F49] py-10 text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <FisioNovaLogo variant="dark" />
          <p className="mt-2 text-xs text-white/60">
            {t.tagline}
          </p>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-white/60">
          {t.disclaimer}
        </p>
      </div>
    </footer>
  );
}
