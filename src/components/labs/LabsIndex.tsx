import Link from "next/link";
import Image from "next/image";
import styles from "./labs-index.module.css";

export function LabsIndex() {
  return (
    <main id="main-content" className={styles.page}>
      <section className="container-page">
        <header className={styles.intro}>
          <p className={styles.eyebrow}>Experimentos / Raúl Romero</p>
          <h1>LABS</h1>
          <p>
            Un espacio para explorar qué ocurre cuando estrategia, diseño y
            tecnología trabajan como un mismo sistema.
          </p>
        </header>

        <article className={styles.feature}>
          <Link
            href="/labs/convergence"
            className={styles.poster}
            aria-label="Explorar Convergence — Lab 001"
          >
            <Image
              src="/labs/convergence/poster.png"
              alt="Convergence: a warm particle field, precise violet geometry and a responsive blue network merging into one system"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
              className={styles.posterImage}
            />
          </Link>

          <div className={styles.copy}>
            <p className={styles.index}>001 / INTERACCIÓN EN TIEMPO REAL</p>
            <h2>CONVERGENCE</h2>
            <p className={styles.description}>
              Tres disciplinas. Un sistema. Una exploración interactiva sobre
              atención, forma y comportamiento.
            </p>
            <Link href="/labs/convergence" className={styles.cta}>
              Explorar experimento <span aria-hidden="true">↗</span>
            </Link>
            <p className={styles.note}>Experiencia en inglés · Sonido opcional</p>
          </div>
        </article>
      </section>
    </main>
  );
}
