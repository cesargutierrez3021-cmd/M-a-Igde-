import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from './utils'
import type {
  Ajustes,
  BloqueRutina,
  Bono,
  Deuda,
  Ejercicio,
  EstadoNoah,
  GastoHogar,
  GastoHogarFijo,
  GastoMoto,
  Jornada,
  RecordatorioManual,
  Viaje,
} from './types'

const AJUSTES_POR_DEFECTO: Ajustes = {
  metaDiaria: 90000,
  moneda: 'COP',
  appPreferida: 'Uber',
  horaAvisoDiario: '19:00',
  vozAsistente: 'confirmar',
}

interface Acciones {
  // jornada
  iniciarJornada: () => void
  terminarJornada: () => void
  jornadaAbierta: () => Jornada | undefined

  // viajes
  registrarViajeGPS: (v: Omit<Viaje, 'id' | 'fuente'>) => string
  registrarViajeManual: (v: Omit<Viaje, 'id' | 'fuente'>) => void
  fijarPagoViaje: (id: string, pago: number) => void
  eliminarViaje: (id: string) => void

  agregarBono: (b: Omit<Bono, 'id'>) => void
  agregarGastoMoto: (g: Omit<GastoMoto, 'id'>) => void
  eliminarGastoMoto: (id: string) => void

  agregarGastoHogar: (g: Omit<GastoHogar, 'id' | 'pagado'>) => void
  marcarGastoHogarPagado: (id: string, pagado: boolean) => void
  eliminarGastoHogar: (id: string) => void
  agregarGastoHogarFijo: (g: Omit<GastoHogarFijo, 'id' | 'activo'>) => void
  eliminarGastoHogarFijo: (id: string) => void

  agregarDeuda: (d: Omit<Deuda, 'id' | 'abonado' | 'pagos' | 'archivada'>) => void
  abonarDeuda: (id: string, monto: number) => void
  eliminarDeuda: (id: string) => void

  agregarRecordatorio: (r: Omit<RecordatorioManual, 'id' | 'disparado'>) => void
  marcarRecordatorioDisparado: (id: string) => void
  eliminarRecordatorio: (id: string) => void

  agregarBloqueRutina: (b: Omit<BloqueRutina, 'id'>) => void
  actualizarBloqueRutina: (id: string, cambios: Partial<BloqueRutina>) => void
  eliminarBloqueRutina: (id: string) => void
  agregarEjercicio: (bloqueId: string, e: Omit<Ejercicio, 'id'>) => void
  eliminarEjercicio: (bloqueId: string, ejercicioId: string) => void

  actualizarAjustes: (cambios: Partial<Ajustes>) => void

  /** corre al abrir la app: genera los gastos fijos del mes que falten */
  generarGastosFijosDelMes: () => void
}

type Tienda = EstadoNoah & Acciones

export const useTienda = create<Tienda>()(
  persist(
    (set, get) => ({
      version: 1,
      jornadas: [],
      viajes: [],
      bonos: [],
      gastosMoto: [],
      gastosHogar: [],
      gastosHogarFijos: [],
      deudas: [],
      recordatorios: [],
      rutina: [],
      ajustes: AJUSTES_POR_DEFECTO,

      jornadaAbierta: () => get().jornadas.find((j) => j.finISO === null),

      iniciarJornada: () =>
        set((s) => {
          if (s.jornadas.some((j) => j.finISO === null)) return s
          return { jornadas: [...s.jornadas, { id: uid(), inicioISO: new Date().toISOString(), finISO: null, viajesIds: [] }] }
        }),

      terminarJornada: () =>
        set((s) => ({
          jornadas: s.jornadas.map((j) => (j.finISO === null ? { ...j, finISO: new Date().toISOString() } : j)),
        })),

      registrarViajeGPS: (v) => {
        const id = uid()
        set((s) => {
          const viaje: Viaje = { ...v, id, fuente: 'gps' }
          const abierta = s.jornadas.find((j) => j.finISO === null)
          const jornadas = abierta
            ? s.jornadas.map((j) => (j.id === abierta.id ? { ...j, viajesIds: [...j.viajesIds, id] } : j))
            : s.jornadas
          return { viajes: [...s.viajes, viaje], jornadas }
        })
        return id
      },

      registrarViajeManual: (v) =>
        set((s) => {
          const id = uid()
          const viaje: Viaje = { ...v, id, fuente: 'manual' }
          const abierta = s.jornadas.find((j) => j.finISO === null)
          const jornadas = abierta
            ? s.jornadas.map((j) => (j.id === abierta.id ? { ...j, viajesIds: [...j.viajesIds, id] } : j))
            : s.jornadas
          return { viajes: [...s.viajes, viaje], jornadas }
        }),

      fijarPagoViaje: (id, pago) => set((s) => ({ viajes: s.viajes.map((v) => (v.id === id ? { ...v, pago } : v)) })),
      eliminarViaje: (id) => set((s) => ({ viajes: s.viajes.filter((v) => v.id !== id) })),

      agregarBono: (b) => set((s) => ({ bonos: [{ ...b, id: uid() }, ...s.bonos] })),

      agregarGastoMoto: (g) => set((s) => ({ gastosMoto: [{ ...g, id: uid() }, ...s.gastosMoto] })),
      eliminarGastoMoto: (id) => set((s) => ({ gastosMoto: s.gastosMoto.filter((g) => g.id !== id) })),

      agregarGastoHogar: (g) => set((s) => ({ gastosHogar: [{ ...g, id: uid(), pagado: false }, ...s.gastosHogar] })),
      marcarGastoHogarPagado: (id, pagado) =>
        set((s) => ({ gastosHogar: s.gastosHogar.map((g) => (g.id === id ? { ...g, pagado } : g)) })),
      eliminarGastoHogar: (id) => set((s) => ({ gastosHogar: s.gastosHogar.filter((g) => g.id !== id) })),
      agregarGastoHogarFijo: (g) => set((s) => ({ gastosHogarFijos: [{ ...g, id: uid(), activo: true }, ...s.gastosHogarFijos] })),
      eliminarGastoHogarFijo: (id) => set((s) => ({ gastosHogarFijos: s.gastosHogarFijos.filter((g) => g.id !== id) })),

      agregarDeuda: (d) => set((s) => ({ deudas: [{ ...d, id: uid(), abonado: 0, pagos: [], archivada: false }, ...s.deudas] })),
      abonarDeuda: (id, monto) =>
        set((s) => ({
          deudas: s.deudas.map((d) =>
            d.id === id
              ? { ...d, abonado: d.abonado + monto, pagos: [...d.pagos, { id: uid(), monto, fechaISO: new Date().toISOString() }] }
              : d
          ),
        })),
      eliminarDeuda: (id) => set((s) => ({ deudas: s.deudas.filter((d) => d.id !== id) })),

      agregarRecordatorio: (r) => set((s) => ({ recordatorios: [{ ...r, id: uid(), disparado: false }, ...s.recordatorios] })),
      marcarRecordatorioDisparado: (id) =>
        set((s) => ({ recordatorios: s.recordatorios.map((r) => (r.id === id ? { ...r, disparado: true } : r)) })),
      eliminarRecordatorio: (id) => set((s) => ({ recordatorios: s.recordatorios.filter((r) => r.id !== id) })),

      agregarBloqueRutina: (b) => set((s) => ({ rutina: [...s.rutina, { ...b, id: uid() }] })),
      actualizarBloqueRutina: (id, cambios) =>
        set((s) => ({ rutina: s.rutina.map((b) => (b.id === id ? { ...b, ...cambios } : b)) })),
      eliminarBloqueRutina: (id) => set((s) => ({ rutina: s.rutina.filter((b) => b.id !== id) })),
      agregarEjercicio: (bloqueId, e) =>
        set((s) => ({
          rutina: s.rutina.map((b) => (b.id === bloqueId ? { ...b, ejercicios: [...(b.ejercicios ?? []), { ...e, id: uid() }] } : b)),
        })),
      eliminarEjercicio: (bloqueId, ejercicioId) =>
        set((s) => ({
          rutina: s.rutina.map((b) =>
            b.id === bloqueId ? { ...b, ejercicios: (b.ejercicios ?? []).filter((e) => e.id !== ejercicioId) } : b
          ),
        })),

      actualizarAjustes: (cambios) => set((s) => ({ ajustes: { ...s.ajustes, ...cambios } })),

      generarGastosFijosDelMes: () =>
        set((s) => {
          const hoy = new Date()
          const nuevos: GastoHogar[] = []
          for (const f of s.gastosHogarFijos) {
            if (!f.activo) continue
            const yaExiste = s.gastosHogar.some((g) => {
              if (g.plantillaId !== f.id) return false
              const fg = new Date(g.fechaISO)
              return fg.getFullYear() === hoy.getFullYear() && fg.getMonth() === hoy.getMonth()
            })
            if (yaExiste) continue
            if (hoy.getDate() < f.diaDelMes) continue
            const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), f.diaDelMes)
            nuevos.push({
              id: uid(),
              categoria: f.categoria,
              valor: f.valor,
              detalle: f.detalle,
              fechaISO: fecha.toISOString(),
              plantillaId: f.id,
              pagado: false,
            })
          }
          if (nuevos.length === 0) return s
          return { gastosHogar: [...nuevos, ...s.gastosHogar] }
        }),
    }),
    { name: 'noah-conductor' }
  )
)
