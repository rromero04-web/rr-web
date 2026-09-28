"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Info, RotateCcw } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getConsultationReasons, getTimePreferences } from "./content";

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

const STRINGS: Record<Locale, {
  title: string;
  demoNotice: string;
  successTitle: string;
  successBody: string;
  fillAnother: string;
  nameLabel: string;
  emailLabel: string;
  reasonLabel: string;
  reasonPlaceholder: string;
  timeLabel: string;
  timePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  errors: {
    name: string;
    email: string;
    reason: string;
    message: string;
  };
}> = {
  es: {
    title: "Solicita tu primera valoración",
    demoNotice:
      "Formulario de demostración: no envía ni almacena ninguna información. Nada de lo que escribas sale de tu navegador.",
    successTitle: "Solicitud de demostración completada.",
    successBody: "En una web real, la clínica recibiría ahora esta información.",
    fillAnother: "Rellenar otra solicitud",
    nameLabel: "Nombre",
    emailLabel: "Correo",
    reasonLabel: "Motivo de la consulta",
    reasonPlaceholder: "Selecciona una opción",
    timeLabel: "Preferencia de horario",
    timePlaceholder: "Sin preferencia concreta",
    messageLabel: "Mensaje",
    messagePlaceholder: "Cuéntanos brevemente qué te ocurre.",
    submit: "Enviar solicitud",
    errors: {
      name: "Indica tu nombre.",
      email: "Introduce un correo válido.",
      reason: "Selecciona el motivo de la consulta.",
      message: "Cuéntanos brevemente tu caso (al menos 10 caracteres).",
    },
  },
  en: {
    title: "Request your first assessment",
    demoNotice:
      "Demo form: it doesn't send or store any information. Nothing you type leaves your browser.",
    successTitle: "Demo request completed.",
    successBody: "On a real website, the clinic would now receive this information.",
    fillAnother: "Fill out another request",
    nameLabel: "Name",
    emailLabel: "Email",
    reasonLabel: "Reason for consultation",
    reasonPlaceholder: "Select an option",
    timeLabel: "Time preference",
    timePlaceholder: "No specific preference",
    messageLabel: "Message",
    messagePlaceholder: "Tell us briefly what's going on.",
    submit: "Send request",
    errors: {
      name: "Please enter your name.",
      email: "Enter a valid email address.",
      reason: "Select the reason for your consultation.",
      message: "Tell us briefly about your case (at least 10 characters).",
    },
  },
};

export function FisioNovaContactForm({ locale }: { locale: Locale }) {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const t = STRINGS[locale];
  const consultationReasons = getConsultationReasons(locale);
  const timePreferences = getTimePreferences(locale);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    if (!values.name.trim()) nextErrors.name = t.errors.name;
    if (!EMAIL_RE.test(values.email)) nextErrors.email = t.errors.email;
    if (!values.reason) nextErrors.reason = t.errors.reason;
    if (!values.message.trim() || values.message.trim().length < 10) {
      nextErrors.message = t.errors.message;
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
    <section id="contacto" className="scroll-mt-20 bg-[#DDEDE6] py-24">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <h2 className="text-3xl leading-[1.1] font-bold tracking-[-0.015em] text-[#0F4C45] sm:text-[2.75rem]">
          {t.title}
        </h2>
        <p className="mt-4 flex items-start gap-2 text-sm text-[#3F5752]">
          <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          {t.demoNotice}
        </p>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgb(15_76_69/0.06)] sm:p-10">
          {submitted ? (
            <div role="status" className="flex flex-col items-start gap-3">
              <CheckCircle2 size={28} className="text-[#1C7F9C]" aria-hidden="true" />
              <p className="text-xl font-bold text-[#0F4C45]">
                {t.successTitle}
              </p>
              <p className="text-base leading-relaxed text-[#5E716C]">
                {t.successBody}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D6E2DD] px-5 text-base font-semibold text-[#0F4C45] hover:border-[#0F4C45]"
              >
                <RotateCcw size={14} aria-hidden="true" />
                {t.fillAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <Field
                label={t.nameLabel}
                value={values.name}
                onChange={(v) => update("name", v)}
                error={errors.name}
                autoComplete="name"
              />
              <Field
                label={t.emailLabel}
                type="email"
                value={values.email}
                onChange={(v) => update("email", v)}
                error={errors.email}
                autoComplete="email"
              />

              <div>
                <label htmlFor="fn-reason" className="mb-2 block text-base font-bold text-[#0F4C45]">
                  {t.reasonLabel}
                </label>
                <select
                  id="fn-reason"
                  value={values.reason}
                  onChange={(e) => update("reason", e.target.value)}
                  aria-invalid={Boolean(errors.reason)}
                  aria-describedby={errors.reason ? "fn-reason-error" : undefined}
                  className="w-full rounded-xl border border-[#B9CCC5] bg-[#FBFCFA] px-4 py-3.5 text-base text-[#0F4C45] outline-none focus:border-[#1C9CC0] focus:ring-4 focus:ring-[#1C9CC0]/15"
                >
                  <option value="">{t.reasonPlaceholder}</option>
                  {consultationReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
                {errors.reason && (
                  <p id="fn-reason-error" className="mt-2 text-sm text-red-700">
                    {errors.reason}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="fn-time" className="mb-2 block text-base font-bold text-[#0F4C45]">
                  {t.timeLabel}
                </label>
                <select
                  id="fn-time"
                  value={values.timePreference}
                  onChange={(e) => update("timePreference", e.target.value)}
                  className="w-full rounded-xl border border-[#B9CCC5] bg-[#FBFCFA] px-4 py-3.5 text-base text-[#0F4C45] outline-none focus:border-[#1C9CC0] focus:ring-4 focus:ring-[#1C9CC0]/15"
                >
                  <option value="">{t.timePlaceholder}</option>
                  {timePreferences.map((pref) => (
                    <option key={pref} value={pref}>
                      {pref}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fn-message" className="mb-2 block text-base font-bold text-[#0F4C45]">
                  {t.messageLabel}
                </label>
                <textarea
                  id="fn-message"
                  rows={4}
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "fn-message-error" : undefined}
                  placeholder={t.messagePlaceholder}
                  className="w-full resize-none rounded-xl border border-[#B9CCC5] bg-[#FBFCFA] px-4 py-3.5 text-base text-[#0F4C45] outline-none focus:border-[#1C9CC0] focus:ring-4 focus:ring-[#1C9CC0]/15"
                />
                {errors.message && (
                  <p id="fn-message-error" className="mt-2 text-sm text-red-700">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0F4C45] px-7 text-base font-semibold text-white transition-colors hover:bg-[#0A3A34]"
              >
                {t.submit}
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
      <label htmlFor={id} className="mb-2 block text-base font-bold text-[#0F4C45]">
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
        className="w-full rounded-xl border border-[#B9CCC5] bg-[#FBFCFA] px-4 py-3.5 text-base text-[#0F4C45] outline-none focus:border-[#1C9CC0] focus:ring-4 focus:ring-[#1C9CC0]/15"
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
