import { motion } from 'framer-motion'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import type { Pick } from '../../lib/types'
import { Link } from 'react-router-dom'

interface PickCardProps {
  pick: Pick
  esValorAlto: boolean // dispara el barrido dorado, manual §7.5
}

/*
 * Tarjeta de pronóstico — pantalla "Hoy" (manual §7.3 módulo 2).
 * Cuando el valor es alto, un barrido de luz dorada cruza la tarjeta una sola vez,
 * en 700ms: "es el único momento de la app en que el dorado se mueve".
 */
export function PickCard({ pick, esValorAlto }: PickCardProps) {
  const hora = new Date(pick.fechaHoraISO).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

  return (
    <Link to={`/detalle/${pick.id}`}>
      <Card className="relative overflow-hidden">
        {esValorAlto && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              background: 'linear-gradient(100deg, transparent 40%, color-mix(in srgb, var(--color-gold) 25%, transparent) 50%, transparent 60%)',
            }}
          />
        )}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">{pick.partido}</p>
            <p className="text-xs text-[var(--text-secondary)]">
              {pick.liga} · {hora}
            </p>
          </div>
          {esValorAlto && <Badge tono="gold">Valor alto</Badge>}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-xs text-[var(--text-secondary)]">{pick.mercado}</p>
            <p className="text-base font-semibold text-[var(--text-primary)]">{pick.seleccion}</p>
          </div>
          <div className="text-right">
            <p className="tabular text-lg font-semibold text-[var(--color-gold-lite)]">
              {pick.cuotaPublicada.toFixed(2)}
            </p>
            <p className="tabular text-xs text-[var(--text-secondary)]">
              edge {(pick.edgeRelativo * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span>Stake sugerido: <span className="tabular">{(pick.stakeSugerido * 100).toFixed(2)}%</span></span>
          <span>Incertidumbre: <span className="tabular">{(pick.incertidumbre * 100).toFixed(0)}%</span></span>
        </div>
      </Card>
    </Link>
  )
}
