import { Mail } from "lucide-react";
import { ContactForm } from "@/components/ui/ContactForm";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { WhatsappIcon } from "@/components/ui/SocialIcons";

const WHATSAPP_NUMBER = "34684772973";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola Raúl, te escribo desde tu web porque quiero contarte un proyecto."
);

export function Contact() {
  return (
    <section id="contacto" className="py-24 md:py-32">
      <div className="container-page grid gap-14 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <RevealOnScroll>
            <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
              Contacto
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              ¿Qué quieres mejorar en tu negocio?
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate">
              Cuéntame brevemente tu idea, problema o proceso. Te responderé
              con los siguientes pasos y una primera valoración.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.12}>
            <div className="mt-8 flex flex-col gap-4 border border-line/70 p-5">
              <div>
                <p className="text-sm font-semibold text-navy">
                  ¿Prefieres escribir directamente?
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
                  ¿Prefieres WhatsApp?
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-cobalt"
                >
                  <WhatsappIcon size={16} />
                  +34 684 772 973
                </a>
              </div>

              <p className="text-xs text-slate">
                Próximamente: reserva de llamada.
              </p>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.16}>
          <div className="border border-line/70 bg-cream p-6 sm:p-8">
            <ContactForm />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
