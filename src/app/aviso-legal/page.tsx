import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal de Raúl Romero — Web & Growth.",
  robots: { index: false, follow: true },
};

export default function AvisoLegalPage() {
  return (
    <div className="container-page py-24 md:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
          Legal
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          Aviso legal
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate">
          En cumplimiento del deber de información aplicable a los
          prestadores de servicios de la sociedad de la información
          (artículos 10 y 22.2 de la Ley 34/2002, de Servicios de la
          Sociedad de la Información y de Comercio Electrónico), se facilitan
          los siguientes datos identificativos del titular de este sitio
          web.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-navy [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_p]:mt-2 [&_a]:font-medium [&_a]:text-navy [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-cobalt">
          <section>
            <h2>1. Datos identificativos del titular</h2>
            <ul>
              <li>Titular: Raúl Romero Agüera.</li>
              <li>NIF: 23312704L</li>
              <li>Nombre comercial: Raúl Romero — Web & Growth.</li>
              <li>
                Domicilio profesional: Calle Milán, n.º 3, 30319 Cartagena,
                Murcia, España.
              </li>
              <li>
                Correo electrónico:{" "}
                <a href="mailto:info@raulromero.es">
                  info@raulromero.es
                </a>
              </li>
              <li>Sitio web: https://raulromero.es</li>
              <li>País de actividad: España.</li>
              <li>
                Forma de actuación: persona física (autónomo). No existe
                sociedad, agencia ni equipo detrás de esta marca.
              </li>
              <li>Inscripción en el Registro Mercantil: no procede.</li>
              <li>Colegiación profesional: no procede.</li>
              <li>Autorización administrativa especial: no procede.</li>
            </ul>
          </section>

          <section>
            <h2>2. Objeto del sitio web</h2>
            <p>
              Este sitio web tiene como finalidad presentar los servicios
              profesionales de diseño web, desarrollo de aplicaciones y
              digitalización de procesos ofrecidos por Raúl Romero, así como
              permitir que los visitantes puedan solicitar información o una
              propuesta a través del formulario de contacto.
            </p>
          </section>

          <section>
            <h2>3. Condiciones de utilización</h2>
            <p>
              El acceso a este sitio web es gratuito y no requiere registro
              previo. El simple acceso y uso del sitio atribuye la condición
              de usuario e implica la aceptación de las condiciones incluidas
              en este aviso legal.
            </p>
            <p>
              El usuario se compromete a utilizar el sitio web y sus
              contenidos de forma diligente, correcta y lícita, y en
              particular a no utilizarlos con fines fraudulentos, ni a
              introducir o difundir virus informáticos u otros sistemas que
              puedan dañar el sitio web o los sistemas de terceros.
            </p>
          </section>

          <section>
            <h2>4. Propiedad intelectual e industrial</h2>
            <p>
              El diseño del sitio web, su código fuente, los textos, la
              identidad visual (incluido el logotipo y monograma «RR») y el
              resto de contenidos originales son propiedad de Raúl Romero,
              salvo que se indique expresamente lo contrario, y están
              protegidos por la normativa de propiedad intelectual e
              industrial.
            </p>
            <p>
              Queda prohibida su reproducción, distribución, comunicación
              pública o transformación, total o parcial, sin la autorización
              expresa del titular, salvo en los casos en los que la ley lo
              permita.
            </p>
          </section>

          <section>
            <h2>5. Responsabilidad sobre los contenidos y disponibilidad</h2>
            <p>
              Se procura que la información contenida en este sitio web sea
              exacta y esté actualizada, pero no se garantiza la ausencia de
              errores ni la disponibilidad continua e ininterrumpida del
              sitio. El titular no se hace responsable de los daños que
              pudieran derivarse de interrupciones, errores de conexión, mal
              funcionamiento del servicio o de causas ajenas a su control
              (por ejemplo, incidencias del proveedor de alojamiento).
            </p>
            <p>
              Los proyectos mostrados en la sección «Proyectos» que aparecen
              marcados como «proyecto conceptual» son ejemplos ilustrativos
              del tipo de trabajo realizado y no representan clientes,
              resultados ni cifras reales.
            </p>
          </section>

          <section>
            <h2>6. Enlaces externos</h2>
            <p>
              Este sitio web puede incluir enlaces a sitios de terceros (por
              ejemplo, redes sociales o WhatsApp). El titular no controla ni
              se hace responsable del contenido, políticas o prácticas de
              esos sitios externos. La inclusión de un enlace no implica
              relación, recomendación o respaldo por parte del titular hacia
              el sitio enlazado.
            </p>
          </section>

          <section>
            <h2>7. Precios e impuestos</h2>
            <p>
              Este sitio web no publica actualmente precios ni tarifas
              cerradas para sus servicios. Si en el futuro se publican
              precios, se indicará expresamente si incluyen o no los
              impuestos aplicables.
            </p>
          </section>

          <section>
            <h2>8. Legislación aplicable y jurisdicción</h2>
            <p>
              Las presentes condiciones se rigen por la legislación española.
              Para la resolución de cualquier controversia derivada del
              acceso o uso de este sitio web, y sin perjuicio de los derechos
              que como consumidor pudieran corresponder al usuario conforme a
              la normativa de protección de consumidores, serán competentes
              los juzgados y tribunales que determine la ley.
            </p>
          </section>

          <section>
            <h2>9. Más información</h2>
            <p>
              Para conocer cómo se tratan los datos personales recogidos a
              través de este sitio web, consulta la{" "}
              <Link href="/privacidad">Política de privacidad</Link>. Para
              conocer el uso de cookies y tecnologías similares, consulta la{" "}
              <Link href="/cookies">Política de cookies</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
