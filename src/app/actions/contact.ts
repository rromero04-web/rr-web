"use server";

import { headers } from "next/headers";
import { contactSchema } from "@/lib/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendContactNotification } from "@/lib/email";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
};

// Límite de solicitudes muy simple, en memoria, por IP. Suficiente para
// frenar envíos automatizados básicos; no persiste entre despliegues ni
// entre instancias del servidor. Para un límite robusto, usar un servicio
// dedicado (p. ej. Upstash Ratelimit) en el futuro.
const submissionsByIp = new Map<string, number[]>();
const MAX_SUBMISSIONS = 3;
const WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter(
    (time) => now - time < WINDOW_MS
  );
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return timestamps.length > MAX_SUBMISSIONS;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return {
      status: "error",
      message: "Has enviado varias solicitudes seguidas. Inténtalo de nuevo en unos minutos.",
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
    website: formData.get("website")?.toString() ?? "",
  };

  const parsed = contactSchema.safeParse(raw);

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
      message: "Revisa los campos marcados antes de enviar el formulario.",
      fieldErrors,
    };
  }

  // Honeypot relleno: se descarta en silencio, sin dar pistas a bots.
  if (parsed.data.website) {
    return { status: "success", message: "Gracias, he recibido tu mensaje." };
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
      source: "web",
    });

    if (error) {
      console.error("Error al guardar la solicitud de contacto:", error.message);
      return {
        status: "error",
        message: "No he podido enviar tu mensaje. Inténtalo de nuevo en unos minutos o escríbeme por correo.",
      };
    }
  } catch (error) {
    console.error("Error inesperado en el formulario de contacto:", error);
    return {
      status: "error",
      message: "No he podido enviar tu mensaje. Inténtalo de nuevo en unos minutos o escríbeme por correo.",
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
  }).catch((error) => {
    console.error("Error inesperado al enviar la notificación por email:", error);
  });

  return {
    status: "success",
    message: "Gracias. He recibido tu mensaje y te responderé lo antes posible con los siguientes pasos.",
  };
}
