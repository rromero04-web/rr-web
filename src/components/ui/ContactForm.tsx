"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";
import { SERVICE_OPTIONS, BUDGET_OPTIONS } from "@/lib/validation";
import { cn } from "@/lib/utils";

const initialState: ContactFormState = { status: "idle", message: "" };

const fieldClass =
  "w-full border border-navy/20 bg-cream px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-slate/60 focus:border-cobalt";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const errors = state.fieldErrors ?? {};

  return (
    <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-5">
      {/* Honeypot: oculto visualmente pero presente en el DOM para atrapar bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">No rellenar este campo</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nombre"
          name="name"
          required
          error={errors.name}
          autoComplete="name"
        />
        <Field
          label="Empresa o proyecto"
          name="company"
          error={errors.company}
          autoComplete="organization"
        />
      </div>

      <Field
        label="Correo electrónico"
        name="email"
        type="email"
        required
        error={errors.email}
        autoComplete="email"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-navy">
            Tipo de servicio <span aria-hidden="true">*</span>
          </label>
          <select
            id="service"
            name="service"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? "service-error" : undefined}
            className={fieldClass}
          >
            <option value="" disabled>
              Selecciona una opción
            </option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.service && (
            <p id="service-error" className="mt-1.5 text-xs text-red-700">
              {errors.service}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-navy">
            Presupuesto orientativo
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className={fieldClass}
          >
            <option value="">Prefiero no indicarlo</option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy">
          Cuéntame tu proyecto <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(fieldClass, "resize-none")}
          placeholder="Cuéntame brevemente tu idea, problema o proceso a mejorar."
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-xs text-red-700">
            {errors.message}
          </p>
        )}
      </div>

      <div className="border border-line/70 bg-navy/[0.03] p-4 text-xs leading-relaxed text-slate">
        <p>
          <strong className="text-navy">Responsable:</strong> Raúl Romero
          Agüera. <strong className="text-navy">Finalidad:</strong> responder
          a tu consulta, valorar el proyecto y realizar las gestiones
          precontractuales solicitadas.{" "}
          <strong className="text-navy">Legitimación:</strong> aplicación de
          medidas precontractuales a petición del interesado.{" "}
          <strong className="text-navy">Destinatarios:</strong> proveedores
          tecnológicos necesarios para alojar la web, gestionar el
          formulario y prestar el servicio, según se detalla en la Política
          de privacidad. <strong className="text-navy">Derechos:</strong>{" "}
          puedes ejercer tus derechos escribiendo a{" "}
          <a
            href="mailto:info@raulromero.es"
            className="font-medium text-navy underline underline-offset-2 hover:text-cobalt"
          >
            info@raulromero.es
          </a>
          . Más información en la{" "}
          <a
            href="/privacidad"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-navy underline underline-offset-2 hover:text-cobalt"
          >
            Política de privacidad
          </a>
          .
        </p>
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "consent-error" : undefined}
          className="mt-1 h-4 w-4 shrink-0 border border-navy/30 accent-[var(--color-cobalt)]"
        />
        <label htmlFor="consent" className="text-sm leading-relaxed text-slate">
          He leído la{" "}
          <a
            href="/privacidad"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-navy underline underline-offset-2 hover:text-cobalt"
          >
            Política de privacidad
          </a>{" "}
          y entiendo cómo se tratarán mis datos.{" "}
          <span aria-hidden="true">*</span>
        </label>
      </div>
      {errors.consent && (
        <p id="consent-error" className="-mt-3 text-xs text-red-700">
          {errors.consent}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 bg-navy px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-cobalt disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {pending ? "Enviando..." : "Enviar mi proyecto"}
      </button>

      <div role="status" aria-live="polite">
        {state.status === "success" && (
          <p className="flex items-start gap-2 border border-cobalt/30 bg-cobalt/5 p-4 text-sm text-navy">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cobalt" aria-hidden="true" />
            {state.message}
          </p>
        )}
        {state.status === "error" && (
          <p className="flex items-start gap-2 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-700" aria-hidden="true" />
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy">
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={fieldClass}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
