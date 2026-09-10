import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { HuskyMark } from '../../components/brand/HuskyMark'
import { TramaJauria } from '../../components/brand/Illustrations'
import { VistaPrevia } from '../../components/brand/VistaPrevia'
import { Button } from '../../components/ui/primitives'
import { useApariencia, TEMAS, MODOS, type Tema, type Modo } from '../../lib/theme'
import { cn } from '../../lib/utils'

const ORDEN_TEMAS: Tema[] = ['terreno', 'mando']
const ORDEN_MODOS: Modo[] = ['oscuro', 'claro']

/*
 * Bienvenida — se muestra una sola vez, en el primer arranque.
 *
 * Elegir apariencia es lo primero que hace el usuario porque el resto de la app
 * se ve distinta según lo que escoja. Las miniaturas pintan con los colores
 * reales de cada combinación, y el tema se aplica en vivo al tocarlo: lo que
 * ves detrás de la tarjeta ya es el tema que estás eligiendo.
 */
export function BienvenidaScreen() {
  const { tema, modo, fijarTema, fijarModo, confirmarEleccion } = useApariencia()

  return (
    <div className="relative z-10 flex min-h-dvh flex-col">
      <TramaJauria className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-70" />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="float-slow inline-block">
            <HuskyMark size={52} vivo />
          </div>
          <h1 className="display mt-4 text-[26px] leading-tight">
            Elige cómo quieres ver <span className="texto-acento">NOAH</span>
          </h1>
          <p className="mx-auto mt-2.5 max-w-[34ch] text-[12.5px] leading-relaxed text-mute">
            Dos lenguajes distintos, cada uno con su versión clara y oscura. Se cambia cuando
            quieras.
          </p>
        </motion.div>

        <div className="mt-8 space-y-3">
          {ORDEN_TEMAS.map((t, i) => {
            const activo = tema === t
            return (
              <motion.button
                key={t}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.36, delay: 0.08 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                whileTap={{ scale: 0.985 }}
                onClick={() => fijarTema(t)}
                aria-pressed={activo}
                className={cn(
                  'w-full rounded-[var(--radius-card)] border p-3.5 text-left transition-colors',
                  activo ? 'border-acento-linea' : 'border-line'
                )}
                style={{ background: activo ? 'var(--grad-acento-suave)' : 'var(--c-surface-2)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="display text-[16px] text-fg">{TEMAS[t].nombre}</p>
                    <p className="mt-0.5 text-[11.5px] text-mute">{TEMAS[t].descripcion}</p>
                  </div>
                  {activo && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 480, damping: 22 }}
                      className="grid size-5 shrink-0 place-items-center rounded-full"
                      style={{ background: 'var(--grad-acento)' }}
                    >
                      <Check size={12} strokeWidth={3} color="var(--btn-fg)" />
                    </motion.span>
                  )}
                </div>

                {/* Las dos versiones del tema: tocar una elige tema y modo a la vez */}
                <div className="mt-3 flex gap-2.5">
                  {ORDEN_MODOS.map((m) => {
                    const elegida = activo && modo === m
                    return (
                      <span
                        key={m}
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation()
                          fijarTema(t)
                          fijarModo(m)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation()
                            fijarTema(t)
                            fijarModo(m)
                          }
                        }}
                        className={cn(
                          'flex-1 rounded-[8px] border p-1.5 transition-colors',
                          elegida ? 'border-acento-linea' : 'border-transparent'
                        )}
                      >
                        <VistaPrevia tema={t} modo={m} />
                        <span
                          className={cn(
                            'mt-1.5 block text-center text-[9.5px] font-semibold uppercase tracking-[0.14em]',
                            elegida ? 'text-acento-alto' : 'text-mute'
                          )}
                        >
                          {MODOS[m].nombre}
                        </span>
                      </span>
                    )
                  })}
                </div>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-auto pt-8">
          <Button variante="acento" ancho onClick={confirmarEleccion}>
            Entrar a NOAH
          </Button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-mute">
            El tema se cambia en Ajustes. El claro y el oscuro, con el botón de la cabecera.
          </p>
        </div>
      </div>
    </div>
  )
}
