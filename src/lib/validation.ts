import { z } from "zod";
import type { Locale } from "@/lib/i18n/config";

export const SERVICE_OPTIONS: Record<Locale, { value: string; label: string }[]> = {
  es: [
    { value: "web-profesional", label: "Web profesional" },
    { value: "web-de-captacion", label: "Web de captación" },
    { value: "aplicaciones-a-medida", label: "Aplicaciones a medida" },
    { value: "no-lo-tengo-claro", label: "Aún no lo tengo claro" },
  ],
  en: [
    { value: "web-profesional", label: "Professional website" },
    { value: "web-de-captacion", label: "Lead-generation website" },
    { value: "aplicaciones-a-medida", label: "Custom application" },
    { value: "no-lo-tengo-claro", label: "Not sure yet" },
  ],
};

export const BUDGET_OPTIONS: Record<Locale, { value: string; label: string }[]> = {
  es: [
    { value: "menos-1000", label: "Menos de 1.000 €" },
    { value: "1000-3000", label: "1.000 € – 3.000 €" },
    { value: "3000-6000", label: "3.000 € – 6.000 €" },
    { value: "mas-6000", label: "Más de 6.000 €" },
    { value: "no-lo-se", label: "Aún no lo sé" },
  ],
  en: [
    { value: "menos-1000", label: "Under €1,000" },
    { value: "1000-3000", label: "€1,000 – €3,000" },
    { value: "3000-6000", label: "€3,000 – €6,000" },
    { value: "mas-6000", label: "Over €6,000" },
    { value: "no-lo-se", label: "Not sure yet" },
  ],
};

const SERVICE_VALUES = SERVICE_OPTIONS.es.map((option) => option.value) as [
  string,
  ...string[],
];
const BUDGET_VALUES = BUDGET_OPTIONS.es.map((option) => option.value) as [
  string,
  ...string[],
];

const VALIDATION_MESSAGES: Record<
  Locale,
  {
    name: string;
    nameMax: string;
    company: string;
    email: string;
    service: string;
    message: string;
    messageMax: string;
    consent: string;
  }
> = {
  es: {
    name: "Escribe tu nombre completo.",
    nameMax: "El nombre es demasiado largo.",
    company: "Ese campo es demasiado largo.",
    email: "Introduce un correo electrónico válido.",
    service: "Selecciona un tipo de servicio.",
    message: "Cuéntame un poco más: al menos 20 caracteres.",
    messageMax: "El mensaje es demasiado largo.",
    consent: "Debes aceptar la política de privacidad.",
  },
  en: {
    name: "Please enter your full name.",
    nameMax: "That name is too long.",
    company: "That field is too long.",
    email: "Please enter a valid email address.",
    service: "Please select a service type.",
    message: "Tell me a bit more: at least 20 characters.",
    messageMax: "That message is too long.",
    consent: "You must accept the privacy policy.",
  },
};

export function getContactSchema(locale: Locale) {
  const t = VALIDATION_MESSAGES[locale];

  return z.object({
    name: z.string().trim().min(2, t.name).max(100, t.nameMax),
    company: z.string().trim().max(120, t.company).optional().or(z.literal("")),
    email: z.email(t.email),
    service: z.enum(SERVICE_VALUES, { error: t.service }),
    budget: z.enum(BUDGET_VALUES).optional().or(z.literal("")),
    message: z.string().trim().min(20, t.message).max(2000, t.messageMax),
    consent: z.literal("on", { error: t.consent }),
    language: z.enum(["es", "en"]).optional().default("es"),
    // Honeypot: debe llegar vacío. Si un bot lo rellena, se descarta la solicitud.
    website: z.string().max(0).optional().or(z.literal("")),
  });
}

export type ContactInput = z.infer<ReturnType<typeof getContactSchema>>;

const CONFIGURATOR_VALIDATION_MESSAGES: Record<Locale, { name: string; nameMax: string; email: string; project: string; comment: string; consent: string }> = {
  es: {
    name: "Escribe tu nombre completo.",
    nameMax: "El nombre es demasiado largo.",
    email: "Introduce un correo electrónico válido.",
    project: "Ese campo es demasiado largo.",
    comment: "El comentario es demasiado largo.",
    consent: "Debes aceptar la política de privacidad.",
  },
  en: {
    name: "Please enter your full name.",
    nameMax: "That name is too long.",
    email: "Please enter a valid email address.",
    project: "That field is too long.",
    comment: "That comment is too long.",
    consent: "You must accept the privacy policy.",
  },
};

export function getConfiguratorContactSchema(locale: Locale) {
  const t = CONFIGURATOR_VALIDATION_MESSAGES[locale];

  return z.object({
    name: z.string().trim().min(2, t.name).max(100, t.nameMax),
    email: z.email(t.email),
    project: z.string().trim().max(120, t.project).optional().or(z.literal("")),
    comment: z.string().trim().max(1000, t.comment).optional().or(z.literal("")),
    consent: z.literal("on", { error: t.consent }),
    language: z.enum(["es", "en"]).optional().default("es"),
    config: z.string().max(4000),
    // Honeypot: debe llegar vacío. Si un bot lo rellena, se descarta la solicitud.
    website: z.string().max(0).optional().or(z.literal("")),
  });
}
