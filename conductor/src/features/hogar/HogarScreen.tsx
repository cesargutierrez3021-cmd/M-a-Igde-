import { useMemo, useState } from 'react'
import { Check, Repeat, X } from 'lucide-react'
import { Pantalla, TituloPantalla } from '../../components/shell/Pantalla'
import { Card, Boton, Chip, Campo, Entrada, EntradaPesos, TituloSeccion, BarraProgreso } from '../../components/ui/primitives'
import { useTienda } from '../../lib/store'
import type { CategoriaHogar } from '../../lib/types'
import { formatearPesos, formatearFechaCorta } from '../../lib/format'
import { calcularResumen, type Periodo } from '../../lib/selectors'

const CATEGORIAS: CategoriaHogar[] = ['Mercado', 'Arriendo', 'Servicios', 'Internet', 'Salud', 'Familia', 'Transporte', 'Ocio', 'Otro']
const PERIODOS: { v: Periodo; l: string }[] = [
  { v: 'hoy', l: 'Hoy' },
  { v: 'semana', l: 'Semana' },
  { v: 'mes', l: 'Mes' },
  { v: 'todo', l: 'Todo' },
]

export function HogarScreen() {
  const estado = useTienda()
  const agregarGastoHogar = useTienda((s) => s.agregarGastoHogar)
  const marcarPagado = useTienda((s) => s.marcarGastoHogarPagado)
  const eliminarGastoHogar = useTienda((s) => s.eliminarGastoHogar)
  const agregarFijo = useTienda((s) => s.agregarGastoHogarFijo)
  const eliminarFijo = useTienda((s) => s.eliminarGastoHogarFijo)

  const [periodo, setPeriodo] = useState<Periodo>('mes')
  const [categoria, setCategoria] = useState<CategoriaHogar>('Mercado')
  const [valor, setValor] = useState(0)
  const [detalle, setDetalle] = useState('')
  const [esFijo, setEsFijo] = useState(false)
  const [diaDelMes, setDiaDelMes] = useState('1')

  const resumen = useMemo(() => calcularResumen(estado, periodo), [estado, periodo])
  const cubierto = resumen.bruto > 0 ? Math.min(1, resumen.bruto / Math.max(1, resumen.gastoHogar)) : 0
  const dias = periodo === 'mes' ? new Date().getDate() : periodo === 'semana' ? Math.min(7, new Date().getDate()) : 1
  const promedioDia = resumen.gastoHogar / Math.max(1, dias)

  const listaOrdenada = useMemo(
    () => [...resumen.gastosHogar].sort((a, b) => b.fechaISO.localeCompare(a.fechaISO)),
    [resumen.gastosHogar]
  )

  function guardarGasto() {
    agregarGastoHogar({ categoria, valor, detalle: detalle || undefined, fechaISO: new Date().toISOString() })
    if (esFijo) {
      agregarFijo({ categoria, valor, detalle: detalle || undefined, diaDelMes: parseInt(diaDelMes, 10) || 1 })
    }
    setValor(0)
    setDetalle('')
    setEsFijo(false)
  }

  return (
    <Pantalla>
      <TituloPantalla kicker="Gastos del hogar" titulo="Lo que sale de casa" bajada="Mercado, arriendo, servicios — todo lo que la jornada tiene que cubrir." />

      <div className="mt-4 flex gap-2">
        {PERIODOS.map((p) => (
          <Chip key={p.v} activo={periodo === p.v} onClick={() => setPeriodo(p.v)}>
            {p.l}
          </Chip>
        ))}
      </div>

      <Card className="mt-3 p-4">
        <p className="text-[10px] tracking-[0.12em] text-mute uppercase">Gasto del hogar · {PERIODOS.find((p) => p.v === periodo)?.l.toLowerCase()}</p>
        <p className="tabular mt-1 text-[26px] font-semibold text-loss">{formatearPesos(resumen.gastoHogar)}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3">
          <div>
            <p className="tabular text-[15px] font-semibold text-fg">{formatearPesos(promedioDia)}</p>
            <p className="text-[10px] text-mute uppercase">promedio por día</p>
          </div>
          <div>
            <p className="tabular text-[15px] font-semibold text-win">{Math.round(cubierto * 100)}%</p>
            <p className="text-[10px] text-mute uppercase">cubierto por el trabajo</p>
          </div>
        </div>
        <div className="mt-2">
          <BarraProgreso fraccion={cubierto} />
        </div>
      </Card>

      <TituloSeccion>Nuevo gasto</TituloSeccion>
      <Card className="space-y-3 p-4">
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIAS.map((c) => (
            <Chip key={c} activo={categoria === c} onClick={() => setCategoria(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Campo etiqueta="Valor">
            <EntradaPesos valor={valor} onCambio={setValor} />
          </Campo>
          <Campo etiqueta="Fecha">
            <Entrada type="date" defaultValue={new Date().toISOString().slice(0, 10)} disabled className="opacity-70" />
          </Campo>
        </div>
        <Campo etiqueta="Detalle">
          <Entrada value={detalle} onChange={(e) => setDetalle(e.target.value)} placeholder="Mercado, arriendo, recibo…" />
        </Campo>

        <button
          onClick={() => setEsFijo((v) => !v)}
          className="flex w-full items-center gap-2 rounded-[var(--radius-btn)] border border-line px-3 py-2.5 text-left"
          style={esFijo ? { borderColor: 'var(--c-acento-linea)', background: 'var(--grad-acento-suave)' } : undefined}
        >
          <Repeat size={15} className={esFijo ? 'text-acento-alto' : 'text-mute'} />
          <span className="flex-1 text-[12.5px] text-fg">Es un gasto fijo: agrégalo solo cada mes</span>
          <span className={`size-4 rounded-full border ${esFijo ? 'border-acento bg-acento' : 'border-line-strong'}`} />
        </button>
        {esFijo && (
          <Campo etiqueta="Día del mes en que se paga">
            <Entrada inputMode="numeric" value={diaDelMes} onChange={(e) => setDiaDelMes(e.target.value)} />
          </Campo>
        )}

        <Boton disabled={valor <= 0} onClick={guardarGasto}>
          Guardar gasto
        </Boton>
      </Card>

      {estado.gastosHogarFijos.length > 0 && (
        <>
          <TituloSeccion>Gastos fijos</TituloSeccion>
          <div className="space-y-2">
            {estado.gastosHogarFijos.map((f) => (
              <Card key={f.id} className="flex items-center justify-between p-3.5">
                <div>
                  <p className="text-[13.5px] font-medium text-fg">{f.detalle || f.categoria}</p>
                  <p className="text-[11px] text-mute">cada mes, día {f.diaDelMes}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="tabular text-[14px] font-semibold text-fg">{formatearPesos(f.valor)}</p>
                  <button onClick={() => eliminarFijo(f.id)} aria-label="Eliminar" className="text-mute">
                    <X size={15} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <TituloSeccion>Historial</TituloSeccion>
      {listaOrdenada.length === 0 ? (
        <p className="text-[13px] text-mute">No hay gastos en este período.</p>
      ) : (
        <div className="space-y-2">
          {listaOrdenada.map((g) => (
            <Card key={g.id} className="flex items-center justify-between p-3.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-[var(--radius-pill)] border border-line px-2 py-0.5 text-[9.5px] font-semibold tracking-[0.06em] text-mute uppercase">
                    {g.categoria}
                  </span>
                  <p className="truncate text-[13px] font-medium text-fg">{g.detalle}</p>
                </div>
                <p className="mt-0.5 text-[10.5px] text-mute">{formatearFechaCorta(g.fechaISO)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                <p className="tabular text-[14px] font-semibold text-loss">-{formatearPesos(g.valor)}</p>
                <button
                  onClick={() => marcarPagado(g.id, !g.pagado)}
                  aria-label="Marcar pagado"
                  className={`grid size-7 place-items-center rounded-full border ${g.pagado ? 'border-win bg-win/15 text-win' : 'border-line-strong text-mute'}`}
                >
                  <Check size={13} />
                </button>
                <button onClick={() => eliminarGastoHogar(g.id)} aria-label="Eliminar" className="text-mute">
                  <X size={15} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Pantalla>
  )
}
