import { useMemo, useState } from 'react'
import { Pantalla, TituloPantalla } from '../../components/shell/Pantalla'
import { Card, Chip, TituloSeccion } from '../../components/ui/primitives'
import { useTienda } from '../../lib/store'
import { formatearPesos, formatearPesosCompacto } from '../../lib/format'
import { calcularResumen, type Periodo } from '../../lib/selectors'

const PERIODOS: { v: Periodo; l: string }[] = [
  { v: 'semana', l: 'Semana' },
  { v: 'mes', l: 'Mes' },
  { v: 'todo', l: 'Todo' },
]

export function BalanceScreen() {
  const estado = useTienda()
  const [periodo, setPeriodo] = useState<Periodo>('mes')
  const resumen = useMemo(() => calcularResumen(estado, periodo), [estado, periodo])

  const filas = [
    { etiqueta: 'Viajes', sub: `${resumen.viajes.length} servicios`, valor: resumen.ingresoViajes, tono: 'win' as const },
    { etiqueta: 'Bonos e incentivos', sub: undefined, valor: resumen.ingresoBonos, tono: 'win' as const },
    { etiqueta: 'Gasto de la moto', sub: 'gasolina, taller, comida', valor: -resumen.gastoMoto, tono: 'loss' as const },
    { etiqueta: 'Gasto del hogar', sub: undefined, valor: -resumen.gastoHogar, tono: 'loss' as const },
    { etiqueta: 'Cuotas de deuda', sub: 'del mes', valor: -resumen.cuotasDeuda, tono: 'loss' as const },
  ].filter((f) => f.valor !== 0)

  return (
    <Pantalla>
      <TituloPantalla kicker="Balance" titulo="A dónde se va el dinero" />

      <div className="mt-4 flex gap-2">
        {PERIODOS.map((p) => (
          <Chip key={p.v} activo={periodo === p.v} onClick={() => setPeriodo(p.v)}>
            {p.l}
          </Chip>
        ))}
      </div>

      <Card className="mt-3 p-4">
        <p className="text-[10px] tracking-[0.12em] text-mute uppercase">Queda libre · {PERIODOS.find((p) => p.v === periodo)?.l.toLowerCase()}</p>
        <p className={`tabular mt-1 text-[28px] font-semibold ${resumen.quedaLibre >= 0 ? 'text-fg' : 'text-loss'}`}>
          {formatearPesos(resumen.quedaLibre)}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3">
          <div>
            <p className="tabular text-[15px] font-semibold text-win">{formatearPesosCompacto(resumen.entro)}</p>
            <p className="text-[10px] text-mute uppercase">entró</p>
          </div>
          <div>
            <p className="tabular text-[15px] font-semibold text-loss">{formatearPesosCompacto(resumen.salio)}</p>
            <p className="text-[10px] text-mute uppercase">salió</p>
          </div>
        </div>
      </Card>

      <TituloSeccion>Detalle</TituloSeccion>
      {filas.length === 0 ? (
        <p className="text-[13px] text-mute">No hay movimientos en este período.</p>
      ) : (
        <div className="divide-y divide-[var(--c-line)] rounded-[var(--radius-card)] border border-line bg-surface">
          {filas.map((f) => (
            <div key={f.etiqueta} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-[13.5px] text-fg">{f.etiqueta}</p>
                {f.sub && <p className="text-[11px] text-mute">{f.sub}</p>}
              </div>
              <p className={`tabular text-[15px] font-semibold ${f.tono === 'win' ? 'text-win' : 'text-loss'}`}>
                {f.valor >= 0 ? '+' : ''}
                {formatearPesos(f.valor)}
              </p>
            </div>
          ))}
        </div>
      )}

      <TituloSeccion>Rendimiento del período</TituloSeccion>
      <Card className="divide-y divide-[var(--c-line)] p-0">
        <Fila etiqueta="Por hora en viaje" sub="hora productiva real" valor={formatearPesos(resumen.km > 0 ? resumen.neto / Math.max(1, resumen.viajes.length) : 0)} />
        <Fila etiqueta="Por día trabajado" sub={`${new Set(resumen.viajes.map((v) => v.finISO.slice(0, 10))).size} días`} valor={formatearPesos(resumen.neto / Math.max(1, new Set(resumen.viajes.map((v) => v.finISO.slice(0, 10))).size))} />
      </Card>
    </Pantalla>
  )
}

function Fila({ etiqueta, sub, valor }: { etiqueta: string; sub: string; valor: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-[13.5px] text-fg">{etiqueta}</p>
        <p className="text-[11px] text-mute">{sub}</p>
      </div>
      <p className="tabular text-[15px] font-semibold text-fg">{valor}</p>
    </div>
  )
}
