import { useState } from 'react'
import { useApariencia, type Tema } from '../../lib/theme'
import { Boton } from '../../components/ui/primitives'
import { cn } from '../../lib/utils'

const OPCIONES: { tema: Tema; titulo: string; bajada: string; muestra: string[] }[] = [
  {
    tema: 'dorado',
    titulo: 'Dorado',
    bajada: 'Papel marfil, serifa y oro. El tuyo, tal cual lo mostraste.',
    muestra: ['#F7F4EC', '#B8860B', '#1B1712'],
  },
  {
    tema: 'mando',
    titulo: 'Puesto de mando',
    bajada: 'Instrumental, negro y cian. El mismo lenguaje de NOAH.',
    muestra: ['#060B14', '#35E0FF', '#f0b429'],
  },
]

export function EleccionApariencia() {
  const { tema, fijarTema, modo, fijarModo, confirmarEleccion } = useApariencia()
  const [seleccion, setSeleccion] = useState<Tema>(tema)

  return (
    <div className="relative z-10 flex min-h-dvh flex-col justify-center px-6 py-10">
      <p className="wordmark text-center text-[15px] text-acento-alto">NOAH</p>
      <h1 className="display mt-3 text-center text-[24px] font-semibold text-fg">Elige cómo se ve tu app</h1>
      <p className="mt-2 text-center text-[13px] leading-relaxed text-mute">
        Lo cambias cuando quieras desde Ajustes.
      </p>

      <div className="mt-8 space-y-3">
        {OPCIONES.map((op) => (
          <button
            key={op.tema}
            onClick={() => {
              setSeleccion(op.tema)
              fijarTema(op.tema)
            }}
            className={cn(
              'w-full rounded-[16px] border p-4 text-left transition-colors',
              seleccion === op.tema ? 'border-acento-linea' : 'border-line'
            )}
            style={seleccion === op.tema ? { background: 'var(--grad-acento-suave)' } : undefined}
          >
            <div className="flex items-center justify-between">
              <p className="display text-[16px] font-semibold text-fg">{op.titulo}</p>
              <div className="flex -space-x-1.5">
                {op.muestra.map((c) => (
                  <span key={c} className="size-5 rounded-full border-2 border-surface" style={{ background: c }} />
                ))}
              </div>
            </div>
            <p className="mt-1 text-[12.5px] text-mute">{op.bajada}</p>
          </button>
        ))}
      </div>

      {seleccion === 'dorado' && (
        <div className="mt-4 flex gap-2">
          {(['claro', 'oscuro'] as const).map((m) => (
            <button
              key={m}
              onClick={() => fijarModo(m)}
              className={cn(
                'flex-1 rounded-[var(--radius-btn)] border py-2.5 text-[13px] font-medium capitalize',
                modo === m ? 'border-acento-linea text-acento-alto' : 'border-line text-dim'
              )}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      <Boton className="mt-8" onClick={confirmarEleccion}>
        Continuar
      </Boton>
    </div>
  )
}
