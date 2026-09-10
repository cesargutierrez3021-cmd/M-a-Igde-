/*
 * Datos de ejemplo — SOLO para construir la interfaz antes de que exista la API
 * (Fase 7 del manual). Nada aquí es una predicción real.
 *
 * Cuando FastAPI esté en pie, se sustituye este archivo por peticiones con
 * TanStack Query: ninguna pantalla necesita cambiar, porque todas consumen
 * los tipos de lib/types.ts, no este módulo directamente.
 */
import type {
  Pick,
  NoBet,
  PuntoCurva,
  Resumen,
  YieldMercado,
  PuntoCalibracion,
  FilaModelo,
  Componente,
  CupoApi,
  InterruptorMercado,
} from '../types'

const enHoras = (h: number) => new Date(Date.now() + h * 3600_000).toISOString()
const haceDias = (d: number) => new Date(Date.now() - d * 86400_000).toISOString()

export const picks: Pick[] = [
  {
    id: 'p1',
    deporte: 'futbol',
    partido: 'Real Betis vs Real Madrid',
    liga: 'LaLiga',
    fechaHoraISO: enHoras(4.5),
    mercado: 'TOTALS_3.5_UNDER',
    mercadoLegible: 'Menos de 3.5 goles',
    seleccion: 'Under 3.5',
    probabilidadCalibrada: 0.801,
    probabilidadMin: 0.71,
    probabilidadMax: 0.89,
    cuotaJusta: 1.42,
    cuotaPublicada: 1.93,
    casa: 'Pinnacle',
    edgeRelativo: 0.288,
    edgeAbsoluto: 0.163,
    ev: 0.547,
    incertidumbre: 0.19,
    confianzaConsenso: 0.52,
    stakeSugerido: 0.021,
    stakeEscala: 4,
    modelos: ['dixon_coles', 'xg_poisson', 'elo'],
    resultado: 'pendiente',
  },
  {
    id: 'p2',
    deporte: 'futbol',
    partido: 'Genoa vs Como',
    liga: 'Serie A',
    fechaHoraISO: enHoras(7),
    mercado: 'TOTALS_2.5_OVER',
    mercadoLegible: 'Más de 2.5 goles',
    seleccion: 'Over 2.5',
    probabilidadCalibrada: 0.567,
    probabilidadMin: 0.5,
    probabilidadMax: 0.63,
    cuotaJusta: 1.94,
    cuotaPublicada: 2.38,
    casa: 'Bet365',
    edgeRelativo: 0.152,
    edgeAbsoluto: 0.075,
    ev: 0.35,
    incertidumbre: 0.27,
    confianzaConsenso: 0.59,
    stakeSugerido: 0.016,
    stakeEscala: 3,
    modelos: ['dixon_coles', 'xg_poisson', 'elo'],
    resultado: 'pendiente',
  },
  {
    id: 'p3',
    deporte: 'futbol',
    partido: 'Millonarios vs Junior',
    liga: 'Colombia Primera A',
    fechaHoraISO: enHoras(9.5),
    mercado: 'DOUBLE_CHANCE_1X',
    mercadoLegible: 'Local gana o empata',
    seleccion: '1X',
    probabilidadCalibrada: 0.678,
    probabilidadMin: 0.6,
    probabilidadMax: 0.75,
    cuotaJusta: 1.62,
    cuotaPublicada: 1.74,
    casa: 'Betplay',
    edgeRelativo: 0.074,
    edgeAbsoluto: 0.047,
    ev: 0.18,
    incertidumbre: 0.34,
    confianzaConsenso: 0.41,
    stakeSugerido: 0.009,
    stakeEscala: 2,
    modelos: ['elo', 'bradley_terry'],
    resultado: 'pendiente',
  },
]

export const noBets: NoBet[] = [
  {
    id: 'nb1',
    mercado: 'BTTS',
    mercadoLegible: 'Ambos marcan',
    motivo: 'EDGE_INSUFICIENTE',
    detalle: 'La mejor cuota del día queda 1,8% por debajo del listón de valor.',
  },
  {
    id: 'nb2',
    mercado: 'CORNERS_9.5',
    mercadoLegible: 'Córners 9.5',
    motivo: 'SIN_CALIBRACION',
    detalle: 'No hay calibrador vigente para este mercado en estas ligas.',
  },
  {
    id: 'nb3',
    mercado: 'CARDS_4.5',
    mercadoLegible: 'Tarjetas 4.5',
    motivo: 'MERCADO_APAGADO',
    detalle: 'Sin fuente de tarjetas fuera de Europa. Apagado a propósito.',
  },
]

export const historial: Pick[] = [
  {
    ...picks[0],
    id: 'h1',
    partido: 'Real Sociedad vs Celta Vigo',
    mercadoLegible: 'Visitante gana o empata',
    seleccion: 'X2',
    cuotaPublicada: 2.15,
    fechaHoraISO: haceDias(1),
    resultado: 'ganada',
    clv: 0.038,
    apostada: true,
  },
  {
    ...picks[1],
    id: 'h2',
    partido: 'Athletic vs Villarreal',
    mercadoLegible: 'Menos de 2.5 goles',
    seleccion: 'Under 2.5',
    cuotaPublicada: 1.88,
    fechaHoraISO: haceDias(2),
    resultado: 'perdida',
    clv: 0.012,
    apostada: true,
  },
  {
    ...picks[2],
    id: 'h3',
    partido: 'Lecce vs Torino',
    mercadoLegible: 'Hándicap asiático 0',
    seleccion: 'Local 0',
    cuotaPublicada: 2.05,
    fechaHoraISO: haceDias(3),
    resultado: 'nula',
    clv: -0.004,
    apostada: false,
  },
  {
    ...picks[0],
    id: 'h4',
    partido: 'Nacional vs Tolima',
    mercadoLegible: 'Más de 1.5 goles',
    seleccion: 'Over 1.5',
    cuotaPublicada: 1.42,
    fechaHoraISO: haceDias(4),
    resultado: 'ganada',
    clv: 0.026,
    apostada: true,
  },
]

/* Curva de 45 días con una caída intermedia: una curva perfecta no es creíble
   y el manual prohíbe presentar el sistema como si nunca perdiera. */
export const curva: PuntoCurva[] = Array.from({ length: 45 }, (_, i) => {
  // Tendencia suave + una racha mala en el tramo central: una curva sin caídas
  // no es creíble, y el manual prohíbe presentar el sistema como si no perdiera.
  const onda = Math.sin(i / 5) * 0.9
  const bache = 2.6 * Math.exp(-((i - 24) ** 2) / 42)
  const bot = 100 + i * 0.28 + onda - bache
  return {
    fechaISO: haceDias(45 - i),
    bot: Number(bot.toFixed(2)),
    usuario: Number((bot - Math.min(i * 0.055, 2.1)).toFixed(2)),
  }
})

export const resumen: Resumen = {
  capital: 500_000,
  unidadValor: 5_000,
  beneficio: 57_500,
  unidades: 11.5,
  roi: 0.041,
  rendimiento: 0.038,
  rachaActual: 2,
  clvMedio: 0.021,
  clvPositivo: 0.61,
  brier: 0.198,
  ece: 0.024,
  drawdownMaximo: -0.086,
  drawdownActual: -0.012,
  sharpe: 0.71,
  resueltas: 34,
  ganadas: 18,
  perdidas: 14,
  nulas: 2,
  muestraMinima: 100,
}

export const yieldPorMercado: YieldMercado[] = [
  { mercado: 'Under/Over', rendimiento: 0.071, n: 14 },
  { mercado: 'Doble opción', rendimiento: 0.042, n: 9 },
  { mercado: 'Hándicap', rendimiento: -0.018, n: 7 },
  { mercado: '1X2', rendimiento: 0.033, n: 4 },
]

export const calibracion: PuntoCalibracion[] = [
  { intervalo: '0-20%', predicha: 0.12, observada: 0.1, n: 6 },
  { intervalo: '20-40%', predicha: 0.31, observada: 0.28, n: 9 },
  { intervalo: '40-60%', predicha: 0.5, observada: 0.52, n: 11 },
  { intervalo: '60-80%', predicha: 0.69, observada: 0.66, n: 8 },
  { intervalo: '80-100%', predicha: 0.86, observada: 0.9, n: 5 },
]

export const modelos: FilaModelo[] = [
  { modelo: 'dixon_coles', mercado: 'Goles', brier: 0.191, ece: 0.021, clv: 0.028, n: 412, activo: true },
  { modelo: 'xg_poisson', mercado: 'Goles', brier: 0.196, ece: 0.026, clv: 0.019, n: 388, activo: true },
  { modelo: 'elo', mercado: '1X2', brier: 0.204, ece: 0.031, clv: 0.011, n: 502, activo: true },
  { modelo: 'bradley_terry', mercado: '1X2', brier: 0.209, ece: 0.038, clv: 0.004, n: 502, activo: true },
  { modelo: 'gbdt', mercado: 'Multi', brier: 0.213, ece: 0.052, clv: -0.006, n: 240, activo: false },
]

export const componentes: Componente[] = [
  { nombre: 'Motor de decisión', estado: 'correcto', detalle: 'Última corrida 09:00', ultimoLatidoISO: enHoras(-0.2) },
  { nombre: 'Worker de la cola', estado: 'correcto', detalle: '0 trabajos atascados', ultimoLatidoISO: enHoras(-0.05) },
  { nombre: 'Ingesta de cuotas', estado: 'atencion', detalle: '12 errores en la última pasada', ultimoLatidoISO: enHoras(-1.5) },
  { nombre: 'Captura de cierre', estado: 'correcto', detalle: '3 de 3 partidos capturados', ultimoLatidoISO: enHoras(-0.4) },
  { nombre: 'Artefacto de modelo', estado: 'correcto', detalle: 'v2026.09.03 · hash verificado', ultimoLatidoISO: haceDias(7) },
  { nombre: 'Telegram', estado: 'critico', detalle: 'Webhook no configurado', ultimoLatidoISO: haceDias(2) },
]

export const cupos: CupoApi[] = [
  { nombre: 'The Odds API', descripcion: 'Cuotas multi-casa · crédito mensual', usado: 318, total: 500, estado: 'correcto' },
  { nombre: 'API-Sports Fútbol', descripcion: 'Partidos y resultados · límite diario', usado: 24, total: 100, estado: 'correcto' },
  { nombre: 'football-data.org', descripcion: 'Calendario · 10 peticiones/min', usado: 86, total: 100, estado: 'atencion' },
]

export const interruptores: InterruptorMercado[] = [
  { clave: '1X2', legible: '1X2', activo: true, modoSombra: false, n: 502 },
  { clave: 'DOUBLE_CHANCE', legible: 'Doble oportunidad', activo: true, modoSombra: false, n: 388 },
  { clave: 'TOTALS', legible: 'Más / menos goles', activo: true, modoSombra: false, n: 641 },
  { clave: 'BTTS', legible: 'Ambos marcan', activo: true, modoSombra: true, n: 120 },
  { clave: 'HANDICAP', legible: 'Hándicap asiático', activo: true, modoSombra: false, n: 214 },
  { clave: 'CORNERS', legible: 'Córners', activo: false, modoSombra: false, n: 0 },
  { clave: 'CARDS', legible: 'Tarjetas', activo: false, modoSombra: false, n: 0 },
]
