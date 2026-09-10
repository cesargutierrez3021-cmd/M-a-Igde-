import { useState } from 'react'
import { Header } from '../../components/shell/Header'
import { Card } from '../../components/ui/card'
import { cn } from '../../lib/utils'

const opciones = [
  { id: 'telegram', etiqueta: 'Alertas por Telegram' },
  { id: 'push', etiqueta: 'Notificaciones push' },
  { id: 'correo', etiqueta: 'Resumen por correo' },
]

/* Ajustes — manual §7.3 módulo 11. */
export function AjustesScreen() {
  const [tema, setTema] = useState<'oscuro' | 'claro'>('oscuro')
  const [activos, setActivos] = useState<Record<string, boolean>>({ telegram: true, push: true, correo: false })

  return (
    <>
      <Header titulo="Ajustes" />
      <main className="space-y-4 p-4 pb-24">
        <Card>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
            Notificaciones
          </p>
          <div className="space-y-3">
            {opciones.map((op) => (
              <label key={op.id} className="flex items-center justify-between text-sm">
                <span>{op.etiqueta}</span>
                <input
                  type="checkbox"
                  checked={activos[op.id] ?? false}
                  onChange={(e) => setActivos((a) => ({ ...a, [op.id]: e.target.checked }))}
                  className="h-5 w-5 accent-[var(--color-gold)]"
                />
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">Tema</p>
          <div className="flex gap-2">
            {(['oscuro', 'claro'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTema(t)}
                className={cn(
                  'min-h-11 flex-1 rounded-[var(--radius-button)] border text-sm capitalize',
                  tema === t
                    ? 'border-[var(--color-gold)] text-[var(--color-gold-lite)]'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        <p className="px-1 text-center text-xs text-[var(--text-secondary)]">
          +18. Juego responsable. NOAH no promete rentabilidad.
        </p>
      </main>
    </>
  )
}
