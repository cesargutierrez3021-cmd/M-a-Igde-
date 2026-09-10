import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutGrid,
  Target,
  Ticket,
  BarChart3,
  MoreHorizontal,
  Wallet,
  History,
  Settings,
  Activity,
  SlidersHorizontal,
  Gauge,
  Crown,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Sheet } from '../ui/controls'

const principales = [
  { to: '/', icon: LayoutGrid, label: 'Panel' },
  { to: '/hoy', icon: Target, label: 'Oportunidades' },
  { to: '/apuestas', icon: Ticket, label: 'Mis apuestas' },
  { to: '/rendimiento', icon: BarChart3, label: 'Rendimiento' },
]

const secundarias = [
  { to: '/capital', icon: Wallet, label: 'Capital', desc: 'Bankroll, Kelly y tope por apuesta' },
  { to: '/historial', icon: History, label: 'Historial', desc: 'Todo lo liquidado, filtrable' },
  { to: '/planes', icon: Crown, label: 'Planes', desc: 'Comparativa de niveles' },
  { to: '/ajustes', icon: Settings, label: 'Ajustes', desc: 'Tema, alertas y preferencias' },
  { to: '/salud', icon: Activity, label: 'Salud del sistema', desc: 'Latidos, colas y cuotas · Admin' },
  { to: '/admin', icon: SlidersHorizontal, label: 'Administración', desc: 'Interruptores y umbrales · Admin' },
  { to: '/calibracion', icon: Gauge, label: 'Calibración', desc: 'Brier, ECE y CLV por modelo · Admin' },
]

/*
 * Navegación inferior. Cuatro destinos principales y una hoja con el resto,
 * para que las doce pantallas del manual sean alcanzables sin amontonar
 * iconos ilegibles. El indicador superior viaja con layoutId entre pestañas:
 * es continuidad, no un parpadeo.
 */
export function BottomNav() {
  const [masAbierto, setMasAbierto] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const enSecundaria = secundarias.some((s) => s.to === pathname)

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/90 backdrop-blur-xl">
        <ul className="mx-auto flex max-w-md items-stretch pb-[env(safe-area-inset-bottom)]">
          {principales.map(({ to, icon: Icon, label }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative flex min-h-[58px] flex-col items-center justify-center gap-1 px-1 pt-1.5 text-[10px] font-medium transition-colors',
                    isActive ? 'text-goldlite' : 'text-mute'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicador"
                        className="absolute inset-x-4 top-0 h-0.5 rounded-full"
                        style={{ background: 'var(--grad-gold)' }}
                        transition={{ type: 'spring', stiffness: 480, damping: 40 }}
                      />
                    )}
                    <motion.span animate={{ scale: isActive ? 1.08 : 1 }} transition={{ duration: 0.18 }}>
                      <Icon size={19} strokeWidth={isActive ? 2 : 1.6} />
                    </motion.span>
                    <span className="leading-none">{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}

          <li className="flex-1">
            <button
              onClick={() => setMasAbierto(true)}
              className={cn(
                'relative flex min-h-[58px] w-full flex-col items-center justify-center gap-1 px-1 pt-1.5 text-[10px] font-medium transition-colors',
                enSecundaria ? 'text-goldlite' : 'text-mute'
              )}
            >
              {enSecundaria && (
                <motion.span
                  layoutId="nav-indicador"
                  className="absolute inset-x-4 top-0 h-0.5 rounded-full"
                  style={{ background: 'var(--grad-gold)' }}
                  transition={{ type: 'spring', stiffness: 480, damping: 40 }}
                />
              )}
              <MoreHorizontal size={19} strokeWidth={1.6} />
              <span className="leading-none">Más</span>
            </button>
          </li>
        </ul>
      </nav>

      <Sheet abierta={masAbierto} onCerrar={() => setMasAbierto(false)} titulo="Todas las secciones">
        <ul className="space-y-1 pb-2">
          {secundarias.map(({ to, icon: Icon, label, desc }, i) => (
            <motion.li
              key={to}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
            >
              <button
                onClick={() => {
                  setMasAbierto(false)
                  navigate(to)
                }}
                className="flex w-full items-center gap-3 rounded-[12px] px-2 py-2.5 text-left transition-colors hover:bg-surface-2"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-line bg-surface-2 text-goldlite">
                  <Icon size={16} strokeWidth={1.6} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium text-fg">{label}</span>
                  <span className="block text-[11.5px] leading-snug text-mute">{desc}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </Sheet>
    </>
  )
}
