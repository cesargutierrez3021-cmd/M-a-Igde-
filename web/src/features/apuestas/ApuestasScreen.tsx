import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bot, Ticket } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, Badge, SectionHeader, FiloSuperior } from '../../components/ui/primitives'
import { Cifra } from '../../components/ui/data'
import { Toggle } from '../../components/ui/controls'
import { picks, historial, resumen } from '../../lib/mock/data'
import { formatearCuota, formatearPesos, formatearUnidades } from '../../lib/format'
import { listaEscalonada, elementoLista } from '../../design/motion'

/*
 * Mis apuestas — manual §7.3, módulo 4 y parte del 6.
 *
 * Dos bloques comparados (tú frente al bot) y el registro de qué alertas
 * marcaste como apostadas. La diferencia entre ambos es el dato que de verdad
 * le importa al usuario: cuánto le costó saltarse apuestas.
 */
export function ApuestasScreen() {
  const [apostadas, setApostadas] = useState<Record<string, boolean>>({ h1: true, h2: true, h4: true })

  const marcadas = historial.filter((h) => apostadas[h.id])
  const ganadasUsuario = marcadas.filter((m) => m.resultado === 'ganada').length
  const resueltasUsuario = marcadas.filter((m) => m.resultado !== 'pendiente' && m.resultado !== 'nula').length

  return (
    <Pantalla>
      <TituloPantalla
        kicker="Tu registro personal"
        titulo="Mis"
        destacado="apuestas"
        bajada="Marca qué alertas apostaste. Comparamos tu resultado real con el del bot."
      />

      {/* Comparativa */}
      <div className="mt-5 space-y-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <BloqueComparativa
            icono={<User size={15} strokeWidth={1.7} />}
            titulo="Tú"
            subtitulo="Las que marcaste como apostadas"
            roi={resueltasUsuario ? (ganadasUsuario / resueltasUsuario) * 0.12 : 0}
            unidades={resumen.unidades * 0.62}
            pesos={resumen.beneficio * 0.62}
            acierto={resueltasUsuario ? ganadasUsuario / resueltasUsuario : 0}
            resueltas={resueltasUsuario}
            ganadas={ganadasUsuario}
            perdidas={resueltasUsuario - ganadasUsuario}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: 0.06 }}>
          <BloqueComparativa
            destacado
            icono={<Bot size={15} strokeWidth={1.7} />}
            titulo="Bot"
            subtitulo="Todas las alertas emitidas"
            roi={resumen.roi}
            unidades={resumen.unidades}
            pesos={resumen.beneficio}
            acierto={resumen.ganadas / (resumen.ganadas + resumen.perdidas)}
            resueltas={resumen.resueltas}
            ganadas={resumen.ganadas}
            perdidas={resumen.perdidas}
          />
        </motion.div>
      </div>

      {/* La brecha, explicada */}
      <Card plano className="mt-3 p-4">
        <p className="text-[12.5px] leading-relaxed text-mute">
          <span className="font-medium text-fg">La brecha:</span> seguiste{' '}
          <span className="tabular text-goldlite">{marcadas.length}</span> de{' '}
          <span className="tabular">{historial.length}</span> alertas. Saltarte el resto te dejó{' '}
          <span className="tabular text-goldlite">
            {formatearPesos(resumen.beneficio * 0.38)}
          </span>{' '}
          fuera — ni bueno ni malo por sí solo: con esta muestra todavía no es concluyente.
        </p>
      </Card>

      {/* Alertas para marcar */}
      <section className="mt-8">
        <SectionHeader
          icono={<Ticket size={16} strokeWidth={1.6} />}
          titulo="Alertas del bot"
          descripcion="Marca las que realmente apostaste, con la cuota que tú conseguiste."
        />

        <motion.ul
          variants={listaEscalonada}
          initial="inicial"
          animate="entra"
          className="mt-3 space-y-2"
        >
          {[...picks, ...historial].map((p) => {
            const marcada = apostadas[p.id] ?? false
            return (
              <motion.li key={p.id} variants={elementoLista}>
                <Card plano className="p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-base">
                      ⚽
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="truncate text-[11.5px] text-mute">{p.partido}</span>
                        <Badge
                          tono={
                            p.resultado === 'ganada'
                              ? 'win'
                              : p.resultado === 'perdida'
                                ? 'loss'
                                : p.resultado === 'pendiente'
                                  ? 'oro'
                                  : 'void'
                          }
                        >
                          {p.resultado}
                        </Badge>
                      </div>
                      <p className="mt-1 text-[14px] font-medium text-fg">{p.mercadoLegible}</p>
                      <p className="text-[11.5px] text-mute">
                        Cuota {formatearCuota(p.cuotaPublicada)} · stake del bot {p.stakeEscala}/10
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <Toggle
                        activo={marcada}
                        onChange={(v) => setApostadas((s) => ({ ...s, [p.id]: v }))}
                        etiqueta={`Marcar ${p.mercadoLegible} como apostada`}
                      />
                      <p className="text-[10px] text-mute">Aposté</p>
                    </div>
                  </div>

                  {/* Al marcarla, se pide la cuota e importe reales */}
                  {marcada && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
                        <Campo etiqueta="Importe" sufijo="COP" defecto="25000" />
                        <Campo etiqueta="Cuota real" defecto={p.cuotaPublicada.toFixed(2)} />
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.li>
            )
          })}
        </motion.ul>
      </section>
    </Pantalla>
  )
}

function BloqueComparativa({
  icono,
  titulo,
  subtitulo,
  roi,
  unidades,
  pesos,
  acierto,
  resueltas,
  ganadas,
  perdidas,
  destacado,
}: {
  icono: React.ReactNode
  titulo: string
  subtitulo: string
  roi: number
  unidades: number
  pesos: number
  acierto: number
  resueltas: number
  ganadas: number
  perdidas: number
  destacado?: boolean
}) {
  return (
    <Card realce={destacado} className="p-4">
      <FiloSuperior dorado={destacado} />
      <div className="flex items-center gap-2">
        <span
          className={`grid size-7 place-items-center rounded-[8px] border ${destacado ? 'border-gold-line text-goldlite' : 'border-line text-mute'}`}
          style={destacado ? { background: 'var(--grad-gold-soft)' } : undefined}
        >
          {icono}
        </span>
        <div>
          <p className="text-[13px] font-semibold text-fg">{titulo}</p>
          <p className="text-[11px] text-mute">{subtitulo}</p>
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-3">
        <Dato etiqueta="ROI" dorado={destacado}>
          <Cifra valor={roi * 100} decimales={1} signo sufijo="%" />
        </Dato>
        <Dato etiqueta="Beneficio">
          <span className="tabular">{formatearUnidades(unidades)}</span>
          <span className="ml-1.5 text-[11px] font-normal text-mute">{formatearPesos(pesos)}</span>
        </Dato>
        <Dato etiqueta="Acierto">
          <Cifra valor={acierto * 100} decimales={1} sufijo="%" />
        </Dato>
        <Dato etiqueta="Resueltas">
          <span className="tabular">{resueltas}</span>
          <span className="ml-1.5 text-[11px] font-normal text-mute">
            {ganadas} G · {perdidas} P
          </span>
        </Dato>
      </div>
    </Card>
  )
}

function Dato({
  etiqueta,
  children,
  dorado,
}: {
  etiqueta: string
  children: React.ReactNode
  dorado?: boolean
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-mute">{etiqueta}</p>
      <p className={`mt-0.5 text-[19px] font-semibold ${dorado ? 'gold-text' : 'text-fg'}`}>
        {children}
      </p>
    </div>
  )
}

function Campo({ etiqueta, defecto, sufijo }: { etiqueta: string; defecto: string; sufijo?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-mute">
        {etiqueta}
      </span>
      <span className="mt-1 flex items-center rounded-[var(--radius-btn)] border border-line bg-surface px-2.5">
        <input
          type="number"
          defaultValue={defecto}
          className="tabular min-h-10 w-full bg-transparent text-[14px] text-fg outline-none"
        />
        {sufijo && <span className="ml-1 text-[11px] text-mute">{sufijo}</span>}
      </span>
    </label>
  )
}
