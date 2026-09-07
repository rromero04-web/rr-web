import type { Locale } from "@/lib/i18n/config";

const ITEMS: Record<Locale, string[]> = {
  es: [
    "Diseño a medida",
    "Desarrollo a medida",
    "Next.js",
    "Supabase",
    "Automatización",
    "Bilingüe ES/EN",
    "Trato directo",
  ],
  en: [
    "Custom design",
    "Custom development",
    "Next.js",
    "Supabase",
    "Automation",
    "Bilingual ES/EN",
    "Direct collaboration",
  ],
};

// Cinta continua puramente en CSS (sin JS): duplica el contenido una vez
// para que el bucle de -50% sea perfectamente continuo. Se detiene por
// completo con prefers-reduced-motion (ver studio.css).
export function Marquee({ locale }: { locale: Locale }) {
  const items = ITEMS[locale];
  const track = [...items, ...items];

  return (
    <div className="studio-marquee" aria-hidden="true">
      <div className="studio-marquee-track">
        {track.map((item, index) => (
          <div className="studio-marquee-item" key={`${item}-${index}`}>
            <span>{item}</span>
            <span className="studio-marquee-dot">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
