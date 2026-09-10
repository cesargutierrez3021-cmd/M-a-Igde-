import { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Bell, Globe, Info, Check } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, SectionHeader, Divider, Badge } from '../../components/ui/primitives'
import { Toggle, FilaAjuste } from '../../components/ui/controls'
import { useTema, type Tema } from '../../lib/theme'
import { cn } from '../../lib/utils'

/* Ajustes — manual §7.3, módulo 11. */
export function AjustesScreen() {
  const [alertas, setAlertas] = useState({ telegram: true, push: true, correo: false, noBet: true })

  return (
    <Pantalla>
      <TituloPantalla
        kicker="Preferencias"
        titulo="Ajustes"
        bajada="Cómo se ve la app y cómo quieres que te avise."
      />

      {/* Tema */}
      <section className="mt-6">
        <SectionHeader
          icono={<Palette size={16} strokeWidth={1.6} />}
          titulo="Apariencia"
          descripcion="Los dos temas usan los mismos tokens: cambia el fondo, no la identidad."
        />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <TarjetaTema tema="noir" nombre="Noir" descripcion="Oscuro · por defecto" />
          <TarjetaTema tema="claro" nombre="Claro" descripcion="Papel cálido" />
        </div>
      </section>

      {/* Notificaciones */}
      <section className="mt-8">
        <SectionHeader
          icono={<Bell size={16} strokeWidth={1.6} />}
          titulo="Alertas"
          descripcion="Reintentar nunca duplica un aviso: cada alerta se envía una sola vez."
        />

        <Card className="mt-3 divide-y divide-[var(--c-line)] px-4">
          <FilaAjuste
            titulo="Telegram"
            descripcion="El canal principal. Llega en segundos."
            control={
              <Toggle
                activo={alertas.telegram}
                onChange={(v) => setAlertas((a) => ({ ...a, telegram: v }))}
                etiqueta="Alertas por Telegram"
              />
            }
          />
          <FilaAjuste
            titulo="Notificaciones push"
            descripcion="Requiere instalar NOAH como app."
            control={
              <Toggle
                activo={alertas.push}
                onChange={(v) => setAlertas((a) => ({ ...a, push: v }))}
                etiqueta="Notificaciones push"
              />
            }
          />
          <FilaAjuste
            titulo="Resumen por correo"
            descripcion="Una vez al día, con lo liquidado."
            control={
              <Toggle
                activo={alertas.correo}
                onChange={(v) => setAlertas((a) => ({ ...a, correo: v }))}
                etiqueta="Resumen por correo"
              />
            }
          />
          <FilaAjuste
            titulo="Avisarme también del NO BET"
            descripcion="Cuando no hay valor, también es información."
            control={
              <Toggle
                activo={alertas.noBet}
                onChange={(v) => setAlertas((a) => ({ ...a, noBet: v }))}
                etiqueta="Avisos de NO BET"
              />
            }
          />
        </Card>
      </section>

      {/* Región */}
      <section className="mt-8">
        <SectionHeader
          icono={<Globe size={16} strokeWidth={1.6} />}
          titulo="Región"
          descripcion="Afecta al formato de cifras y a la hora de los partidos."
        />
        <Card className="mt-3 divide-y divide-[var(--c-line)] px-4">
          <FilaAjuste titulo="Idioma" control={<span className="text-[13px] text-dim">Español</span>} />
          <FilaAjuste
            titulo="Zona horaria"
            control={<span className="text-[13px] text-dim">Bogotá · UTC−5</span>}
          />
          <FilaAjuste
            titulo="Moneda"
            control={<span className="text-[13px] text-dim">COP</span>}
          />
        </Card>
      </section>

      {/* Legal */}
      <section className="mt-8">
        <SectionHeader
          icono={<Info size={16} strokeWidth={1.6} />}
          titulo="Acerca de"
          descripcion="Lo que NOAH es y lo que no es."
        />
        <Card plano className="mt-3 p-4">
          <div className="flex flex-wrap gap-2">
            <Badge tono="void">v0.1.0 · PAPER</Badge>
            <Badge tono="void">Artefacto v2026.09.03</Badge>
          </div>
          <Divider />
          <p className="mt-3 text-[12px] leading-relaxed text-mute">
            NOAH es una herramienta de análisis deportivo. No acepta apuestas, no maneja dinero de
            terceros y no promete rentabilidad en ninguna pantalla. Muestra probabilidad, valor e
            incertidumbre, y marca como no concluyente lo que tiene muestra insuficiente.
          </p>
          <p className="mt-3 text-[12px] font-medium text-dim">+18 · Juego responsable.</p>
        </Card>
      </section>
    </Pantalla>
  )
}

/*
 * Selector de tema con vista previa real: cada tarjeta pinta una miniatura con
 * los colores de su tema. Elegir a ciegas entre "claro" y "oscuro" es peor
 * experiencia que verlo antes de tocar.
 */
function TarjetaTema({ tema, nombre, descripcion }: { tema: Tema; nombre: string; descripcion: string }) {
  const { tema: actual, fijar } = useTema()
  const activo = actual === tema

  const paleta =
    tema === 'noir'
      ? { fondo: '#0B0D10', sup: '#14181D', linea: 'rgba(195,199,204,0.14)', texto: '#F5F6F7' }
      : { fondo: '#F7F5F1', sup: '#FFFFFF', linea: 'rgba(20,24,29,0.10)', texto: '#14181D' }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => fijar(tema)}
      className={cn(
        'overflow-hidden rounded-[var(--radius-card)] border p-3 text-left transition-colors',
        activo ? 'border-gold-line' : 'border-line'
      )}
      style={{ background: activo ? 'var(--grad-gold-soft)' : 'var(--c-surface-2)' }}
      aria-pressed={activo}
    >
      {/* Miniatura */}
      <div
        className="h-20 w-full overflow-hidden rounded-[10px] border p-2"
        style={{ background: paleta.fondo, borderColor: paleta.linea }}
      >
        <div className="flex items-center gap-1">
          <span className="size-2 rounded-full" style={{ background: '#C9A227' }} />
          <span
            className="h-1.5 w-8 rounded-full"
            style={{ background: paleta.texto, opacity: 0.65 }}
          />
        </div>
        <div
          className="mt-2 h-7 w-full rounded-[6px] border"
          style={{ background: paleta.sup, borderColor: paleta.linea }}
        />
        <div className="mt-1.5 flex gap-1">
          <span className="h-3 flex-1 rounded-[4px]" style={{ background: paleta.sup }} />
          <span
            className="h-3 flex-1 rounded-[4px]"
            style={{ background: 'linear-gradient(135deg,#E8C766,#C9A227)' }}
          />
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <div>
          <p className="text-[13.5px] font-semibold text-fg">{nombre}</p>
          <p className="text-[11px] text-mute">{descripcion}</p>
        </div>
        {activo && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 480, damping: 22 }}
            className="grid size-5 shrink-0 place-items-center rounded-full"
            style={{ background: 'var(--grad-gold)' }}
          >
            <Check size={12} strokeWidth={3} color="#12140F" />
          </motion.span>
        )}
      </div>
    </motion.button>
  )
}
