import { useCallback, useEffect, useRef, useState } from 'react'
import { Geolocation } from '@capacitor/geolocation'
import { useTienda } from '../../lib/store'
import { RastreadorViaje } from '../../lib/geo'
import { formatearDuracion } from '../../lib/format'
import { Burbuja, esNativo } from '../../lib/nativo'
import type { App } from '../../lib/types'

/*
 * Motor del viaje: arranca el GPS, separa el reloj (corre siempre) del
 * kilometraje (solo suma con movimiento real, ver lib/geo.ts), y si la app
 * corre en el teléfono, mantiene sincronizada la burbuja flotante para que
 * el conductor pueda controlar el viaje sin salir de la app de la carrera.
 */

export interface EstadoViaje {
  activo: boolean
  km: number
  msTranscurridos: number
  app: App
  iniciarViaje: () => void
  terminarViaje: (guardar: boolean) => void
  cambiarApp: (a: App) => void
  errorGps: string | null
}

export function useViaje(): EstadoViaje {
  const registrarViajeGPS = useTienda((s) => s.registrarViajeGPS)
  const appPreferida = useTienda((s) => s.ajustes.appPreferida)
  const jornadaAbierta = useTienda((s) => s.jornadaAbierta)

  const [activo, setActivo] = useState(false)
  const [km, setKm] = useState(0)
  const [ms, setMs] = useState(0)
  const [app, setApp] = useState<App>(appPreferida)
  const [errorGps, setErrorGps] = useState<string | null>(null)

  const rastreador = useRef<RastreadorViaje | null>(null)
  const watchId = useRef<string | null>(null)
  const inicioISO = useRef<string>('')
  const tickRef = useRef<number | null>(null)

  const detenerGps = useCallback(async () => {
    if (watchId.current) {
      await Geolocation.clearWatch({ id: watchId.current }).catch(() => {})
      watchId.current = null
    }
  }, [])

  const terminarViaje = useCallback(
    (guardar: boolean) => {
      if (guardar && rastreador.current && inicioISO.current) {
        registrarViajeGPS({
          app,
          km: Math.round(rastreador.current.km * 10) / 10,
          pago: null,
          inicioISO: inicioISO.current,
          finISO: new Date().toISOString(),
        })
      }
      setActivo(false)
      setKm(0)
      setMs(0)
      rastreador.current = null
      void detenerGps()
      if (tickRef.current) window.clearInterval(tickRef.current)
      if (esNativo()) {
        Burbuja.actualizar({ km: '0.0', tiempo: '0m', enViaje: false }).catch(() => {})
      }
    },
    [app, detenerGps, registrarViajeGPS]
  )

  const iniciarViaje = useCallback(async () => {
    setErrorGps(null)
    try {
      const permiso = await Geolocation.requestPermissions()
      if (permiso.location !== 'granted' && permiso.coarseLocation !== 'granted') {
        setErrorGps('Sin permiso de ubicación: el viaje corre por tiempo, sin kilómetros.')
      }
    } catch {
      setErrorGps('No se pudo pedir el permiso de ubicación.')
    }

    inicioISO.current = new Date().toISOString()
    rastreador.current = new RastreadorViaje()
    setActivo(true)
    setKm(0)
    setMs(0)

    try {
      watchId.current = await Geolocation.watchPosition(
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 2000 },
        (pos, err) => {
          if (err || !pos) return
          const r = rastreador.current
          if (!r) return
          r.procesar({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            precisionM: pos.coords.accuracy ?? 50,
            timestampMs: pos.timestamp,
          })
          setKm(r.km)
        }
      )
    } catch {
      setErrorGps('El GPS no respondió: el viaje corre por tiempo, sin kilómetros.')
    }

    tickRef.current = window.setInterval(() => {
      if (rastreador.current) setMs(rastreador.current.msTranscurridos)
    }, 1000)
  }, [])

  // sincroniza la burbuja flotante mientras hay viaje activo
  useEffect(() => {
    if (!esNativo() || !activo) return
    Burbuja.actualizar({ km: km.toFixed(1), tiempo: formatearDuracion(ms), enViaje: true }).catch(() => {})
  }, [activo, km, ms])

  // escucha la burbuja: un toque allá termina o inicia el viaje desde acá
  useEffect(() => {
    if (!esNativo()) return
    let handle: { remove: () => void } | undefined
    Burbuja.addListener('accion', (d) => {
      if (d.accion === 'terminar') terminarViaje(true)
      if (d.accion === 'iniciar' && jornadaAbierta()) void iniciarViaje()
    }).then((h) => {
      handle = h
    })
    return () => handle?.remove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { activo, km, msTranscurridos: ms, app, iniciarViaje, terminarViaje, cambiarApp: setApp, errorGps }
}
