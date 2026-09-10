import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/*
 * Apariencia de la app: dos temas (dorado, mando) y un modo (claro, oscuro)
 * que solo aplica a dorado — mando siempre es oscuro, es su única variante.
 * Se elige la primera vez que se abre la app y se puede cambiar después en
 * Ajustes, o con el botón rápido del encabezado.
 */

export type Tema = 'dorado' | 'mando'
export type Modo = 'claro' | 'oscuro'

const CLAVE_TEMA = 'noahc:tema'
const CLAVE_MODO = 'noahc:modo'
const CLAVE_ELEGIDA = 'noahc:apariencia-elegida'

interface Apariencia {
  tema: Tema
  modo: Modo
  yaEligio: boolean
  fijarTema: (t: Tema) => void
  fijarModo: (m: Modo) => void
  alternar: () => void
  confirmarEleccion: () => void
}

const Ctx = createContext<Apariencia | null>(null)

function leerInicial<T extends string>(clave: string, porDefecto: T): T {
  try {
    const v = localStorage.getItem(clave)
    return (v as T) ?? porDefecto
  } catch {
    return porDefecto
  }
}

export function ProveedorApariencia({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(() => leerInicial(CLAVE_TEMA, 'dorado'))
  const [modo, setModo] = useState<Modo>(() => {
    const guardado = leerInicial<Modo | ''>(CLAVE_MODO, '')
    if (guardado) return guardado
    const prefiereOscuro = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
    return prefiereOscuro ? 'oscuro' : 'claro'
  })
  const [yaEligio, setYaEligio] = useState(() => leerInicial<string>(CLAVE_ELEGIDA, '') === 'si')

  const modoEfectivo: Modo = tema === 'mando' ? 'oscuro' : modo

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema)
    document.documentElement.setAttribute('data-modo', modoEfectivo)
    try {
      localStorage.setItem(CLAVE_TEMA, tema)
      localStorage.setItem(CLAVE_MODO, modo)
    } catch {
      /* modo privado o sin storage: se pierde al cerrar, no es crítico */
    }
    const meta = document.querySelector('meta[name="theme-color"]')
    const color = getComputedStyle(document.documentElement).getPropertyValue('--c-canvas').trim()
    if (meta && color) meta.setAttribute('content', color)
  }, [tema, modo, modoEfectivo])

  const valor = useMemo<Apariencia>(
    () => ({
      tema,
      modo: modoEfectivo,
      yaEligio,
      fijarTema: setTema,
      fijarModo: setModo,
      alternar: () => setModo((m) => (m === 'claro' ? 'oscuro' : 'claro')),
      confirmarEleccion: () => {
        setYaEligio(true)
        try {
          localStorage.setItem(CLAVE_ELEGIDA, 'si')
        } catch {
          /* ignorar */
        }
      },
    }),
    [tema, modoEfectivo, yaEligio]
  )

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useApariencia(): Apariencia {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApariencia debe usarse dentro de ProveedorApariencia')
  return ctx
}
