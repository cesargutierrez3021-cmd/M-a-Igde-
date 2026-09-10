import { useEffect, useRef, useState } from 'react'

interface NumeroAnimadoProps {
  valor: number
  decimales?: number
  sufijo?: string
  prefijo?: string
}

/*
 * Conteo animado al entrar — manual §7.5: 0 al valor, 600ms, curva easeOut.
 * "Este detalle es el que más 'caro' hace ver un panel de estadísticas."
 * Respeta prefers-reduced-motion saltando directo al valor final.
 */
export function NumeroAnimado({ valor, decimales = 0, sufijo = '', prefijo = '' }: NumeroAnimadoProps) {
  const [actual, setActual] = useState(0)
  const inicioRef = useRef<number | null>(null)

  useEffect(() => {
    const prefiereReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefiereReducido) {
      setActual(valor)
      return
    }
    const duracionMs = 600
    let frame: number
    const paso = (ts: number) => {
      if (inicioRef.current === null) inicioRef.current = ts
      const progreso = Math.min((ts - inicioRef.current) / duracionMs, 1)
      const easeOut = 1 - Math.pow(1 - progreso, 3)
      setActual(valor * easeOut)
      if (progreso < 1) frame = requestAnimationFrame(paso)
    }
    frame = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(frame)
  }, [valor])

  return (
    <span className="tabular">
      {prefijo}
      {actual.toFixed(decimales)}
      {sufijo}
    </span>
  )
}
