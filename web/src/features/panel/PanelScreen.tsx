import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, Wallet, TrendingUp, ArrowUpRight } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { useApariencia } from '../../lib/theme'
import { nombreDe } from '../../lib/nombres'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, Badge, SectionHeader, FiloSuperior, Button } from '../../components/ui/primitives'
import { Cifra, StatTile, AvisoMuestra } from '../../components/ui/data'
import { Sparkline } from '../../components/charts'
import { TramaJauria, FiligranaN } from '../../components/brand/Illustrations'
import { resumen, curva, historial, picks } from '../../lib/mock/data'
import { formatearPesos, formatearCuota, formatearFechaCorta } from '../../lib/format'
import { listaEscalonada, elementoLista, tarjeta } from '../../design/motion'
import type { ResultadoPick } from '../../lib/types'

const tonoResultado: Record<ResultadoPick, 'win' | 'loss' | 'void' | 'acento'> = {
  ganada: 'win',
  perdida: 'loss',
  nula: 'void',
  invalidada: 'void',
  pendiente: 'acento',
}

/*
 * Panel — la pantalla de aterrizaje.
 * Responde en un vistazo a tres preguntas: cómo va el capital, qué emitió el
 * bot últimamente, y si esas cifras significan algo todavía (§7.4).
 */
export function PanelScreen() {
  const { tema } = useApariencia()
  const n = nombreDe('inicio', tema)
  const ultimas = [...historial, ...picks].slice(0, 5)

  return (
    <Pantalla>
      {/* Cabecera con trama decorativa detrás del saludo */}
      <div className="relative">
        <TramaJauria className="pointer-events-none absolute -top-6 right-0 h-24 w-2/3 opacity-70" />
        <TituloPantalla
          kicker={n.kicker}
          titulo="Hola,"
          destacado={tema === 'terreno' ? 'explorador' : 'Analista'}
          bajada="Resumen del capital, últimas alertas y estado de la jauría."
        />
      </div>

      {/* Baldosas principales */}
      <motion.div
        variants={listaEscalonada}
        initial="inicial"
        animate="entra"
        className="mt-5 grid grid-cols-2 gap-3"
      >
        <motion.div variants={elementoLista} className="col-span-2">
          <Card realce className="relative p-4">
            <FiloSuperior dorado />
            <FiligranaN className="pointer-events-none absolute -right-4 -top-4 size-28 text-fg" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
              Ganancia neta
            </p>
            <div className="mt-1.5 flex items-end justify-between gap-3">
              <div>
                <p className="texto-acento text-[34px] leading-none font-semibold">
                  <Cifra valor={resumen.unidades} decimales={2} signo sufijo=" u" />
                </p>
                <p className="mt-1.5 text-[12.5px] text-mute">
                  {formatearPesos(resumen.beneficio)} · {resumen.resueltas} resueltas
                </p>
              </div>
              <div className="w-24 shrink-0">
                <Sparkline datos={curva} />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={elementoLista}>
          <StatTile etiqueta="ROI" nota="Sobre lo apostado">
            <Cifra valor={resumen.roi * 100} decimales={1} signo sufijo="%" />
          </StatTile>
        </motion.div>

        <motion.div variants={elementoLista}>
          <StatTile etiqueta="CLV medio" nota="La métrica que de verdad predice" destacada>
            <Cifra valor={resumen.clvMedio * 100} decimales={1} signo sufijo="%" />
          </StatTile>
        </motion.div>

        <motion.div variants={elementoLista}>
          <StatTile etiqueta="Acierto" nota={`${resumen.ganadas} G · ${resumen.perdidas} P`}>
            <Cifra valor={(resumen.ganadas / (resumen.ganadas + resumen.perdidas)) * 100} decimales={1} sufijo="%" />
          </StatTile>
        </motion.div>

        <motion.div variants={elementoLista}>
          <StatTile etiqueta="Racha" nota="Consecutivas ganadas">
            <Cifra valor={resumen.rachaActual} />
          </StatTile>
        </motion.div>
      </motion.div>

      {/* Honestidad estadística: siempre visible mientras la muestra sea corta */}
      <motion.div variants={tarjeta} initial="inicial" animate="entra" className="mt-4">
        <AvisoMuestra n={resumen.resueltas} minimo={resumen.muestraMinima} />
      </motion.div>

      {/* Últimas alertas */}
      <section className="mt-8">
        <SectionHeader
          icono={<Send size={16} strokeWidth={1.6} />}
          titulo="Últimas alertas"
          descripcion="Lo que el motor emitió, con su estado actual."
          accion={
            <Link to="/historial" className="text-[12px] font-medium text-acento-alto">
              Ver todo
            </Link>
          }
        />

        <motion.ul
          variants={listaEscalonada}
          initial="inicial"
          animate="entra"
          className="mt-3 space-y-2"
        >
          {ultimas.map((p) => (
            <motion.li key={p.id} variants={elementoLista}>
              <Link to={`/detalle/${p.id}`}>
                <Card plano className="flex items-center gap-3 p-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-base">
                    ⚽
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-fg">{p.mercadoLegible}</p>
                    <p className="truncate text-[11.5px] text-mute">
                      {p.partido} · cuota {formatearCuota(p.cuotaPublicada)} ·{' '}
                      {formatearFechaCorta(p.fechaHoraISO)}
                    </p>
                  </div>
                  <Badge tono={tonoResultado[p.resultado]}>{p.resultado}</Badge>
                </Card>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* Capital */}
      <section className="mt-8">
        <SectionHeader
          icono={<Wallet size={16} strokeWidth={1.6} />}
          titulo="Tu capital"
          descripcion="Todo stake que ves se recalcula sobre esta cifra."
        />

        <Card className="mt-3 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="texto-acento text-[28px] leading-none font-semibold">
                {formatearPesos(resumen.capital)}
              </p>
              <p className="mt-1.5 text-[12px] text-mute">
                1 unidad = {formatearPesos(resumen.unidadValor)} · 1% del capital
              </p>
            </div>
            <Link to="/capital">
              <Button variante="contorno" className="min-h-10 px-3 text-[13px]">
                Editar
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Acceso rápido a rendimiento */}
      <section className="mt-4">
        <Link to="/rendimiento">
          <Card className="flex items-center gap-3 p-4">
            <span
              className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-acento-linea text-acento-alto"
              style={{ background: 'var(--grad-acento-suave)' }}
            >
              <TrendingUp size={16} strokeWidth={1.6} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium text-fg">Comparativa bot vs. tú</p>
              <p className="text-[12px] text-mute">Qué te costó saltarte apuestas, en pesos</p>
            </div>
            <ArrowUpRight size={16} className="shrink-0 text-mute" />
          </Card>
        </Link>
      </section>
    </Pantalla>
  )
}
