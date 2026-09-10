import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Filter } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, Badge, Button } from '../../components/ui/primitives'
import { Segmented } from '../../components/ui/controls'
import { IlustracionVacio } from '../../components/brand/Illustrations'
import { historial } from '../../lib/mock/data'
import { formatearCuota, formatearFechaCorta, formatearPorcentaje } from '../../lib/format'
import { listaEscalonada, elementoLista } from '../../design/motion'
import type { ResultadoPick } from '../../lib/types'

type Filtro = 'todas' | 'ganada' | 'perdida' | 'nula'

const tono: Record<ResultadoPick, 'win' | 'loss' | 'void' | 'acento'> = {
  ganada: 'win',
  perdida: 'loss',
  nula: 'void',
  invalidada: 'void',
  pendiente: 'acento',
}

/* Historial — manual §7.3, módulo 7. Filtrable y exportable. */
export function HistorialScreen() {
  const [filtro, setFiltro] = useState<Filtro>('todas')

  const filas = useMemo(
    () => (filtro === 'todas' ? historial : historial.filter((h) => h.resultado === filtro)),
    [filtro]
  )

  return (
    <Pantalla>
      <TituloPantalla
        kicker="Todo lo liquidado"
        titulo="Historial"
        bajada="Cada apuesta resuelta, con la cuota que se consiguió y su CLV."
      />

      <div className="mt-4">
        <Segmented
          id="historial"
          valor={filtro}
          onChange={setFiltro}
          opciones={[
            { valor: 'todas', etiqueta: 'Todas' },
            { valor: 'ganada', etiqueta: 'Ganadas' },
            { valor: 'perdida', etiqueta: 'Perdidas' },
            { valor: 'nula', etiqueta: 'Nulas' },
          ]}
        />
      </div>

      {filas.length === 0 ? (
        <Card className="mt-5 p-6 text-center">
          <IlustracionVacio className="mx-auto w-full max-w-[200px] text-mute" />
          <p className="mt-3 text-[13px] text-mute">Nada en este filtro todavía.</p>
        </Card>
      ) : (
        <motion.ul
          variants={listaEscalonada}
          initial="inicial"
          animate="entra"
          key={filtro}
          className="mt-4 space-y-2"
        >
          {filas.map((h) => (
            <motion.li key={h.id} variants={elementoLista}>
              <Card plano className="p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11.5px] text-mute">
                      {formatearFechaCorta(h.fechaHoraISO)} · {h.liga}
                    </p>
                    <p className="mt-0.5 truncate text-[14px] font-medium text-fg">
                      {h.mercadoLegible}
                    </p>
                    <p className="truncate text-[11.5px] text-mute">{h.partido}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge tono={tono[h.resultado]}>{h.resultado}</Badge>
                    <p className="tabular mt-1.5 text-[13px] font-semibold text-fg">
                      {formatearCuota(h.cuotaPublicada)}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-3 border-t border-line pt-2.5 text-[11px]">
                  <span className="text-mute">
                    Apostada:{' '}
                    <span className={h.apostada ? 'text-fg' : 'text-mute'}>
                      {h.apostada ? 'sí' : 'no'}
                    </span>
                  </span>
                  {h.clv !== undefined && (
                    <span className="text-mute">
                      CLV{' '}
                      <span className={`tabular ${h.clv >= 0 ? 'text-win' : 'text-loss'}`}>
                        {formatearPorcentaje(h.clv, 1)}
                      </span>
                    </span>
                  )}
                </div>
              </Card>
            </motion.li>
          ))}
        </motion.ul>
      )}

      <div className="mt-5 flex gap-2">
        <Button variante="contorno" ancho icono={<Download size={15} strokeWidth={1.7} />}>
          Exportar CSV
        </Button>
        <Button variante="contorno" icono={<Filter size={15} strokeWidth={1.7} />} aria-label="Más filtros" />
      </div>
    </Pantalla>
  )
}
