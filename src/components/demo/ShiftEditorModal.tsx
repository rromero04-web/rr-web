"use client";

import { useState } from "react";
import { Modal } from "@/components/demo/ui/Modal";
import type { Locale } from "@/lib/i18n/config";
import { ABSENCE_SHIFT_LABEL, FREE_SHIFT_LABEL, WEEKDAY_LABEL } from "@/lib/demo/labels";
import type { Shift } from "@/lib/demo/types";

const TIME_PRESETS = ["09:00–17:00", "08:00–16:00", "10:00–18:00"];

const STRINGS: Record<
  Locale,
  {
    fallbackTitle: string;
    currentShift: string;
    assignSchedule: string;
    customSchedule: string;
    customPlaceholder: string;
    save: string;
    markAbsence: string;
  }
> = {
  es: {
    fallbackTitle: "Editar turno",
    currentShift: "Turno actual:",
    assignSchedule: "Asignar horario",
    customSchedule: "Horario personalizado",
    customPlaceholder: "p. ej. 11:00–19:00",
    save: "Guardar",
    markAbsence: "Marcar ausencia",
  },
  en: {
    fallbackTitle: "Edit shift",
    currentShift: "Current shift:",
    assignSchedule: "Assign schedule",
    customSchedule: "Custom schedule",
    customPlaceholder: "e.g. 11:00–19:00",
    save: "Save",
    markAbsence: "Mark absence",
  },
};

interface ShiftEditorModalProps {
  locale: Locale;
  shift: (Shift & { employeeName: string }) | null;
  onClose: () => void;
  onSave: (label: string, isAbsence: boolean) => void;
}

export function ShiftEditorModal({ locale, shift, onClose, onSave }: ShiftEditorModalProps) {
  const [custom, setCustom] = useState("");
  const strings = STRINGS[locale];
  const presets = [...TIME_PRESETS, FREE_SHIFT_LABEL[locale]];

  return (
    <Modal
      open={Boolean(shift)}
      onClose={onClose}
      title={shift ? `${shift.employeeName} · ${WEEKDAY_LABEL[locale][shift.day]}` : strings.fallbackTitle}
      widthClassName="max-w-sm"
      locale={locale}
    >
      {shift && (
        <div className="space-y-4">
          <p className="text-sm text-slate">
            {strings.currentShift} <span className="font-mono text-navy">{shift.label}</span>
          </p>

          <div>
            <p className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
              {strings.assignSchedule}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onSave(preset, false);
                    onClose();
                  }}
                  className="border border-line/70 px-3 py-1.5 text-sm text-navy transition-colors hover:border-navy/40"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!custom.trim()) return;
              onSave(custom.trim(), false);
              onClose();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1">
              <label htmlFor="custom-shift" className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
                {strings.customSchedule}
              </label>
              <input
                id="custom-shift"
                type="text"
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
                placeholder={strings.customPlaceholder}
                className="mt-1.5 w-full border border-navy/20 bg-cream px-3 py-2 text-sm text-navy outline-none focus:border-cobalt"
              />
            </div>
            <button
              type="submit"
              className="border border-navy bg-navy px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-cobalt hover:border-cobalt"
            >
              {strings.save}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              onSave(ABSENCE_SHIFT_LABEL[locale], true);
              onClose();
            }}
            className="w-full border border-alert/40 bg-alert-soft px-4 py-2 text-sm font-semibold text-alert transition-opacity hover:opacity-80"
          >
            {strings.markAbsence}
          </button>
        </div>
      )}
    </Modal>
  );
}
