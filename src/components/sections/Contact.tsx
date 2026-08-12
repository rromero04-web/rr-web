import { Mail } from "lucide-react";
import { ContactForm } from "@/components/ui/ContactForm";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { WhatsappIcon } from "@/components/ui/SocialIcons";
import type { Locale } from "@/lib/i18n/config";

const WHATSAPP_NUMBER = "34684772973";

const STRINGS: Record<Locale, {
  eyebrow: string;
  title: string;
  description: string;
  emailPrompt: string;
  whatsappPrompt: string;
  callNote: string;
  whatsappMessage: string;
}> = {
  es: {
    eyebrow: "Contacto",
    title: "¿Qué quieres mejorar en tu negocio?",
    description:
      "Cuéntame brevemente tu idea, problema o proceso. Te responderé con los siguientes pasos y una primera valoración.",
    emailPrompt: "¿Prefieres escribir directamente?",
    whatsappPrompt: "¿Prefieres WhatsApp?",
    callNote: "Próximamente: reserva de llamada.",
    whatsappMessage: "Hola Raúl, te escribo desde tu web porque quiero contarte un proyecto.",
  },
  en: {
    eyebrow: "Contact",
    title: "What would you like to improve in your business?",
    description:
      "Tell me briefly about your idea, problem or process. I'll get back to you with next steps and an initial assessment.",
    emailPrompt: "Prefer to write directly?",
    whatsappPrompt: "Prefer WhatsApp?",
    callNote: "Coming soon: call booking.",
    whatsappMessage: "Hi Raúl, I'm reaching out from your website because I'd like to tell you about a project.",
  },
};

export function Contact({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const whatsappMessage = encodeURIComponent(t.whatsappMessage);

  return (
    <section id="contacto" className="py-24 md:py-32">
      <div className="container-page grid gap-14 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <RevealOnScroll>
            <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
              {t.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              {t.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate">
              {t.description}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.12}>
            <div className="mt-8 flex flex-col gap-4 border border-line/70 p-5">
              <div>
                <p className="text-sm font-semibold text-navy">
                  {t.emailPrompt}
                </p>
                <a
                  href="mailto:info@raulromero.es"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-cobalt"
                >
                  <Mail size={16} aria-hidden="true" />
                  info@raulromero.es
                </a>
              </div>

              <div className="border-t border-line/70 pt-4">
                <p className="text-sm font-semibold text-navy">
                  {t.whatsappPrompt}
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-cobalt"
                >
                  <WhatsappIcon size={16} />
                  +34 684 772 973
                </a>
              </div>

              <p className="text-xs text-slate">
                {t.callNote}
              </p>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.16}>
          <div className="border border-line/70 bg-cream p-6 sm:p-8">
            <ContactForm locale={locale} />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
