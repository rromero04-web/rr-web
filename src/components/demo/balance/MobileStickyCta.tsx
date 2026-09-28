import type { Locale } from "@/lib/i18n/config";

const STRINGS: Record<Locale, { cta: string }> = {
  es: { cta: "Solicitar valoración inicial" },
  en: { cta: "Request an initial assessment" },
};

export function MobileStickyCta({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#CFE0D3] bg-white p-3 md:hidden">
      <a
        href="#valoracion"
        className="flex min-h-12 items-center justify-center rounded-md bg-[#1F6F4A] px-4 text-base font-semibold text-white transition-colors hover:bg-[#185A3C]"
      >
        {t.cta}
      </a>
    </div>
  );
}
