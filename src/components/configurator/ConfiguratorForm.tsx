"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { submitConfiguratorForm, type ConfiguratorFormState } from "@/app/actions/configurator";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { FORM_STRINGS } from "@/lib/configurator/strings";
import { useConfigurator } from "@/lib/configurator/state";
import { cn } from "@/lib/utils";

const initialState: ConfiguratorFormState = { status: "idle", message: "" };

const fieldClass =
  "w-full border border-navy/20 bg-cream px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-slate/60 focus:border-cobalt";

export function ConfiguratorForm({ locale }: { locale: Locale }) {
  const t = FORM_STRINGS[locale];
  const { state, submitted } = useConfigurator();
  const [formState, formAction, pending] = useActionState(submitConfiguratorForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const privacyHref = localizePath("/privacidad", locale);

  useEffect(() => {
    if (formState.status === "success") {
      formRef.current?.reset();
      submitted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.status]);

  const errors = formState.fieldErrors ?? {};

  return (
    <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-4 border-t border-line/70 pt-6">
      <h3 className="text-lg font-bold text-navy">{t.title}</h3>
      <p className="text-sm text-slate">{t.intro}</p>

      <input type="hidden" name="language" value={locale} />
      <input type="hidden" name="config" value={JSON.stringify(state.config)} />

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="configurator-website">{t.honeypotLabel}</label>
        <input id="configurator-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="configurator-name" className="mb-1.5 block text-sm font-medium text-navy">
            {t.name} <span aria-hidden="true">*</span>
          </label>
          <input
            id="configurator-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "configurator-name-error" : undefined}
            className={fieldClass}
          />
          {errors.name && (
            <p id="configurator-name-error" className="mt-1.5 text-xs text-red-700">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="configurator-email" className="mb-1.5 block text-sm font-medium text-navy">
            {t.email} <span aria-hidden="true">*</span>
          </label>
          <input
            id="configurator-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "configurator-email-error" : undefined}
            className={fieldClass}
          />
          {errors.email && (
            <p id="configurator-email-error" className="mt-1.5 text-xs text-red-700">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="configurator-project" className="mb-1.5 block text-sm font-medium text-navy">
          {t.project}
        </label>
        <input
          id="configurator-project"
          name="project"
          type="text"
          autoComplete="organization"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="configurator-comment" className="mb-1.5 block text-sm font-medium text-navy">
          {t.comment}
        </label>
        <textarea
          id="configurator-comment"
          name="comment"
          rows={3}
          placeholder={t.commentPlaceholder}
          className={cn(fieldClass, "resize-none")}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="configurator-consent"
          name="consent"
          type="checkbox"
          required
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "configurator-consent-error" : undefined}
          className="mt-1 h-4 w-4 shrink-0 border border-navy/30 accent-[var(--color-cobalt)]"
        />
        <label htmlFor="configurator-consent" className="text-sm leading-relaxed text-slate">
          <a
            href={privacyHref}
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-navy underline underline-offset-2 hover:text-cobalt"
          >
            {t.consent}
          </a>{" "}
          <span aria-hidden="true">*</span>
        </label>
      </div>
      {errors.consent && (
        <p id="configurator-consent-error" className="-mt-2 text-xs text-red-700">
          {errors.consent}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex items-center justify-center gap-2 bg-navy px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-cobalt disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {pending ? t.submitting : t.submit}
      </button>

      <div role="status" aria-live="polite">
        {formState.status === "success" && (
          <p className="flex items-start gap-2 border border-cobalt/30 bg-cobalt/5 p-4 text-sm text-navy">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cobalt" aria-hidden="true" />
            {formState.message}
          </p>
        )}
        {formState.status === "error" && (
          <p className="flex items-start gap-2 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-700" aria-hidden="true" />
            {formState.message}
          </p>
        )}
      </div>
    </form>
  );
}
