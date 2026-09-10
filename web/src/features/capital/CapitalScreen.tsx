import { Header } from '../../components/shell/Header'
import { Card } from '../../components/ui/card'
import { NumeroAnimado } from '../../components/ui/numero-animado'
import { resumenEstadisticas } from '../../lib/mock/data'

/*
 * Capital — manual §7.3 módulo 5.
 * Bankroll inicial, fracción de Kelly, tope por apuesta. Todo stake que muestre
 * la app se recalcula sobre el capital real del usuario, no sobre uno de ejemplo.
 */
export function CapitalScreen() {
  return (
    <>
      <Header titulo="Capital" />
      <main className="space-y-4 p-4 pb-24">
        <Card>
          <p className="text-xs text-[var(--text-secondary)]">Capital actual</p>
          <p className="mt-1 text-3xl font-semibold text-[var(--color-gold-lite)]">
            $<NumeroAnimado valor={resumenEstadisticas.capitalActual} decimales={2} />
          </p>
        </Card>

        <Card className="space-y-4">
          <label className="block text-sm">
            <span className="text-[var(--text-secondary)]">Bankroll inicial</span>
            <input
              type="number"
              defaultValue={1000}
              className="mt-1 w-full rounded-[var(--radius-button)] border border-[var(--border-subtle)] bg-transparent px-3 py-2 tabular"
            />
          </label>

          <label className="block text-sm">
            <span className="text-[var(--text-secondary)]">Fracción de Kelly</span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              defaultValue={0.25}
              className="mt-2 w-full accent-[var(--color-gold)]"
            />
            <p className="mt-1 text-xs text-[var(--text-secondary)]">0.25× — conservador por defecto</p>
          </label>

          <label className="block text-sm">
            <span className="text-[var(--text-secondary)]">Tope por apuesta</span>
            <input
              type="number"
              defaultValue={5}
              className="mt-1 w-full rounded-[var(--radius-button)] border border-[var(--border-subtle)] bg-transparent px-3 py-2 tabular"
            />
            <p className="mt-1 text-xs text-[var(--text-secondary)]">% máximo del capital en una sola apuesta</p>
          </label>
        </Card>
      </main>
    </>
  )
}
