import Image from "next/image";
import { projects } from "@/content/projects";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function Projects() {
  return (
    <section id="proyectos" className="border-b border-line/70 py-24 md:py-32">
      <div className="container-page">
        <RevealOnScroll>
          <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
            Proyectos
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Casos de estudio
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
            Estoy empezando a construir mi cartera de clientes. Los proyectos de
            abajo son conceptuales — ilustran el tipo de problema que resuelvo
            y cómo lo abordaría — y se irán sustituyendo por casos reales.
          </p>
        </RevealOnScroll>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {projects.map((project, index) => (
            <RevealOnScroll key={project.slug} delay={index * 0.08} className="h-full">
              <article className="group flex h-full flex-col border border-line/70 bg-cream transition-colors hover:border-cobalt/60">
                <div className="relative aspect-[4/3] overflow-hidden border-b border-line/70 bg-navy">
                  <Image
                    src={project.image}
                    alt={`Mockup de ${project.name}`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-0 top-0 skew-x-[-12deg] origin-top-right translate-x-3 bg-cobalt px-4 py-1.5 text-[11px] font-bold tracking-wide text-cream uppercase"
                  >
                    <span className="inline-block -skew-x-[-12deg]">
                      Proyecto conceptual
                    </span>
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
                    {project.sector}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-navy">
                    {project.name}
                  </h3>

                  <dl className="mt-4 space-y-3 text-sm text-slate">
                    <div>
                      <dt className="font-semibold text-navy">Problema</dt>
                      <dd className="mt-0.5 leading-relaxed">{project.problem}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-navy">Solución</dt>
                      <dd className="mt-0.5 leading-relaxed">{project.solution}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-navy">Resultado</dt>
                      <dd className="mt-0.5 leading-relaxed">{project.result}</dd>
                    </div>
                  </dl>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <li
                        key={tech}
                        className="border border-line/70 px-2.5 py-1 text-xs font-medium text-slate"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
