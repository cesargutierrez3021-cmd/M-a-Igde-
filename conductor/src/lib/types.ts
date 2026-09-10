/* Modelo de datos. Todo vive en este teléfono: nada sale a internet. */

export type App = 'Uber' | 'DiDi' | 'inDrive' | 'Cabify' | 'Picap' | 'Rappi' | 'Particular'

export const APPS: App[] = ['Uber', 'DiDi', 'inDrive', 'Cabify', 'Picap', 'Rappi', 'Particular']

export interface Viaje {
  id: string
  app: App
  km: number
  pago: number | null // null = pendiente de que el conductor escriba cuánto le pagaron
  inicioISO: string
  finISO: string
  nota?: string
  fuente: 'gps' | 'manual'
}

export interface Bono {
  id: string
  origen: App | 'Otro'
  monto: number
  concepto: string
  fechaISO: string
}

export type TipoGastoMoto = 'Gasolina' | 'Mantenimiento' | 'Comida' | 'Lavado' | 'Peaje' | 'Multa' | 'Otro'

export interface GastoMoto {
  id: string
  tipo: TipoGastoMoto
  valor: number
  litros?: number
  nota?: string
  fechaISO: string
}

export type CategoriaHogar =
  | 'Mercado'
  | 'Arriendo'
  | 'Servicios'
  | 'Internet'
  | 'Salud'
  | 'Familia'
  | 'Transporte'
  | 'Ocio'
  | 'Otro'

export interface GastoHogar {
  id: string
  categoria: CategoriaHogar
  valor: number
  detalle?: string
  fechaISO: string
  /** si viene de una plantilla fija, el id de esa plantilla */
  plantillaId?: string
  pagado: boolean
}

/** Un gasto de hogar que se repite solo cada mes. */
export interface GastoHogarFijo {
  id: string
  categoria: CategoriaHogar
  valor: number
  detalle?: string
  diaDelMes: number
  activo: boolean
}

export type VencimientoTipo = 'mensual' | 'unico'

export interface Deuda {
  id: string
  nombre: string
  saldoTotal: number
  cuota: number
  vencimiento: VencimientoTipo
  diaDelMes?: number
  fechaUnicaISO?: string
  abonado: number
  pagos: { id: string; monto: number; fechaISO: string }[]
  archivada: boolean
}

export interface Jornada {
  id: string
  inicioISO: string
  finISO: string | null
  viajesIds: string[]
}

export interface RecordatorioManual {
  id: string
  titulo: string
  detalle?: string
  fechaHoraISO: string
  disparado: boolean
}

export interface BloqueRutina {
  id: string
  dia: 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'
  horaInicio: string // "HH:mm"
  horaFin: string
  titulo: string
  tipo: 'entrenamiento' | 'comida' | 'descanso' | 'trabajo' | 'otro'
  detalle?: string
  ejercicios?: Ejercicio[]
}

export interface Ejercicio {
  id: string
  nombre: string
  series: number
  repeticiones: string
  pausaSeg: number
  imagenDataUrl?: string
  nota?: string
}

export interface Ajustes {
  metaDiaria: number
  moneda: 'COP'
  appPreferida: App
  horaAvisoDiario: string // "HH:mm"
  vozAsistente: 'silencio' | 'confirmar'
}

export interface EstadoNoah {
  version: 1
  jornadas: Jornada[]
  viajes: Viaje[]
  bonos: Bono[]
  gastosMoto: GastoMoto[]
  gastosHogar: GastoHogar[]
  gastosHogarFijos: GastoHogarFijo[]
  deudas: Deuda[]
  recordatorios: RecordatorioManual[]
  rutina: BloqueRutina[]
  ajustes: Ajustes
}
