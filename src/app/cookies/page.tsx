import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Política de cookies de Raúl Romero — Web & Growth.",
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <div className="container-page py-24 md:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
          Legal
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          Política de cookies
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate">
          Esta política se basa en una revisión técnica real del código de
          este sitio web, no en un texto genérico. Se actualizará cada vez
          que cambie algo de lo descrito aquí.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-navy [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_p]:mt-2 [&_a]:font-medium [&_a]:text-navy [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-cobalt">
          <section>
            <h2>1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos que un sitio web puede
              guardar en tu navegador para recordar información sobre tu
              visita, como preferencias, sesiones o datos de navegación.
              Existen tecnologías equivalentes, como el almacenamiento local
              del navegador (<code>localStorage</code>,{" "}
              <code>sessionStorage</code>), que cumplen funciones similares.
            </p>
          </section>

          <section>
            <h2>2. Cookies y almacenamiento que utiliza esta web</h2>
            <p>
              <strong>
                Esta web, en su versión actual, no instala ninguna cookie,
                propia ni de terceros, ni utiliza <code>localStorage</code>{" "}
                ni <code>sessionStorage</code> para guardar información en tu
                navegador.
              </strong>{" "}
              No hay cookies de analítica (como Google Analytics), ni de
              publicidad, ni de redes sociales, ni siquiera cookies técnicas
              propias: el sitio funciona sin necesidad de ellas.
            </p>
            <p>
              Las tipografías se sirven directamente desde este dominio (no
              se cargan desde servidores de Google en tiempo real), por lo
              que su uso tampoco genera cookies ni conexiones a terceros.
            </p>
            <p>
              El formulario de contacto envía los datos directamente al
              servidor mediante una petición segura, sin dejar ninguna
              cookie ni almacenamiento persistente en tu navegador. Los
              enlaces a Instagram y WhatsApp son enlaces salientes normales:
              no cargan ningún contenido de esos servicios dentro de esta web
              ni instalan cookies mientras navegas por ella.
            </p>
            <p>
              Como no se utiliza ninguna cookie no esencial, esta web no
              muestra ningún banner de consentimiento de cookies: mostrar uno
              sin necesidad sería tan confuso como no informar cuando sí
              hace falta.
            </p>
          </section>

          <section>
            <h2>3. Si esto cambia en el futuro</h2>
            <p>
              Si en el futuro se incorpora alguna herramienta que instale
              cookies no esenciales o tecnologías equivalentes (por ejemplo,
              analítica de visitas), antes de activarla:
            </p>
            <ul>
              <li>Se actualizará esta política con el detalle exacto: nombre, proveedor, finalidad, tipo, duración y si implica alguna transferencia de datos.</li>
              <li>
                Se bloqueará esa tecnología por defecto hasta que decidas
                si la aceptas.
              </li>
              <li>
                Se mostrará un aviso con opciones igual de visibles para
                aceptar o rechazar, sin casillas premarcadas, y con la
                posibilidad de cambiar tu elección en cualquier momento
                desde un enlace permanente en el pie de página.
              </li>
            </ul>
            <p>Mientras eso no ocurra, no hace falta nada de eso.</p>
          </section>

          <section>
            <h2>4. Más información</h2>
            <p>
              Para saber qué datos personales se tratan a través del
              formulario de contacto y con qué finalidad, consulta la{" "}
              <Link href="/privacidad">Política de privacidad</Link>.
            </p>
          </section>

          <section>
            <h2>5. Fecha de última actualización</h2>
            <p>10 de agosto de 2026.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
