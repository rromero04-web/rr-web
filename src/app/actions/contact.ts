"use server";

import { headers } from "next/headers";
import { getContactSchema } from "@/lib/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendContactNotification } from "@/lib/email";
import { createRateLimiter } from "@/lib/rateLimit";
import type { Locale } from "@/lib/i18n/config";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
};

const RATE_LIMIT_MESSAGES: Record<Locale, string> = {
  es: "Has enviado varias solicitudes seguidas. Inténtalo de nuevo en unos minutos.",
  en: "You've sent several requests in a row. Please try again in a few minutes.",
};

const FIELD_ERRORS_MESSAGES: Record<Locale, string> = {
  es: "Revisa los campos marcados antes de enviar el formulario.",
  en: "Please check the highlighted fields before submitting the form.",
};

const SUBMIT_ERROR_MESSAGES: Record<Locale, string> = {
  es: "No he podido enviar tu mensaje. Inténtalo de nuevo en unos minutos o escríbeme por correo.",
  en: "I couldn't send your message. Please try again in a few minutes or email me directly.",
};

const HONEYPOT_SUCCESS_MESSAGES: Record<Locale, string> = {
  es: "Gracias, he recibido tu mensaje.",
  en: "Thanks, I've received your message.",
};

const SUCCESS_MESSAGES: Record<Locale, string> = {
  es: "Gracias. He recibido tu mensaje y te responderé lo antes posible con los siguientes pasos.",
  en: "Thank you. I've received your message and will get back to you as soon as possible with next steps.",
};

const isRateLimited = createRateLimiter(3, 10 * 60 * 1000);

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawLanguage = formData.get("language")?.toString();
  const locale: Locale = rawLanguage === "en" ? "en" : "es";

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return {
      status: "error",
      message: RATE_LIMIT_MESSAGES[locale],
    };
  }

  const raw = {
    name: formData.get("name")?.toString() ?? "",
    company: formData.get("company")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    service: formData.get("service")?.toString() ?? "",
    budget: formData.get("budget")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    consent: formData.get("consent")?.toString() ?? "",
    language: rawLanguage ?? "",
    website: formData.get("website")?.toString() ?? "",
  };

  const parsed = getContactSchema(locale).safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: "error",
      message: FIELD_ERRORS_MESSAGES[locale],
      fieldErrors,
    };
  }

  // Honeypot relleno: se descarta en silencio, sin dar pistas a bots.
  if (parsed.data.website) {
    return { status: "success", message: HONEYPOT_SUCCESS_MESSAGES[locale] };
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("contact_requests").insert({
      name: parsed.data.name,
      company: parsed.data.company || null,
      email: parsed.data.email,
      service: parsed.data.service,
      budget: parsed.data.budget || null,
      message: parsed.data.message,
      source: locale === "en" ? "web-en" : "web",
    });

    if (error) {
      console.error("Error al guardar la solicitud de contacto:", error.message);
      return {
        status: "error",
        message: SUBMIT_ERROR_MESSAGES[locale],
      };
    }
  } catch (error) {
    console.error("Error inesperado en el formulario de contacto:", error);
    return {
      status: "error",
      message: SUBMIT_ERROR_MESSAGES[locale],
    };
  }

  // La solicitud ya está guardada en Supabase. El aviso por email es un
  // extra de conveniencia: si falla, no debe impedir que el usuario vea
  // la confirmación de envío.
  await sendContactNotification({
    name: parsed.data.name,
    company: parsed.data.company || null,
    email: parsed.data.email,
    service: parsed.data.service,
    budget: parsed.data.budget || null,
    message: parsed.data.message,
    language: locale,
  }).catch((error) => {
    console.error("Error inesperado al enviar la notificación por email:", error);
  });

  return {
    status: "success",
    message: SUCCESS_MESSAGES[locale],
  };
}
