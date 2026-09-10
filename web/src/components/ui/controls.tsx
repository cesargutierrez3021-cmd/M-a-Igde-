import { type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { hoja, velo } from '../../design/motion'

/* ── Interruptor ──────────────────────────────────────────────────────────
 * El pomo se desplaza con muelle; el carril se rellena en dorado. 44px de
 * objetivo táctil aunque el control dibujado sea menor (manual §7.5).
 */
interface ToggleProps {
  activo: boolean
  onChange: (v: boolean) => void
  etiqueta: string
}

export function Toggle({ activo, onChange, etiqueta }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={etiqueta}
      onClick={() => onChange(!activo)}
      className="grid h-11 w-14 shrink-0 place-items-center"
    >
      <span
        className={cn(
          'flex h-7 w-12 items-center rounded-full border p-0.5 transition-colors',
          activo ? 'border-acento-linea' : 'border-line bg-surface-3'
        )}
        style={activo ? { background: 'var(--grad-acento)' } : undefined}
      >
        <motion.span
          className="size-6 rounded-full"
          style={{ background: activo ? 'var(--btn-fg)' : 'var(--c-mute)' }}
          animate={{ x: activo ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 32 }}
        />
      </span>
    </button>
  )
}

/* ── Selector segmentado ──────────────────────────────────────────────────
 * El indicador dorado viaja entre opciones con layoutId, en vez de aparecer
 * y desaparecer. Es el detalle que hace que se sienta una app y no una web.
 */
interface SegmentedProps<T extends string> {
  opciones: { valor: T; etiqueta: string; icono?: ReactNode }[]
  valor: T
  onChange: (v: T) => void
  id: string
}

export function Segmented<T extends string>({ opciones, valor, onChange, id }: SegmentedProps<T>) {
  return (
    <div className="flex rounded-[var(--radius-pill)] border border-line bg-surface-2 p-1">
      {opciones.map((op) => {
        const activo = op.valor === valor
        return (
          <button
            key={op.valor}
            onClick={() => onChange(op.valor)}
            className={cn(
              'relative flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] px-3 text-[13px] font-medium transition-colors',
              activo ? '' : 'text-mute'
            )}
          >
            {activo && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-[var(--radius-pill)]"
                style={{ background: 'var(--grad-acento)' }}
                transition={{ type: 'spring', stiffness: 480, damping: 38 }}
              />
            )}
            <span
              className="relative flex items-center gap-1.5"
              style={activo ? { color: 'var(--btn-fg)' } : undefined}
            >
              {op.icono}
              {op.etiqueta}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ── Hoja inferior ────────────────────────────────────────────────────────── */
interface SheetProps {
  abierta: boolean
  onCerrar: () => void
  titulo: string
  children: ReactNode
}

export function Sheet({ abierta, onCerrar, titulo, children }: SheetProps) {
  return (
    <AnimatePresence>
      {abierta && (
        <>
          <motion.div
            variants={velo}
            initial="inicial"
            animate="entra"
            exit="sale"
            onClick={onCerrar}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
          />
          <motion.div
            variants={hoja}
            initial="inicial"
            animate="entra"
            exit="sale"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => info.offset.y > 90 && onCerrar()}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-[22px] border-t border-acento-linea bg-surface pb-[calc(env(safe-area-inset-bottom)+16px)]"
          >
            <div className="flex justify-center pt-3">
              <span className="h-1 w-10 rounded-full bg-line-strong" />
            </div>
            <h3 className="display px-5 pt-3 pb-1 text-base text-fg">{titulo}</h3>
            <div className="px-5 pt-2">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Fila de ajuste ───────────────────────────────────────────────────────── */
export function FilaAjuste({
  titulo,
  descripcion,
  control,
  icono,
}: {
  titulo: string
  descripcion?: string
  control: ReactNode
  icono?: ReactNode
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      {icono && <span className="shrink-0 text-mute">{icono}</span>}
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-fg">{titulo}</p>
        {descripcion && <p className="mt-0.5 text-[12px] leading-snug text-mute">{descripcion}</p>}
      </div>
      {control}
    </div>
  )
}
