import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Card, FiloSuperior } from './primitives'

/* ── Cifra con conteo animado ──────────────────────────────────────────────
 * Manual §7.5: de 0 al valor en 600ms con curva easeOut. Arranca cuando el
 * elemento entra en pantalla, no al montar, para que también se aprecie en
 * las tarjetas que están más abajo.
 */
interface CifraProps {
  valor: number
  decimales?: number
  prefijo?: string
  sufijo?: string
  signo?: boolean
  className?: string
}

export function Cifra({ valor, decimales = 0, prefijo = '', sufijo = '', signo, className }: CifraProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const visible = useInView(ref, { once: true, margin: '-40px' })
  const [actual, setActual] = useState(0)

  useEffect(() => {
    if (!visible) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActual(valor)
      return
    }
    let frame = 0
    let inicio: number | null = null
    const paso = (ts: number) => {
      if (inicio === null) inicio = ts
      const p = Math.min((ts - inicio) / 600, 1)
      setActual(valor * (1 - Math.pow(1 - p, 3)))
      if (p < 1) frame = requestAnimationFrame(paso)
    }
    frame = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(frame)
  }, [visible, valor])

  const prefijoSigno = signo && valor > 0 ? '+' : ''

  return (
    <span ref={ref} className={cn('tabular', className)}>
      {prefijoSigno}
      {prefijo}
      {actual.toFixed(decimales)}
      {sufijo}
    </span>
  )
}

/* ── Baldosa de métrica ───────────────────────────────────────────────────── */
interface StatTileProps {
  etiqueta: string
  children: ReactNode
  nota?: string
  destacada?: boolean
  className?: string
}

export function StatTile({ etiqueta, children, nota, destacada, className }: StatTileProps) {
  return (
    <Card className={cn('p-3.5', className)} realce={destacada}>
      <FiloSuperior dorado={destacada} />
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">{etiqueta}</p>
      <div
        className={cn(
          'mt-1.5 text-[26px] leading-none font-semibold',
          destacada ? 'texto-acento' : 'text-fg'
        )}
      >
        {children}
      </div>
      {nota && <p className="mt-1.5 text-[11px] leading-snug text-mute">{nota}</p>}
    </Card>
  )
}

/* ── Barra de progreso ─────────────────────────────────────────────────────
 * Se dibuja de izquierda a derecha al entrar. Acepta un tono para el caso
 * "consumido" (cupos de API) donde el verde significa holgura, no acierto.
 */
interface BarraProps {
  fraccion: number
  tono?: 'acento' | 'win' | 'loss' | 'neutro'
  alto?: number
}

const fondos: Record<string, string> = {
  acento: 'var(--grad-acento)',
  win: 'var(--c-win)',
  loss: 'var(--c-loss)',
  neutro: 'var(--c-dim)',
}

export function Barra({ fraccion, tono = 'acento', alto = 6 }: BarraProps) {
  const pct = Math.max(0, Math.min(1, fraccion)) * 100
  return (
    <div
      className="w-full overflow-hidden rounded-full bg-surface-3"
      style={{ height: alto }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: fondos[tono] }}
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}

/* ── Escala de stake (1-10) ────────────────────────────────────────────────
 * Diez puntos, se encienden en cascada. Comunica la magnitud de un vistazo
 * mejor que un número suelto, y deja claro que el stake es acotado.
 */
export function EscalaStake({ nivel, total = 10 }: { nivel: number; total?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Stake ${nivel} de ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full"
          style={{ background: i < nivel ? 'var(--c-acento-alto)' : 'var(--c-line-strong)' }}
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.03, duration: 0.2 }}
        />
      ))}
    </div>
  )
}

/* ── Medidor de confianza ──────────────────────────────────────────────────
 * Arco segmentado. Un arco dice "esto es una medida con techo" mucho mejor
 * que una barra recta, y evita que se lea como una promesa de acierto.
 */
export function MedidorConfianza({ valor, size = 84 }: { valor: number; size?: number }) {
  const segmentos = 20
  const encendidos = Math.round(valor * segmentos)
  const r = size / 2 - 8
  const centro = size / 2

  return (
    <div className="relative" style={{ width: size, height: size * 0.62 }}>
      <svg width={size} height={size * 0.62} viewBox={`0 0 ${size} ${size * 0.62}`}>
        {Array.from({ length: segmentos }, (_, i) => {
          const t = i / (segmentos - 1)
          const ang = Math.PI * (1 - t)
          const x1 = centro + Math.cos(ang) * (r - 6)
          const y1 = centro - 6 - Math.sin(ang) * (r - 6)
          const x2 = centro + Math.cos(ang) * r
          const y2 = centro - 6 - Math.sin(ang) * r
          return (
            <motion.line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i < encendidos ? 'var(--c-acento-alto)' : 'var(--c-line-strong)'}
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02, duration: 0.18 }}
            />
          )
        })}
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <span className="tabular text-lg font-semibold text-fg">{Math.round(valor * 100)}</span>
        <span className="text-[11px] text-mute">/100</span>
      </div>
    </div>
  )
}

/* ── Aviso de muestra insuficiente ────────────────────────────────────────
 * Regla de honestidad del manual §7.4: lo que no es concluyente se marca,
 * no se esconde. Este componente existe para que sea imposible olvidarlo.
 */
export function AvisoMuestra({ n, minimo }: { n: number; minimo: number }) {
  if (n >= minimo) return null
  return (
    <Card className="p-3.5" realce>
      <FiloSuperior dorado />
      <div className="flex gap-3">
        <span className="mt-0.5 text-acento-alto">⚠</span>
        <p className="text-[13px] leading-snug text-dim">
          <span className="font-semibold text-fg">Muestra insuficiente:</span> {n} de {minimo}{' '}
          apuestas resueltas. El ROI y el rendimiento todavía{' '}
          <span className="text-acento-alto">no son concluyentes</span> — no tomes decisiones con
          estas cifras.
        </p>
      </div>
      <div className="mt-3">
        <Barra fraccion={n / minimo} />
      </div>
    </Card>
  )
}
