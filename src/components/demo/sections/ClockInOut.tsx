"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut, MapPin, Info } from "lucide-react";
import { useDemoData } from "@/components/demo/DemoDataProvider";
import { StatusBadge } from "@/components/demo/ui/StatusBadge";
import type { Locale } from "@/lib/i18n/config";
import { INTL_LOCALE, TIME_ENTRY_TYPE_LABEL } from "@/lib/demo/labels";

const STRINGS: Record<
  Locale,
  {
    currentTime: string;
    working: string;
    offShift: string;
    clockIn: string;
    clockOut: string;
    locationValidated: string;
    disclaimer: string;
    history: string;
    person: string;
    type: string;
    time: string;
    location: string;
  }
> = {
  es: {
    currentTime: "Hora actual",
    working: "Trabajando",
    offShift: "Fuera de jornada",
    clockIn: "Fichar entrada",
    clockOut: "Fichar salida",
    locationValidated: "Ubicación validada: Centro de trabajo",
    disclaimer:
      "En una aplicación real, la ubicación únicamente se comprobaría en el momento del fichaje y según la política establecida por la empresa. Esta demo no accede a tu ubicación real.",
    history: "Historial de fichajes",
    person: "Persona",
    type: "Tipo",
    time: "Hora",
    location: "Ubicación",
  },
  en: {
    currentTime: "Current time",
    working: "Working",
    offShift: "Off shift",
    clockIn: "Clock in",
    clockOut: "Clock out",
    locationValidated: "Location validated: Workplace",
    disclaimer:
      "In a real application, the location would only be checked at the moment of clocking in, following the company's policy. This demo does not access your real location.",
    history: "Clock-in history",
    person: "Person",
    type: "Type",
    time: "Time",
    location: "Location",
  },
};

export function ClockInOut({ locale }: { locale: Locale }) {
  const { state, clockIn, clockOut } = useDemoData();
  const [now, setNow] = useState<Date | null>(null);
  const strings = STRINGS[locale];

  useEffect(() => {
    function tick() {
      setNow(new Date());
    }
    // Se difiere el primer tick a una macrotarea para no llamar a setState
    // de forma síncrona en el cuerpo del efecto.
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  const isWorking = state.visitorStatus === "trabajando";

  const history = [...state.timeEntries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-8">
      <div className="border border-line/70 bg-cream p-6 sm:p-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
              {strings.currentTime}
            </p>
            <p className="mt-1 font-mono text-4xl font-bold text-navy tabular-nums sm:text-5xl">
              {now
                ? now.toLocaleTimeString(INTL_LOCALE[locale], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                : "--:--:--"}
            </p>
            <div className="mt-3">
              <StatusBadge tone={isWorking ? "success" : "neutral"}>
                {isWorking ? strings.working : strings.offShift}
              </StatusBadge>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto">
            <button
              type="button"
              onClick={clockIn}
              disabled={isWorking}
              className="inline-flex items-center justify-center gap-2 bg-success px-6 py-3 text-sm font-semibold text-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LogIn size={16} aria-hidden="true" />
              {strings.clockIn}
            </button>
            <button
              type="button"
              onClick={clockOut}
              disabled={!isWorking}
              className="inline-flex items-center justify-center gap-2 border border-navy px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-cream disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-navy"
            >
              <LogOut size={16} aria-hidden="true" />
              {strings.clockOut}
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-line/70 pt-5 text-sm text-slate">
          <MapPin size={15} className="shrink-0 text-cobalt" aria-hidden="true" />
          {strings.locationValidated}
        </div>

        <div className="mt-3 flex items-start gap-2 text-xs text-slate/80">
          <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>{strings.disclaimer}</p>
        </div>
      </div>

      <div className="border border-line/70 bg-cream">
        <div className="border-b border-line/70 p-4">
          <h2 className="text-sm font-bold text-navy">{strings.history}</h2>
        </div>

        <div className="hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line/70 text-left text-xs font-semibold tracking-wide text-slate uppercase">
                <th scope="col" className="p-4">{strings.person}</th>
                <th scope="col" className="p-4">{strings.type}</th>
                <th scope="col" className="p-4">{strings.time}</th>
                <th scope="col" className="p-4">{strings.location}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {history.map((entry) => (
                <tr key={entry.id}>
                  <td className="p-4 font-medium text-navy">{entry.employeeName}</td>
                  <td className="p-4">
                    <StatusBadge tone={entry.type === "entrada" ? "success" : "neutral"}>
                      {TIME_ENTRY_TYPE_LABEL[locale][entry.type]}
                    </StatusBadge>
                  </td>
                  <td className="p-4 font-mono text-slate">
                    {new Date(entry.timestamp).toLocaleString(INTL_LOCALE[locale], {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-4 text-slate">{entry.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="divide-y divide-line/70 sm:hidden">
          {history.map((entry) => (
            <li key={entry.id} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-navy">{entry.employeeName}</span>
                <StatusBadge tone={entry.type === "entrada" ? "success" : "neutral"}>
                  {TIME_ENTRY_TYPE_LABEL[locale][entry.type]}
                </StatusBadge>
              </div>
              <p className="mt-1.5 font-mono text-xs text-slate">
                {new Date(entry.timestamp).toLocaleString(INTL_LOCALE[locale], {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                · {entry.location}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
