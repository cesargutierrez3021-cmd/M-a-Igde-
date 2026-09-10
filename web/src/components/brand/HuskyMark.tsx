interface HuskyMarkProps {
  size?: number
  className?: string
  /** Anima la mirada al montar. Se usa solo en cabecera y pantalla de acceso. */
  vivo?: boolean
}

/*
 * NOAH — isotipo. Husky facetado, frontal y simétrico (manual §1.3, dirección A).
 *
 * Geometría: cráneo ancho arriba que se estrecha hacia el hocico, orejas
 * triangulares apoyadas en las esquinas superiores, y una máscara facial clara
 * — que es lo que hace reconocible a un husky y no a un lobo genérico.
 *
 * Los colores de marca (oro y plata) son constantes en ambos temas: la marca
 * no cambia de identidad porque el usuario prefiera fondo claro.
 */
export function HuskyMark({ size = 28, className, vivo = false }: HuskyMarkProps) {
  const id = vivo ? 'husky-vivo' : 'husky'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      role="img"
      aria-label="NOAH"
    >
      <defs>
        <linearGradient id={`${id}-oro`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#E8C766" />
          <stop offset="100%" stopColor="#B08C1C" />
        </linearGradient>
        <linearGradient id={`${id}-oro-d`} x1="0.9" y1="0" x2="0.1" y2="1">
          <stop offset="0%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#7E6410" />
        </linearGradient>
        <linearGradient id={`${id}-plata`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#EFF1F3" />
          <stop offset="100%" stopColor="#AFB5BC" />
        </linearGradient>
        <linearGradient id={`${id}-plata-d`} x1="1" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#CFD3D8" />
          <stop offset="100%" stopColor="#8B9299" />
        </linearGradient>
      </defs>

      {/* Orejas: triángulos apoyados en las esquinas del cráneo */}
      <path d="M14 26 L11 4 L28 19 Z" fill={`url(#${id}-oro)`} />
      <path d="M50 26 L53 4 L36 19 Z" fill={`url(#${id}-oro-d)`} />
      {/* Interior de oreja */}
      <path d="M16 23 L14 10 L24 20 Z" fill="#8F6F13" opacity="0.55" />
      <path d="M48 23 L50 10 L40 20 Z" fill="#8F6F13" opacity="0.4" />

      {/* Cráneo: dos planos que se encuentran en el eje */}
      <path d="M14 26 L32 21 L32 40 L12 33 Z" fill={`url(#${id}-plata)`} />
      <path d="M50 26 L32 21 L32 40 L52 33 Z" fill={`url(#${id}-plata-d)`} />

      {/* Mejillas facetadas, en oro */}
      <path d="M12 33 L32 40 L32 54 L20 46 Z" fill={`url(#${id}-oro-d)`} />
      <path d="M52 33 L32 40 L32 54 L44 46 Z" fill={`url(#${id}-oro)`} />

      {/* Máscara facial y hocico: la marca del husky */}
      <path d="M24 40 L32 27 L40 40 L32 58 Z" fill="#F5F6F7" opacity="0.95" />

      {/* Ojos: rendijas anguladas hacia el centro */}
      <g className={vivo ? 'breathe' : undefined}>
        <path d="M17 31 L27 28 L26 35 L19 35 Z" fill="#0B0D10" />
        <path d="M47 31 L37 28 L38 35 L45 35 Z" fill="#0B0D10" />
        <circle cx="22" cy="31.6" r="1.5" fill="#E8C766" />
        <circle cx="42" cy="31.6" r="1.5" fill="#E8C766" />
      </g>

      {/* Trufa */}
      <path d="M32 45 L27.5 51 L36.5 51 Z" fill="#14181D" />
    </svg>
  )
}

/** Logotipo completo: isotipo + palabra, para cabeceras y pantalla de acceso. */
export function Logotipo({ size = 26 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <HuskyMark size={size} vivo />
      <span className="wordmark gold-text" style={{ fontSize: size * 0.72, lineHeight: 1 }}>
        NOAH
      </span>
    </div>
  )
}
