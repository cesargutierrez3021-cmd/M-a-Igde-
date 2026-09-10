import { motion } from 'framer-motion'
import { Gauge, Brain } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, SectionHeader, Badge, FiloSuperior } from '../../components/ui/primitives'
import { StatTile, Cifra } from '../../components/ui/data'
import { GraficoCalibracion } from '../../components/charts'
import { calibracion, modelos, resumen } from '../../lib/mock/data'
import { formatearPorcentaje } from '../../lib/format'
import { listaEscalonada, elementoLista } from '../../design/motion'

/*
 * Calibración y modelos — manual §7.3, módulo 10 (Admin).
 * "El panel que dice si el sistema sigue siendo honesto."
 */
export function CalibracionScreen() {
  return (
    <Pantalla>
      <TituloPantalla
        kicker="Control del sistema"
        titulo="Calibración"
        destacado="y modelos"
        bajada="Si el motor promete un 70% y acierta el 55%, aquí se ve antes de que cueste dinero."
      />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <StatTile etiqueta="Brier global" nota="Menor es mejor">
          <Cifra valor={resumen.brier} decimales={3} />
        </StatTile>
        <StatTile etiqueta="ECE" nota="Objetivo < 0,030" destacada={resumen.ece < 0.03}>
          <Cifra valor={resumen.ece} decimales={3} />
        </StatTile>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
        <Card className="mt-3 p-4">
          <FiloSuperior />
          <SectionHeader
            icono={<Gauge size={16} strokeWidth={1.6} />}
            titulo="Curva de fiabilidad"
            descripcion="Predicha frente a observada, por intervalo de probabilidad."
          />
          <div className="mt-4">
            <GraficoCalibracion datos={calibracion} />
          </div>

          <ul className="mt-3 space-y-1.5">
            {calibracion.map((c) => {
              const desvio = c.observada - c.predicha
              return (
                <li key={c.intervalo} className="flex items-center justify-between text-[12px]">
                  <span className="tabular text-mute">{c.intervalo}</span>
                  <span className="flex items-center gap-2">
                    <span className="tabular text-dim">
                      {formatearPorcentaje(c.predicha, 0)} → {formatearPorcentaje(c.observada, 0)}
                    </span>
                    <span
                      className={`tabular w-14 text-right font-semibold ${Math.abs(desvio) < 0.03 ? 'text-win' : 'text-goldlite'}`}
                    >
                      {desvio >= 0 ? '+' : ''}
                      {(desvio * 100).toFixed(1)}
                    </span>
                    <span className="tabular w-8 text-right text-[11px] text-mute">n={c.n}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </Card>
      </motion.div>

      {/* Modelos */}
      <section className="mt-8">
        <SectionHeader
          icono={<Brain size={16} strokeWidth={1.6} />}
          titulo="Rendimiento por modelo"
          descripcion="Ningún modelo se activa sin walk-forward y CLV medidos (invariante 9)."
        />

        <motion.ul variants={listaEscalonada} initial="inicial" animate="entra" className="mt-3 space-y-2">
          {modelos.map((m) => (
            <motion.li key={m.modelo} variants={elementoLista}>
              <Card plano className="p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[13.5px] font-medium text-fg">{m.modelo}</p>
                    <p className="text-[11.5px] text-mute">
                      {m.mercado} · n={m.n}
                    </p>
                  </div>
                  <Badge tono={m.activo ? 'win' : 'void'}>{m.activo ? 'Activo' : 'Apagado'}</Badge>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
                  <Celda etiqueta="Brier" valor={m.brier.toFixed(3)} />
                  <Celda etiqueta="ECE" valor={m.ece.toFixed(3)} alerta={m.ece >= 0.03} />
                  <Celda
                    etiqueta="CLV"
                    valor={formatearPorcentaje(m.clv, 1)}
                    alerta={m.clv <= 0}
                    bueno={m.clv > 0}
                  />
                </div>
              </Card>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <Card plano className="mt-4 p-4">
        <p className="text-[12px] leading-relaxed text-mute">
          Un modelo con CLV negativo sostenido se apaga, aunque su Brier parezca bueno: acertar más
          que el azar no sirve si el mercado ya lo tenía descontado antes que nosotros.
        </p>
      </Card>
    </Pantalla>
  )
}

function Celda({
  etiqueta,
  valor,
  alerta,
  bueno,
}: {
  etiqueta: string
  valor: string
  alerta?: boolean
  bueno?: boolean
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-mute">{etiqueta}</p>
      <p
        className={`tabular mt-0.5 text-[14px] font-semibold ${
          alerta ? 'text-loss' : bueno ? 'text-win' : 'text-fg'
        }`}
      >
        {valor}
      </p>
    </div>
  )
}
