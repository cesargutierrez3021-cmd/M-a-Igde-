import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Radar, Trophy, Users } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, SectionHeader, Button } from '../../components/ui/primitives'
import { TarjetaSellado, BarraConsenso } from '../../components/comunidad/piezas'
import { useApariencia } from '../../lib/theme'
import { nombreDe, VOCABULARIO } from '../../lib/nombres'
import { feed, porId, consensos, tipsters } from '../../lib/mock/data'
import { listaEscalonada, elementoLista } from '../../design/motion'
import { cn } from '../../lib/utils'

type Filtro = 'todos' | 'siguiendo' | 'clv' | 'hoy'

const FILTROS: { valor: Filtro; etiqueta: string }[] = [
  { valor: 'todos', etiqueta: 'Todos' },
  { valor: 'siguiendo', etiqueta: 'Siguiendo' },
  { valor: 'clv', etiqueta: 'Mejor CLV' },
  { valor: 'hoy', etiqueta: 'Hoy' },
]

/** Simulación de a quién sigues. En producción viene del perfil. */
const SIGUIENDO = new Set(['u1', 'u2'])

/*
 * Comunidad — el feed de pronósticos sellados de la gente.
 *
 * Lo que lo separa de un foro: cada pronóstico lleva al lado el CLV histórico
 * de quien lo publicó, y el consenso del partido se contrasta siempre con la
 * posición del bot. Ser mayoría no da la razón, y la app lo dice.
 */
export function ComunidadScreen() {
  const { tema } = useApariencia()
  const n = nombreDe('comunidad', tema)
  const voz = VOCABULARIO[tema]

  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [copiados, setCopiados] = useState<Set<string>>(new Set())

  const visibles = useMemo(() => {
    switch (filtro) {
      case 'siguiendo':
        return feed.filter((p) => SIGUIENDO.has(p.autorId))
      case 'clv':
        return [...feed].sort((a, b) => (porId(b.autorId)?.clv ?? 0) - (porId(a.autorId)?.clv ?? 0))
      case 'hoy':
        return feed.filter((p) => p.resultado === 'pendiente')
      default:
        return feed
    }
  }, [filtro])

  return (
    <Pantalla>
      <TituloPantalla
        kicker={n.kicker}
        titulo={tema === 'terreno' ? 'La' : 'El'}
        destacado={tema === 'terreno' ? 'jauría' : 'escuadrón'}
        bajada={`${tipsters.length - 1} ${voz.miembros} · ${voz.cadaSellado} y liquidado solo.`}
      />

      {/* Filtros */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            className={cn(
              'shrink-0 rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-[12px] font-medium transition-colors',
              filtro === f.valor ? 'border-acento-linea text-acento-alto' : 'border-line text-mute'
            )}
            style={filtro === f.valor ? { background: 'var(--grad-acento-suave)' } : undefined}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      {/* Consenso: la pieza distintiva */}
      <section className="mt-5">
        <SectionHeader
          icono={<Radar size={16} strokeWidth={1.6} />}
          titulo={tema === 'terreno' ? 'Rastro colectivo' : 'Barrido colectivo'}
          descripcion={`Hacia dónde se inclina la gente, y qué dice ${voz.bot} en el mismo partido.`}
        />
        <motion.div variants={listaEscalonada} initial="inicial" animate="entra" className="mt-3 space-y-3">
          {consensos.map((c) => (
            <motion.div key={c.partido} variants={elementoLista}>
              <BarraConsenso consenso={c} nombreBot={voz.bot} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Feed */}
      <section className="mt-7">
        <SectionHeader
          icono={<Users size={16} strokeWidth={1.6} />}
          titulo={`Últimos ${voz.actividad}`}
          descripcion="Copiar sella a tu nombre con la cuota de ahora, no con la suya."
        />

        {visibles.length === 0 ? (
          <Card className="mt-3 p-6 text-center">
            <p className="text-[13px] text-mute">
              Nadie que sigas ha sellado nada todavía.
            </p>
          </Card>
        ) : (
          <motion.div
            key={filtro}
            variants={listaEscalonada}
            initial="inicial"
            animate="entra"
            className="mt-3 space-y-3"
          >
            {visibles.map((p) => (
              <motion.div key={p.id} variants={elementoLista}>
                <TarjetaSellado
                  pronostico={p}
                  autor={porId(p.autorId)!}
                  copiado={copiados.has(p.id)}
                  onCopiar={() => setCopiados((s) => new Set(s).add(p.id))}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <Link to="/clasificacion" className="mt-5 block">
        <Card className="flex items-center gap-3 p-4">
          <span
            className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-acento-linea text-acento-alto"
            style={{ background: 'var(--grad-acento-suave)' }}
          >
            <Trophy size={16} strokeWidth={1.6} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-fg">{nombreDe('clasificacion', tema).largo}</p>
            <p className="text-[11.5px] text-mute">Ordenada por CLV, no por aciertos</p>
          </div>
          <Button variante="contorno" className="min-h-9 px-3 text-[12px]">Ver</Button>
        </Card>
      </Link>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-mute">
        Ningún {voz.pronostico} publicado aquí se puede editar ni borrar después.
        <br />
        +18 · Juego responsable.
      </p>
    </Pantalla>
  )
}
