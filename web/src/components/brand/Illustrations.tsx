/*
 * Ilustraciones propias en SVG. Existen para que las pantallas vacías y los
 * estados de espera tengan carácter en vez de un texto gris centrado.
 *
 * Todas usan el mismo lenguaje geométrico que el isotipo: planos facetados,
 * ángulos rectos y diagonales, nada de formas redondeadas blandas.
 */

/** Sin valor hoy: una montaña de datos y una línea de listón que nadie supera. */
export function IlustracionSinValor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="sv-oro" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8C766" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Listón de valor */}
      <line
        x1="12" y1="42" x2="188" y2="42"
        stroke="url(#sv-oro)" strokeWidth="1.5" strokeDasharray="5 4"
      />
      <text x="14" y="36" fill="#C9A227" fontSize="8" fontFamily="JetBrains Mono, monospace">
        listón
      </text>

      {/* Barras de candidatos, todas por debajo */}
      {[
        [30, 62], [52, 74], [74, 58], [96, 80], [118, 66], [140, 72], [162, 55],
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x} y={y} width="14" height={104 - y} rx="2"
          fill="currentColor" opacity={0.16 + i * 0.03}
        />
      ))}

      <line x1="12" y1="104" x2="188" y2="104" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  )
}

/** Sin conexión / sin datos: husky esquemático dormido sobre líneas cortadas. */
export function IlustracionVacio({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" className={className} aria-hidden>
      <path d="M72 44 L86 50 L83 68 Z" fill="currentColor" opacity="0.28" />
      <path d="M128 44 L114 50 L117 68 Z" fill="currentColor" opacity="0.2" />
      <path d="M83 68 L100 56 L100 92 L74 78 Z" fill="currentColor" opacity="0.22" />
      <path d="M117 68 L100 56 L100 92 L126 78 Z" fill="currentColor" opacity="0.16" />
      <path d="M92 78 L100 70 L108 78 L100 96 Z" fill="currentColor" opacity="0.34" />

      {/* Líneas de señal cortadas */}
      <g stroke="#C9A227" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round">
        <path d="M28 60 L44 60" />
        <path d="M52 60 L60 60" />
        <path d="M140 60 L148 60" />
        <path d="M156 60 L172 60" />
      </g>
    </svg>
  )
}

/** Cabecera decorativa: rejilla facetada que sugiere una jauría de nodos. */
export function TramaJauria({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 140" fill="none" className={className} aria-hidden preserveAspectRatio="none">
      <defs>
        <linearGradient id="tj-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="url(#tj-fade)" strokeWidth="1">
        <path d="M0 20 L80 60 L160 14 L240 66 L320 26 L400 58" />
        <path d="M0 62 L80 100 L160 56 L240 108 L320 68 L400 98" />
      </g>
      {[[80, 60], [160, 14], [240, 66], [320, 26]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#C9A227" opacity="0.5" />
      ))}
    </svg>
  )
}

/** Marca de agua para cabeceras de sección: el monograma N muy tenue. */
export function FiligranaN({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <path
        d="M22 82 V22 L78 82 V22"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="square"
        opacity="0.06"
      />
    </svg>
  )
}
