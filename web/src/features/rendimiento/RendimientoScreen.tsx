import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, LayoutGrid, Gauge, ShieldAlert } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { useApariencia } from '../../lib/theme'
import { nombreDe } from '../../lib/nombres'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, SectionHeader, FiloSuperior, Badge } from '../../components/ui/primitives'
import { Cifra, StatTile, AvisoMuestra, Barra } from '../../components/ui/data'
import { Segmented } from '../../components/ui/controls'
import { CurvaCapital, BarrasRendimiento, GraficoCalibracion } from '../../components/charts'
import { curva, resumen, yieldPorMercado, calibracion } from '../../lib/mock/data'
import { formatearPesos, formatearPorcentaje } from '../../lib/format'
import { listaEscalonada, elementoLista } from '../../design/motion'

type Vista = 'capital' | 'mercados' | 'calidad'

/*
 * Rendimiento — manual §7.3 módulos 6 y 10, y §7.4 (métricas obligatorias).
 * Tres vistas para no amontonar veinte cifras en una sola pantalla.
 */
export function RendimientoScreen() {
  const { tema } = useApariencia()
  const n = nombreDe('rendimiento', tema)
  const [vista, setVista] = useState<Vista>('capital')

  return (
    <Pantalla>
      <TituloPantalla
        kicker={n.kicker}
        titulo={n.largo}
        bajada="Histórico completo: capital, desglose por mercado y calidad de las probabilidades."
      />

      <div className="mt-4">
        <Segmented
          id="rendimiento"
          valor={vista}
          onChange={setVista}
          opciones={[
            { valor: 'capital', etiqueta: 'Capital', icono: <TrendingUp size={14} strokeWidth={1.8} /> },
            { valor: 'mercados', etiqueta: 'Mercados', icono: <LayoutGrid size={14} strokeWidth={1.8} /> },
            { valor: 'calidad', etiqueta: 'Calidad', icono: <Gauge size={14} strokeWidth={1.8} /> },
          ]}
        />
      </div>

      <div className="mt-4">
        <AvisoMuestra n={resumen.resueltas} minimo={resumen.muestraMinima} />
      </div>

      {vista === 'capital' && <VistaCapital key="capital" />}
      {vista === 'mercados' && <VistaMercados key="mercados" />}
      {vista === 'calidad' && <VistaCalidad key="calidad" />}
    </Pantalla>
  )
}

/* ── Capital ──────────────────────────────────────────────────────────────── */
function VistaCapital() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
      <Card className="mt-4 p-4">
        <FiloSuperior dorado />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
              Curva de capital
            </p>
            <p className="texto-acento mt-1 text-[28px] leading-none font-semibold">
              <Cifra valor={resumen.unidades} decimales={2} signo sufijo=" u" />
            </p>
            <p className="mt-1 text-[12px] text-mute">
              {formatearPesos(resumen.beneficio)} · banca de referencia 100 u
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 text-[11px]">
            <span className="flex items-center gap-1.5 text-mute">
              <span className="h-0.5 w-4 rounded-full" style={{ background: 'var(--c-acento-alto)' }} />
              Bot
            </span>
            <span className="flex items-center gap-1.5 text-mute">
              <span className="h-0.5 w-4 rounded-full border-t border-dashed border-dim" />
              Tú
            </span>
          </div>
        </div>

        <div className="mt-4">
          <CurvaCapital datos={curva} />
        </div>
      </Card>

      <motion.div
        variants={listaEscalonada}
        initial="inicial"
        animate="entra"
        className="mt-3 grid grid-cols-2 gap-3"
      >
        <motion.div variants={elementoLista}>
          <StatTile etiqueta="Drawdown máx." nota="Peor caída desde un pico">
            <span className="text-loss">
              <Cifra valor={resumen.drawdownMaximo * 100} decimales={1} sufijo="%" />
            </span>
          </StatTile>
        </motion.div>
        <motion.div variants={elementoLista}>
          <StatTile etiqueta="Drawdown actual" nota="Distancia al último pico">
            <Cifra valor={resumen.drawdownActual * 100} decimales={1} sufijo="%" />
          </StatTile>
        </motion.div>
        <motion.div variants={elementoLista}>
          <StatTile etiqueta="Sharpe" nota="Retorno ajustado por riesgo">
            <Cifra valor={resumen.sharpe} decimales={2} />
          </StatTile>
        </motion.div>
        <motion.div variants={elementoLista}>
          <StatTile etiqueta="Rendimiento" nota="Beneficio ÷ total apostado">
            <Cifra valor={resumen.rendimiento * 100} decimales={1} signo sufijo="%" />
          </StatTile>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/* ── Mercados ─────────────────────────────────────────────────────────────── */
function VistaMercados() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
      <Card className="mt-4 p-4">
        <SectionHeader
          icono={<LayoutGrid size={16} strokeWidth={1.6} />}
          titulo="Rendimiento por mercado"
          descripcion="Un mercado que pierde se ve que pierde. No se camufla."
        />
        <div className="mt-4">
          <BarrasRendimiento datos={yieldPorMercado} />
        </div>
      </Card>

      <motion.ul
        variants={listaEscalonada}
        initial="inicial"
        animate="entra"
        className="mt-3 space-y-2"
      >
        {yieldPorMercado.map((y) => (
          <motion.li key={y.mercado} variants={elementoLista}>
            <Card plano className="p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-fg">{y.mercado}</p>
                  <p className="text-[11.5px] text-mute">{y.n} apuestas resueltas</p>
                </div>
                <div className="text-right">
                  <p
                    className={`tabular text-[17px] font-semibold ${y.rendimiento >= 0 ? 'text-acento-alto' : 'text-loss'}`}
                  >
                    {formatearPorcentaje(y.rendimiento)}
                  </p>
                  {y.n < 20 && <Badge tono="void" className="mt-1">n corto</Badge>}
                </div>
              </div>
            </Card>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}

/* ── Calidad ──────────────────────────────────────────────────────────────── */
function VistaCalidad() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
      <Card className="mt-4 p-4">
        <SectionHeader
          icono={<Gauge size={16} strokeWidth={1.6} />}
          titulo="Calibración"
          descripcion="Compara la probabilidad que predijo el motor con la frecuencia real de acierto."
        />
        <div className="mt-4">
          <GraficoCalibracion datos={calibracion} />
        </div>
        <p className="mt-2 text-[11.5px] leading-relaxed text-mute">
          Si la barra observada queda por debajo de la predicha, el motor sobreestima. Ese es el
          fallo que hundió la versión anterior, y por eso este panel existe.
        </p>
      </Card>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <StatTile etiqueta="CLV medio" nota="Predice si hay ventaja real" destacada>
          <Cifra valor={resumen.clvMedio * 100} decimales={1} signo sufijo="%" />
        </StatTile>
        <StatTile etiqueta="CLV positivo" nota="% de apuestas por encima del cierre">
          <Cifra valor={resumen.clvPositivo * 100} decimales={0} sufijo="%" />
        </StatTile>
        <StatTile etiqueta="Brier" nota="Menor es mejor">
          <Cifra valor={resumen.brier} decimales={3} />
        </StatTile>
        <StatTile etiqueta="ECE" nota="Error de calibración · objetivo < 0,03">
          <Cifra valor={resumen.ece} decimales={3} />
        </StatTile>
      </div>

      <Card plano className="mt-3 p-4">
        <div className="flex gap-3">
          <ShieldAlert size={16} className="mt-0.5 shrink-0 text-acento-alto" strokeWidth={1.6} />
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-fg">La puerta del CLV</p>
            <p className="mt-1 text-[12px] leading-relaxed text-mute">
              Si el CLV medio no es positivo y distinguible de cero, el sistema no tiene ventaja
              y ninguna interfaz lo arregla. Progreso hacia la muestra mínima:
            </p>
            <div className="mt-2.5">
              <Barra fraccion={resumen.resueltas / resumen.muestraMinima} />
            </div>
            <p className="tabular mt-1.5 text-[11px] text-mute">
              {resumen.resueltas} / {resumen.muestraMinima} resueltas
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
