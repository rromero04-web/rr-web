import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { InstagramIcon } from "@/components/ui/SocialIcons";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/rr.webandgrowth",
    icon: InstagramIcon,
  },
];

const LEGAL_LINKS = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/cookies", label: "Política de cookies" },
];

export function Footer() {
  return (
    <footer className="border-t border-line/70 bg-navy text-cream">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/logo-mark-inverse.png"
              alt=""
              width={800}
              height={672}
              className="h-8 w-auto shrink-0"
            />
            <span className="text-sm font-bold tracking-[0.14em] uppercase">
              Raúl Romero
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
            Webs y aplicaciones pensadas para hacer crecer negocios. Estrategia,
            diseño y desarrollo en una misma dirección.
          </p>
          <a
            href="mailto:info@raulromero.es"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cream/90 hover:text-cobalt-soft"
          >
            <Mail size={16} aria-hidden="true" />
            info@raulromero.es
          </a>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.14em] text-cream/50 uppercase">
            Redes
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-sm text-cream/80 hover:text-cobalt-soft"
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.14em] text-cream/50 uppercase">
            Legal
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-cream/80 hover:text-cobalt-soft"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Raúl Romero. Todos los derechos reservados.</p>
          <p>Diseñado y desarrollado por Raúl Romero.</p>
        </div>
      </div>
    </footer>
  );
}
