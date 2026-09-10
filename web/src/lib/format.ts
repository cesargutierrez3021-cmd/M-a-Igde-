/*
 * Formateadores. Todos con locale es-CO porque el proyecto opera en Colombia
 * (Fly.io región Bogotá, ligas de Sudamérica). Un solo sitio para que las
 * cifras se vean idénticas en toda la app.
 */

const pesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatearPesos(valor: number): string {
  return pesos.format(valor)
}

export function formatearPorcentaje(fraccion: number, decimales = 1): string {
  return `${(fraccion * 100).toFixed(decimales)}%`
}

export function formatearConSigno(fraccion: number, decimales = 1): string {
  const signo = fraccion > 0 ? '+' : ''
  return `${signo}${(fraccion * 100).toFixed(decimales)}%`
}

export function formatearCuota(cuota: number): string {
  return cuota.toFixed(2)
}

export function formatearUnidades(u: number): string {
  const signo = u > 0 ? '+' : ''
  return `${signo}${u.toFixed(2)} u`
}

export function formatearHora(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

export function formatearFechaCorta(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
}

export function formatearFechaLarga(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** "en 3 h 20 min" — cuenta atrás hasta el inicio del partido. */
export function faltanPara(iso: string, ahora = Date.now()): string {
  const ms = new Date(iso).getTime() - ahora
  if (ms <= 0) return 'en juego'
  const minutos = Math.floor(ms / 60000)
  const horas = Math.floor(minutos / 60)
  if (horas >= 24) return `en ${Math.floor(horas / 24)} d`
  if (horas === 0) return `en ${minutos} min`
  return `en ${horas} h ${minutos % 60} min`
}
