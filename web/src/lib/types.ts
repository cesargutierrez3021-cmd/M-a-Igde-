/*
 * Tipos del dominio NOAH, vistos desde la interfaz.
 * Reflejan lo que el contrato de mercado (manual §5) expone hacia afuera:
 * la interfaz nunca decide nada, solo muestra lo que el motor ya decidió.
 */

export type NivelUsuario = 'gratuito' | 'premium' | 'admin'

export type ResultadoPick = 'pendiente' | 'ganada' | 'perdida' | 'nula'

export interface Pick {
  id: string
  partido: string
  liga: string
  fechaHoraISO: string
  mercado: string // p.ej. "1X2", "TOTALS_2.5" — nunca se privilegia ninguno (invariante 4)
  seleccion: string
  probabilidadCalibrada: number // 0-1
  cuotaJusta: number
  cuotaPublicada: number
  edgeRelativo: number
  edgeAbsoluto: number
  ev: number
  incertidumbre: number // 0-1, a mayor valor menos evidencia
  stakeSugerido: number // fracción de Kelly simultáneo, 0-1
  resultado: ResultadoPick
  clv?: number // se conoce solo al cierre
}

export interface NoBet {
  id: string
  fechaISO: string
  mercado: string
  motivo: string // p.ej. "SIN_CALIBRACION", "EDGE_INSUFICIENTE"
}

export interface ApuestaUsuario {
  pickId: string
  aposto: boolean
  importe?: number
  cuotaReal?: number
}

export interface PuntoCurvaCapital {
  fechaISO: string
  capitalBot: number
  capitalUsuario: number
}

export interface ResumenEstadisticas {
  capitalActual: number
  beneficioPerdida: number
  roi: number
  yield: number
  rachaActual: number
  clvMedio: number
  porcentajeClvPositivo: number
  brier: number
  drawdownMaximo: number
  drawdownActual: number
  sharpe: number
  muestraSuficiente: boolean // por debajo de cierto n, todo se marca "no concluyente"
}
