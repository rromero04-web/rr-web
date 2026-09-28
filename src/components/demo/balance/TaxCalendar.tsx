"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n/config";

// Calendario de plazos trimestrales del IVA (modelo 303) y del pago
// fraccionado del IRPF (modelo 130) para autónomos. Los plazos son reales
// (1-20 de abril, julio y octubre; 1-30 de enero), aunque se trasladan si el
// último día es festivo o fin de semana: por eso se presentan como orientativos.

type Deadline = { quarter: 1 | 2 | 3 | 4; date: Date };

const QUARTER_DEADLINES: { quarter: 1 | 2 | 3 | 4; month: number; day: number; nextYear: boolean }[] = [
  { quarter: 1, month: 3, day: 20, nextYear: false },
  { quarter: 2, month: 6, day: 20, nextYear: false },
  { quarter: 3, month: 9, day: 20, nextYear: false },
  { quarter: 4, month: 0, day: 30, nextYear: true },
];

function upcomingDeadlines(today: Date, count: number): Deadline[] {
  const all: Deadline[] = [];
  for (const year of [today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1]) {
    for (const q of QUARTER_DEADLINES) {
      all.push({ quarter: q.quarter, date: new Date(q.nextYear ? year + 1 : year, q.month, q.day) });
    }
  }
  return all
    .filter((deadline) => deadline.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, count);
}

function daysBetween(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

// La fecha de hoy solo existe en el navegador (la página se genera estática).
// Se expresa como texto "AAAA-M-D" para que el valor sea estable durante el día.
function subscribe() {
  return () => {};
}
function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}
function getServerTodayKey() {
  return null;
}

const STRINGS: Record<Locale, {
  title: string;
  quarter: (q: number) => string;
  window: (month: string, lastDay: number) => string;
  left: (days: number) => string;
  today: string;
  cta: string;
  note: string;
}> = {
  es: {
    title: "Próximos plazos de IVA e IRPF trimestral",
    quarter: (q) => `${["Primer", "Segundo", "Tercer", "Cuarto"][q - 1]} trimestre`,
    window: (month, lastDay) => `Modelos 303 y 130, del 1 al ${lastDay} de ${month}`,
    left: (days) => (days === 1 ? "Falta 1 día" : `Faltan ${days} días`),
    today: "Termina hoy",
    cta: "¿Lo tienes preparado? Pide tu valoración",
    note: "Fechas orientativas: si el último día es festivo o fin de semana, el plazo pasa al siguiente día hábil.",
  },
  en: {
    title: "Upcoming quarterly VAT and income tax deadlines",
    quarter: (q) => `${["First", "Second", "Third", "Fourth"][q - 1]} quarter`,
    window: (month, lastDay) => `Forms 303 and 130, ${month} 1 to ${lastDay}`,
    left: (days) => (days === 1 ? "1 day left" : `${days} days left`),
    today: "Ends today",
    cta: "Ready for it? Request your assessment",
    note: "Indicative dates: if the last day falls on a holiday or weekend, the deadline moves to the next working day.",
  },
};

const INTL = { es: "es-ES", en: "en-GB" } as const;

export function TaxCalendar({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const todayKey = useSyncExternalStore(subscribe, getTodayKey, getServerTodayKey);
  const today = todayKey
    ? (() => {
        const [y, m, d] = todayKey.split("-").map(Number);
        return new Date(y, m, d);
      })()
    : null;
  // Sin fecha (render en servidor) se muestran los plazos del año en orden,
  // sin cuenta atrás; el navegador los sustituye al hidratar.
  const deadlines = today
    ? upcomingDeadlines(today, 3)
    : QUARTER_DEADLINES.slice(0, 3).map((q) => ({ quarter: q.quarter, date: new Date(2000, q.month, q.day) }));

  const dayFormat = new Intl.DateTimeFormat(INTL[locale], { day: "numeric" });
  const monthShort = new Intl.DateTimeFormat(INTL[locale], { month: "short" });
  const monthLong = new Intl.DateTimeFormat(INTL[locale], { month: "long" });

  return (
    <div className="overflow-hidden rounded-lg border border-[#CFE0D3] bg-[#FBFCF9] shadow-[0_24px_48px_-28px_rgb(20_33_61/0.35)]">
      <p className="border-b-2 border-[#1F6F4A] px-6 py-4 text-base font-bold text-[#14213D]">{t.title}</p>
      <ol>
        {deadlines.map((deadline, index) => {
          const days = today ? daysBetween(today, deadline.date) : null;
          const nearest = today !== null && index === 0;
          return (
            <li
              key={`${deadline.quarter}-${deadline.date.getFullYear()}`}
              className={`flex items-center gap-5 border-b border-[#CFE0D3] px-6 py-4 last:border-b-0 ${nearest ? "bg-[#FBF1D6]" : ""}`}
            >
              <span className="w-14 shrink-0 text-center tabular-nums">
                <span className="block text-3xl leading-none font-bold text-[#14213D]">{dayFormat.format(deadline.date)}</span>
                <span className="mt-1 block text-sm text-[#4A5670]">{monthShort.format(deadline.date).replace(".", "")}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold text-[#14213D]">{t.quarter(deadline.quarter)}</span>
                <span className="mt-0.5 block text-sm text-[#4A5670]">
                  {t.window(monthLong.format(deadline.date), deadline.date.getDate())}
                </span>
              </span>
              {days !== null && (
                <span className={`shrink-0 text-sm font-semibold tabular-nums ${nearest ? "text-[#7A5A06]" : "text-[#4A5670]"}`}>
                  {days === 0 ? t.today : t.left(days)}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="border-t-2 border-[#1F6F4A] px-6 py-4">
        <a href="#valoracion" className="text-base font-semibold text-[#1F6F4A] underline decoration-[#1F6F4A]/35 underline-offset-4 hover:decoration-[#1F6F4A]">
          {t.cta}
        </a>
        <p className="mt-2 text-sm leading-relaxed text-[#4A5670]">{t.note}</p>
      </div>
    </div>
  );
}
