import { useEffect, useMemo, useState } from 'react'
import { AlarmClock, Check, ShieldAlert, X } from 'lucide-react'
import { Pantalla, TituloPantalla } from '../../components/shell/Pantalla'
import { Card, Boton, Campo, Entrada, TituloSeccion } from '../../components/ui/primitives'
import { useTienda } from '../../lib/store'
import { calcularResumen, proximosVencimientos } from '../../lib/selectors'
import { formatearPesos } from '../../lib/format'
import { AlarmaPantalla, esNativo } from '../../lib/nativo'
import { reprogramarVencimientos } from './programador'

export function AvisosScreen() {
  const estado = useTienda()
  const actualizarAjustes = useTienda((s) => s.actualizarAjustes)
  const agregarRecordatorio = useTienda((s) => s.agregarRecordatorio)
  const eliminarRecordatorio = useTienda((s) => s.eliminarRecordatorio)

  const hoy = useMemo(() => calcularResumen(estado, 'hoy'), [estado])
  const pendientes = useMemo(() => proximosVencimientos(estado), [estado])
  const leFalta = Math.max(0, estado.ajustes.metaDiaria - hoy.neto)

  const [permisoAlarmas, setPermisoAlarmas] = useState(true)
  const [titulo, setTitulo] = useState('')
  const [detalle, setDetalle] = useState('')
  const [fechaHora, setFechaHora] = useState('')

  useEffect(() => {
    void reprogramarVencimientos(pendientes)
    if (esNativo()) AlarmaPantalla.tienePermisoAlarmasExactas().then((r) => setPermisoAlarmas(r.concedido))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendientes.length])

  function programarRecordatorio() {
    if (!titulo || !fechaHora) return
    const fechaISO = new Date(fechaHora).toISOString()
    agregarRecordatorio({ titulo, detalle: detalle || undefined, fechaHoraISO: fechaISO })
    if (esNativo()) {
      AlarmaPantalla.programar({ id: `manual-${Date.now()}`, fechaHoraMs: new Date(fechaISO).getTime(), titulo, detalle }).catch(() => {})
    }
    setTitulo('')
    setDetalle('')
    setFechaHora('')
  }

  return (
    <Pantalla>
      <TituloPantalla kicker="Avisos" titulo="Lo que no te puedes perder" />

      <Card className="mt-4 p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-[0.12em] text-mute uppercase">Hora del aviso</p>
        </div>
        <input
          type="time"
          value={estado.ajustes.horaAvisoDiario}
          onChange={(e) => actualizarAjustes({ horaAvisoDiario: e.target.value })}
          className="tabular mt-1 min-h-11 w-full rounded-[var(--radius-btn)] border border-line bg-surface-2 px-3 text-[15px] text-fg"
        />
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <p className="text-[13px] text-fg">Necesita al día</p>
          <p className="tabular text-[15px] font-semibold text-fg">{formatearPesos(estado.ajustes.metaDiaria)}</p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[13px] text-fg">Lleva hoy</p>
          <p className={`tabular text-[15px] font-semibold ${hoy.neto >= 0 ? 'text-win' : 'text-loss'}`}>{formatearPesos(hoy.neto)}</p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[13px] text-fg">Le falta</p>
          <p className="tabular text-[15px] font-semibold text-loss">{formatearPesos(leFalta)}</p>
        </div>
      </Card>

      <TituloSeccion>Nuevo recordatorio</TituloSeccion>
      <Card className="space-y-3 p-4">
        <Campo etiqueta="Título">
          <Entrada value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="¿Qué debo recordarte?" />
        </Campo>
        <Campo etiqueta="Detalle (opcional)">
          <Entrada value={detalle} onChange={(e) => setDetalle(e.target.value)} />
        </Campo>
        <Campo etiqueta="Fecha y hora">
          <Entrada type="datetime-local" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} />
        </Campo>
        <Boton disabled={!titulo || !fechaHora} onClick={programarRecordatorio}>
          <span className="flex items-center justify-center gap-2">
            <AlarmClock size={15} /> Programar alarma
          </span>
        </Boton>
      </Card>

      {estado.recordatorios.filter((r) => !r.disparado).length > 0 && (
        <>
          <TituloSeccion>Recordatorios activos</TituloSeccion>
          <div className="space-y-2">
            {estado.recordatorios
              .filter((r) => !r.disparado)
              .map((r) => (
                <Card key={r.id} className="flex items-center justify-between p-3.5">
                  <div>
                    <p className="text-[13.5px] font-medium text-fg">{r.titulo}</p>
                    <p className="text-[11px] text-mute">{new Date(r.fechaHoraISO).toLocaleString('es-CO')}</p>
                  </div>
                  <button onClick={() => eliminarRecordatorio(r.id)} aria-label="Eliminar" className="text-mute">
                    <X size={15} />
                  </button>
                </Card>
              ))}
          </div>
        </>
      )}

      {pendientes.length > 0 && (
        <>
          <TituloSeccion>Vencimientos próximos</TituloSeccion>
          <p className="-mt-2 mb-2 text-[11.5px] text-mute">
            Avisan solos: a las 12 del día que vencen, y una notificación 3 y 1 día antes.
          </p>
          <div className="space-y-2">
            {pendientes.map((p) => (
              <Card key={`${p.tipo}-${p.id}`} className="flex items-center justify-between p-3.5">
                <div>
                  <p className="text-[13.5px] font-medium text-fg">{p.nombre}</p>
                  <p className="text-[11px] text-mute">
                    {p.diasParaVencer === 0 ? 'vence hoy' : p.diasParaVencer < 0 ? 'vencido' : `en ${p.diasParaVencer} días`}
                  </p>
                </div>
                <p className="tabular text-[14px] font-semibold text-fg">{formatearPesos(p.valor)}</p>
              </Card>
            ))}
          </div>
        </>
      )}

      <TituloSeccion>Permisos de alarma</TituloSeccion>
      <Card className="space-y-3 p-4">
        <p className="text-[12px] leading-relaxed text-mute">
          Falta darle permiso a lo que aparezca en rojo abajo. Sin esto, Android retrasa las alarmas o no las muestra sobre la pantalla bloqueada.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => esNativo() && AlarmaPantalla.solicitarPermisoAlarmasExactas()}
            className={`flex items-center justify-center gap-1.5 rounded-[var(--radius-btn)] border py-3 text-[12.5px] font-medium ${permisoAlarmas ? 'border-line text-dim' : 'border-loss/45 text-loss'}`}
          >
            Alarmas exactas {permisoAlarmas && <Check size={14} />}
          </button>
          <button
            onClick={() => esNativo() && AlarmaPantalla.solicitarPermisoAlarmasExactas()}
            className="display flex items-center justify-center gap-1.5 rounded-[var(--radius-btn)] py-3 text-[12.5px] font-semibold text-[var(--btn-fg)] uppercase tracking-[0.03em]"
            style={{ background: 'var(--grad-acento)' }}
          >
            <ShieldAlert size={14} /> Pantalla completa
          </button>
        </div>
        <Boton
          variante="contorno"
          onClick={() =>
            esNativo() &&
            AlarmaPantalla.programar({ id: 'prueba', fechaHoraMs: Date.now() + 5000, titulo: 'Alarma de prueba', detalle: 'Así se va a ver' })
          }
        >
          Probar la alarma ahora
        </Boton>
      </Card>
    </Pantalla>
  )
}
