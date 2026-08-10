import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de Raúl Romero — Web & Growth.",
  robots: { index: false, follow: true },
};

export default function PrivacidadPage() {
  return (
    <div className="container-page py-24 md:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
          Legal
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          Política de privacidad
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate">
          Este documento explica, en lenguaje claro, qué datos personales
          trata este sitio web, para qué, durante cuánto tiempo y qué
          derechos tienes. No sustituye el asesoramiento de un profesional y
          no garantiza por sí solo el cumplimiento de ninguna normativa.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-navy [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_p]:mt-2 [&_a]:font-medium [&_a]:text-navy [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-cobalt">
          <section>
            <h2>1. Responsable del tratamiento</h2>
            <p>
              Responsable del tratamiento: Raúl Romero Agüera, con NIF
              23312704L y domicilio profesional en Calle Milán, n.º 3, 30319
              Cartagena, Murcia, España. Correo electrónico de contacto y
              ejercicio de derechos:{" "}
              <a href="mailto:info@raulromero.es">
                info@raulromero.es
              </a>
              .
            </p>
            <ul>
              <li>Nombre comercial: Raúl Romero — Web & Growth.</li>
              <li>Sitio web: https://raulromero.es</li>
              <li>
                Forma de actuación: persona física (autónomo), sin sociedad
                ni agencia detrás.
              </li>
              <li>País de actividad: España.</li>
              <li>No existe delegado de protección de datos designado.</li>
            </ul>
          </section>

          <section>
            <h2>2. Datos personales tratados</h2>
            <p>
              Los únicos datos personales que trata esta web son los que tú
              mismo introduces voluntariamente en el formulario de contacto:
            </p>
            <ul>
              <li>Nombre (obligatorio).</li>
              <li>Empresa o proyecto (opcional).</li>
              <li>Correo electrónico (obligatorio).</li>
              <li>Tipo de servicio que te interesa (obligatorio).</li>
              <li>Presupuesto orientativo (opcional).</li>
              <li>Mensaje o descripción del proyecto (obligatorio).</li>
            </ul>
            <p>
              Al enviarse el formulario se registran también, de forma
              automática: la fecha y hora de envío, un estado interno de
              gestión de la solicitud (por ejemplo, «nueva», «leída» o
              «respondida») y la fuente del contacto (que hoy es siempre
              «web», por ser el único canal del formulario).
            </p>
            <p>
              Como medida de seguridad frente a envíos automatizados
              (spam), el servidor mantiene temporalmente en su memoria un
              contador de envíos por dirección IP durante unos minutos, para
              limitar el número de solicitudes seguidas. Este contador{" "}
              <strong>no se guarda en ninguna base de datos</strong>, no
              queda asociado a tu nombre ni a tu mensaje, y desaparece al
              reiniciarse el servidor.
            </p>
            <p>
              Esta web no utiliza cookies ni tecnologías de rastreo, por lo
              que no se recogen datos de navegación, comportamiento o
              perfiles de uso (más detalle en la{" "}
              <Link href="/cookies">Política de cookies</Link>).
            </p>
          </section>

          <section>
            <h2>3. Procedencia de los datos</h2>
            <p>
              Todos los datos proceden directamente de ti, como persona
              interesada, a través del formulario de contacto. No se obtienen
              datos personales de fuentes de terceros ni de bases de datos
              externas.
            </p>
          </section>

          <section>
            <h2>4. Finalidades del tratamiento</h2>
            <p>Los datos del formulario se usan exclusivamente para:</p>
            <ul>
              <li>Responder a tu consulta.</li>
              <li>Valorar el proyecto o servicio que solicitas.</li>
              <li>Preparar y enviarte una propuesta o presupuesto.</li>
              <li>
                Realizar las gestiones precontractuales que tú mismo
                solicitas al ponerte en contacto.
              </li>
            </ul>
            <p>
              El formulario general de contacto{" "}
              <strong>no suscribe a ninguna newsletter ni lista de
              publicidad</strong>. Si en el futuro se incorpora un envío de
              comunicaciones comerciales, existirá una casilla independiente,
              opcional y no premarcada, con su propia información y base
              jurídica, separada de esta finalidad.
            </p>
          </section>

          <section>
            <h2>5. Bases jurídicas</h2>
            <ul>
              <li>
                <strong>Formulario de contacto:</strong> aplicación de
                medidas precontractuales a solicitud de la persona
                interesada (artículo 6.1.b del RGPD). No se basa en tu
                consentimiento, porque su finalidad es responder a algo que
                tú mismo has pedido.
              </li>
              <li>
                <strong>Prevención de spam (contador temporal de envíos):</strong>{" "}
                interés legítimo del responsable en proteger el servicio
                frente a abusos (artículo 6.1.f del RGPD).
              </li>
            </ul>
          </section>

          <section>
            <h2>6. Carácter obligatorio de los datos</h2>
            <p>
              Nombre, correo electrónico, tipo de servicio y mensaje son
              obligatorios: sin ellos, el formulario no puede enviarse ni,
              por tanto, responderse. Empresa/proyecto y presupuesto
              orientativo son opcionales.
            </p>
          </section>

          <section>
            <h2>7. Plazos de conservación</h2>
            <ul>
              <li>
                Si tu consulta no termina en una relación contractual, los
                datos se conservan como máximo 12 meses desde la última
                comunicación contigo, salvo que sea necesario conservarlos
                durante más tiempo para atender o defenderse de una
                reclamación.
              </li>
              <li>
                Si se establece una relación contractual, los datos se
                conservan durante esa relación y, después, durante los
                plazos legales aplicables a las responsabilidades y
                obligaciones derivadas (por ejemplo, fiscales o mercantiles).
              </li>
              <li>
                Si existe una obligación legal de conservar ciertos datos,
                estos quedarán bloqueados y solo se usarán para atender esa
                obligación, sin darles otro uso.
              </li>
              <li>
                Transcurridos los plazos anteriores, los datos se eliminan o
                anonimizan de forma segura.
              </li>
            </ul>
            <p>
              A día de hoy no existe todavía un proceso automatizado de
              eliminación de solicitudes antiguas en Supabase: la limpieza se
              realizará mediante revisión periódica manual por parte del
              responsable, hasta que se implemente un mecanismo automatizado.
            </p>
          </section>

          <section>
            <h2>8. Destinatarios y encargados del tratamiento</h2>
            <p>
              Tus datos <strong>no se venden ni se ceden a terceros con
              fines comerciales</strong>. Únicamente acceden a ellos los
              proveedores tecnológicos estrictamente necesarios para
              alojar la web y gestionar el formulario, en calidad de
              encargados del tratamiento (artículo 28 del RGPD):
            </p>
            <ul>
              <li>
                <strong>Supabase</strong> — almacena la base de datos con las
                solicitudes de contacto.
              </li>
              <li>
                <strong>Vercel</strong> — aloja y ejecuta la web y sus
                funciones de servidor.
              </li>
              <li>
                <strong>Resend</strong> — envía al responsable un aviso por
                correo electrónico cada vez que se recibe una solicitud, para
                poder responderla antes. Resend procesa para ello el nombre,
                correo, servicio, presupuesto y mensaje de la solicitud;
                puedes consultar su{" "}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  política de privacidad
                </a>
                .
              </li>
            </ul>
            <p>
              No se utiliza ninguna herramienta de analítica, publicidad ni
              CAPTCHA externo en esta web: la protección antispam es un
              mecanismo propio (ver sección 2).
            </p>
          </section>

          <section>
            <h2>9. Transferencias internacionales</h2>
            <p>
              El proyecto de Supabase y la región de ejecución en Vercel
              utilizados por esta web están configurados por el responsable
              en <strong>Irlanda (Unión Europea)</strong>. Aun así, ambos
              proveedores son empresas con infraestructura y soporte
              internacional, por lo que puede producirse tratamiento o acceso
              a los datos fuera del Espacio Económico Europeo:
            </p>
            <ul>
              <li>
                <strong>Vercel Inc.</strong> tiene su sede en Estados Unidos.
                Según su Addendum de Tratamiento de Datos, puede transferir
                datos a sus subencargados (que incluyen infraestructura en
                AWS, Azure y Google Cloud) fuera del EEE cuando sea
                necesario, salvaguardado con Cláusulas Contractuales Tipo de
                la UE (2021) y el UK IDTA. Puedes consultar su{" "}
                <a
                  href="https://vercel.com/legal/dpa"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Addendum de Tratamiento de Datos
                </a>{" "}
                y su{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  política de privacidad
                </a>
                .
              </li>
              <li>
                <strong>Supabase</strong> garantiza contractualmente que,
                cuando el cliente especifica una región (como Irlanda, en
                este caso), los datos se almacenan y procesan
                principalmente en esa región. No obstante, su documentación
                pública también hace referencia a infraestructura y soporte
                en Estados Unidos, con salvaguardas mediante Cláusulas
                Contractuales Tipo. Puedes consultar su{" "}
                <a
                  href="https://supabase.com/legal/dpa"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Addendum de Tratamiento de Datos
                </a>
                , su{" "}
                <a
                  href="https://supabase.com/legal/customer-resources/subprocessor-list"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  lista de subencargados
                </a>{" "}
                y su{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  política de privacidad
                </a>
                .
              </li>
              <li>
                <strong>Resend</strong> (Plus Five Five, Inc.) tiene su sede
                en Estados Unidos y, según su propia política de privacidad,
                puede transferir y mantener la información en servidores
                ubicados en Estados Unidos. Puedes consultar su{" "}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  política de privacidad
                </a>
                .
              </li>
            </ul>
            <p>
              En todos los casos, cualquier transferencia fuera del EEE se
              realiza bajo Cláusulas Contractuales Tipo aprobadas por la
              Comisión Europea, como mecanismo de garantía reconocido por el
              RGPD.
            </p>
          </section>

          <section>
            <h2>10. Derechos de las personas interesadas</h2>
            <p>Puedes ejercer en cualquier momento tus derechos de:</p>
            <ul>
              <li>Acceso a tus datos personales.</li>
              <li>Rectificación de datos inexactos.</li>
              <li>Supresión de tus datos.</li>
              <li>Oposición al tratamiento.</li>
              <li>Limitación del tratamiento.</li>
              <li>Portabilidad, cuando resulte aplicable.</li>
              <li>
                Retirada del consentimiento en cualquier momento, para los
                tratamientos que se basen en él, sin que ello afecte a la
                licitud del tratamiento previo a su retirada.
              </li>
            </ul>
            <p>
              Puedes ejercerlos escribiendo a{" "}
              <a href="mailto:info@raulromero.es">
                info@raulromero.es
              </a>
              . La solicitud debe permitir identificarte y entender qué
              derecho quieres ejercer; solo se te pedirá información
              adicional de identificación cuando sea realmente necesaria y
              proporcionada.
            </p>
          </section>

          <section>
            <h2>11. Reclamaciones ante la Agencia Española de Protección de Datos</h2>
            <p>
              Si consideras que el tratamiento de tus datos no se ajusta a la
              normativa, puedes presentar una reclamación ante la Agencia
              Española de Protección de Datos:{" "}
              <a
                href="https://www.aepd.es/"
                target="_blank"
                rel="noreferrer noopener"
              >
                www.aepd.es
              </a>
              .
            </p>
          </section>

          <section>
            <h2>12. Seguridad</h2>
            <p>
              Se aplican medidas técnicas y organizativas razonables para
              proteger tus datos: el formulario se valida tanto en el
              navegador como en el servidor, la conexión se realiza mediante
              HTTPS, y el acceso público a la base de datos está restringido
              mediante políticas de seguridad a nivel de fila (Row Level
              Security) que solo permiten insertar nuevas solicitudes, nunca
              leerlas, modificarlas ni borrarlas desde el navegador. Ninguna
              medida de seguridad es infalible al cien por cien, por lo que
              no podemos garantizar una seguridad absoluta.
            </p>
          </section>

          <section>
            <h2>13. Menores de edad</h2>
            <p>
              Esta web no está dirigida específicamente a menores de edad. Si
              eres menor, te pedimos que no nos facilites datos personales
              sin la autorización de tu padre, madre o tutor legal. Si
              detectamos que se han facilitado datos de un menor sin esa
              autorización, los eliminaremos en cuanto tengamos constancia.
            </p>
          </section>

          <section>
            <h2>14. Decisiones automatizadas y elaboración de perfiles</h2>
            <p>
              No se toman decisiones basadas únicamente en tratamiento
              automatizado ni se elaboran perfiles a partir de tus datos.
            </p>
          </section>

          <section>
            <h2>15. Cambios en esta política</h2>
            <p>
              Esta política puede actualizarse cuando cambien los servicios,
              proveedores o tratamientos descritos en ella. Los cambios
              relevantes se reflejarán en esta misma página, junto con su
              fecha de actualización.
            </p>
          </section>

          <section>
            <h2>16. Fecha de última actualización</h2>
            <p>10 de agosto de 2026.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
