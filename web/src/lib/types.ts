/*
 * Tipos del dominio NOAH vistos desde la interfaz.
 * La interfaz nunca decide nada: refleja lo que el motor ya decidió
 * (manual §4). Estos tipos son el contrato que la API deberá cumplir.
 */

export type NivelUsuario = 'gratuito' | 'premium' | 'admin'
export type Deporte = 'futbol' | 'baloncesto' | 'tenis'
export type ResultadoPick = 'pendiente' | 'ganada' | 'perdida' | 'nula' | 'invalidada'
export type EstadoSalud = 'correcto' | 'atencion' | 'critico'

export interface Pick {
  id: string
  deporte: Deporte
  partido: string
  liga: string
  fechaHoraISO: string
  /** Clave del mercado — el evaluador nunca privilegia ninguna (invariante 4). */
  mercado: string
  mercadoLegible: string
  seleccion: string
  probabilidadCalibrada: number
  probabilidadMin: number
  probabilidadMax: number
  cuotaJusta: number
  cuotaPublicada: number
  casa: string
  edgeRelativo: number
  edgeAbsoluto: number
  ev: number
  incertidumbre: number
  confianzaConsenso: number
  stakeSugerido: number
  stakeEscala: number
  modelos: string[]
  resultado: ResultadoPick
  clv?: number
  apostada?: boolean
}

export interface NoBet {
  id: string
  mercado: string
  mercadoLegible: string
  motivo: 'SIN_CALIBRACION' | 'EDGE_INSUFICIENTE' | 'INCERTIDUMBRE_ALTA' | 'MERCADO_APAGADO'
  detalle: string
}

export interface PuntoCurva {
  fechaISO: string
  bot: number
  usuario: number
}

export interface Resumen {
  capital: number
  unidadValor: number
  beneficio: number
  unidades: number
  roi: number
  rendimiento: number
  rachaActual: number
  clvMedio: number
  clvPositivo: number
  brier: number
  ece: number
  drawdownMaximo: number
  drawdownActual: number
  sharpe: number
  resueltas: number
  ganadas: number
  perdidas: number
  nulas: number
  muestraMinima: number
}

export interface YieldMercado {
  mercado: string
  rendimiento: number
  n: number
}

export interface PuntoCalibracion {
  intervalo: string
  predicha: number
  observada: number
  n: number
}

export interface FilaModelo {
  modelo: string
  mercado: string
  brier: number
  ece: number
  clv: number
  n: number
  activo: boolean
}

export interface Componente {
  nombre: string
  estado: EstadoSalud
  detalle: string
  ultimoLatidoISO: string
}

export interface CupoApi {
  nombre: string
  descripcion: string
  usado: number
  total: number
  estado: EstadoSalud
}

export interface InterruptorMercado {
  clave: string
  legible: string
  activo: boolean
  modoSombra: boolean
  n: number
}
