import { useState } from 'react'
import { motion } from 'framer-motion'
import { ToggleRight, Play, Users, ScrollText, TriangleAlert } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, SectionHeader, Badge, Button, Divider } from '../../components/ui/primitives'
import { Toggle, FilaAjuste } from '../../components/ui/controls'
import { interruptores } from '../../lib/mock/data'
import { listaEscalonada, elementoLista } from '../../design/motion'

/*
 * Administración — manual §7.3, módulo 9 (Admin).
 * Interruptores por mercado, control de acceso por plan y ejecución manual.
 * Todo lo nuevo llega apagado y pasa antes por modo sombra (§9, puerta 7).
 */
export function AdminScreen() {
  const [mercados, setMercados] = useState(interruptores)
  const [acceso, setAcceso] = useState({ oportunidades: true, alertas: true })
  const [simulacion, setSimulacion] = useState(true)

  return (
    <Pantalla>
      <TituloPantalla
        kicker="Control del sistema"
        titulo="Adminis"
        destacado="tración"
        bajada="Encender y apagar sin desplegar. Cada cambio se aplica de inmediato."
      />

      {/* Interruptores por mercado */}
      <section className="mt-6">
        <SectionHeader
          icono={<ToggleRight size={16} strokeWidth={1.6} />}
          titulo="Mercados"
          descripcion="Un mercado que se porta mal se apaga en segundos, sin tocar código."
        />

        <motion.ul variants={listaEscalonada} initial="inicial" animate="entra" className="mt-3 space-y-2">
          {mercados.map((m, i) => (
            <motion.li key={m.clave} variants={elementoLista}>
              <Card plano className="p-3.5">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-[14px] font-medium text-fg">{m.legible}</p>
                      {m.modoSombra && <Badge tono="acento">Modo sombra</Badge>}
                      {!m.activo && <Badge tono="void">Apagado</Badge>}
                    </div>
                    <p className="mt-0.5 font-mono text-[11px] text-mute">
                      {m.clave} · {m.n} resueltas
                    </p>
                  </div>
                  <Toggle
                    activo={m.activo}
                    onChange={(v) =>
                      setMercados((lista) =>
                        lista.map((x, j) => (j === i ? { ...x, activo: v } : x))
                      )
                    }
                    etiqueta={`Activar ${m.legible}`}
                  />
                </div>

                {m.modoSombra && m.activo && (
                  <p className="mt-2.5 border-t border-line pt-2.5 text-[11.5px] leading-snug text-mute">
                    Calcula y registra, pero no publica. Se promueve solo cuando su CLV en sombra
                    sea coherente con el backtest.
                  </p>
                )}
              </Card>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* Acceso por plan */}
      <section className="mt-8">
        <SectionHeader
          icono={<Users size={16} strokeWidth={1.6} />}
          titulo="Acceso por plan"
          descripcion="Se comprueba en el servidor. Ocultar en el cliente no es proteger."
        />
        <Card className="mt-3 divide-y divide-[var(--c-line)] px-4">
          <FilaAjuste
            titulo="Oportunidades"
            descripcion="Los usuarios gratuitos ven un muro en vez de la lista completa."
            control={
              <Toggle
                activo={acceso.oportunidades}
                onChange={(v) => setAcceso((a) => ({ ...a, oportunidades: v }))}
                etiqueta="Restringir oportunidades"
              />
            }
          />
          <FilaAjuste
            titulo="Alertas del bot"
            descripcion="Los usuarios gratuitos no ven la comparativa en Mis apuestas."
            control={
              <Toggle
                activo={acceso.alertas}
                onChange={(v) => setAcceso((a) => ({ ...a, alertas: v }))}
                etiqueta="Restringir alertas"
              />
            }
          />
        </Card>
      </section>

      {/* Ejecución */}
      <section className="mt-8">
        <SectionHeader
          icono={<Play size={16} strokeWidth={1.6} />}
          titulo="Ejecución de motores"
          descripcion="Forzar una corrida fuera de horario. Idempotente: no duplica apuestas."
        />

        <Card className="mt-3 p-4">
          <div className="flex items-center gap-3">
            <Toggle
              activo={simulacion}
              onChange={setSimulacion}
              etiqueta="Modo simulación"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium text-fg">Modo simulación</p>
              <p className="text-[11.5px] leading-snug text-mute">
                Analiza sin escribir en la base de datos.
              </p>
            </div>
          </div>

          <Divider />

          <div className="mt-3 flex gap-2">
            <Button variante="acento" ancho icono={<Play size={15} strokeWidth={2} />}>
              Motor fútbol
            </Button>
            <Button variante="contorno" ancho disabled>
              Baloncesto
            </Button>
          </div>

          {!simulacion && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex gap-2.5 rounded-[10px] border border-[color-mix(in_srgb,var(--c-loss)_35%,transparent)] bg-[color-mix(in_srgb,var(--c-loss)_10%,transparent)] p-3"
            >
              <TriangleAlert size={15} className="mt-0.5 shrink-0 text-loss" strokeWidth={1.8} />
              <p className="text-[12px] leading-snug text-dim">
                Con la simulación apagada, la corrida escribe en la base de datos. Sigue siendo
                modo PAPER: no se mueve dinero real.
              </p>
            </motion.div>
          )}
        </Card>
      </section>

      {/* Auditoría */}
      <section className="mt-8">
        <SectionHeader
          icono={<ScrollText size={16} strokeWidth={1.6} />}
          titulo="Registro de auditoría"
          descripcion="Solo-anexado. Nada se edita ni se borra."
        />
        <Card plano className="mt-3 divide-y divide-[var(--c-line)] px-4">
          {[
            ['09:00', 'Corrida completa · 118 partidos · 3 alertas'],
            ['08:15', 'Artefacto v2026.09.03 cargado · hash verificado'],
            ['06:00', 'Ingesta de cuotas · 12 errores registrados'],
          ].map(([hora, texto]) => (
            <div key={hora} className="flex gap-3 py-3">
              <span className="tabular shrink-0 text-[12px] text-acento-alto">{hora}</span>
              <span className="text-[12.5px] leading-snug text-mute">{texto}</span>
            </div>
          ))}
        </Card>
      </section>
    </Pantalla>
  )
}
