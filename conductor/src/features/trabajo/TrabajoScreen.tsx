import { useMemo, useState } from 'react'
import { Play, Square, Plus, Gift, Fuel } from 'lucide-react'
import { Pantalla, TituloPantalla } from '../../components/shell/Pantalla'
import { Card, Boton, Chip, Campo, Entrada, EntradaPesos, TituloSeccion } from '../../components/ui/primitives'
import { useTienda } from '../../lib/store'
import { useViaje } from './useViaje'
import { APPS, type App, type TipoGastoMoto } from '../../lib/types'
import { formatearDuracion, formatearKm, formatearPesos, formatearPesosCompacto, formatearHora, formatearFechaCorta } from '../../lib/format'
import { calcularResumen, type Periodo } from '../../lib/selectors'
import { Burbuja, esNativo } from '../../lib/nativo'

const TIPOS_GASTO: TipoGastoMoto[] = ['Gasolina', 'Mantenimiento', 'Comida', 'Lavado', 'Peaje', 'Multa', 'Otro']
const PERIODOS: { v: Periodo; l: string }[] = [
  { v: 'hoy', l: 'Hoy' },
  { v: 'semana', l: 'Semana' },
  { v: 'mes', l: 'Mes' },
  { v: 'todo', l: 'Todo' },
]

export function TrabajoScreen() {
  const estado = useTienda()
  const jornadaAbierta = estado.jornadaAbierta()
  const iniciarJornada = useTienda((s) => s.iniciarJornada)
  const terminarJornada = useTienda((s) => s.terminarJornada)
  const fijarPagoViaje = useTienda((s) => s.fijarPagoViaje)
  const registrarViajeManual = useTienda((s) => s.registrarViajeManual)
  const agregarBono = useTienda((s) => s.agregarBono)
  const agregarGastoMoto = useTienda((s) => s.agregarGastoMoto)

  const viaje = useViaje()
  const [periodo, setPeriodo] = useState<Periodo>('hoy')
  const [mostrarManual, setMostrarManual] = useState(false)
  const [mostrarBono, setMostrarBono] = useState(false)
  const [mostrarGasto, setMostrarGasto] = useState(false)

  const resumen = useMemo(() => calcularResumen(estado, periodo), [estado, periodo])
  const pendientes = useMemo(() => estado.viajes.filter((v) => v.pago === null), [estado.viajes])

  async function alIniciarJornada() {
    iniciarJornada()
    if (esNativo()) {
      const permiso = await Burbuja.tienePermiso()
      if (permiso.concedido) Burbuja.mostrar({ km: '0.0', tiempo: '0m', enViaje: false }).catch(() => {})
    }
  }

  function alTerminarJornada() {
    if (viaje.activo) viaje.terminarViaje(true)
    terminarJornada()
    if (esNativo()) Burbuja.ocultar().catch(() => {})
  }

  return (
    <Pantalla>
      <TituloPantalla
        kicker={jornadaAbierta ? 'Jornada abierta' : 'Sin jornada'}
        titulo="Tu turno"
        bajada={jornadaAbierta ? `Desde las ${formatearHora(jornadaAbierta.inicioISO)}.` : 'Inicia la jornada para empezar a registrar viajes.'}
      />

      {viaje.errorGps && (
        <p className="mt-3 rounded-[var(--radius-btn)] border border-loss/35 bg-loss/10 px-3 py-2 text-[12px] text-loss">
          {viaje.errorGps}
        </p>
      )}

      {/* Viaje en curso */}
      {viaje.activo && (
        <Card className="mt-4 p-4" style={{ borderColor: 'var(--c-acento-linea)' }}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] text-acento-alto uppercase">
              <span className="size-1.5 rounded-full bg-acento breathe" /> Viaje en curso · {viaje.app}
            </span>
          </div>
          <div className="tabular mt-2 flex items-end gap-4">
            <div>
              <p className="text-[30px] font-semibold text-fg">{formatearDuracion(viaje.msTranscurridos)}</p>
              <p className="text-[10px] text-mute uppercase">tiempo</p>
            </div>
            <div>
              <p className="text-[30px] font-semibold text-fg">{viaje.km.toFixed(1)}</p>
              <p className="text-[10px] text-mute uppercase">km</p>
            </div>
          </div>
          <Boton className="mt-3" onClick={() => viaje.terminarViaje(true)}>
            <span className="flex items-center justify-center gap-2">
              <Square size={15} /> Terminar viaje
            </span>
          </Boton>
        </Card>
      )}

      {/* Control de jornada */}
      {!jornadaAbierta ? (
        <Boton className="mt-5" onClick={alIniciarJornada}>
          Iniciar jornada
        </Boton>
      ) : (
        <div className="mt-5 space-y-2.5">
          {!viaje.activo && (
            <>
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {APPS.map((a) => (
                  <Chip key={a} activo={viaje.app === a} onClick={() => viaje.cambiarApp(a)}>
                    {a}
                  </Chip>
                ))}
              </div>
              <Boton onClick={() => viaje.iniciarViaje()}>
                <span className="flex items-center justify-center gap-2">
                  <Play size={15} /> Iniciar viaje
                </span>
              </Boton>
            </>
          )}
          <Boton variante="fantasma" className="min-h-9 text-[12px] normal-case" onClick={alTerminarJornada}>
            Terminar jornada
          </Boton>
        </div>
      )}

      {/* Pendientes de pago */}
      {pendientes.length > 0 && (
        <>
          <TituloSeccion>Pendientes de pago · {pendientes.length}</TituloSeccion>
          <div className="space-y-2.5">
            {pendientes.map((v) => (
              <PendientePago key={v.id} viaje={v} onGuardar={(pago) => fijarPagoViaje(v.id, pago)} />
            ))}
          </div>
        </>
      )}

      {/* Registro manual */}
      <TituloSeccion accion={<BotonExpandir abierto={mostrarManual} onClick={() => setMostrarManual((v) => !v)} etiqueta="Manual" />}>
        Registrar viaje
      </TituloSeccion>
      {mostrarManual && (
        <FormularioManual
          onGuardar={(v) => {
            registrarViajeManual(v)
            setMostrarManual(false)
          }}
        />
      )}

      {/* Bono */}
      <TituloSeccion accion={<BotonExpandir abierto={mostrarBono} onClick={() => setMostrarBono((v) => !v)} etiqueta="Nuevo" />}>
        Bono o incentivo
      </TituloSeccion>
      {mostrarBono && (
        <FormularioBono
          onGuardar={(b) => {
            agregarBono(b)
            setMostrarBono(false)
          }}
        />
      )}

      {/* Gasto de moto */}
      <TituloSeccion accion={<BotonExpandir abierto={mostrarGasto} onClick={() => setMostrarGasto((v) => !v)} etiqueta="Nuevo" />}>
        Gasto de la moto
      </TituloSeccion>
      {mostrarGasto && (
        <FormularioGastoMoto
          onGuardar={(g) => {
            agregarGastoMoto(g)
            setMostrarGasto(false)
          }}
        />
      )}

      {/* Resumen */}
      <TituloSeccion>Resumen</TituloSeccion>
      <div className="flex gap-2">
        {PERIODOS.map((p) => (
          <Chip key={p.v} activo={periodo === p.v} onClick={() => setPeriodo(p.v)}>
            {p.l}
          </Chip>
        ))}
      </div>
      <Card className="mt-3 p-4">
        <p className="text-[10px] tracking-[0.12em] text-mute uppercase">Neto ({PERIODOS.find((p) => p.v === periodo)?.l.toLowerCase()})</p>
        <p className={`tabular mt-1 text-[26px] font-semibold ${resumen.neto >= 0 ? 'text-fg' : 'text-loss'}`}>{formatearPesos(resumen.neto)}</p>
      </Card>

      {/* Rendimiento */}
      <TituloSeccion>Rendimiento</TituloSeccion>
      <Card className="divide-y divide-[var(--c-line)] p-0">
        <FilaRendimiento etiqueta="Por kilómetro (bruto)" sub={`sobre ${formatearKm(resumen.km)}`} valor={formatearPesos(resumen.porKmBruto)} />
        <FilaRendimiento etiqueta="Por kilómetro (neto)" sub="ya descontando la moto" valor={formatearPesos(resumen.porKmNeto)} tono="win" />
        <FilaRendimiento etiqueta="Por viaje" sub={`${resumen.viajes.length} viajes`} valor={formatearPesos(resumen.porViaje)} />
      </Card>

      {/* Últimos días */}
      <TituloSeccion>Últimos días</TituloSeccion>
      <UltimosDias />
    </Pantalla>
  )
}

function BotonExpandir({ abierto, onClick, etiqueta }: { abierto: boolean; onClick: () => void; etiqueta: string }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 text-[11.5px] font-medium text-acento-alto">
      <Plus size={13} className={abierto ? 'rotate-45 transition-transform' : 'transition-transform'} /> {abierto ? 'Cerrar' : etiqueta}
    </button>
  )
}

function FilaRendimiento({ etiqueta, sub, valor, tono }: { etiqueta: string; sub: string; valor: string; tono?: 'win' }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-[13.5px] text-fg">{etiqueta}</p>
        <p className="text-[11px] text-mute">{sub}</p>
      </div>
      <p className={`tabular text-[15px] font-semibold ${tono === 'win' ? 'text-win' : 'text-fg'}`}>{valor}</p>
    </div>
  )
}

function PendientePago({ viaje, onGuardar }: { viaje: { id: string; km: number; app: App; finISO: string }; onGuardar: (pago: number) => void }) {
  const [pago, setPago] = useState(0)
  return (
    <Card className="p-3.5">
      <p className="text-[12.5px] text-mute">
        {viaje.app} · {formatearKm(viaje.km)} · {formatearHora(viaje.finISO)}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <EntradaPesos valor={pago} onCambio={setPago} placeholder="¿Cuánto le pagó?" />
        <button
          disabled={pago <= 0}
          onClick={() => onGuardar(pago)}
          className="display min-h-11 shrink-0 rounded-[var(--radius-btn)] px-4 text-[12px] font-semibold tracking-[0.04em] text-[var(--btn-fg)] uppercase disabled:opacity-40"
          style={{ background: 'var(--grad-acento)' }}
        >
          Guardar
        </button>
      </div>
    </Card>
  )
}

function FormularioManual({ onGuardar }: { onGuardar: (v: { app: App; km: number; pago: number | null; inicioISO: string; finISO: string; nota?: string }) => void }) {
  const preferida = useTienda((s) => s.ajustes.appPreferida)
  const [app, setApp] = useState<App>(preferida)
  const [km, setKm] = useState('')
  const [pago, setPago] = useState(0)
  const [nota, setNota] = useState('')

  return (
    <Card className="space-y-3 p-4">
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {APPS.map((a) => (
          <Chip key={a} activo={app === a} onClick={() => setApp(a)}>
            {a}
          </Chip>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Kilómetros">
          <Entrada inputMode="decimal" value={km} onChange={(e) => setKm(e.target.value)} placeholder="0.0" />
        </Campo>
        <Campo etiqueta="Me pagó">
          <EntradaPesos valor={pago} onCambio={setPago} />
        </Campo>
      </div>
      <Campo etiqueta="Nota (opcional)">
        <Entrada value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Zona, cliente, detalle…" />
      </Campo>
      <Boton
        disabled={!km}
        onClick={() => {
          const ahora = new Date().toISOString()
          onGuardar({ app, km: parseFloat(km) || 0, pago: pago || null, inicioISO: ahora, finISO: ahora, nota: nota || undefined })
        }}
      >
        Guardar viaje
      </Boton>
    </Card>
  )
}

function FormularioBono({ onGuardar }: { onGuardar: (b: { origen: App | 'Otro'; monto: number; concepto: string; fechaISO: string }) => void }) {
  const [origen, setOrigen] = useState<App | 'Otro'>('Uber')
  const [monto, setMonto] = useState(0)
  const [concepto, setConcepto] = useState('')
  return (
    <Card className="space-y-3 p-4">
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Origen">
          <select value={origen} onChange={(e) => setOrigen(e.target.value as App | 'Otro')} className="min-h-11 w-full rounded-[var(--radius-btn)] border border-line bg-surface-2 px-3 text-[15px] text-fg">
            {[...APPS, 'Otro' as const].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Monto">
          <EntradaPesos valor={monto} onCambio={setMonto} />
        </Campo>
      </div>
      <Campo etiqueta="Concepto">
        <Entrada value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder="Meta de 15 viajes, hora pico…" />
      </Campo>
      <Boton
        disabled={monto <= 0}
        onClick={() => {
          onGuardar({ origen, monto, concepto, fechaISO: new Date().toISOString() })
          setMonto(0)
          setConcepto('')
        }}
      >
        <span className="flex items-center justify-center gap-2">
          <Gift size={15} /> Sumar bono
        </span>
      </Boton>
    </Card>
  )
}

function FormularioGastoMoto({ onGuardar }: { onGuardar: (g: { tipo: TipoGastoMoto; valor: number; litros?: number; nota?: string; fechaISO: string }) => void }) {
  const [tipo, setTipo] = useState<TipoGastoMoto>('Gasolina')
  const [valor, setValor] = useState(0)
  const [litros, setLitros] = useState('')
  const [nota, setNota] = useState('')
  return (
    <Card className="space-y-3 p-4">
      <div className="grid grid-cols-4 gap-2">
        {TIPOS_GASTO.map((t) => (
          <Chip key={t} activo={tipo === t} onClick={() => setTipo(t)}>
            {t}
          </Chip>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Valor">
          <EntradaPesos valor={valor} onCambio={setValor} />
        </Campo>
        <Campo etiqueta="Litros (si es gasolina)">
          <Entrada inputMode="decimal" value={litros} onChange={(e) => setLitros(e.target.value)} placeholder="—" />
        </Campo>
      </div>
      <Campo etiqueta="Nota">
        <Entrada value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Estación, taller, almuerzo…" />
      </Campo>
      <Boton
        variante="contorno"
        disabled={valor <= 0}
        onClick={() => {
          onGuardar({ tipo, valor, litros: litros ? parseFloat(litros) : undefined, nota: nota || undefined, fechaISO: new Date().toISOString() })
          setValor(0)
          setLitros('')
          setNota('')
        }}
      >
        <span className="flex items-center justify-center gap-2">
          <Fuel size={15} /> Guardar gasto
        </span>
      </Boton>
    </Card>
  )
}

function UltimosDias() {
  const estado = useTienda()
  const dias = useMemo(() => {
    const mapa = new Map<string, { fechaISO: string; neto: number; km: number; viajes: number; msJornada: number }>()
    for (const v of estado.viajes) {
      const clave = v.finISO.slice(0, 10)
      const acc = mapa.get(clave) ?? { fechaISO: v.finISO, neto: 0, km: 0, viajes: 0, msJornada: 0 }
      acc.neto += v.pago ?? 0
      acc.km += v.km
      acc.viajes += 1
      mapa.set(clave, acc)
    }
    for (const g of estado.gastosMoto) {
      const clave = g.fechaISO.slice(0, 10)
      const acc = mapa.get(clave)
      if (acc) acc.neto -= g.valor
    }
    for (const j of estado.jornadas) {
      if (!j.finISO) continue
      const clave = j.inicioISO.slice(0, 10)
      const acc = mapa.get(clave)
      if (acc) acc.msJornada += new Date(j.finISO).getTime() - new Date(j.inicioISO).getTime()
    }
    return [...mapa.values()].sort((a, b) => b.fechaISO.localeCompare(a.fechaISO)).slice(0, 8)
  }, [estado.viajes, estado.gastosMoto, estado.jornadas])

  if (dias.length === 0) return <p className="text-[13px] text-mute">Todavía no hay días registrados.</p>

  return (
    <div className="divide-y divide-[var(--c-line)] rounded-[var(--radius-card)] border border-line bg-surface">
      {dias.map((d) => (
        <div key={d.fechaISO} className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-[13.5px] font-medium text-fg">{formatearFechaCorta(d.fechaISO)}</p>
            <p className="text-[11px] text-mute">
              {d.viajes} viajes · {formatearKm(d.km)} {d.msJornada > 0 && `· ${formatearDuracion(d.msJornada)}`}
            </p>
          </div>
          <div className="text-right">
            <p className={`tabular text-[15px] font-semibold ${d.neto >= 0 ? 'text-fg' : 'text-loss'}`}>{formatearPesos(d.neto)}</p>
            <p className="tabular text-[10.5px] text-mute">{d.km > 0 ? formatearPesosCompacto(d.neto / d.km) + '/km' : ''}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
