import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Tema = 'noir' | 'claro'

const CLAVE = 'noah:tema'

interface ContextoTema {
  tema: Tema
  alternar: () => void
  fijar: (t: Tema) => void
}

const Ctx = createContext<ContextoTema | null>(null)

function temaInicial(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado === 'noir' || guardado === 'claro') return guardado
  } catch {
    // Almacenamiento bloqueado (modo privado): se sigue con el tema por defecto.
  }
  return 'noir'
}

/*
 * Proveedor de tema. El manual pide modo claro con los mismos tokens
 * invertidos (§1.1) y que el usuario pueda elegirlo desde Ajustes (§7.3 módulo 11).
 * La elección se recuerda en el dispositivo.
 */
export function ProveedorTema({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(temaInicial)

  useEffect(() => {
    document.documentElement.dataset.theme = tema
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', tema === 'noir' ? '#0B0D10' : '#F7F5F1')
    try {
      localStorage.setItem(CLAVE, tema)
    } catch {
      // Sin persistencia: el tema sigue aplicado en esta sesión.
    }
  }, [tema])

  const valor = useMemo<ContextoTema>(
    () => ({
      tema,
      alternar: () => setTema((t) => (t === 'noir' ? 'claro' : 'noir')),
      fijar: setTema,
    }),
    [tema]
  )

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useTema(): ContextoTema {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTema debe usarse dentro de ProveedorTema')
  return ctx
}
