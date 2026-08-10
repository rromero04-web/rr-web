import "server-only";
import { Resend } from "resend";

type ContactNotificationInput = {
  name: string;
  company: string | null;
  email: string;
  service: string;
  budget: string | null;
  message: string;
};

// Envío de la notificación por email al recibir una solicitud de contacto.
// Es "best effort": si falla (o si RESEND_API_KEY no está configurada),
// la solicitud ya está guardada en Supabase y no se pierde — solo se
// registra el error para revisarlo manualmente.
export async function sendContactNotification(data: ContactNotificationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.warn(
      "Notificación por email omitida: faltan RESEND_API_KEY, CONTACT_NOTIFICATION_EMAIL o CONTACT_FROM_EMAIL."
    );
    return;
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `Nueva solicitud de contacto — ${data.name}`,
    text: [
      `Nombre: ${data.name}`,
      `Empresa o proyecto: ${data.company ?? "(no indicado)"}`,
      `Correo: ${data.email}`,
      `Servicio: ${data.service}`,
      `Presupuesto orientativo: ${data.budget ?? "(no indicado)"}`,
      "",
      "Mensaje:",
      data.message,
    ].join("\n"),
  });

  if (error) {
    console.error("Error al enviar la notificación por email:", error.message);
  }
}
