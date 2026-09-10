import { useEffect, useMemo, useState } from 'react'
import { Dumbbell, ImagePlus, Plus, X } from 'lucide-react'
import { Pantalla, TituloPantalla } from '../../components/shell/Pantalla'
import { Card, Boton, Chip, Campo, Entrada, TituloSeccion } from '../../components/ui/primitives'
import { useTienda } from '../../lib/store'
import type { BloqueRutina, Ejercicio } from '../../lib/types'
import { cn } from '../../lib/utils'
import { AlarmaPantalla, esNativo } from '../../lib/nativo'

const DIAS: { v: BloqueRutina['dia']; l: string }[] = [
  { v: 'lun', l: 'Lun' },
  { v: 'mar', l: 'Mar' },
  { v: 'mie', l: 'Mié' },
  { v: 'jue', l: 'Jue' },
  { v: 'vie', l: 'Vie' },
  { v: 'sab', l: 'Sáb' },
  { v: 'dom', l: 'Dom' },
]

const TIPOS: { v: BloqueRutina['tipo']; l: string }[] = [
  { v: 'entrenamiento', l: 'Entrenamiento' },
  { v: 'comida', l: 'Comida' },
  { v: 'trabajo', l: 'Trabajo' },
  { v: 'descanso', l: 'Descanso' },
  { v: 'otro', l: 'Otro' },
]

function diaDeHoy(): BloqueRutina['dia'] {
  const idx = (new Date().getDay() + 6) % 7 // lunes = 0
  return DIAS[idx].v
}

function horaActual(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function RutinaScreen() {
  const estado = useTienda()
  const agregarBloque = useTienda((s) => s.agregarBloqueRutina)
  const eliminarBloque = useTienda((s) => s.eliminarBloqueRutina)

  const [dia, setDia] = useState<BloqueRutina['dia']>(diaDeHoy())
  const [mostrarForm, setMostrarForm] = useState(false)
  const [expandido, setExpandido] = useState<string | null>(null)

  const bloques = useMemo(
    () => estado.rutina.filter((b) => b.dia === dia).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)),
    [estado.rutina, dia]
  )
  const ahora = horaActual()

  // programa las alarmas de hoy que todavía no han pasado
  useEffect(() => {
    if (!esNativo() || dia !== diaDeHoy()) return
    const hoyBase = new Date()
    hoyBase.setSeconds(0, 0)
    for (const b of bloques) {
      if (b.horaInicio <= ahora) continue
      const [h, m] = b.horaInicio.split(':').map(Number)
      const fecha = new Date(hoyBase)
      fecha.setHours(h, m, 0, 0)
      AlarmaPantalla.programar({
        id: `rutina-${b.id}-${fecha.toDateString()}`,
        fechaHoraMs: fecha.getTime(),
        titulo: b.titulo,
        detalle: b.detalle || 'Hora de la rutina',
      }).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bloques.length, dia])

  return (
    <Pantalla>
      <TituloPantalla kicker="Rutina" titulo="Tu día, hora por hora" bajada="Se guarda en el teléfono. Cada bloque puede sonar como una alarma cuando le llega la hora." />

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {DIAS.map((d) => (
          <Chip key={d.v} activo={dia === d.v} onClick={() => setDia(d.v)}>
            {d.l}
            {d.v === diaDeHoy() && ' · hoy'}
          </Chip>
        ))}
      </div>

      <TituloSeccion
        accion={
          <button onClick={() => setMostrarForm((v) => !v)} className="flex items-center gap-1 text-[11.5px] font-medium text-acento-alto">
            <Plus size={13} className={mostrarForm ? 'rotate-45 transition-transform' : 'transition-transform'} /> {mostrarForm ? 'Cerrar' : 'Nuevo bloque'}
          </button>
        }
      >
        Bloques
      </TituloSeccion>

      {mostrarForm && (
        <FormularioBloque
          diaInicial={dia}
          onGuardar={(b) => {
            agregarBloque(b)
            setMostrarForm(false)
          }}
        />
      )}

      {bloques.length === 0 ? (
        <p className="text-[13px] text-mute">Sin bloques para este día todavía.</p>
      ) : (
        <div className="space-y-2.5">
          {bloques.map((b) => {
            const enCurso = dia === diaDeHoy() && b.horaInicio <= ahora && ahora < b.horaFin
            return (
              <Card
                key={b.id}
                className="p-0"
                style={enCurso ? { borderColor: 'var(--c-acento-linea)' } : undefined}
              >
                <button className="flex w-full items-center gap-3 p-3.5 text-left" onClick={() => setExpandido((e) => (e === b.id ? null : b.id))}>
                  <div className="w-14 shrink-0 text-center">
                    <p className="tabular text-[13px] font-semibold text-fg">{b.horaInicio}</p>
                    <p className="tabular text-[10px] text-mute">{b.horaFin}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {enCurso && <span className="size-1.5 rounded-full bg-acento breathe" />}
                      <p className="truncate text-[13.5px] font-medium text-fg">{b.titulo}</p>
                    </div>
                    <p className="text-[10.5px] text-mute capitalize">{b.tipo}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      eliminarBloque(b.id)
                    }}
                    aria-label="Eliminar"
                    className="shrink-0 text-mute"
                  >
                    <X size={15} />
                  </button>
                </button>

                {expandido === b.id && (
                  <div className="border-t border-line p-3.5">
                    {b.detalle && <p className="text-[12.5px] leading-relaxed text-dim">{b.detalle}</p>}
                    <EjerciciosBloque bloque={b} />
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </Pantalla>
  )
}

function FormularioBloque({ diaInicial, onGuardar }: { diaInicial: BloqueRutina['dia']; onGuardar: (b: Omit<BloqueRutina, 'id'>) => void }) {
  const [dia, setDia] = useState(diaInicial)
  const [horaInicio, setHoraInicio] = useState('06:00')
  const [horaFin, setHoraFin] = useState('06:30')
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState<BloqueRutina['tipo']>('entrenamiento')
  const [detalle, setDetalle] = useState('')

  return (
    <Card className="space-y-3 p-4">
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {DIAS.map((d) => (
          <Chip key={d.v} activo={dia === d.v} onClick={() => setDia(d.v)}>
            {d.l}
          </Chip>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Desde">
          <Entrada type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
        </Campo>
        <Campo etiqueta="Hasta">
          <Entrada type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
        </Campo>
      </div>
      <Campo etiqueta="Título">
        <Entrada value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Piernas, desayuno, levantarme…" />
      </Campo>
      <div className="flex flex-wrap gap-2">
        {TIPOS.map((t) => (
          <Chip key={t.v} activo={tipo === t.v} onClick={() => setTipo(t.v)}>
            {t.l}
          </Chip>
        ))}
      </div>
      <Campo etiqueta="Detalle (opcional)">
        <Entrada value={detalle} onChange={(e) => setDetalle(e.target.value)} placeholder="Qué debes hacer o comer" />
      </Campo>
      <Boton
        disabled={!titulo}
        onClick={() => onGuardar({ dia, horaInicio, horaFin, titulo, tipo, detalle: detalle || undefined, ejercicios: [] })}
      >
        Guardar bloque
      </Boton>
    </Card>
  )
}

function EjerciciosBloque({ bloque }: { bloque: BloqueRutina }) {
  const agregarEjercicio = useTienda((s) => s.agregarEjercicio)
  const eliminarEjercicio = useTienda((s) => s.eliminarEjercicio)
  const [mostrar, setMostrar] = useState(false)

  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-mute uppercase">
          <Dumbbell size={12} /> Ejercicios
        </p>
        <button onClick={() => setMostrar((v) => !v)} className="text-[11.5px] font-medium text-acento-alto">
          {mostrar ? 'Cerrar' : '+ Agregar'}
        </button>
      </div>

      {(bloque.ejercicios ?? []).length > 0 && (
        <div className="space-y-2">
          {(bloque.ejercicios ?? []).map((ej) => (
            <div key={ej.id} className="flex items-center gap-3 rounded-[var(--radius-btn)] border border-line bg-surface-2 p-2.5">
              {ej.imagenDataUrl ? (
                <img src={ej.imagenDataUrl} alt={ej.nombre} className="size-12 shrink-0 rounded-[8px] object-cover" />
              ) : (
                <div className="grid size-12 shrink-0 place-items-center rounded-[8px] bg-surface-3 text-mute">
                  <Dumbbell size={16} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-fg">{ej.nombre}</p>
                <p className="text-[11px] text-mute">
                  {ej.series} series · {ej.repeticiones} · pausa {ej.pausaSeg}s
                </p>
                {ej.nota && <p className="mt-0.5 text-[11px] text-dim">{ej.nota}</p>}
              </div>
              <button onClick={() => eliminarEjercicio(bloque.id, ej.id)} aria-label="Eliminar" className="shrink-0 text-mute">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {mostrar && (
        <FormularioEjercicio
          onGuardar={(e) => {
            agregarEjercicio(bloque.id, e)
            setMostrar(false)
          }}
        />
      )}
    </div>
  )
}

function FormularioEjercicio({ onGuardar }: { onGuardar: (e: Omit<Ejercicio, 'id'>) => void }) {
  const [nombre, setNombre] = useState('')
  const [series, setSeries] = useState('3')
  const [repeticiones, setRepeticiones] = useState('12')
  const [pausa, setPausa] = useState('45')
  const [nota, setNota] = useState('')
  const [imagen, setImagen] = useState<string | undefined>()

  function alCargarImagen(archivo: File) {
    const lector = new FileReader()
    lector.onload = () => setImagen(lector.result as string)
    lector.readAsDataURL(archivo)
  }

  return (
    <div className="mt-2 space-y-2.5 rounded-[var(--radius-btn)] border border-dashed border-line p-3">
      <Entrada value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del ejercicio" />
      <div className="grid grid-cols-3 gap-2">
        <Entrada inputMode="numeric" value={series} onChange={(e) => setSeries(e.target.value)} placeholder="Series" />
        <Entrada value={repeticiones} onChange={(e) => setRepeticiones(e.target.value)} placeholder="Reps" />
        <Entrada inputMode="numeric" value={pausa} onChange={(e) => setPausa(e.target.value)} placeholder="Pausa (s)" />
      </div>
      <Entrada value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Cómo se hace (opcional)" />
      <label className={cn('flex items-center gap-2 rounded-[var(--radius-btn)] border border-line px-3 py-2.5 text-[12.5px]', imagen ? 'text-acento-alto' : 'text-mute')}>
        <ImagePlus size={15} />
        {imagen ? 'Foto cargada' : 'Cargar foto (opcional)'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && alCargarImagen(e.target.files[0])}
        />
      </label>
      <Boton
        variante="contorno"
        disabled={!nombre}
        onClick={() =>
          onGuardar({
            nombre,
            series: parseInt(series, 10) || 1,
            repeticiones,
            pausaSeg: parseInt(pausa, 10) || 30,
            nota: nota || undefined,
            imagenDataUrl: imagen,
          })
        }
      >
        Guardar ejercicio
      </Boton>
    </div>
  )
}
