import { Moon, Sun } from 'lucide-react'
import { useApariencia } from '../../lib/theme'
import { useTienda } from '../../lib/store'
import { formatearPesosCompacto, formatearKm } from '../../lib/format'
import { calcularResumen } from '../../lib/selectors'

export function Encabezado() {
  const { tema, modo, alternar } = useApariencia()
  const estado = useTienda()
  const hoy = calcularResumen(estado, 'hoy')
  const fecha = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'short' })

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 pt-[max(14px,env(safe-area-inset-top))] pb-3">
        <div className="flex items-center gap-2.5">
          <LogoHusky />
          <div>
            <p className="wordmark text-[19px] leading-none text-fg">
              N<span className="texto-acento">O</span>AH
            </p>
            <p className="mt-0.5 text-[10px] tracking-[0.12em] text-mute uppercase">
              Conductor · {fecha}
            </p>
          </div>
        </div>
        {tema !== 'mando' && (
          <button
            onClick={alternar}
            aria-label="Cambiar claro/oscuro"
            className="grid size-9 place-items-center rounded-full border border-line text-dim transition-colors"
          >
            {modo === 'oscuro' ? <Sun size={16} strokeWidth={1.7} /> : <Moon size={16} strokeWidth={1.7} />}
          </button>
        )}
      </div>

      <div className="mx-auto grid max-w-md grid-cols-3 divide-x divide-line border-t border-line">
        <Kpi valor={formatearPesosCompacto(hoy.neto)} etiqueta="Neto hoy" acento={hoy.neto >= 0} />
        <Kpi valor={formatearKm(hoy.km).replace(' km', '')} etiqueta="Km hoy" />
        <Kpi valor={formatearPesosCompacto(hoy.porKmNeto)} etiqueta="$ / km" />
      </div>
    </header>
  )
}

function Kpi({ valor, etiqueta, acento }: { valor: string; etiqueta: string; acento?: boolean }) {
  return (
    <div className="px-2 py-2.5 text-center">
      <p className={`tabular text-[15px] font-semibold ${acento === false ? 'text-loss' : acento ? 'text-acento-alto' : 'text-fg'}`}>
        {valor}
      </p>
      <p className="mt-0.5 text-[9px] tracking-[0.1em] text-mute uppercase">{etiqueta}</p>
    </div>
  )
}

function LogoHusky() {
  return (
    <svg width="30" height="30" viewBox="0 0 64 64" fill="none" aria-hidden>
      <path
        d="M32 6 12 22v14c0 12 8 20 20 22 12-2 20-10 20-22V22L32 6Z"
        fill="none"
        stroke="var(--c-acento)"
        strokeWidth="2.4"
      />
      <path d="M12 22 4 14l10 2 6-8-2 10 6-6-1 9" stroke="var(--c-acento)" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <path d="M52 22 60 14l-10 2-6-8 2 10-6-6 1 9" stroke="var(--c-acento)" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <path d="M32 24c-6 0-10 5-10 11 0 4 2 7 5 9l2-6 3 6 3-6 2 6c3-2 5-5 5-9 0-6-4-11-10-11Z" fill="var(--c-acento)" opacity="0.9" />
      <circle cx="27" cy="30" r="1.6" fill="var(--c-canvas)" />
      <circle cx="37" cy="30" r="1.6" fill="var(--c-canvas)" />
    </svg>
  )
}
