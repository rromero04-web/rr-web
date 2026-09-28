// Arco de goniómetro: el instrumento con el que el fisioterapeuta mide los
// grados de movimiento de una articulación. Al cargar, el brazo móvil gira
// de 0° a 150° y el arco se rellena: "recuperar movilidad" en una imagen.
// Es decorativo (aria-hidden); el pie de figura explica qué representa.

const CX = 200;
const CY = 200;
const R = 150;
const TARGET = 150;

function point(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY - radius * Math.sin(rad) };
}

const TICKS = Array.from({ length: 19 }, (_, index) => index * 10);
const end = point(TARGET, R);

export function Goniometer() {
  return (
    <svg viewBox="-24 0 448 236" className="fn-goniometer h-auto w-full" aria-hidden="true">
      {/* Marcas cada 10°, más largas cada 30° */}
      {TICKS.map((angle) => {
        const major = angle % 30 === 0;
        const from = point(angle, R + 14);
        const to = point(angle, R + (major ? 30 : 22));
        return (
          <line
            key={angle}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={major ? "#0F4C45" : "#9DB5AD"}
            strokeWidth={major ? 2 : 1.25}
            strokeLinecap="round"
          />
        );
      })}
      {[0, 90, 180].map((angle) => {
        const label = point(angle, R + 44);
        return (
          <text
            key={angle}
            x={label.x}
            y={label.y + (angle === 90 ? 4 : 18)}
            textAnchor="middle"
            fontSize="13"
            fill="#5E716C"
          >
            {angle}°
          </text>
        );
      })}

      {/* Recorrido completo y arco recuperado */}
      <path d={`M ${CX + R} ${CY} A ${R} ${R} 0 0 0 ${CX - R} ${CY}`} fill="none" stroke="#DDEDE6" strokeWidth="18" strokeLinecap="round" />
      <path
        className="fn-goniometer-arc"
        d={`M ${CX + R} ${CY} A ${R} ${R} 0 0 0 ${end.x} ${end.y}`}
        fill="none"
        stroke="#1C9CC0"
        strokeWidth="18"
        strokeLinecap="round"
        pathLength={1}
      />

      {/* Brazo fijo y brazo móvil */}
      <line x1={CX} y1={CY} x2={CX + R - 26} y2={CY} stroke="#0F4C45" strokeWidth="6" strokeLinecap="round" />
      <g className="fn-goniometer-arm">
        <line x1={CX} y1={CY} x2={CX + R - 26} y2={CY} stroke="#0F4C45" strokeWidth="6" strokeLinecap="round" />
      </g>
      <circle cx={CX} cy={CY} r="11" fill="#FBFCFA" stroke="#0F4C45" strokeWidth="5" />

      <text x={CX} y={CY - 52} textAnchor="middle" fontSize="44" fontWeight="700" fill="#0F4C45" className="fn-goniometer-value">
        {TARGET}°
      </text>
    </svg>
  );
}
