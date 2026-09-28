import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { InstagramIcon, WhatsappIcon } from "@/components/ui/SocialIcons";
import { localizePath, type Locale } from "@/lib/i18n/config";

const STRINGS: Record<Locale, {
  tagline: string;
  contact: string;
  explore: string;
  legal: string;
  builder: string;
  rights: string;
  place: string;
  legalLinks: { href: string; label: string }[];
}> = {
  es: {
    tagline: "Webs y aplicaciones para negocios pequeños, hechas por una sola persona de principio a fin.",
    contact: "Contacto",
    explore: "Explora",
    legal: "Legal",
    builder: "Configura tu proyecto",
    rights: "Todos los derechos reservados.",
    place: "Cartagena, Murcia",
    legalLinks: [
      { href: "/aviso-legal", label: "Aviso legal" },
      { href: "/privacidad", label: "Privacidad" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
  en: {
    tagline: "Websites and applications for small businesses, made by one person from start to finish.",
    contact: "Contact",
    explore: "Explore",
    legal: "Legal",
    builder: "Build your project",
    rights: "All rights reserved.",
    place: "Cartagena, Spain",
    legalLinks: [
      { href: "/aviso-legal", label: "Legal notice" },
      { href: "/privacidad", label: "Privacy" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
};

export function Footer({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];

  return (
    <footer className="rr-footer">
      <div className="container-page rr-footer-top">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/brand/logo-mark-inverse.png" alt="" width={800} height={672} className="h-7 w-auto shrink-0" />
            <span className="font-semibold">Raúl Romero</span>
          </div>
          <p>{t.tagline}</p>
        </div>

        <div>
          <h2>{t.contact}</h2>
          <ul>
            <li><a href="mailto:info@raulromero.es"><Mail size={16} aria-hidden="true" />info@raulromero.es</a></li>
            <li><a href="https://wa.me/34684772973" target="_blank" rel="noreferrer noopener"><WhatsappIcon size={16} />WhatsApp</a></li>
            <li><a href="https://www.instagram.com/rr.webandgrowth" target="_blank" rel="noreferrer noopener"><InstagramIcon size={16} />Instagram</a></li>
          </ul>
        </div>

        <div>
          <h2>{t.explore}</h2>
          <ul>
            <li><Link href={localizePath("/configurador", locale)}>{t.builder}</Link></li>
            <li><Link href="/labs">Labs</Link></li>
          </ul>
        </div>

        <div>
          <h2>{t.legal}</h2>
          <ul>
            {t.legalLinks.map((link) => (
              <li key={link.href}><Link href={localizePath(link.href, locale)}>{link.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-page rr-footer-bottom">
        <p>© {new Date().getFullYear()} Raúl Romero. {t.rights}</p>
        <p>{t.place}</p>
      </div>
    </footer>
  );
}
