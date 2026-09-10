import { LocalNotifications } from '@capacitor/local-notifications'
import { AlarmaPantalla, esNativo } from '../../lib/nativo'
import type { Pendiente } from '../../lib/selectors'

/*
 * El día que vence, a las 12 del mediodía: alarma a pantalla completa.
 * 3 días antes y 1 día antes: un aviso normal, como el de un mensaje.
 * Todo se reprograma cada vez que se abre Avisos — no hace falta que el
 * conductor repita nada a mano.
 */

function idsDePendiente(p: Pendiente) {
  const base = `${p.tipo}-${p.id}`
  return { hoy: `${base}-hoy`, dias3: `${base}-3d`, dia1: `${base}-1d` }
}

function aLasDoce(iso: string): number {
  const d = new Date(iso)
  d.setHours(12, 0, 0, 0)
  return d.getTime()
}

export async function reprogramarVencimientos(pendientes: Pendiente[]) {
  if (!esNativo()) return

  for (const p of pendientes) {
    const { hoy, dias3, dia1 } = idsDePendiente(p)
    const vence = new Date(p.fechaVenceISO)

    if (p.diasParaVencer === 0) {
      await AlarmaPantalla.programar({
        id: hoy,
        fechaHoraMs: aLasDoce(p.fechaVenceISO),
        titulo: `${p.nombre} vence hoy`,
        detalle: `Cuota de ${p.valor.toLocaleString('es-CO')} pesos.`,
      }).catch(() => {})
    }

    if (p.diasParaVencer === 3 || p.diasParaVencer === 1) {
      const notifId = crearIdNumerico(p.diasParaVencer === 3 ? dias3 : dia1)
      const fecha = new Date(vence)
      fecha.setHours(9, 0, 0, 0)
      await LocalNotifications.schedule({
        notifications: [
          {
            id: notifId,
            title: p.diasParaVencer === 3 ? 'Está próximo a vencer' : 'Vence mañana',
            body: `${p.nombre} · ${p.valor.toLocaleString('es-CO')} pesos`,
            schedule: { at: fecha },
          },
        ],
      }).catch(() => {})
    }
  }
}

function crearIdNumerico(texto: string): number {
  let h = 0
  for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) >>> 0
  return h % 1_000_000
}
