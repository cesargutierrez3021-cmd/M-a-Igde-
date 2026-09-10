import { motion } from 'framer-motion'
import { Check, Minus, Crown } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, Badge, Button, FiloSuperior } from '../../components/ui/primitives'
import { TramaJauria } from '../../components/brand/Illustrations'
import { listaEscalonada, elementoLista } from '../../design/motion'

const planes = [
  {
    nombre: 'Gratuito',
    precio: 'Gratis',
    nota: 'Para ver si NOAH es para ti',
    incluye: [
      'El pronóstico de mayor valor del día',
      'Tu bankroll y tu ROI',
      'Estadísticas básicas propias',
      'Historial de 30 días',
    ],
    excluye: ['El resto de pronósticos', 'El detalle del «por qué»', 'Comparativa completa contra el bot', 'Alertas de Telegram'],
  },
  {
    nombre: 'Premium',
    precio: 'Por definir',
    nota: 'Cuando el papel demuestre CLV sostenido',
    destacado: true,
    incluye: [
      'Todos los pronósticos del día',
      'Detalle completo: modelos, cuota justa, edge, EV, incertidumbre',
      'Traza de decisión paso a paso',
      'Comparativa bot vs. tú, con la brecha explicada',
      'Alertas por Telegram y push',
      'Historial completo y desgloses',
    ],
    excluye: ['Panel de administración y salud del sistema'],
  },
]

/* Planes — manual §7.3, módulo 12. */
export function PlanesScreen() {
  return (
    <Pantalla>
      <div className="relative">
        <TramaJauria className="pointer-events-none absolute -top-6 right-0 h-24 w-2/3 opacity-70" />
        <TituloPantalla
          kicker="Niveles"
          titulo="Elige tu"
          destacado="plan"
          bajada="Sin promesas de rentabilidad. Lo que cambia es cuánto del razonamiento puedes ver."
        />
      </div>

      <motion.div
        variants={listaEscalonada}
        initial="inicial"
        animate="entra"
        className="mt-5 space-y-3"
      >
        {planes.map((p) => (
          <motion.div key={p.nombre} variants={elementoLista}>
            <Card realce={p.destacado} className="p-4">
              <FiloSuperior dorado={p.destacado} />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {p.destacado && <Crown size={16} className="text-acento-alto" strokeWidth={1.7} />}
                    <h2 className="display text-[19px] text-fg">{p.nombre}</h2>
                  </div>
                  <p className="mt-1 text-[12px] text-mute">{p.nota}</p>
                </div>
                {p.destacado && <Badge tono="acento">Recomendado</Badge>}
              </div>

              <p
                className={`mt-3 text-[26px] leading-none font-semibold ${p.destacado ? 'texto-acento' : 'text-fg'}`}
              >
                {p.precio}
              </p>

              <ul className="mt-4 space-y-2">
                {p.incluye.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] leading-snug text-dim">
                    <Check size={15} strokeWidth={2.2} className="mt-0.5 shrink-0 text-win" />
                    {item}
                  </li>
                ))}
                {p.excluye.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] leading-snug text-mute">
                    <Minus size={15} strokeWidth={2.2} className="mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <Button variante={p.destacado ? 'acento' : 'contorno'} ancho disabled={p.destacado}>
                  {p.destacado ? 'Disponible tras la fase de papel' : 'Tu plan actual'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card plano className="mt-4 p-4">
        <p className="text-[12px] leading-relaxed text-mute">
          El plan de pago no se abre hasta que 90 días en papel muestren CLV positivo y coherente
          con el backtest. Cobrar antes de eso sería vender una ventaja que aún no está demostrada.
        </p>
      </Card>
    </Pantalla>
  )
}
