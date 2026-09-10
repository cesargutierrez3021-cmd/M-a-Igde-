import { useState } from 'react'
import { X } from 'lucide-react'
import { Pantalla, TituloPantalla } from '../../components/shell/Pantalla'
import { Card, Boton, Chip, Campo, Entrada, EntradaPesos, TituloSeccion, BarraProgreso } from '../../components/ui/primitives'
import { useTienda } from '../../lib/store'
import { formatearPesos, formatearPesosCompacto } from '../../lib/format'
import type { VencimientoTipo } from '../../lib/types'

export function DeudasScreen() {
  const estado = useTienda()
  const agregarDeuda = useTienda((s) => s.agregarDeuda)
  const abonarDeuda = useTienda((s) => s.abonarDeuda)
  const eliminarDeuda = useTienda((s) => s.eliminarDeuda)

  const deudas = estado.deudas.filter((d) => !d.archivada)
  const totalDeuda = deudas.reduce((a, d) => a + Math.max(0, d.saldoTotal - d.abonado), 0)
  const totalCuotas = deudas.reduce((a, d) => a + d.cuota, 0)

  const [nombre, setNombre] = useState('')
  const [saldoTotal, setSaldoTotal] = useState(0)
  const [cuota, setCuota] = useState(0)
  const [vencimiento, setVencimiento] = useState<VencimientoTipo>('mensual')
  const [diaDelMes, setDiaDelMes] = useState('5')
  const [fechaUnica, setFechaUnica] = useState('')

  function guardar() {
    agregarDeuda({
      nombre,
      saldoTotal,
      cuota,
      vencimiento,
      diaDelMes: vencimiento === 'mensual' ? parseInt(diaDelMes, 10) || 1 : undefined,
      fechaUnicaISO: vencimiento === 'unico' && fechaUnica ? new Date(fechaUnica).toISOString() : undefined,
    })
    setNombre('')
    setSaldoTotal(0)
    setCuota(0)
  }

  return (
    <Pantalla>
      <TituloPantalla kicker="Deudas" titulo="Lo que debes" bajada="Préstamos, arriendo, tarjetas — con su fecha y su abono." />

      <Card className="mt-4 p-4">
        <p className="text-[10px] tracking-[0.12em] text-mute uppercase">Saldo total pendiente</p>
        <p className="tabular mt-1 text-[26px] font-semibold text-loss">{formatearPesos(totalDeuda)}</p>
        <p className="tabular mt-1 text-[12px] text-mute">{formatearPesos(totalCuotas)} en cuotas mensuales</p>
      </Card>

      <TituloSeccion>Nueva deuda</TituloSeccion>
      <Card className="space-y-3 p-4">
        <Campo etiqueta="Nombre">
          <Entrada value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Préstamo moto, tarjeta, arriendo…" />
        </Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo etiqueta="Saldo total">
            <EntradaPesos valor={saldoTotal} onCambio={setSaldoTotal} />
          </Campo>
          <Campo etiqueta="Cuota">
            <EntradaPesos valor={cuota} onCambio={setCuota} />
          </Campo>
        </div>
        <Campo etiqueta="Vencimiento">
          <div className="flex gap-2">
            <Chip activo={vencimiento === 'mensual'} onClick={() => setVencimiento('mensual')}>
              Cada mes
            </Chip>
            <Chip activo={vencimiento === 'unico'} onClick={() => setVencimiento('unico')}>
              Fecha única
            </Chip>
          </div>
        </Campo>
        {vencimiento === 'mensual' ? (
          <Campo etiqueta="Día del mes que se paga">
            <Entrada inputMode="numeric" value={diaDelMes} onChange={(e) => setDiaDelMes(e.target.value)} />
          </Campo>
        ) : (
          <Campo etiqueta="Fecha">
            <Entrada type="date" value={fechaUnica} onChange={(e) => setFechaUnica(e.target.value)} />
          </Campo>
        )}
        <Boton disabled={!nombre || cuota <= 0} onClick={guardar}>
          Guardar deuda
        </Boton>
      </Card>

      <TituloSeccion>Detalle</TituloSeccion>
      {deudas.length === 0 ? (
        <p className="text-[13px] text-mute">No tienes deudas registradas.</p>
      ) : (
        <div className="space-y-3">
          {deudas.map((d) => (
            <FilaDeuda key={d.id} deuda={d} onAbonar={(m) => abonarDeuda(d.id, m)} onEliminar={() => eliminarDeuda(d.id)} />
          ))}
        </div>
      )}
    </Pantalla>
  )
}

function FilaDeuda({
  deuda: d,
  onAbonar,
  onEliminar,
}: {
  deuda: { id: string; nombre: string; saldoTotal: number; abonado: number; cuota: number; vencimiento: VencimientoTipo; diaDelMes?: number }
  onAbonar: (m: number) => void
  onEliminar: () => void
}) {
  const [abono, setAbono] = useState(d.cuota)
  const fraccion = d.saldoTotal > 0 ? d.abonado / d.saldoTotal : 0
  const porcentaje = Math.round(fraccion * 100)

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <p className="text-[14.5px] font-semibold text-fg">{d.nombre}</p>
        <div className="flex items-center gap-2">
          <p className="tabular text-[14px] font-semibold text-loss">{formatearPesosCompacto(d.saldoTotal)}</p>
          <button onClick={onEliminar} aria-label="Eliminar" className="text-mute">
            <X size={15} />
          </button>
        </div>
      </div>
      <div className="mt-2">
        <BarraProgreso fraccion={fraccion} />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="tabular text-[11px] text-mute">
          Abonado {formatearPesosCompacto(d.abonado)} de {formatearPesosCompacto(d.saldoTotal)} · {porcentaje}%
        </p>
        <span className="shrink-0 rounded-[var(--radius-pill)] border border-line px-2 py-0.5 text-[10px] text-mute">
          {d.vencimiento === 'mensual' ? `${d.diaDelMes}D` : 'única'}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1">
          <EntradaPesos valor={abono} onCambio={setAbono} />
        </div>
        <button
          disabled={abono <= 0}
          onClick={() => onAbonar(abono)}
          className="display min-h-11 shrink-0 rounded-[var(--radius-btn)] border border-acento-linea px-4 text-[12px] font-semibold tracking-[0.04em] text-acento-alto uppercase disabled:opacity-40"
        >
          Abonar {formatearPesosCompacto(abono)}
        </button>
      </div>
    </Card>
  )
}
