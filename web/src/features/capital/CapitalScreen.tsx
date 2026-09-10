import { useState } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, ShieldCheck } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, SectionHeader, FiloSuperior, Button, Divider } from '../../components/ui/primitives'
import { Cifra, Barra } from '../../components/ui/data'
import { resumen, picks } from '../../lib/mock/data'
import { formatearPesos } from '../../lib/format'

/*
 * Capital — manual §7.3, módulo 5.
 * Lo que se fija aquí recalcula el stake que muestra toda la app: por eso la
 * pantalla enseña en vivo cómo cambia la apuesta sugerida al mover los mandos.
 */
export function CapitalScreen() {
  const [capital, setCapital] = useState(resumen.capital)
  const [kelly, setKelly] = useState(0.25)
  const [tope, setTope] = useState(5)

  const unidad = capital / 100
  const ejemplo = picks[0]
  const stakeCrudo = ejemplo ? ejemplo.stakeSugerido * capital * (kelly / 0.25) : 0
  const stakeFinal = Math.min(stakeCrudo, (capital * tope) / 100)
  const topeAplicado = stakeCrudo > (capital * tope) / 100

  return (
    <Pantalla>
      <TituloPantalla
        kicker="Gestión de riesgo"
        titulo="Tu"
        destacado="capital"
        bajada="Define la banca y cuánto riesgo aceptas. Todo lo demás se calcula sobre esto."
      />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
        <Card realce className="mt-5 p-4">
          <FiloSuperior dorado />
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
            Capital actual
          </p>
          <p className="gold-text mt-1.5 text-[34px] leading-none font-semibold">
            <Cifra valor={capital} prefijo="$" />
          </p>
          <p className="mt-2 text-[12.5px] text-mute">
            1 unidad = {formatearPesos(unidad)} · 1% del capital
          </p>
        </Card>
      </motion.div>

      <section className="mt-6">
        <SectionHeader
          icono={<SlidersHorizontal size={16} strokeWidth={1.6} />}
          titulo="Parámetros"
          descripcion="Kelly fraccionado protege de la ruina; el tope protege de un error del modelo."
        />

        <Card className="mt-3 p-4">
          <label className="block">
            <span className="text-[13px] font-medium text-fg">Banca inicial</span>
            <span className="mt-1.5 flex items-center rounded-[var(--radius-btn)] border border-line bg-surface-2 px-3">
              <span className="text-mute">$</span>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(Math.max(0, Number(e.target.value)))}
                className="tabular min-h-11 w-full bg-transparent px-1.5 text-[16px] text-fg outline-none"
              />
              <span className="text-[11px] text-mute">COP</span>
            </span>
          </label>

          <div className="my-4">
            <Divider />
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-medium text-fg">Fracción de Kelly</span>
              <span className="tabular text-[15px] font-semibold text-goldlite">
                {kelly.toFixed(2)}×
              </span>
            </div>
            <input
              type="range"
              min={0.05}
              max={1}
              step={0.05}
              value={kelly}
              onChange={(e) => setKelly(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--c-gold)]"
              aria-label="Fracción de Kelly"
            />
            <div className="mt-1 flex justify-between text-[10.5px] text-mute">
              <span>0,05 · muy conservador</span>
              <span>1,00 · Kelly completo</span>
            </div>
            <p className="mt-2 text-[11.5px] leading-snug text-mute">
              Kelly completo maximiza el crecimiento a largo plazo, pero con probabilidades que no
              son exactas produce caídas brutales. Por eso 0,25 es el valor por defecto.
            </p>
          </div>

          <div className="my-4">
            <Divider />
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-medium text-fg">Tope por apuesta</span>
              <span className="tabular text-[15px] font-semibold text-goldlite">{tope}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={1}
              value={tope}
              onChange={(e) => setTope(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--c-gold)]"
              aria-label="Tope por apuesta"
            />
            <p className="mt-2 text-[11.5px] leading-snug text-mute">
              Máximo del capital que puede ir a una sola apuesta, pase lo que pase con el modelo.
            </p>
          </div>
        </Card>
      </section>

      {/* Efecto en vivo sobre una apuesta real */}
      {ejemplo && (
        <section className="mt-6">
          <SectionHeader
            icono={<ShieldCheck size={16} strokeWidth={1.6} />}
            titulo="Cómo queda una apuesta"
            descripcion="Con tus parámetros, aplicado a la oportunidad de mayor valor de hoy."
          />

          <Card className="mt-3 p-4">
            <p className="text-[12px] text-mute">{ejemplo.partido}</p>
            <p className="text-[15px] font-medium text-fg">{ejemplo.mercadoLegible}</p>

            <div className="mt-3.5 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-mute">
                  Stake sugerido
                </p>
                <p className="gold-text text-[26px] leading-none font-semibold">
                  <Cifra valor={stakeFinal} prefijo="$" />
                </p>
              </div>
              <p className="tabular text-[12px] text-mute">
                {((stakeFinal / capital) * 100).toFixed(2)}% del capital
              </p>
            </div>

            <div className="mt-3">
              <Barra fraccion={stakeFinal / ((capital * tope) / 100)} alto={5} />
            </div>

            {topeAplicado && (
              <p className="mt-2.5 text-[11.5px] leading-snug text-goldlite">
                El tope del {tope}% recortó esta apuesta. La puerta no mata el mercado: reduce el
                stake.
              </p>
            )}
          </Card>
        </section>
      )}

      <div className="mt-5">
        <Button variante="oro" ancho>
          Guardar cambios
        </Button>
      </div>
    </Pantalla>
  )
}
