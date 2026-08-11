"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Info, RotateCcw } from "lucide-react";
import { CONSULTATION_REASONS, TIME_PREFERENCES } from "./content";

type FormValues = {
  name: string;
  email: string;
  reason: string;
  timePreference: string;
  message: string;
};

const EMPTY_FORM: FormValues = {
  name: "",
  email: "",
  reason: "",
  timePreference: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FisioNovaContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    if (!values.name.trim()) nextErrors.name = "Indica tu nombre.";
    if (!EMAIL_RE.test(values.email)) nextErrors.email = "Introduce un correo válido.";
    if (!values.reason) nextErrors.reason = "Selecciona el motivo de la consulta.";
    if (!values.message.trim() || values.message.trim().length < 10) {
      nextErrors.message = "Cuéntanos brevemente tu caso (al menos 10 caracteres).";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    }
  }

  function handleReset() {
    setValues(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
  }

  return (
    <section id="contacto" className="bg-[#FAF9F5] py-20">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#0E6E64] uppercase">
          Contacto
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#123832] sm:text-4xl">
          Solicita tu primera valoración
        </h2>
        <p className="mt-3 flex items-start gap-2 text-xs text-[#5C726D]/80">
          <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          Formulario de demostración: no envía ni almacena ninguna
          información. Nada de lo que escribas sale de tu navegador.
        </p>

        <div className="mt-8 border border-[#E4DFD3] bg-white p-6 sm:p-8">
          {submitted ? (
            <div role="status" className="flex flex-col items-start gap-3">
              <CheckCircle2 size={28} className="text-[#0E6E64]" aria-hidden="true" />
              <p className="text-base font-bold text-[#123832]">
                Solicitud de demostración completada.
              </p>
              <p className="text-sm leading-relaxed text-[#5C726D]">
                En una web real, la clínica recibiría ahora esta información.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 inline-flex items-center gap-2 border border-[#0E6E64]/30 px-4 py-2 text-sm font-semibold text-[#123832] hover:border-[#0E6E64] hover:text-[#0E6E64]"
              >
                <RotateCcw size={14} aria-hidden="true" />
                Rellenar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <Field
                label="Nombre"
                value={values.name}
                onChange={(v) => update("name", v)}
                error={errors.name}
                autoComplete="name"
              />
              <Field
                label="Correo"
                type="email"
                value={values.email}
                onChange={(v) => update("email", v)}
                error={errors.email}
                autoComplete="email"
              />

              <div>
                <label htmlFor="fn-reason" className="mb-1.5 block text-sm font-medium text-[#123832]">
                  Motivo de la consulta
                </label>
                <select
                  id="fn-reason"
                  value={values.reason}
                  onChange={(e) => update("reason", e.target.value)}
                  aria-invalid={Boolean(errors.reason)}
                  aria-describedby={errors.reason ? "fn-reason-error" : undefined}
                  className="w-full border border-[#123832]/20 bg-[#FAF9F5] px-4 py-3 text-sm text-[#123832] outline-none focus:border-[#0E6E64]"
                >
                  <option value="">Selecciona una opción</option>
                  {CONSULTATION_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
                {errors.reason && (
                  <p id="fn-reason-error" className="mt-1.5 text-xs text-red-700">
                    {errors.reason}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="fn-time" className="mb-1.5 block text-sm font-medium text-[#123832]">
                  Preferencia de horario
                </label>
                <select
                  id="fn-time"
                  value={values.timePreference}
                  onChange={(e) => update("timePreference", e.target.value)}
                  className="w-full border border-[#123832]/20 bg-[#FAF9F5] px-4 py-3 text-sm text-[#123832] outline-none focus:border-[#0E6E64]"
                >
                  <option value="">Sin preferencia concreta</option>
                  {TIME_PREFERENCES.map((pref) => (
                    <option key={pref} value={pref}>
                      {pref}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fn-message" className="mb-1.5 block text-sm font-medium text-[#123832]">
                  Mensaje
                </label>
                <textarea
                  id="fn-message"
                  rows={4}
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "fn-message-error" : undefined}
                  placeholder="Cuéntanos brevemente qué te ocurre."
                  className="w-full resize-none border border-[#123832]/20 bg-[#FAF9F5] px-4 py-3 text-sm text-[#123832] outline-none focus:border-[#0E6E64]"
                />
                {errors.message && (
                  <p id="fn-message-error" className="mt-1.5 text-xs text-red-700">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center bg-[#0E6E64] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B4F49]"
              >
                Enviar solicitud
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  const id = `fn-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#123832]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full border border-[#123832]/20 bg-[#FAF9F5] px-4 py-3 text-sm text-[#123832] outline-none focus:border-[#0E6E64]"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
