import { Mail } from "lucide-react";
import { ContactForm } from "@/components/ui/ContactForm";
import { WhatsappIcon } from "@/components/ui/SocialIcons";
import type { Locale } from "@/lib/i18n/config";

const WHATSAPP_NUMBER = "34684772973";

const STRINGS: Record<Locale, {
  title: string;
  description: string;
  email: string;
  whatsapp: string;
  whatsappMessage: string;
}> = {
  es: {
    title: "¿Qué quieres mejorar en tu negocio?",
    description:
      "Cuéntame brevemente tu idea, problema o proceso. Te responderé con los siguientes pasos y una primera valoración.",
    email: "Por email",
    whatsapp: "Por WhatsApp",
    whatsappMessage: "Hola Raúl, te escribo desde tu web porque quiero contarte un proyecto.",
  },
  en: {
    title: "What would you like to improve in your business?",
    description:
      "Tell me briefly about your idea, problem or process. I'll get back to you with next steps and an initial assessment.",
    email: "By email",
    whatsapp: "On WhatsApp",
    whatsappMessage: "Hi Raúl, I'm reaching out from your website because I'd like to tell you about a project.",
  },
};

export function Contact({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const whatsappMessage = encodeURIComponent(t.whatsappMessage);

  return (
    <section id="contacto" className="rr-section">
      <div className="container-page rr-contact">
        <div>
          <h2 className="rr-display rr-section-title">{t.title}</h2>
          <p className="rr-contact-intro">{t.description}</p>
          <ul className="rr-channels">
            <li>
              {t.email}
              <a href="mailto:info@raulromero.es"><Mail size={16} aria-hidden="true" />info@raulromero.es</a>
            </li>
            <li>
              {t.whatsapp}
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`} target="_blank" rel="noreferrer noopener">
                <WhatsappIcon size={16} />+34 684 772 973
              </a>
            </li>
          </ul>
        </div>

        <div className="rr-contact-form">
          <ContactForm locale={locale} />
        </div>
      </div>
    </section>
  );
}
