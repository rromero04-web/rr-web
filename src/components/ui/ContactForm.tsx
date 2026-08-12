"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";
import { SERVICE_OPTIONS, BUDGET_OPTIONS } from "@/lib/validation";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const initialState: ContactFormState = { status: "idle", message: "" };

const fieldClass =
  "w-full border border-navy/20 bg-cream px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-slate/60 focus:border-cobalt";

const STRINGS: Record<Locale, {
  honeypotLabel: string;
  name: string;
  company: string;
  email: string;
  serviceLabel: string;
  servicePlaceholder: string;
  budgetLabel: string;
  budgetPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  legalNotice: (privacyHref: string) => ReactNode;
  consentLabel: (privacyHref: string) => ReactNode;
  submit: string;
  submitting: string;
}> = {
  es: {
    honeypotLabel: "No rellenar este campo",
    name: "Nombre",
    company: "Empresa o proyecto",
    email: "Correo electrónico",
    serviceLabel: "Tipo de servicio",
    servicePlaceholder: "Selecciona una opción",
    budgetLabel: "Presupuesto orientativo",
    budgetPlaceholder: "Prefiero no indicarlo",
    messageLabel: "Cuéntame tu proyecto",
    messagePlaceholder: "Cuéntame brevemente tu idea, problema o proceso a mejorar.",
    legalNotice: (privacyHref) => (
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
          href={privacyHref}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-navy underline underline-offset-2 hover:text-cobalt"
        >
          Política de privacidad
        </a>
        .
      </p>
    ),
    consentLabel: (privacyHref) => (
      <>
        He leído la{" "}
        <a
          href={privacyHref}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-navy underline underline-offset-2 hover:text-cobalt"
        >
          Política de privacidad
        </a>{" "}
        y entiendo cómo se tratarán mis datos.{" "}
        <span aria-hidden="true">*</span>
      </>
    ),
    submit: "Enviar mi proyecto",
    submitting: "Enviando...",
  },
  en: {
    honeypotLabel: "Leave this field empty",
    name: "Name",
    company: "Company or project",
    email: "Email address",
    serviceLabel: "Service type",
    servicePlaceholder: "Choose an option",
    budgetLabel: "Estimated budget",
    budgetPlaceholder: "Prefer not to say",
    messageLabel: "Tell me about your project",
    messagePlaceholder: "Briefly describe your idea, problem or process to improve.",
    legalNotice: (privacyHref) => (
      <p>
        <strong className="text-navy">Data controller:</strong> Raúl Romero
        Agüera. <strong className="text-navy">Purpose:</strong> to respond
        to your enquiry, assess the project and carry out the requested
        pre-contractual steps.{" "}
        <strong className="text-navy">Legal basis:</strong> pre-contractual
        measures taken at the data subject&apos;s request.{" "}
        <strong className="text-navy">Recipients:</strong> technology
        providers required to host the website, manage the form and
        deliver the service, as detailed in the Privacy Policy.{" "}
        <strong className="text-navy">Your rights:</strong> you can
        exercise your rights by writing to{" "}
        <a
          href="mailto:info@raulromero.es"
          className="font-medium text-navy underline underline-offset-2 hover:text-cobalt"
        >
          info@raulromero.es
        </a>
        . More information in the{" "}
        <a
          href={privacyHref}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-navy underline underline-offset-2 hover:text-cobalt"
        >
          Privacy Policy
        </a>
        .
      </p>
    ),
    consentLabel: (privacyHref) => (
      <>
        I have read the{" "}
        <a
          href={privacyHref}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-navy underline underline-offset-2 hover:text-cobalt"
        >
          Privacy Policy
        </a>{" "}
        and understand how my data will be handled.{" "}
        <span aria-hidden="true">*</span>
      </>
    ),
    submit: "Send my project",
    submitting: "Sending...",
  },
};

export function ContactForm({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const privacyHref = localizePath("/privacidad", locale);
  const serviceOptions = SERVICE_OPTIONS[locale];
  const budgetOptions = BUDGET_OPTIONS[locale];

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const errors = state.fieldErrors ?? {};

  return (
    <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="language" value={locale} />

      {/* Honeypot: oculto visualmente pero presente en el DOM para atrapar bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">{t.honeypotLabel}</label>
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
          label={t.name}
          name="name"
          required
          error={errors.name}
          autoComplete="name"
        />
        <Field
          label={t.company}
          name="company"
          error={errors.company}
          autoComplete="organization"
        />
      </div>

      <Field
        label={t.email}
        name="email"
        type="email"
        required
        error={errors.email}
        autoComplete="email"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-navy">
            {t.serviceLabel} <span aria-hidden="true">*</span>
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
              {t.servicePlaceholder}
            </option>
            {serviceOptions.map((option) => (
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
            {t.budgetLabel}
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className={fieldClass}
          >
            <option value="">{t.budgetPlaceholder}</option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy">
          {t.messageLabel} <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(fieldClass, "resize-none")}
          placeholder={t.messagePlaceholder}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-xs text-red-700">
            {errors.message}
          </p>
        )}
      </div>

      <div className="border border-line/70 bg-navy/[0.03] p-4 text-xs leading-relaxed text-slate">
        {t.legalNotice(privacyHref)}
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
          {t.consentLabel(privacyHref)}
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
        {pending ? t.submitting : t.submit}
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
