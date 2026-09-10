import { Header } from '../../components/shell/Header'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Check, X } from 'lucide-react'

const planes = [
  {
    nombre: 'Gratuito',
    precio: '$0',
    incluye: ['1 pronóstico al día', 'Estadísticas básicas', 'Tu bankroll y ROI'],
    excluye: ['Detalle del por qué', 'Comparativa bot vs usuario', 'Alertas Telegram'],
  },
  {
    nombre: 'Premium',
    precio: '$—/mes',
    destacado: true,
    incluye: ['Todos los pronósticos', 'Detalle completo (modelos, edge, EV)', 'Comparativa bot vs usuario', 'Alertas Telegram y push', 'Historial completo'],
    excluye: ['Panel de administración'],
  },
]

/* Planes — manual §7.3 módulo 12. Gestión de pago vía Stripe cuando llegue el momento. */
export function PlanesScreen() {
  return (
    <>
      <Header titulo="Planes" />
      <main className="space-y-4 p-4 pb-24">
        {planes.map((p) => (
          <Card key={p.nombre} className={p.destacado ? 'border-[var(--color-gold)]' : undefined}>
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">{p.nombre}</p>
              {p.destacado && <Badge tono="gold">Recomendado</Badge>}
            </div>
            <p className="tabular mt-1 text-2xl font-semibold text-[var(--color-gold-lite)]">{p.precio}</p>

            <ul className="mt-3 space-y-1.5 text-sm">
              {p.incluye.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[var(--text-primary)]">
                  <Check size={16} className="mt-0.5 shrink-0 text-[var(--color-win)]" /> {item}
                </li>
              ))}
              {p.excluye.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[var(--text-secondary)]">
                  <X size={16} className="mt-0.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </main>
    </>
  )
}
