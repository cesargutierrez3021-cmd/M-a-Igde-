/*
 * Seguimiento GPS del viaje.
 *
 * Dos reglas separadas, como se pidió:
 *  - el TIEMPO corre desde que se pulsa iniciar hasta que se pulsa terminar,
 *    esté quieto o en movimiento el conductor;
 *  - los KILÓMETROS solo suman cuando el GPS confirma que hubo desplazamiento
 *    real, no ruido de la señal con el teléfono quieto.
 */

export interface Fijacion {
  lat: number
  lon: number
  precisionM: number
  timestampMs: number
}

const RADIO_TIERRA_M = 6371000

export function distanciaHaversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const rad = (g: number) => (g * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLon = rad(b.lon - a.lon)
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return RADIO_TIERRA_M * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

/** Precisión máxima que aceptamos de una fijación; peor que esto, se descarta. */
const PRECISION_MAX_M = 35
/** Velocidad mínima (m/s) para considerar que hubo movimiento real; ~1.5 km/h. */
const VELOCIDAD_MINIMA_MS = 0.42

export class RastreadorViaje {
  private ultima: Fijacion | null = null
  private kmAcumulados = 0
  private inicioMs: number

  constructor() {
    this.inicioMs = Date.now()
  }

  get km(): number {
    return this.kmAcumulados
  }

  get msTranscurridos(): number {
    return Date.now() - this.inicioMs
  }

  /** Procesa una fijación nueva y devuelve true si sumó distancia. */
  procesar(f: Fijacion): boolean {
    if (f.precisionM > PRECISION_MAX_M) return false
    if (!this.ultima) {
      this.ultima = f
      return false
    }
    const dt = (f.timestampMs - this.ultima.timestampMs) / 1000
    if (dt <= 0) return false

    const distanciaM = distanciaHaversine(this.ultima, f)
    // umbral dinámico: al menos el ruido combinado de las dos fijaciones
    const umbralM = Math.max(8, (f.precisionM + this.ultima.precisionM) * 0.5)
    const velocidadMs = distanciaM / dt

    if (distanciaM > umbralM && velocidadMs >= VELOCIDAD_MINIMA_MS) {
      this.kmAcumulados += distanciaM / 1000
      this.ultima = f
      return true
    }

    // si no se movió lo suficiente, no perdemos la referencia: así no se
    // acumula "deriva" fijación a fijación mientras el teléfono está quieto.
    if (distanciaM <= umbralM) this.ultima = f
    return false
  }
}
