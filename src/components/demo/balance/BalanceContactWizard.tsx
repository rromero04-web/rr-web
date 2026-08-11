"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Info, RotateCcw } from "lucide-react";
import { NEED_OPTIONS, CONTACT_PREFERENCES } from "./content";
import { cn } from "@/lib/utils";

const SITUATION_OPTIONS = ["Autónomo", "Empresa", "Próxima alta", "Consulta puntual"];

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

export function BalanceContactWizard() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<WizardValues>(EMPTY_VALUES);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  function update<K extends keyof WizardValues>(key: K, value: WizardValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    if (step === 1 && !values.situation) {
      setError("Selecciona tu situación para continuar.");
      return;
    }
    if (step === 2 && !values.need) {
      setError("Selecciona qué necesitas para continuar.");
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
      setError("Indica tu nombre.");
      return;
    }
    if (!EMAIL_RE.test(values.email)) {
      setError("Introduce un correo válido.");
      return;
    }
    if (!values.consent) {
      setError("Marca la casilla de consentimiento de demostración para continuar.");
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
          Valoración inicial
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#16233A] sm:text-4xl">
          Solicita tu valoración fiscal inicial
        </h2>
        <p className="mt-3 flex items-start gap-2 text-xs text-[#4B5568]/80">
          <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          Formulario de demostración: no envía ni almacena ninguna
          información. Nada de lo que escribas sale de tu navegador.
        </p>

        <div className="mt-8 border border-[#16233A]/10 bg-[#F6F4EF] p-6 sm:p-8">
          {completed ? (
            <div role="status" className="flex flex-col items-start gap-3">
              <CheckCircle2 size={28} className="text-[#2F8F5B]" aria-hidden="true" />
              <p className="text-base font-bold text-[#16233A]">Simulación completada</p>
              <p className="text-sm leading-relaxed text-[#4B5568]">
                En una web real, Balance Asesores recibiría una solicitud
                estructurada con la información necesaria para valorar el
                contacto.
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 border border-[#16233A]/20 px-4 py-2.5 text-sm font-semibold text-[#16233A] hover:border-[#16233A]/50"
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  Reiniciar demostración
                </button>
                <Link
                  href="/#contacto"
                  className="inline-flex items-center gap-2 bg-[#2F8F5B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#26744A]"
                >
                  Quiero una web de captación para mi negocio
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wide text-[#4B5568]">
                  Paso {step} de {TOTAL_STEPS}
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
                      ¿Cuál es tu situación?
                    </legend>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {SITUATION_OPTIONS.map((option) => (
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
                        ¿Qué necesitas?
                      </legend>
                      <div className="mt-3 grid gap-2">
                        {NEED_OPTIONS.map((option) => (
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
                        Detalle adicional (opcional)
                      </label>
                      <textarea
                        id="balance-need-detail"
                        rows={3}
                        value={values.needDetail}
                        onChange={(e) => update("needDetail", e.target.value)}
                        placeholder="Cuéntanos algo más si lo consideras útil."
                        className="w-full resize-none border border-[#16233A]/20 bg-white px-4 py-3 text-sm text-[#16233A] outline-none focus:border-[#2F8F5B]"
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="balance-name" className="mb-1.5 block text-sm font-medium text-[#16233A]">
                        Nombre
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
                        Correo
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
                        Teléfono (opcional)
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
                        Preferencia de contacto
                      </label>
                      <select
                        id="balance-preference"
                        value={values.contactPreference}
                        onChange={(e) => update("contactPreference", e.target.value)}
                        className="w-full border border-[#16233A]/20 bg-white px-4 py-3 text-sm text-[#16233A] outline-none focus:border-[#2F8F5B]"
                      >
                        <option value="">Sin preferencia</option>
                        {CONTACT_PREFERENCES.map((pref) => (
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
                      He leído que esto es una demostración: mis datos no se
                      envían ni almacenan en ningún servidor.
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
                  Atrás
                </button>

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center gap-2 bg-[#2F8F5B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#26744A]"
                  >
                    Continuar
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 bg-[#2F8F5B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#26744A]"
                  >
                    Enviar solicitud
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
