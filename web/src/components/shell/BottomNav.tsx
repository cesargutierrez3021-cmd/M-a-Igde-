import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutGrid, Target, PenLine, Users, TrendingUp, MoreHorizontal,
  Ticket, Wallet, History, Settings, Activity, SlidersHorizontal, Gauge, Crown, Trophy,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Sheet } from '../ui/controls'
import { useApariencia } from '../../lib/theme'
import { nombreDe, type ClavePanel } from '../../lib/nombres'

const principales: { to: string; icon: typeof LayoutGrid; clave: ClavePanel }[] = [
  { to: '/', icon: LayoutGrid, clave: 'inicio' },
  { to: '/hoy', icon: Target, clave: 'oportunidades' },
  { to: '/pronosticos', icon: PenLine, clave: 'pronosticos' },
  { to: '/comunidad', icon: Users, clave: 'comunidad' },
]

const secundarias: { to: string; icon: typeof LayoutGrid; clave: ClavePanel; desc: string }[] = [
  { to: '/rendimiento', icon: TrendingUp, clave: 'rendimiento', desc: 'Tres curvas, desgloses y CLV por casa' },
  { to: '/clasificacion', icon: Trophy, clave: 'clasificacion', desc: 'Ranking por CLV, mínimo 30 sellados' },
  { to: '/apuestas', icon: Ticket, clave: 'apuestas', desc: 'Qué seguiste del bot, con tu cuota real' },
  { to: '/capital', icon: Wallet, clave: 'capital', desc: 'Banca, fracción de Kelly y tope' },
  { to: '/historial', icon: History, clave: 'historial', desc: 'Todo lo liquidado, filtrable' },
  { to: '/planes', icon: Crown, clave: 'planes', desc: 'Comparativa de niveles' },
  { to: '/ajustes', icon: Settings, clave: 'ajustes', desc: 'Tema, modo, alertas y región' },
  { to: '/salud', icon: Activity, clave: 'salud', desc: 'Latidos, colas y cupos · Admin' },
  { to: '/admin', icon: SlidersHorizontal, clave: 'admin', desc: 'Interruptores y moderación · Admin' },
  { to: '/calibracion', icon: Gauge, clave: 'calibracion', desc: 'Brier, ECE y CLV por modelo · Admin' },
]

/*
 * Navegación inferior.
 *
 * Las etiquetas salen de lib/nombres: en Terreno dicen Base · Mapa · Cuaderno ·
 * Jauría, y en Puesto de mando, Mando · Objetivos · Trazado · Escuadrón. Cambiar
 * de tema cambia el idioma de la app, no solo sus colores.
 */
export function BottomNav() {
  const [masAbierto, setMasAbierto] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { tema } = useApariencia()
  const enSecundaria = secundarias.some((s) => s.to === pathname)

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/90 backdrop-blur-xl">
        <ul className="mx-auto flex max-w-md items-stretch pb-[env(safe-area-inset-bottom)]">
          {principales.map(({ to, icon: Icon, clave }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative flex min-h-[58px] flex-col items-center justify-center gap-1 px-1 pt-1.5 text-[9.5px] font-medium transition-colors',
                    isActive ? 'text-acento-alto' : 'text-mute'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicador"
                        className="absolute inset-x-4 top-0 h-0.5 rounded-full"
                        style={{ background: 'var(--grad-acento)' }}
                        transition={{ type: 'spring', stiffness: 480, damping: 40 }}
                      />
                    )}
                    <motion.span animate={{ scale: isActive ? 1.08 : 1 }} transition={{ duration: 0.18 }}>
                      <Icon size={19} strokeWidth={isActive ? 2 : 1.6} />
                    </motion.span>
                    <span className="leading-none">{nombreDe(clave, tema).corto}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}

          <li className="flex-1">
            <button
              onClick={() => setMasAbierto(true)}
              className={cn(
                'relative flex min-h-[58px] w-full flex-col items-center justify-center gap-1 px-1 pt-1.5 text-[9.5px] font-medium transition-colors',
                enSecundaria ? 'text-acento-alto' : 'text-mute'
              )}
            >
              {enSecundaria && (
                <motion.span
                  layoutId="nav-indicador"
                  className="absolute inset-x-4 top-0 h-0.5 rounded-full"
                  style={{ background: 'var(--grad-acento)' }}
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
        <ul className="max-h-[52vh] space-y-1 overflow-y-auto pb-2">
          {secundarias.map(({ to, icon: Icon, clave, desc }, i) => (
            <motion.li
              key={to}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.03, duration: 0.2 }}
            >
              <button
                onClick={() => {
                  setMasAbierto(false)
                  navigate(to)
                }}
                className="flex w-full items-center gap-3 rounded-[12px] px-2 py-2.5 text-left transition-colors hover:bg-surface-2"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-line bg-surface-2 text-acento-alto">
                  <Icon size={16} strokeWidth={1.6} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium text-fg">
                    {nombreDe(clave, tema).largo}
                  </span>
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
