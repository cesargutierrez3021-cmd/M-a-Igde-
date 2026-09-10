import { motion } from 'framer-motion'
import { useApariencia } from '../../lib/theme'

interface Props {
  /** Estimación central, 0-1. */
  valor: number
  /** Extremos del rango creíble, 0-1. */
  min: number
  max: number
}

/*
 * La probabilidad, dibujada según el tema.
 *
 * En Terreno es un perfil de montaña: la cresta marca la estimación y la franja
 * azul, el terreno donde todavía cabe la duda. En Puesto de mando es un aro de
 * instrumento con dos topes que marcan ese mismo rango.
 *
 * Los dos dicen lo mismo — cuánta certeza hay, no solo cuánta probabilidad — y
 * ninguno esconde la incertidumbre detrás de un número redondo.
 */
export function Probabilidad(props: Props) {
  const { tema } = useApariencia()
  return tema === 'terreno' ? <PerfilMontana {...props} /> : <AroInstrumento {...props} />
}

/* ── Terreno: perfil de montaña con franja de duda ─────────────────────── */
function PerfilMontana({ valor, min, max }: Props) {
  const x = (f: number) => f * 320
  const cima = x(valor)
  const izq = x(min)
  const der = x(max)

  // Campana centrada en la cima, con la anchura que marca el rango.
  const ancho = Math.max(der - izq, 40)
  const puntos = Array.from({ length: 33 }, (_, i) => {
    const px = (i / 32) * 320
    const t = (px - cima) / (ancho * 0.62)
    const py = 74 - 60 * Math.exp(-t * t)
    return `${px.toFixed(1)},${py.toFixed(1)}`
  }).join(' ')

  return (
    <div className="w-full">
      <svg viewBox="0 0 320 88" className="w-full" role="img" aria-label={`Probabilidad ${Math.round(valor * 100)}%`}>
        {/* franja del rango creíble */}
        <motion.rect
          x={izq}
          y={4}
          height={70}
          fill="var(--c-alt)"
          opacity={0.11}
          initial={{ width: 0 }}
          whileInView={{ width: der - izq }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* relleno bajo la cresta */}
        <motion.polygon
          points={`0,74 ${puntos} 320,74`}
          fill="var(--c-acento)"
          opacity={0.24}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.24 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />

        {/* la cresta */}
        <motion.polyline
          points={puntos}
          fill="none"
          stroke="var(--c-acento)"
          strokeWidth={1.8}
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />

        {/* marcador de la estimación */}
        <line x1={cima} y1={10} x2={cima} y2={74} stroke="var(--c-acento)" strokeWidth={1.4} />
        <motion.circle
          cx={cima}
          cy={14}
          r={4}
          fill="var(--c-acento)"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, type: 'spring', stiffness: 420, damping: 22 }}
        />

        <line x1={0} y1={74} x2={320} y2={74} stroke="var(--c-line)" strokeWidth={1} />
        <text x={izq + 3} y={85} fontSize={9} fill="var(--c-mute)" fontFamily="JetBrains Mono">
          {Math.round(min * 100)}%
        </text>
        <text x={der - 27} y={85} fontSize={9} fill="var(--c-mute)" fontFamily="JetBrains Mono">
          {Math.round(max * 100)}%
        </text>
      </svg>
      <p className="mt-1 text-[11px] text-mute">
        Cresta <span className="tabular text-dim">{(valor * 100).toFixed(1)}%</span> · la franja es
        la duda que queda
      </p>
    </div>
  )
}

/* ── Mando: aro de instrumento con topes del rango ─────────────────────── */
function AroInstrumento({ valor, min, max }: Props) {
  const R = 38
  const C = 2 * Math.PI * R
  const angulo = (f: number) => f * 360 - 90

  const tope = (f: number) => {
    const rad = (angulo(f) * Math.PI) / 180
    return {
      x1: 48 + Math.cos(rad) * (R - 7),
      y1: 48 + Math.sin(rad) * (R - 7),
      x2: 48 + Math.cos(rad) * (R + 7),
      y2: 48 + Math.sin(rad) * (R + 7),
    }
  }
  const t1 = tope(min)
  const t2 = tope(max)

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 96 96" className="w-[96px] shrink-0" role="img" aria-label={`Probabilidad ${Math.round(valor * 100)}%`}>
        <circle cx={48} cy={48} r={R} fill="none" stroke="var(--c-surface-3)" strokeWidth={7} />
        <motion.circle
          cx={48}
          cy={48}
          r={R}
          fill="none"
          stroke="var(--c-acento)"
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={C}
          transform="rotate(-90 48 48)"
          initial={{ strokeDashoffset: C }}
          whileInView={{ strokeDashoffset: C * (1 - valor) }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* los dos topes del rango creíble */}
        <line {...t1} stroke="var(--c-alt)" strokeWidth={2} strokeLinecap="round" />
        <line {...t2} stroke="var(--c-alt)" strokeWidth={2} strokeLinecap="round" />
        <text
          x={48} y={45} textAnchor="middle"
          fontSize={19} fontWeight={700} fill="var(--c-fg)" fontFamily="JetBrains Mono"
        >
          {Math.round(valor * 100)}
        </text>
        <text x={48} y={58} textAnchor="middle" fontSize={7.5} fill="var(--c-mute)" letterSpacing="0.1em">
          PROB %
        </text>
      </svg>

      <div className="min-w-0 flex-1">
        <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-mute">
          Rango creíble
        </p>
        <p className="tabular mt-0.5 text-[17px] font-semibold" style={{ color: 'var(--c-alt)' }}>
          {Math.round(min * 100)}–{Math.round(max * 100)}%
        </p>
        <p className="mt-1.5 text-[11px] leading-snug text-mute">
          Los dos topes del aro marcan hasta dónde llega la duda.
        </p>
      </div>
    </div>
  )
}
