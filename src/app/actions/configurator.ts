"use server";

import { headers } from "next/headers";
import { getConfiguratorContactSchema } from "@/lib/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendConfiguratorNotification } from "@/lib/email";
import { createRateLimiter } from "@/lib/rateLimit";
import { normalizeConfig } from "@/lib/configurator/types";
import { buildConfigSummaryText } from "@/lib/configurator/summary";
import type { Locale } from "@/lib/i18n/config";
import type { ProjectType } from "@/lib/configurator/types";

export type ConfiguratorFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
};

// Reutiliza el mismo limitador en memoria que el formulario de contacto
// principal (ver src/lib/rateLimit.ts), con una instancia propia para no
// compartir cupo entre ambos formularios.
const isRateLimited = createRateLimiter(3, 10 * 60 * 1000);

const RATE_LIMIT_MESSAGES: Record<Locale, string> = {
  es: "Has enviado varias solicitudes seguidas. Inténtalo de nuevo en unos minutos.",
  en: "You've sent several requests in a row. Please try again in a few minutes.",
};
const FIELD_ERRORS_MESSAGES: Record<Locale, string> = {
  es: "Revisa los campos marcados antes de enviar el formulario.",
  en: "Please check the highlighted fields before submitting the form.",
};
const SUBMIT_ERROR_MESSAGES: Record<Locale, string> = {
  es: "No he podido enviar tu proyecto. Inténtalo de nuevo en unos minutos o escríbeme por correo.",
  en: "I couldn't send your project. Please try again in a few minutes or email me directly.",
};
const HONEYPOT_SUCCESS_MESSAGES: Record<Locale, string> = {
  es: "Gracias, he recibido tu proyecto.",
  en: "Thanks, I've received your project.",
};
const SUCCESS_MESSAGES: Record<Locale, string> = {
  es: "Gracias. He recibido tu proyecto configurado y te responderé lo antes posible con los siguientes pasos.",
  en: "Thank you. I've received your configured project and will get back to you as soon as possible with next steps.",
};

// El catálogo de servicios de contact_requests (columna con CHECK
// constraint en Supabase) no conoce los tipos del configurador; se
// reutiliza la tabla existente mapeando al valor más cercano en vez de
// crear una columna o tabla nueva.
const SERVICE_MAPPING: Record<ProjectType, string> = {
  "web-profesional": "web-profesional",
  "web-captacion": "web-de-captacion",
  "app-interna": "aplicaciones-a-medida",
  "ia-integracion": "aplicaciones-a-medida",
  "sin-definir": "no-lo-tengo-claro",
};

export async function submitConfiguratorForm(
  _prevState: ConfiguratorFormState,
  formData: FormData
): Promise<ConfiguratorFormState> {
  const rawLanguage = formData.get("language")?.toString();
  const locale: Locale = rawLanguage === "en" ? "en" : "es";

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return { status: "error", message: RATE_LIMIT_MESSAGES[locale] };
  }

  const raw = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    project: formData.get("project")?.toString() ?? "",
    comment: formData.get("comment")?.toString() ?? "",
    consent: formData.get("consent")?.toString() ?? "",
    language: rawLanguage ?? "",
    config: formData.get("config")?.toString() ?? "{}",
    website: formData.get("website")?.toString() ?? "",
  };

  const parsed = getConfiguratorContactSchema(locale).safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { status: "error", message: FIELD_ERRORS_MESSAGES[locale], fieldErrors };
  }

  if (parsed.data.website) {
    return { status: "success", message: HONEYPOT_SUCCESS_MESSAGES[locale] };
  }

  let configJson: unknown = {};
  try {
    configJson = JSON.parse(parsed.data.config);
  } catch {
    // Config ilegible: se continúa con la configuración por defecto en vez
    // de bloquear el envío por un problema de serialización del cliente.
  }
  const config = normalizeConfig(configJson);
  const summaryText = buildConfigSummaryText(config, locale);
  const service = SERVICE_MAPPING[config.projectType ?? "sin-definir"];

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("contact_requests").insert({
      name: parsed.data.name,
      company: parsed.data.project || null,
      email: parsed.data.email,
      service,
      budget: null,
      message: [summaryText, parsed.data.comment ? `\n${parsed.data.comment}` : ""].join(""),
      source: locale === "en" ? "configurator-en" : "configurator",
    });

    if (error) {
      console.error("Error al guardar el proyecto del configurador:", error.message);
      return { status: "error", message: SUBMIT_ERROR_MESSAGES[locale] };
    }
  } catch (error) {
    console.error("Error inesperado al guardar el proyecto del configurador:", error);
    return { status: "error", message: SUBMIT_ERROR_MESSAGES[locale] };
  }

  await sendConfiguratorNotification({
    name: parsed.data.name,
    email: parsed.data.email,
    project: parsed.data.project || null,
    comment: parsed.data.comment || null,
    language: locale,
    summaryText,
  }).catch((error) => {
    console.error("Error inesperado al enviar la notificación del configurador:", error);
  });

  return { status: "success", message: SUCCESS_MESSAGES[locale] };
}
