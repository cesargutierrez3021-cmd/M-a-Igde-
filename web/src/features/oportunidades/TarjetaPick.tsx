import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Card, Badge, FiloSuperior } from '../../components/ui/primitives'
import { EscalaStake, Barra } from '../../components/ui/data'
import type { Pick } from '../../lib/types'
import { formatearCuota, formatearPorcentaje, faltanPara } from '../../lib/format'
import { elementoLista } from '../../design/motion'

/** Umbral de "valor alto" para el barrido dorado. Provisional en la interfaz;
 *  en producción llega calculado desde core/policy.py, nunca decidido aquí. */
const VALOR_ALTO = 0.15

const iconoDeporte: Record<string, string> = {
  futbol: '⚽',
  baloncesto: '🏀',
  tenis: '🎾',
}

/*
 * Tarjeta de oportunidad.
 *
 * El detalle de marca (manual §7.5): cuando el valor es alto, un barrido de luz
 * dorada cruza la tarjeta una sola vez en 700ms. Es el único momento de la app
 * en que el dorado se mueve — por eso significa algo.
 */
export function TarjetaPick({ pick, indice }: { pick: Pick; indice: number }) {
  const alto = pick.edgeRelativo >= VALOR_ALTO

  return (
    <motion.div variants={elementoLista}>
      <Link to={`/detalle/${pick.id}`} className="block">
        <Card realce={alto} className="p-0">
          <FiloSuperior dorado={alto} />

          {alto && (
            <motion.span
              className="pointer-events-none absolute inset-y-0 w-1/2"
              initial={{ x: '-120%' }}
              animate={{ x: '260%' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 + indice * 0.08 }}
              style={{
                background:
                  'linear-gradient(100deg, transparent, color-mix(in srgb, var(--c-acento-alto) 22%, transparent), transparent)',
              }}
            />
          )}

          {/* Encabezado: partido + escala de stake */}
          <div className="flex items-start justify-between gap-3 p-4 pb-3">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-line bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-dim">
                <span aria-hidden>{iconoDeporte[pick.deporte]}</span>
                <span className="truncate">{pick.partido}</span>
              </span>
              <p className="mt-1.5 text-[11.5px] text-mute">
                {pick.liga} · {faltanPara(pick.fechaHoraISO)}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-mute">
                Stake {pick.stakeEscala}/10
              </p>
              <div className="mt-1.5 flex justify-end">
                <EscalaStake nivel={pick.stakeEscala} />
              </div>
            </div>
          </div>

          {/* Selección: el dato protagonista */}
          <div className="px-4">
            <h3 className="display text-[21px] leading-tight">
              <span className="texto-acento">{pick.mercadoLegible}</span>
            </h3>
            <p className="mt-1 flex items-baseline gap-2 text-[12.5px] text-mute">
              <span>Cuota</span>
              <span className="tabular text-[15px] font-semibold text-fg">
                {formatearCuota(pick.cuotaPublicada)}
              </span>
              <span>· {pick.casa}</span>
            </p>
          </div>

          {/* Rejilla de métricas */}
          <div className="mt-3.5 grid grid-cols-2 gap-px bg-line">
            <Metrica etiqueta="Probabilidad" valor={formatearPorcentaje(pick.probabilidadCalibrada)} />
            <Metrica
              etiqueta="Ventaja"
              valor={formatearPorcentaje(pick.edgeRelativo)}
              dorado
            />
            <Metrica etiqueta="Valor esperado" valor={formatearPorcentaje(pick.ev)} />
            <Metrica
              etiqueta="Rango de prob."
              valor={`${(pick.probabilidadMin * 100).toFixed(0)}–${(pick.probabilidadMax * 100).toFixed(0)}%`}
            />
          </div>

          {/* Confianza del consenso + modelos que opinaron */}
          <div className="p-4 pt-3.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold uppercase tracking-[0.12em] text-mute">
                Confianza del consenso
              </span>
              <span className="tabular font-semibold text-acento-alto">
                {Math.round(pick.confianzaConsenso * 100)}/100
              </span>
            </div>
            <div className="mt-2">
              <Barra fraccion={pick.confianzaConsenso} alto={5} />
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {pick.modelos.map((m) => (
                  <Badge key={m} tono="void" className="font-mono text-[10px] font-medium">
                    {m}
                  </Badge>
                ))}
              </div>
              <ChevronRight size={16} className="shrink-0 text-mute" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}

function Metrica({ etiqueta, valor, dorado }: { etiqueta: string; valor: string; dorado?: boolean }) {
  return (
    <div className="bg-surface px-4 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-mute">{etiqueta}</p>
      <p className={`tabular mt-0.5 text-[17px] font-semibold ${dorado ? 'text-acento-alto' : 'text-fg'}`}>
        {valor}
      </p>
    </div>
  )
}
