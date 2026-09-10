import { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Bell, Globe, Info, Check } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, SectionHeader, Divider, Badge } from '../../components/ui/primitives'
import { Toggle, FilaAjuste } from '../../components/ui/controls'
import { useApariencia, TEMAS, MODOS, type Tema, type Modo } from '../../lib/theme'
import { VistaPrevia } from '../../components/brand/VistaPrevia'
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

      {/* Apariencia: dos ejes independientes */}
      <section className="mt-6">
        <SectionHeader
          icono={<Palette size={16} strokeWidth={1.6} />}
          titulo="Apariencia"
          descripcion="El tema decide la identidad; el modo, el fondo. Se eligen por separado."
        />

        <div className="mt-3 space-y-3">
          {(['terreno', 'mando'] as Tema[]).map((t) => (
            <TarjetaTema key={t} tema={t} />
          ))}
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
 * Selector de apariencia. Cada tarjeta es un tema, y dentro están sus dos modos
 * con vista previa real. Tocar una miniatura fija tema y modo a la vez, así que
 * cambiar de "Terreno oscuro" a "Mando claro" es un solo toque.
 */
function TarjetaTema({ tema }: { tema: Tema }) {
  const { tema: temaActivo, modo, fijarTema, fijarModo } = useApariencia()
  const activo = temaActivo === tema

  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      className={cn(
        'overflow-hidden rounded-[var(--radius-card)] border p-3.5 transition-colors',
        activo ? 'border-acento-linea' : 'border-line'
      )}
      style={{ background: activo ? 'var(--grad-acento-suave)' : 'var(--c-surface-2)' }}
    >
      <button
        onClick={() => fijarTema(tema)}
        className="flex w-full items-start justify-between gap-3 text-left"
        aria-pressed={activo}
      >
        <div className="min-w-0">
          <p className="display text-[15.5px] text-fg">{TEMAS[tema].nombre}</p>
          <p className="mt-0.5 text-[11.5px] text-mute">{TEMAS[tema].descripcion}</p>
        </div>
        {activo && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 480, damping: 22 }}
            className="grid size-5 shrink-0 place-items-center rounded-full"
            style={{ background: 'var(--grad-acento)' }}
          >
            <Check size={12} strokeWidth={3} color="var(--btn-fg)" />
          </motion.span>
        )}
      </button>

      <div className="mt-3 flex gap-2.5">
        {(['oscuro', 'claro'] as Modo[]).map((m) => {
          const elegida = activo && modo === m
          return (
            <button
              key={m}
              onClick={() => {
                fijarTema(tema)
                fijarModo(m)
              }}
              aria-pressed={elegida}
              className={cn(
                'flex-1 rounded-[8px] border p-1.5 transition-colors',
                elegida ? 'border-acento-linea' : 'border-transparent'
              )}
            >
              <VistaPrevia tema={tema} modo={m} />
              <span
                className={cn(
                  'mt-1.5 block text-center text-[9.5px] font-semibold uppercase tracking-[0.14em]',
                  elegida ? 'text-acento-alto' : 'text-mute'
                )}
              >
                {MODOS[m].nombre}
              </span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
