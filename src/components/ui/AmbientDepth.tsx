// Fondo decorativo de profundidad: formas suaves que derivan lentamente
// detrás del contenido, como iluminación ambiental de una galería. Puro
// CSS (sin JS), pausado por completo con prefers-reduced-motion.
export function AmbientDepth({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div className={`studio-ambient studio-ambient-${tone}`} aria-hidden="true">
      <span className="studio-ambient-orb studio-ambient-orb-1" />
      <span className="studio-ambient-orb studio-ambient-orb-2" />
      <span className="studio-ambient-orb studio-ambient-orb-3" />
      <span className="studio-ambient-grid" />
    </div>
  );
}
