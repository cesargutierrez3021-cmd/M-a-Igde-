import type { Tema, Modo } from '../../lib/theme'

/*
 * Miniatura de una combinación tema × modo.
 *
 * Existe para que elegir apariencia no sea elegir a ciegas entre dos palabras:
 * la miniatura pinta con los colores reales de esa combinación. Los valores
 * están escritos aquí a propósito, porque tiene que dibujar una combinación
 * que NO es la activa — no puede leerlos de las variables del documento.
 */

interface Paleta {
  canvas: string
  surface: string
  line: string
  acento: string
  gradiente: string
  texto: string
}

const PALETAS: Record<Tema, Record<Modo, Paleta>> = {
  terreno: {
    oscuro: {
      canvas: '#0E1418', surface: '#141C21', line: 'rgba(159,170,178,.16)',
      acento: '#C9A227', gradiente: 'linear-gradient(135deg,#E8C766,#C9A227)', texto: '#E4EAED',
    },
    claro: {
      canvas: '#F2F3F0', surface: '#FFFFFF', line: 'rgba(20,26,29,.13)',
      acento: '#8A6D14', gradiente: 'linear-gradient(135deg,#B08D1E,#8A6D14)', texto: '#141A1D',
    },
  },
  mando: {
    oscuro: {
      canvas: '#060B14', surface: '#0C141F', line: 'rgba(53,224,255,.2)',
      acento: '#35E0FF', gradiente: 'linear-gradient(135deg,#35E0FF,#F0B429)', texto: '#DDE7F0',
    },
    claro: {
      canvas: '#EDF2F6', surface: '#FFFFFF', line: 'rgba(14,90,115,.22)',
      acento: '#0E7C99', gradiente: 'linear-gradient(135deg,#0E7C99,#9A7212)', texto: '#0D1720',
    },
  },
}

export function VistaPrevia({ tema, modo }: { tema: Tema; modo: Modo }) {
  const p = PALETAS[tema][modo]
  const radio = tema === 'terreno' ? 3 : 7

  return (
    <div
      className="h-[72px] w-full overflow-hidden p-2"
      style={{
        background: p.canvas,
        border: `1px solid ${p.line}`,
        borderRadius: tema === 'terreno' ? 4 : 9,
      }}
      aria-hidden
    >
      {/* barra de marca */}
      <div className="flex items-center gap-1">
        <span style={{ width: 26, height: 4, borderRadius: 2, background: p.acento }} />
        <span style={{ width: 12, height: 4, borderRadius: 2, background: p.texto, opacity: 0.3 }} />
      </div>

      {/* tarjeta principal */}
      <div
        className="mt-1.5"
        style={{ height: 26, background: p.surface, border: `1px solid ${p.line}`, borderRadius: radio }}
      />

      {/* fila de baldosas, una de ellas con el acento */}
      <div className="mt-1.5 flex gap-1">
        <span style={{ flex: 1, height: 12, background: p.surface, border: `1px solid ${p.line}`, borderRadius: radio }} />
        <span style={{ flex: 1, height: 12, background: p.gradiente, borderRadius: radio }} />
        <span style={{ flex: 1, height: 12, background: p.surface, border: `1px solid ${p.line}`, borderRadius: radio }} />
      </div>
    </div>
  )
}
