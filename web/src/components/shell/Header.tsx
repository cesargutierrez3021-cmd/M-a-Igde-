import { Moon, Sun, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { Logotipo } from '../brand/HuskyMark'
import { useApariencia } from '../../lib/theme'
import { pulsable } from '../../design/motion'

/*
 * Cabecera fija. Mantiene la marca siempre visible y ofrece lo único que el
 * usuario necesita desde cualquier pantalla: cambiar de tema y salir.
 * El fondo lleva desenfoque para que el contenido pase por debajo sin chocar.
 */
export function Header({ onSalir }: { onSalir?: () => void }) {
  const { modo, alternarModo } = useApariencia()

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <Logotipo size={26} />

        <div className="flex items-center gap-1">
          <motion.button
            {...pulsable}
            onClick={alternarModo}
            aria-label={modo === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="relative grid size-10 place-items-center rounded-full border border-line text-dim"
          >
            <motion.span
              key={modo}
              initial={{ rotate: -70, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="grid place-items-center"
            >
              {modo === 'oscuro' ? <Sun size={17} strokeWidth={1.6} /> : <Moon size={17} strokeWidth={1.6} />}
            </motion.span>
          </motion.button>

          {onSalir && (
            <motion.button
              {...pulsable}
              onClick={onSalir}
              aria-label="Cerrar sesión"
              className="grid size-10 place-items-center rounded-full border border-line text-dim"
            >
              <LogOut size={16} strokeWidth={1.6} />
            </motion.button>
          )}
        </div>
      </div>
    </header>
  )
}

/*
 * Encabezado de pantalla: píldora + titular grande + bajada.
 * Es lo que da jerarquía editorial y evita que todas las pantallas
 * empiecen igual de planas.
 */
export function TituloPantalla({
  kicker,
  titulo,
  destacado,
  bajada,
}: {
  kicker: string
  titulo: string
  destacado?: string
  bajada?: string
}) {
  return (
    <div className="pb-1">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
      >
        <span
          className="inline-flex items-center rounded-[var(--radius-pill)] border border-acento-linea px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-acento-alto"
          style={{ background: 'var(--grad-acento-suave)' }}
        >
          {kicker}
        </span>
      </motion.div>

      <motion.h1
        className="display mt-3 text-[30px] text-fg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26, delay: 0.04 }}
      >
        {titulo}
        {destacado && <span className="texto-acento"> {destacado}</span>}
      </motion.h1>

      {bajada && (
        <motion.p
          className="mt-2 text-[13.5px] leading-relaxed text-mute"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.26, delay: 0.08 }}
        >
          {bajada}
        </motion.p>
      )}
    </div>
  )
}
