import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, Badge, FiloSuperior } from '../../components/ui/primitives'
import { Avatar, SelloVerificado } from '../../components/comunidad/piezas'
import { HuskyMark } from '../../components/brand/HuskyMark'
import { useApariencia } from '../../lib/theme'
import { nombreDe, VOCABULARIO } from '../../lib/nombres'
import { clasificacion, tuPuesto, MINIMO_RANKING, resumen } from '../../lib/mock/data'
import { formatearPorcentaje } from '../../lib/format'
import { cn } from '../../lib/utils'
import type { EntradaRanking } from '../../lib/types'

type Criterio = 'clv' | 'roi' | 'racha' | 'volumen'

const CRITERIOS: { valor: Criterio; etiqueta: string }[] = [
  { valor: 'clv', etiqueta: 'CLV' },
  { valor: 'roi', etiqueta: 'ROI' },
  { valor: 'racha', etiqueta: 'Racha' },
  { valor: 'volumen', etiqueta: 'Volumen' },
]

/*
 * Clasificación — ordenada por CLV, no por aciertos.
 *
 * Acertar mucho un mes es suerte; batir sistemáticamente a la cuota de cierre
 * no lo es. Es la misma métrica con la que NOAH se juzga a sí mismo, aplicada
 * a la comunidad. Umbral de entrada: 30 sellados.
 */
export function ClasificacionScreen() {
  const { tema } = useApariencia()
  const n = nombreDe('clasificacion', tema)
  const voz = VOCABULARIO[tema]

  const [criterio, setCriterio] = useState<Criterio>('clv')

  const ordenada = useMemo(() => {
    const valor = (e: EntradaRanking) => {
      switch (criterio) {
        case 'roi': return e.tipster.roi
        case 'racha': return e.tipster.racha
        case 'volumen': return e.tipster.sellados
        default: return e.tipster.clv
      }
    }
    return [...clasificacion]
      .sort((a, b) => valor(b) - valor(a))
      .map((e, i) => ({ ...e, puesto: i + 1 }))
  }, [criterio])

  const cifraDe = (e: EntradaRanking) => {
    switch (criterio) {
      case 'roi': return formatearPorcentaje(e.tipster.roi, 1)
      case 'racha': return String(e.tipster.racha)
      case 'volumen': return String(e.tipster.sellados)
      default: return formatearPorcentaje(e.tipster.clv, 1)
    }
  }

  return (
    <Pantalla>
      <TituloPantalla
        kicker={n.kicker}
        titulo="Quién llegó"
        destacado="más alto"
        bajada="Ordenado por CLV, no por aciertos. Acertar es fácil un mes; batir al cierre, no."
      />

      {/* Criterio */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {CRITERIOS.map((c) => (
          <button
            key={c.valor}
            onClick={() => setCriterio(c.valor)}
            className={cn(
              'shrink-0 rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-[12px] font-medium transition-colors',
              criterio === c.valor ? 'border-acento-linea text-acento-alto' : 'border-line text-mute'
            )}
            style={criterio === c.valor ? { background: 'var(--grad-acento-suave)' } : undefined}
          >
            {c.etiqueta}
          </button>
        ))}
      </div>

      {/* Tabla — las filas se mueven al reordenar, no se recargan */}
      <Card className="mt-4 overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-mute">
            {tema === 'terreno' ? 'Cima' : 'Cabecera'}
          </span>
          <span className="text-[10px] text-mute">mín. {MINIMO_RANKING} sellados</span>
        </div>

        <motion.ul layout className="divide-y divide-[var(--c-line)]">
          {ordenada.map((e) => (
            <motion.li
              key={e.tipster.id}
              layout
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            >
              <Link to={`/perfil/${e.tipster.id}`} className="flex items-center gap-3 px-4 py-3">
                <span
                  className={cn(
                    'tabular w-5 shrink-0 text-[14px] font-semibold',
                    e.puesto === 1 ? 'text-acento-alto' : 'text-mute'
                  )}
                >
                  {e.puesto}
                </span>
                <Avatar tipster={e.tipster} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[13.5px] font-semibold text-fg">
                      {e.tipster.alias}
                    </span>
                    {e.tipster.verificado && <SelloVerificado compacto />}
                  </div>
                  <p className="tabular text-[10.5px] text-mute">
                    {e.tipster.sellados} sellados · ROI {formatearPorcentaje(e.tipster.roi, 1)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={cn('tabular text-[15px] font-semibold', e.puesto === 1 ? 'text-acento-alto' : 'text-fg')}>
                    {cifraDe(e)}
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.1em] text-mute">
                    {CRITERIOS.find((c) => c.valor === criterio)?.etiqueta}
                  </p>
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {/* Tu fila, siempre visible aunque estés fuera */}
        <div
          className="flex items-center gap-3 border-t px-4 py-3"
          style={{ borderColor: 'var(--c-acento-linea)', background: 'var(--grad-acento-suave)' }}
        >
          <span className="tabular w-5 shrink-0 text-[14px] font-semibold text-acento-alto">
            {tuPuesto.puesto}
          </span>
          <Avatar tipster={tuPuesto.tipster} size={32} />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-fg">Tu posición</p>
            <p className="text-[10.5px] text-mute">
              {tuPuesto.tipster.sellados} sellados · te faltan{' '}
              <span className="tabular">{MINIMO_RANKING - tuPuesto.tipster.sellados}</span> para entrar
            </p>
          </div>
          <p className="tabular shrink-0 text-[15px] font-semibold text-acento-alto">
            {formatearPorcentaje(tuPuesto.tipster.clv, 1)}
          </p>
        </div>
      </Card>

      {/* El bot, fuera de concurso */}
      <Card className="mt-3 p-4">
        <FiloSuperior />
        <div className="flex items-center gap-3">
          <HuskyMark size={30} />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-fg">NOAH</p>
            <p className="tabular text-[10.5px] text-mute">
              {resumen.resueltas} sellados · ROI {formatearPorcentaje(resumen.roi, 1)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="tabular text-[15px] font-semibold text-acento-alto">
              {formatearPorcentaje(resumen.clvMedio, 1)}
            </p>
            <Badge tono="void" className="mt-1">no compite</Badge>
          </div>
        </div>
      </Card>

      <Card plano className="mt-3 p-4">
        <div className="flex gap-3">
          <Info size={15} className="mt-0.5 shrink-0 text-mute" strokeWidth={1.7} />
          <p className="text-[12px] leading-relaxed text-mute">
            Nadie entra con menos de {MINIMO_RANKING} {voz.pronosticos} sellados. Con menos que eso,
            un primer puesto es <span className="text-acento-alto">ruido con nombre propio</span> —
            la misma regla que NOAH se aplica a sí mismo con sus 100 apuestas.
          </p>
        </div>
      </Card>
    </Pantalla>
  )
}
