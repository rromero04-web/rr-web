"use client";

import { useState } from "react";
import { Modal } from "@/components/demo/ui/Modal";
import type { Shift } from "@/lib/demo/types";

const PRESETS = ["09:00–17:00", "08:00–16:00", "10:00–18:00", "Libre"];

interface ShiftEditorModalProps {
  shift: (Shift & { employeeName: string }) | null;
  onClose: () => void;
  onSave: (label: string) => void;
}

export function ShiftEditorModal({ shift, onClose, onSave }: ShiftEditorModalProps) {
  const [custom, setCustom] = useState("");

  return (
    <Modal
      open={Boolean(shift)}
      onClose={onClose}
      title={shift ? `${shift.employeeName} · ${shift.day}` : "Editar turno"}
      widthClassName="max-w-sm"
    >
      {shift && (
        <div className="space-y-4">
          <p className="text-sm text-slate">
            Turno actual: <span className="font-mono text-navy">{shift.label}</span>
          </p>

          <div>
            <p className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
              Asignar horario
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onSave(preset);
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
              onSave(custom.trim());
              onClose();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1">
              <label htmlFor="custom-shift" className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
                Horario personalizado
              </label>
              <input
                id="custom-shift"
                type="text"
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
                placeholder="p. ej. 11:00–19:00"
                className="mt-1.5 w-full border border-navy/20 bg-cream px-3 py-2 text-sm text-navy outline-none focus:border-cobalt"
              />
            </div>
            <button
              type="submit"
              className="border border-navy bg-navy px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-cobalt hover:border-cobalt"
            >
              Guardar
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              onSave("Ausencia programada");
              onClose();
            }}
            className="w-full border border-alert/40 bg-alert-soft px-4 py-2 text-sm font-semibold text-alert transition-opacity hover:opacity-80"
          >
            Marcar ausencia
          </button>
        </div>
      )}
    </Modal>
  );
}
