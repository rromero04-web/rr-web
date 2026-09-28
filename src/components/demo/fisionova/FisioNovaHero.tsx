import type { Locale } from "@/lib/i18n/config";
import { FISIONOVA_LOCATION } from "./content";
import { Goniometer } from "./Goniometer";

const STRINGS: Record<Locale, {
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  caption: string;
}> = {
  es: {
    title: "Recupera tu movilidad. Vuelve a sentirte bien.",
    description: `Fisioterapia personalizada en ${FISIONOVA_LOCATION} para aliviar el dolor, recuperar movimiento y ayudarte a retomar tu día a día.`,
    ctaPrimary: "Solicitar una primera valoración",
    ctaSecondary: "Ver tratamientos",
    caption: "Medimos tu movilidad en cada revisión para que veas cómo avanzas.",
  },
  en: {
    title: "Recover your mobility. Feel like yourself again.",
    description: `Personalized physiotherapy in ${FISIONOVA_LOCATION} to relieve pain, regain movement and help you get back to your everyday life.`,
    ctaPrimary: "Request a first assessment",
    ctaSecondary: "See treatments",
    caption: "We measure your mobility at every check-up so you can see your progress.",
  },
};

export function FisioNovaHero({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];

  return (
    <section id="inicio" className="bg-[#FBFCFA] pt-14 pb-20 sm:pt-20 sm:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1 className="text-[2.75rem] leading-[1.05] font-bold tracking-[-0.02em] text-[#0F4C45] sm:text-6xl">
            {t.title}
          </h1>
          <p className="mt-6 max-w-[32em] text-lg leading-relaxed text-[#5E716C] sm:text-xl">
            {t.description}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contacto"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0F4C45] px-7 text-base font-semibold text-white transition-colors hover:bg-[#0A3A34]"
            >
              {t.ctaPrimary}
            </a>
            <a
              href="#tratamientos"
              className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-base font-semibold text-[#0F4C45] underline decoration-[#0F4C45]/30 underline-offset-4 transition-colors hover:decoration-[#0F4C45]"
            >
              {t.ctaSecondary}
            </a>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-md">
          <Goniometer />
          <figcaption className="mt-4 text-center text-base leading-relaxed text-[#5E716C]">
            {t.caption}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
