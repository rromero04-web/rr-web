import type { Locale } from "@/lib/i18n/config";

const STRINGS: Record<Locale, { cta: string }> = {
  es: { cta: "Solicitar valoración inicial" },
  en: { cta: "Request an initial assessment" },
};

export function MobileStickyCta({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#16233A]/10 bg-white/95 p-3 backdrop-blur md:hidden">
      <a
        href="#valoracion"
        className="flex items-center justify-center bg-[#2F8F5B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#26744A]"
      >
        {t.cta}
      </a>
    </div>
  );
}
