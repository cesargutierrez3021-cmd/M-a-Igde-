import { Header } from '../../components/shell/Header'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { picksDeHoy } from '../../lib/mock/data'
import type { ResultadoPick } from '../../lib/types'

const tonoResultado: Record<ResultadoPick, 'win' | 'loss' | 'void' | 'silver'> = {
  ganada: 'win',
  perdida: 'loss',
  nula: 'void',
  pendiente: 'silver',
}

/* Historial — manual §7.3 módulo 7. Filtrable y exportable a CSV (pendiente de API real). */
export function HistorialScreen() {
  return (
    <>
      <Header titulo="Historial" />
      <main className="space-y-2 p-4 pb-24">
        {picksDeHoy.map((pick) => (
          <Card key={pick.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{pick.partido}</p>
              <p className="text-xs text-[var(--text-secondary)]">{pick.mercado} · {pick.seleccion}</p>
            </div>
            <Badge tono={tonoResultado[pick.resultado]}>{pick.resultado}</Badge>
          </Card>
        ))}
        <button className="mt-2 w-full rounded-[var(--radius-button)] border border-[var(--border-subtle)] py-2.5 text-sm text-[var(--text-secondary)]">
          Exportar a CSV
        </button>
      </main>
    </>
  )
}
