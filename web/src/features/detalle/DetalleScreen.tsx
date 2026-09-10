import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Brain, Route, Scale, TriangleAlert } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { Card, Badge, SectionHeader, FiloSuperior, Divider, Kicker } from '../../components/ui/primitives'
import { Barra, MedidorConfianza, EscalaStake, Cifra } from '../../components/ui/data'
import { picks, historial } from '../../lib/mock/data'
import { formatearCuota, formatearPorcentaje, faltanPara } from '../../lib/format'
import { listaEscalonada, elementoLista, tarjeta } from '../../design/motion'

/*
 * Detalle del pronóstico — manual §7.3, módulo 3 (Premium).
 *
 * "El 'por qué' completo: qué modelos opinaron y cuánto, probabilidad calibrada
 * frente a cuota justa del mercado, edge absoluto y relativo, EV, incertidumbre,
 * evidencia, y la traza de decisión paso a paso."
 */
export function DetalleScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pick = [...picks, ...historial].find((p) => p.id === id)

  if (!pick) {
    return (
      <Pantalla>
        <p className="pt-12 text-center text-sm text-mute">Pronóstico no encontrado.</p>
      </Pantalla>
    )
  }

  const margenCasa = 1 / pick.cuotaJusta - 1 / pick.cuotaPublicada

  const traza: { paso: string; detalle: string }[] = [
    { paso: 'Datos validados', detalle: 'Cuotas de 12 casas · alineaciones no disponibles todavía' },
    { paso: 'Features con corte temporal', detalle: `as_of ${new Date(pick.fechaHoraISO).toLocaleDateString('es-CO')} · sin datos posteriores` },
    { paso: 'Modelos', detalle: `${pick.modelos.join(' · ')} — combinados por grupo de correlación` },
    { paso: 'Calibración aplicada', detalle: 'Isotónica por tabla, artefacto v2026.09.03' },
    { paso: 'De-vig (Shin)', detalle: `Margen de la casa retirado: ${formatearPorcentaje(margenCasa, 2)}` },
    { paso: 'Valor medido', detalle: `Edge relativo ${formatearPorcentaje(pick.edgeRelativo)} y absoluto ${formatearPorcentaje(pick.edgeAbsoluto)}` },
    { paso: 'Kelly simultáneo', detalle: `Cartera del día optimizada entera · stake ${pick.stakeEscala}/10` },
  ]

  return (
    <Pantalla>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex min-h-11 items-center gap-2 text-[13px] text-mute"
      >
        <ArrowLeft size={16} strokeWidth={1.7} />
        Volver
      </button>

      {/* Cabecera del pronóstico */}
      <motion.div variants={tarjeta} initial="inicial" animate="entra">
        <Card realce className="p-4">
          <FiloSuperior dorado />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Kicker>{pick.liga}</Kicker>
              <p className="mt-2.5 text-[14px] font-medium text-dim">{pick.partido}</p>
              <p className="text-[11.5px] text-mute">{faltanPara(pick.fechaHoraISO)}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-mute">Stake</p>
              <p className="tabular text-[15px] font-semibold text-fg">{pick.stakeEscala}/10</p>
              <div className="mt-1.5 flex justify-end">
                <EscalaStake nivel={pick.stakeEscala} />
              </div>
            </div>
          </div>

          <h1 className="display mt-4 text-[26px] leading-tight">
            <span className="gold-text">{pick.mercadoLegible}</span>
          </h1>

          <div className="mt-3 flex items-stretch gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-mute">
                Cuota publicada
              </p>
              <p className="tabular text-[22px] font-semibold text-fg">
                {formatearCuota(pick.cuotaPublicada)}
              </p>
              <p className="text-[11px] text-mute">{pick.casa}</p>
            </div>
            <Divider vertical />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-mute">
                Cuota justa
              </p>
              <p className="tabular text-[22px] font-semibold text-dim">
                {formatearCuota(pick.cuotaJusta)}
              </p>
              <p className="text-[11px] text-mute">tras de-vig</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Probabilidad con su rango — la incertidumbre se ve, no se esconde */}
      <section className="mt-6">
        <SectionHeader
          icono={<Scale size={16} strokeWidth={1.6} />}
          titulo="Probabilidad e incertidumbre"
          descripcion="La banda es el rango creíble, no un adorno: cuanto más ancha, menos evidencia."
        />

        <Card className="mt-3 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="gold-text text-[32px] leading-none font-semibold">
                <Cifra valor={pick.probabilidadCalibrada * 100} decimales={1} sufijo="%" />
              </p>
              <p className="mt-1 text-[12px] text-mute">probabilidad calibrada</p>
            </div>
            <MedidorConfianza valor={pick.confianzaConsenso} />
          </div>

          {/* Banda de rango */}
          <div className="mt-5">
            <div className="relative h-8">
              <div className="absolute inset-x-0 top-3.5 h-1 rounded-full bg-surface-3" />
              <motion.div
                className="absolute top-3.5 h-1 rounded-full"
                style={{
                  background: 'var(--grad-gold)',
                  left: `${pick.probabilidadMin * 100}%`,
                  right: `${100 - pick.probabilidadMax * 100}%`,
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.div
                className="absolute top-1.5 size-5 -translate-x-1/2 rounded-full border-2 border-canvas"
                style={{ left: `${pick.probabilidadCalibrada * 100}%`, background: 'var(--c-goldlite)' }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 420, damping: 24 }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-mute">
              <span className="tabular">{(pick.probabilidadMin * 100).toFixed(0)}%</span>
              <span>rango creíble</span>
              <span className="tabular">{(pick.probabilidadMax * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <Mini etiqueta="Edge rel." valor={formatearPorcentaje(pick.edgeRelativo)} dorado />
            <Mini etiqueta="Edge abs." valor={formatearPorcentaje(pick.edgeAbsoluto)} />
            <Mini etiqueta="EV" valor={formatearPorcentaje(pick.ev)} />
          </div>
        </Card>
      </section>

      {/* Modelos que opinaron */}
      <section className="mt-6">
        <SectionHeader
          icono={<Brain size={16} strokeWidth={1.6} />}
          titulo="Quién opinó"
          descripcion="Modelos del mismo grupo de correlación no cuentan como opiniones independientes."
        />

        <motion.div
          variants={listaEscalonada}
          initial="inicial"
          animate="entra"
          className="mt-3 space-y-2"
        >
          {pick.modelos.map((m, i) => {
            const peso = [0.42, 0.36, 0.22][i] ?? 0.2
            return (
              <motion.div key={m} variants={elementoLista}>
                <Card plano className="p-3.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-mono text-dim">{m}</span>
                    <span className="tabular font-semibold text-fg">
                      {formatearPorcentaje(peso, 0)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <Barra fraccion={peso} alto={4} />
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Traza de decisión */}
      <section className="mt-6">
        <SectionHeader
          icono={<Route size={16} strokeWidth={1.6} />}
          titulo="Traza de decisión"
          descripcion="Cada paso que llevó de los datos a este stake, en orden."
        />

        <Card className="mt-3 p-4">
          <ol className="relative space-y-4 pl-6">
            {/* Raíl vertical */}
            <span className="absolute left-[7px] top-1 bottom-1 w-px bg-line" aria-hidden />

            {traza.map((t, i) => (
              <motion.li
                key={t.paso}
                className="relative"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.05, duration: 0.26 }}
              >
                <span
                  className="absolute -left-6 top-1 size-[15px] rounded-full border-2 border-canvas"
                  style={{ background: 'var(--c-gold)' }}
                  aria-hidden
                />
                <p className="text-[13.5px] font-medium text-fg">{t.paso}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-mute">{t.detalle}</p>
              </motion.li>
            ))}
          </ol>
        </Card>
      </section>

      {/* Advertencia final */}
      <Card plano className="mt-6 p-4">
        <div className="flex gap-3">
          <TriangleAlert size={16} className="mt-0.5 shrink-0 text-mute" strokeWidth={1.6} />
          <p className="text-[12px] leading-relaxed text-mute">
            Esto es una probabilidad calibrada y una medida de valor frente a la cuota del mercado.
            No es una garantía de resultado, y NOAH no promete rentabilidad en ninguna pantalla.
          </p>
        </div>
      </Card>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge tono="void" className="font-mono">{pick.mercado}</Badge>
        <Badge tono="void">Incertidumbre {formatearPorcentaje(pick.incertidumbre, 0)}</Badge>
        {pick.clv !== undefined && (
          <Badge tono={pick.clv >= 0 ? 'win' : 'loss'}>
            CLV {formatearPorcentaje(pick.clv, 1)}
          </Badge>
        )}
      </div>
    </Pantalla>
  )
}

function Mini({ etiqueta, valor, dorado }: { etiqueta: string; valor: string; dorado?: boolean }) {
  return (
    <div className="rounded-[10px] border border-line bg-surface-2 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-mute">{etiqueta}</p>
      <p className={`tabular mt-0.5 text-[15px] font-semibold ${dorado ? 'text-goldlite' : 'text-fg'}`}>
        {valor}
      </p>
    </div>
  )
}
