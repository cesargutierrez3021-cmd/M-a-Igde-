/*
 * Datos de ejemplo — SOLO para desarrollar la interfaz antes de que exista la API real (Fase 7).
 * Nada de esto es una predicción real. Se sustituye por llamadas a FastAPI cuando el motor
 * esté conectado. Ver manual §4 (arquitectura) y §7 (interfaz).
 */
import type { Pick, NoBet, PuntoCurvaCapital, ResumenEstadisticas } from '../types'

export const picksDeHoy: Pick[] = [
  {
    id: 'p1',
    partido: 'Millonarios vs Junior',
    liga: 'Colombia Primera A',
    fechaHoraISO: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    mercado: 'TOTALS_2.5',
    seleccion: 'Más de 2.5',
    probabilidadCalibrada: 0.58,
    cuotaJusta: 1.72,
    cuotaPublicada: 1.85,
    edgeRelativo: 0.076,
    edgeAbsoluto: 0.043,
    ev: 0.073,
    incertidumbre: 0.22,
    stakeSugerido: 0.021,
    resultado: 'pendiente',
  },
  {
    id: 'p2',
    partido: 'River Plate vs Palmeiras',
    liga: 'Copa Libertadores',
    fechaHoraISO: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    mercado: '1X2',
    seleccion: 'Empate',
    probabilidadCalibrada: 0.31,
    cuotaJusta: 3.05,
    cuotaPublicada: 3.4,
    edgeRelativo: 0.11,
    edgeAbsoluto: 0.034,
    ev: 0.115,
    incertidumbre: 0.18,
    stakeSugerido: 0.014,
    resultado: 'pendiente',
  },
]

export const noBetsDeHoy: NoBet[] = [
  { id: 'nb1', fechaISO: new Date().toISOString(), mercado: 'BTTS', motivo: 'EDGE_INSUFICIENTE' },
  { id: 'nb2', fechaISO: new Date().toISOString(), mercado: 'CORNERS_9.5', motivo: 'SIN_CALIBRACION' },
]

export const curvaCapital: PuntoCurvaCapital[] = Array.from({ length: 30 }, (_, i) => ({
  fechaISO: new Date(Date.now() - (30 - i) * 86400000).toISOString(),
  capitalBot: 1000 * (1 + i * 0.004),
  capitalUsuario: 1000 * (1 + i * 0.0031),
}))

export const resumenEstadisticas: ResumenEstadisticas = {
  capitalActual: 1123.4,
  beneficioPerdida: 123.4,
  roi: 0.0412,
  yield: 0.0387,
  rachaActual: 2,
  clvMedio: 0.021,
  porcentajeClvPositivo: 0.61,
  brier: 0.198,
  drawdownMaximo: -0.086,
  drawdownActual: -0.012,
  sharpe: 0.71,
  muestraSuficiente: false, // menos de ~100 picks: se marca "no concluyente" (regla de honestidad §7.4)
}
