import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Tema = 'terreno' | 'mando'
export type Modo = 'oscuro' | 'claro'

const CLAVE_TEMA = 'noah:tema'
const CLAVE_MODO = 'noah:modo'
const CLAVE_ELEGIDO = 'noah:apariencia-elegida'

export const TEMAS: Record<Tema, { nombre: string; descripcion: string }> = {
  terreno: { nombre: 'Terreno', descripcion: 'Cartografía · cotas y curvas de nivel' },
  mando: { nombre: 'Puesto de mando', descripcion: 'Instrumentos · objetivos y telemetría' },
}

export const MODOS: Record<Modo, { nombre: string }> = {
  oscuro: { nombre: 'Oscuro' },
  claro: { nombre: 'Claro' },
}

/** Color de la barra de estado del sistema, por combinación. */
const COLOR_BARRA: Record<Tema, Record<Modo, string>> = {
  terreno: { oscuro: '#0E1418', claro: '#F2F3F0' },
  mando: { oscuro: '#060B14', claro: '#EDF2F6' },
}

interface ContextoApariencia {
  tema: Tema
  modo: Modo
  /** false hasta que el usuario elige en la bienvenida. Gobierna si se muestra. */
  yaEligio: boolean
  fijarTema: (t: Tema) => void
  fijarModo: (m: Modo) => void
  alternarModo: () => void
  confirmarEleccion: () => void
}

const Ctx = createContext<ContextoApariencia | null>(null)

function leer<T extends string>(clave: string, validos: readonly T[], porDefecto: T): T {
  try {
    const v = localStorage.getItem(clave)
    if (v && (validos as readonly string[]).includes(v)) return v as T
  } catch {
    // Almacenamiento bloqueado (modo privado): se sigue con el valor por defecto.
  }
  return porDefecto
}

/** Si el sistema pide claro y el usuario aún no ha elegido, se respeta. */
function modoInicial(): Modo {
  try {
    if (localStorage.getItem(CLAVE_MODO)) return leer(CLAVE_MODO, ['oscuro', 'claro'] as const, 'oscuro')
  } catch {
    // Sin acceso al almacenamiento: se decide por la preferencia del sistema.
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'claro' : 'oscuro'
}

/*
 * Apariencia de NOAH: dos ejes independientes.
 *
 *   TEMA  decide la identidad — paleta, formas, atmósfera, ilustración
 *   MODO  decide el fondo sobre el que se lee esa identidad
 *
 * Se eligen juntos en la bienvenida, se cambian por separado después: el tema
 * desde Ajustes, el modo desde el botón de la cabecera. Ambos se recuerdan.
 */
export function ProveedorApariencia({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(() => leer(CLAVE_TEMA, ['terreno', 'mando'] as const, 'terreno'))
  const [modo, setModo] = useState<Modo>(modoInicial)
  const [yaEligio, setYaEligio] = useState<boolean>(() => {
    try {
      return localStorage.getItem(CLAVE_ELEGIDO) === 'si'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const raiz = document.documentElement
    raiz.dataset.tema = tema
    raiz.dataset.modo = modo

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', COLOR_BARRA[tema][modo])

    try {
      localStorage.setItem(CLAVE_TEMA, tema)
      localStorage.setItem(CLAVE_MODO, modo)
    } catch {
      // Sin persistencia: la elección sigue aplicada en esta sesión.
    }
  }, [tema, modo])

  const valor = useMemo<ContextoApariencia>(
    () => ({
      tema,
      modo,
      yaEligio,
      fijarTema: setTema,
      fijarModo: setModo,
      alternarModo: () => setModo((m) => (m === 'oscuro' ? 'claro' : 'oscuro')),
      confirmarEleccion: () => {
        setYaEligio(true)
        try {
          localStorage.setItem(CLAVE_ELEGIDO, 'si')
        } catch {
          // Sin persistencia: volverá a preguntar en el próximo arranque.
        }
      },
    }),
    [tema, modo, yaEligio]
  )

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useApariencia(): ContextoApariencia {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApariencia debe usarse dentro de ProveedorApariencia')
  return ctx
}
