import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Card } from '../../components/ui/card'
import { picksDeHoy } from '../../lib/mock/data'

/*
 * Detalle del pronóstico — manual §7.3 módulo 3, acceso Premium.
 * "El 'por qué' completo (...) Es la pantalla que separa NOAH de un canal de tips."
 */
export function DetalleScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pick = picksDeHoy.find((p) => p.id === id)

  if (!pick) {
    return (
      <div className="p-4">
        <p className="text-sm text-[var(--text-secondary)]">Pronóstico no encontrado.</p>
      </div>
    )
  }

  const filas: [string, string][] = [
    ['Probabilidad calibrada', `${(pick.probabilidadCalibrada * 100).toFixed(1)}%`],
    ['Cuota justa (de-vig Shin)', pick.cuotaJusta.toFixed(2)],
    ['Cuota publicada', pick.cuotaPublicada.toFixed(2)],
    ['Edge relativo', `${(pick.edgeRelativo * 100).toFixed(1)}%`],
    ['Edge absoluto', `${(pick.edgeAbsoluto * 100).toFixed(1)}%`],
    ['EV', `${(pick.ev * 100).toFixed(1)}%`],
    ['Incertidumbre', `${(pick.incertidumbre * 100).toFixed(0)}%`],
    ['Stake sugerido (Kelly simultáneo)', `${(pick.stakeSugerido * 100).toFixed(2)}%`],
  ]

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg)]/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate(-1)} aria-label="Volver" className="flex h-11 w-11 items-center justify-center">
          <ArrowLeft size={20} className="text-[var(--text-secondary)]" />
        </button>
        <h1 className="text-sm font-medium">{pick.partido}</h1>
      </header>

      <main className="space-y-4 p-4 pb-24">
        <Card>
          <p className="text-xs text-[var(--text-secondary)]">{pick.liga} · {pick.mercado}</p>
          <p className="mt-1 text-lg font-semibold">{pick.seleccion}</p>
        </Card>

        <Card>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
            Traza de decisión
          </p>
          <dl className="space-y-2.5">
            {filas.map(([etiqueta, valor]) => (
              <div key={etiqueta} className="flex items-center justify-between text-sm">
                <dt className="text-[var(--text-secondary)]">{etiqueta}</dt>
                <dd className="tabular font-medium">{valor}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <p className="px-1 text-xs text-[var(--text-secondary)]">
          NOAH no promete rentabilidad. Esta es la probabilidad calibrada del sistema y el valor medido
          frente a la cuota del mercado — no una garantía de resultado.
        </p>
      </main>
    </>
  )
}
