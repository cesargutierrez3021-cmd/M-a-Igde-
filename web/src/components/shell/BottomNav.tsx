import { NavLink } from 'react-router-dom'
import { Home, Wallet, BarChart3, Settings } from 'lucide-react'
import { cn } from '../../lib/utils'

const items = [
  { to: '/', icon: Home, label: 'Hoy' },
  { to: '/apuestas', icon: Wallet, label: 'Apuestas' },
  { to: '/estadisticas', icon: BarChart3, label: 'Stats' },
  { to: '/ajustes', icon: Settings, label: 'Ajustes' },
]

/*
 * Navegación inferior — objetivos táctiles de 44px mínimo (manual §7.5).
 * Móvil primero: la misma pantalla acabará empaquetada para Play Store (§7.1).
 */
export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] pb-[env(safe-area-inset-bottom)]">
      <ul className="flex items-stretch justify-around">
        {items.map(({ to, icon: Icon, label }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex min-h-11 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors',
                  isActive ? 'text-[var(--color-gold-lite)]' : 'text-[var(--text-secondary)]'
                )
              }
            >
              <Icon size={20} strokeWidth={1.5} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
