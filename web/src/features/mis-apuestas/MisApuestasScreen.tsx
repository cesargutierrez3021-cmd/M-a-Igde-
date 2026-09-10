import { useState } from 'react'
import { Header } from '../../components/shell/Header'
import { Card } from '../../components/ui/card'
import { picksDeHoy } from '../../lib/mock/data'
import { cn } from '../../lib/utils'

/*
 * "Mis apuestas" — manual §7.3 módulo 4.
 * Botones Aposté/No aposté con importe y cuota reales editables (el usuario pudo
 * haber tomado otra cuota que la publicada). Liquidación automática al cerrar el partido.
 */
export function MisApuestasScreen() {
  const [estado, setEstado] = useState<Record<string, boolean | null>>({})

  return (
    <>
      <Header titulo="Mis apuestas" />
      <main className="space-y-3 p-4 pb-24">
        {picksDeHoy.map((pick) => {
          const marcado = estado[pick.id] ?? null
          return (
            <Card key={pick.id}>
              <p className="text-sm font-medium">{pick.partido}</p>
              <p className="text-xs text-[var(--text-secondary)]">{pick.mercado} · {pick.seleccion}</p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setEstado((s) => ({ ...s, [pick.id]: true }))}
                  className={cn(
                    'min-h-11 flex-1 rounded-[var(--radius-button)] border text-sm font-medium transition-colors',
                    marcado === true
                      ? 'border-[var(--color-win)] bg-[color-mix(in_srgb,var(--color-win)_16%,transparent)] text-[var(--color-win)]'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  )}
                >
                  Aposté
                </button>
                <button
                  onClick={() => setEstado((s) => ({ ...s, [pick.id]: false }))}
                  className={cn(
                    'min-h-11 flex-1 rounded-[var(--radius-button)] border text-sm font-medium transition-colors',
                    marcado === false
                      ? 'border-[var(--color-void)] bg-[color-mix(in_srgb,var(--color-void)_20%,transparent)] text-[var(--text-secondary)]'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  )}
                >
                  No aposté
                </button>
              </div>

              {marcado === true && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <label className="text-xs text-[var(--text-secondary)]">
                    Importe
                    <input
                      type="number"
                      placeholder="0"
                      className="mt-1 w-full rounded-[var(--radius-button)] border border-[var(--border-subtle)] bg-transparent px-2 py-2 text-sm tabular"
                    />
                  </label>
                  <label className="text-xs text-[var(--text-secondary)]">
                    Cuota real tomada
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={pick.cuotaPublicada}
                      className="mt-1 w-full rounded-[var(--radius-button)] border border-[var(--border-subtle)] bg-transparent px-2 py-2 text-sm tabular"
                    />
                  </label>
                </div>
              )}
            </Card>
          )
        })}
      </main>
    </>
  )
}
