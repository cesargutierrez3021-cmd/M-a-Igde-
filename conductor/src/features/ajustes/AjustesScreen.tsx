import { useState } from 'react'
import { Pantalla, TituloPantalla } from '../../components/shell/Pantalla'
import { Card, Boton, Chip, Campo, EntradaPesos, TituloSeccion } from '../../components/ui/primitives'
import { useApariencia, type Tema } from '../../lib/theme'
import { useTienda } from '../../lib/store'
import { APPS } from '../../lib/types'
import { Burbuja, esNativo } from '../../lib/nativo'
import { cn } from '../../lib/utils'

const TEMAS: { v: Tema; l: string; d: string }[] = [
  { v: 'dorado', l: 'Dorado', d: 'Papel marfil, serifa y oro — con versión clara y oscura.' },
  { v: 'mando', l: 'Puesto de mando', d: 'Instrumental, negro y cian.' },
]

export function AjustesScreen() {
  const { tema, modo, fijarTema, fijarModo } = useApariencia()
  const ajustes = useTienda((s) => s.ajustes)
  const actualizar = useTienda((s) => s.actualizarAjustes)
  const [metaDiaria, setMetaDiaria] = useState(ajustes.metaDiaria)
  const [permisoBurbuja, setPermisoBurbuja] = useState<'desconocido' | 'si' | 'no'>('desconocido')

  async function pedirPermisoBurbuja() {
    if (!esNativo()) return
    const r = await Burbuja.solicitarPermiso()
    setPermisoBurbuja(r.concedido ? 'si' : 'no')
  }

  return (
    <Pantalla>
      <TituloPantalla kicker="Ajustes" titulo="Tu app, a tu manera" />

      <TituloSeccion>Apariencia</TituloSeccion>
      <div className="space-y-2.5">
        {TEMAS.map((t) => (
          <button
            key={t.v}
            onClick={() => fijarTema(t.v)}
            className={cn('w-full rounded-[16px] border p-3.5 text-left', tema === t.v ? 'border-acento-linea' : 'border-line')}
            style={tema === t.v ? { background: 'var(--grad-acento-suave)' } : undefined}
          >
            <p className="display text-[14.5px] font-semibold text-fg">{t.l}</p>
            <p className="mt-0.5 text-[11.5px] text-mute">{t.d}</p>
          </button>
        ))}
      </div>
      {tema === 'dorado' && (
        <div className="mt-2.5 flex gap-2">
          {(['claro', 'oscuro'] as const).map((m) => (
            <Chip key={m} activo={modo === m} onClick={() => fijarModo(m)}>
              <span className="capitalize">{m}</span>
            </Chip>
          ))}
        </div>
      )}

      <TituloSeccion>Meta diaria neta</TituloSeccion>
      <Card className="p-4">
        <Campo etiqueta="Cuánto quieres llevarte limpio cada día">
          <EntradaPesos valor={metaDiaria} onCambio={setMetaDiaria} />
        </Campo>
        <Boton className="mt-3" onClick={() => actualizar({ metaDiaria })}>
          Guardar meta
        </Boton>
      </Card>

      <TituloSeccion>App preferida</TituloSeccion>
      <p className="-mt-2 mb-2 text-[11.5px] text-mute">La que se selecciona sola al registrar un viaje. Se puede cambiar viaje a viaje.</p>
      <div className="flex flex-wrap gap-2">
        {APPS.map((a) => (
          <Chip key={a} activo={ajustes.appPreferida === a} onClick={() => actualizar({ appPreferida: a })}>
            {a}
          </Chip>
        ))}
      </div>

      <TituloSeccion>Voz del asistente</TituloSeccion>
      <div className="flex gap-2">
        <Chip activo={ajustes.vozAsistente === 'confirmar'} onClick={() => actualizar({ vozAsistente: 'confirmar' })}>
          Confirmar en voz alta
        </Chip>
        <Chip activo={ajustes.vozAsistente === 'silencio'} onClick={() => actualizar({ vozAsistente: 'silencio' })}>
          En silencio
        </Chip>
      </div>

      <TituloSeccion>Burbuja flotante</TituloSeccion>
      <Card className="space-y-3 p-4">
        <p className="text-[12px] leading-relaxed text-mute">
          El globito aparece solo cuando abres la jornada. Un toque abre o cierra el viaje. Mantenerlo presionado abre esta app.
          Arrastrarlo lo deja donde lo sueltes.
        </p>
        <Boton onClick={pedirPermisoBurbuja}>
          {permisoBurbuja === 'si' ? 'Permiso concedido' : 'Activar globito'}
        </Boton>
        <p className="text-center text-[11px] text-mute">
          {esNativo() ? 'Se pide el permiso "Mostrar sobre otras apps" del sistema.' : 'Disponible solo en la app instalada, no en el navegador.'}
        </p>
      </Card>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-mute">
        Todo se guarda solo en este teléfono. Exporta de vez en cuando si vas a formatear o cambiar de equipo.
      </p>
    </Pantalla>
  )
}
