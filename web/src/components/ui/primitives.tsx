import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { pulsable } from '../../design/motion'

/* ── Tarjeta ────────────────────────────────────────────────────────────────
 * Manual §7.5: elevación por contraste de superficie y un borde superior más
 * claro, nunca por sombra difusa. `realce` añade el filo dorado que se reserva
 * para lo que de verdad importa.
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  realce?: boolean
  plano?: boolean
}

export function Card({ className, realce, plano, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-card)] border',
        plano ? 'bg-surface-2' : 'bg-[image:var(--grad-surface)]',
        realce ? 'border-gold-line' : 'border-line',
        className
      )}
      style={{ boxShadow: realce ? 'var(--glow-gold)' : 'var(--shadow-card)' }}
      {...props}
    />
  )
}

/** Filo superior luminoso: la única "sombra" que usa el sistema. */
export function FiloSuperior({ dorado = false }: { dorado?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-px"
      style={{
        background: dorado
          ? 'var(--grad-hairline)'
          : 'linear-gradient(90deg, transparent, var(--c-line-strong), transparent)',
      }}
    />
  )
}

/* ── Cabecera de sección ───────────────────────────────────────────────────
 * Icono dentro de un cuadro con borde dorado tenue + título en Sora.
 * Es el patrón que da ritmo a las pantallas largas.
 */
interface SectionHeaderProps {
  icono: ReactNode
  titulo: string
  descripcion?: string
  accion?: ReactNode
}

export function SectionHeader({ icono, titulo, descripcion, accion }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-gold-line text-goldlite"
        style={{ background: 'var(--grad-gold-soft)' }}
      >
        {icono}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="display text-[17px] text-fg">{titulo}</h2>
        {descripcion && <p className="mt-0.5 text-[13px] leading-snug text-mute">{descripcion}</p>}
      </div>
      {accion}
    </div>
  )
}

/* ── Etiqueta ─────────────────────────────────────────────────────────────── */
type Tono = 'oro' | 'win' | 'loss' | 'void' | 'neutro'

const tonos: Record<Tono, string> = {
  oro: 'text-goldlite border-gold-line bg-[image:var(--grad-gold-soft)]',
  win: 'text-win border-[color-mix(in_srgb,var(--c-win)_35%,transparent)] bg-[color-mix(in_srgb,var(--c-win)_12%,transparent)]',
  loss: 'text-loss border-[color-mix(in_srgb,var(--c-loss)_35%,transparent)] bg-[color-mix(in_srgb,var(--c-loss)_12%,transparent)]',
  void: 'text-mute border-line bg-surface-3',
  neutro: 'text-dim border-line bg-surface-2',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tono?: Tono
}

export function Badge({ className, tono = 'neutro', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-pill)] border px-2.5 py-1 text-[11px] font-semibold',
        tonos[tono],
        className
      )}
      {...props}
    />
  )
}

/** Píldora de encabezado de pantalla: "MÁX. 3 AL DÍA", "MOTOR DEL BOT". */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-[var(--radius-pill)] border border-gold-line px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-goldlite"
      style={{ background: 'var(--grad-gold-soft)' }}
    >
      {children}
    </span>
  )
}

/* ── Botón ────────────────────────────────────────────────────────────────── */
type Variante = 'oro' | 'contorno' | 'fantasma' | 'peligro'

const variantes: Record<Variante, string> = {
  oro: 'text-[#12140F] font-semibold',
  contorno: 'border border-line-strong text-fg bg-surface-2',
  fantasma: 'text-dim',
  peligro:
    'border border-[color-mix(in_srgb,var(--c-loss)_40%,transparent)] text-loss bg-[color-mix(in_srgb,var(--c-loss)_10%,transparent)]',
}

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variante?: Variante
  ancho?: boolean
  icono?: ReactNode
}

export function Button({
  className,
  variante = 'contorno',
  ancho,
  icono,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      {...pulsable}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-btn)] px-4 text-sm transition-colors',
        'disabled:pointer-events-none disabled:opacity-45',
        variantes[variante],
        ancho && 'w-full',
        className
      )}
      style={variante === 'oro' ? { background: 'var(--grad-gold)' } : undefined}
      {...props}
    >
      {icono}
      {children}
    </motion.button>
  )
}

/* ── Separador ───────────────────────────────────────────────────────────── */
export function Divider({ dorado, vertical }: { dorado?: boolean; vertical?: boolean }) {
  if (vertical) {
    return <div className="w-px self-stretch shrink-0" style={{ background: 'var(--c-line)' }} />
  }
  return (
    <div
      className="h-px w-full"
      style={{ background: dorado ? 'var(--grad-hairline)' : 'var(--c-line)' }}
    />
  )
}

/* ── Esqueleto de carga ──────────────────────────────────────────────────── */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />
}

/** Punto de estado con anillo que se expande. Comunica "vivo", no decora. */
export function PuntoEstado({ estado }: { estado: 'correcto' | 'atencion' | 'critico' }) {
  const color =
    estado === 'correcto' ? 'var(--c-win)' : estado === 'atencion' ? 'var(--c-gold)' : 'var(--c-loss)'
  return (
    <span className="relative grid size-2.5 shrink-0 place-items-center">
      <span className="absolute size-2.5 rounded-full" style={{ background: color }} />
      {estado !== 'critico' && (
        <span
          className="pulse-ring absolute size-2.5 rounded-full"
          style={{ background: color, opacity: 0.5 }}
        />
      )}
      {estado === 'critico' && (
        <span className="breathe absolute size-2.5 rounded-full" style={{ background: color }} />
      )}
    </span>
  )
}
