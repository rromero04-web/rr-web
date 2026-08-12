"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Info, RotateCcw } from "lucide-react";
import { getNeedOptions, getContactPreferences, getSituationOptions } from "./content";
import { cn } from "@/lib/utils";
import { localizePath, type Locale } from "@/lib/i18n/config";

type WizardValues = {
  situation: string;
  need: string;
  needDetail: string;
  name: string;
  email: string;
  phone: string;
  contactPreference: string;
  consent: boolean;
};

const EMPTY_VALUES: WizardValues = {
  situation: "",
  need: "",
  needDetail: "",
  name: "",
  email: "",
  phone: "",
  contactPreference: "",
  consent: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL_STEPS = 3;

const STRINGS: Record<Locale, {
  eyebrow: string;
  title: string;
  formNotice: string;
  errorSituation: string;
  errorNeed: string;
  errorName: string;
  errorEmail: string;
  errorConsent: string;
  completedTitle: string;
  completedBody: string;
  restart: string;
  ctaAfterCompletion: string;
  stepOf: (step: number, total: number) => string;
  situationLegend: string;
  needLegend: string;
  needDetailLabel: string;
  needDetailPlaceholder: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  preferenceLabel: string;
  preferenceNone: string;
  consentLabel: string;
  back: string;
  continue: string;
  submit: string;
}> = {
  es: {
    eyebrow: "Valoración inicial",
    title: "Solicita tu valoración fiscal inicial",
    formNotice:
      "Formulario de demostración: no envía ni almacena ninguna información. Nada de lo que escribas sale de tu navegador.",
    errorSituation: "Selecciona tu situación para continuar.",
    errorNeed: "Selecciona qué necesitas para continuar.",
    errorName: "Indica tu nombre.",
    errorEmail: "Introduce un correo válido.",
    errorConsent: "Marca la casilla de consentimiento de demostración para continuar.",
    completedTitle: "Simulación completada",
    completedBody:
      "En una web real, Balance Asesores recibiría una solicitud estructurada con la información necesaria para valorar el contacto.",
    restart: "Reiniciar demostración",
    ctaAfterCompletion: "Quiero una web de captación para mi negocio",
    stepOf: (step, total) => `Paso ${step} de ${total}`,
    situationLegend: "¿Cuál es tu situación?",
    needLegend: "¿Qué necesitas?",
    needDetailLabel: "Detalle adicional (opcional)",
    needDetailPlaceholder: "Cuéntanos algo más si lo consideras útil.",
    nameLabel: "Nombre",
    emailLabel: "Correo",
    phoneLabel: "Teléfono (opcional)",
    preferenceLabel: "Preferencia de contacto",
    preferenceNone: "Sin preferencia",
    consentLabel:
      "He leído que esto es una demostración: mis datos no se envían ni almacenan en ningún servidor.",
    back: "Atrás",
    continue: "Continuar",
    submit: "Enviar solicitud",
  },
  en: {
    eyebrow: "Initial assessment",
    title: "Request your initial tax assessment",
    formNotice:
      "Demo form: it doesn't send or store any information. Nothing you type ever leaves your browser.",
    errorSituation: "Select your situation to continue.",
    errorNeed: "Select what you need to continue.",
    errorName: "Enter your name.",
    errorEmail: "Enter a valid email address.",
    errorConsent: "Check the demo consent box to continue.",
    completedTitle: "Simulation completed",
    completedBody:
      "On a real website, Balance Asesores would receive a structured request with the information needed to assess the contact.",
    restart: "Restart demo",
    ctaAfterCompletion: "I want a lead-generation website for my business",
    stepOf: (step, total) => `Step ${step} of ${total}`,
    situationLegend: "What's your situation?",
    needLegend: "What do you need?",
    needDetailLabel: "Additional detail (optional)",
    needDetailPlaceholder: "Tell us more if you find it useful.",
    nameLabel: "Name",
    emailLabel: "Email",
    phoneLabel: "Phone (optional)",
    preferenceLabel: "Contact preference",
    preferenceNone: "No preference",
    consentLabel:
      "I understand this is a demo: my data is not sent to or stored on any server.",
    back: "Back",
    continue: "Continue",
    submit: "Send request",
  },
};

export function BalanceContactWizard({ locale }: { locale: Locale }) {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<WizardValues>(EMPTY_VALUES);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const t = STRINGS[locale];
  const situationOptions = getSituationOptions(locale);
  const needOptions = getNeedOptions(locale);
  const contactPreferences = getContactPreferences(locale);

  function update<K extends keyof WizardValues>(key: K, value: WizardValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    if (step === 1 && !values.situation) {
      setError(t.errorSituation);
      return;
    }
    if (step === 2 && !values.need) {
      setError(t.errorNeed);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    if (!values.name.trim()) {
      setError(t.errorName);
      return;
    }
    if (!EMAIL_RE.test(values.email)) {
      setError(t.errorEmail);
      return;
    }
    if (!values.consent) {
      setError(t.errorConsent);
      return;
    }
    setError(null);
    setCompleted(true);
  }

  function handleReset() {
    setValues(EMPTY_VALUES);
    setStep(1);
    setError(null);
    setCompleted(false);
  }

  return (
    <section id="valoracion" className="bg-white py-20">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#2F8F5B] uppercase">
          {t.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#16233A] sm:text-4xl">
          {t.title}
        </h2>
        <p className="mt-3 flex items-start gap-2 text-xs text-[#4B5568]/80">
          <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          {t.formNotice}
        </p>

        <div className="mt-8 border border-[#16233A]/10 bg-[#F6F4EF] p-6 sm:p-8">
          {completed ? (
            <div role="status" className="flex flex-col items-start gap-3">
              <CheckCircle2 size={28} className="text-[#2F8F5B]" aria-hidden="true" />
              <p className="text-base font-bold text-[#16233A]">{t.completedTitle}</p>
              <p className="text-sm leading-relaxed text-[#4B5568]">
                {t.completedBody}
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 border border-[#16233A]/20 px-4 py-2.5 text-sm font-semibold text-[#16233A] hover:border-[#16233A]/50"
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  {t.restart}
                </button>
                <Link
                  href={localizePath("/#contacto", locale)}
                  className="inline-flex items-center gap-2 bg-[#2F8F5B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#26744A]"
                >
                  {t.ctaAfterCompletion}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wide text-[#4B5568]">
                  {t.stepOf(step, TOTAL_STEPS)}
                </p>
              </div>
              <div className="mt-2 h-1.5 w-full bg-[#16233A]/10">
                <div
                  className="h-1.5 bg-[#2F8F5B] transition-all duration-300"
                  style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                />
              </div>

              <div className="mt-6">
                {step === 1 && (
                  <fieldset>
                    <legend className="text-sm font-bold text-[#16233A]">
                      {t.situationLegend}
                    </legend>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {situationOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => update("situation", option)}
                          aria-pressed={values.situation === option}
                          className={cn(
                            "border px-4 py-3 text-left text-sm font-medium transition-colors",
                            values.situation === option
                              ? "border-[#2F8F5B] bg-[#2F8F5B]/10 text-[#16233A]"
                              : "border-[#16233A]/15 text-[#16233A] hover:border-[#2F8F5B]/50"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <fieldset>
                      <legend className="text-sm font-bold text-[#16233A]">
                        {t.needLegend}
                      </legend>
                      <div className="mt-3 grid gap-2">
                        {needOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => update("need", option)}
                            aria-pressed={values.need === option}
                            className={cn(
                              "border px-4 py-3 text-left text-sm font-medium transition-colors",
                              values.need === option
                                ? "border-[#2F8F5B] bg-[#2F8F5B]/10 text-[#16233A]"
                                : "border-[#16233A]/15 text-[#16233A] hover:border-[#2F8F5B]/50"
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <div>
                      <label htmlFor="balance-need-detail" className="mb-1.5 block text-sm font-medium text-[#16233A]">
                        {t.needDetailLabel}
                      </label>
                      <textarea
                        id="balance-need-detail"
                        rows={3}
                        value={values.needDetail}
                        onChange={(e) => update("needDetail", e.target.value)}
                        placeholder={t.needDetailPlaceholder}
                        className="w-full resize-none border border-[#16233A]/20 bg-white px-4 py-3 text-sm text-[#16233A] outline-none focus:border-[#2F8F5B]"
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="balance-name" className="mb-1.5 block text-sm font-medium text-[#16233A]">
                        {t.nameLabel}
                      </label>
                      <input
                        id="balance-name"
                        type="text"
                        value={values.name}
                        onChange={(e) => update("name", e.target.value)}
                        autoComplete="name"
                        className="w-full border border-[#16233A]/20 bg-white px-4 py-3 text-sm text-[#16233A] outline-none focus:border-[#2F8F5B]"
                      />
                    </div>
                    <div>
                      <label htmlFor="balance-email" className="mb-1.5 block text-sm font-medium text-[#16233A]">
                        {t.emailLabel}
                      </label>
                      <input
                        id="balance-email"
                        type="email"
                        value={values.email}
                        onChange={(e) => update("email", e.target.value)}
                        autoComplete="email"
                        className="w-full border border-[#16233A]/20 bg-white px-4 py-3 text-sm text-[#16233A] outline-none focus:border-[#2F8F5B]"
                      />
                    </div>
                    <div>
                      <label htmlFor="balance-phone" className="mb-1.5 block text-sm font-medium text-[#16233A]">
                        {t.phoneLabel}
                      </label>
                      <input
                        id="balance-phone"
                        type="tel"
                        value={values.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        autoComplete="tel"
                        className="w-full border border-[#16233A]/20 bg-white px-4 py-3 text-sm text-[#16233A] outline-none focus:border-[#2F8F5B]"
                      />
                    </div>
                    <div>
                      <label htmlFor="balance-preference" className="mb-1.5 block text-sm font-medium text-[#16233A]">
                        {t.preferenceLabel}
                      </label>
                      <select
                        id="balance-preference"
                        value={values.contactPreference}
                        onChange={(e) => update("contactPreference", e.target.value)}
                        className="w-full border border-[#16233A]/20 bg-white px-4 py-3 text-sm text-[#16233A] outline-none focus:border-[#2F8F5B]"
                      >
                        <option value="">{t.preferenceNone}</option>
                        {contactPreferences.map((pref) => (
                          <option key={pref} value={pref}>
                            {pref}
                          </option>
                        ))}
                      </select>
                    </div>
                    <label className="flex items-start gap-3 text-sm text-[#4B5568]">
                      <input
                        type="checkbox"
                        checked={values.consent}
                        onChange={(e) => update("consent", e.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 border border-[#16233A]/30 accent-[#2F8F5B]"
                      />
                      {t.consentLabel}
                    </label>
                  </div>
                )}
              </div>

              {error && (
                <p role="alert" className="mt-4 text-sm text-red-700">
                  {error}
                </p>
              )}

              <div className="mt-7 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 1}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#16233A] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowLeft size={15} aria-hidden="true" />
                  {t.back}
                </button>

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center gap-2 bg-[#2F8F5B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#26744A]"
                  >
                    {t.continue}
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 bg-[#2F8F5B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#26744A]"
                  >
                    {t.submit}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
