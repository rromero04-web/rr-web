import { z } from "zod";

export const SERVICE_OPTIONS = [
  { value: "web-profesional", label: "Web profesional" },
  { value: "web-de-captacion", label: "Web de captación" },
  { value: "aplicaciones-a-medida", label: "Aplicaciones a medida" },
  { value: "no-lo-tengo-claro", label: "Aún no lo tengo claro" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "menos-1000", label: "Menos de 1.000 €" },
  { value: "1000-3000", label: "1.000 € – 3.000 €" },
  { value: "3000-6000", label: "3.000 € – 6.000 €" },
  { value: "mas-6000", label: "Más de 6.000 €" },
  { value: "no-lo-se", label: "Aún no lo sé" },
] as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre completo.")
    .max(100, "El nombre es demasiado largo."),
  company: z
    .string()
    .trim()
    .max(120, "Ese campo es demasiado largo.")
    .optional()
    .or(z.literal("")),
  email: z.email("Introduce un correo electrónico válido."),
  service: z.enum(SERVICE_OPTIONS.map((option) => option.value) as [string, ...string[]], {
    error: "Selecciona un tipo de servicio.",
  }),
  budget: z
    .enum(BUDGET_OPTIONS.map((option) => option.value) as [string, ...string[]])
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Cuéntame un poco más: al menos 20 caracteres.")
    .max(2000, "El mensaje es demasiado largo."),
  consent: z.literal("on", { error: "Debes aceptar la política de privacidad." }),
  // Honeypot: debe llegar vacío. Si un bot lo rellena, se descarta la solicitud.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
