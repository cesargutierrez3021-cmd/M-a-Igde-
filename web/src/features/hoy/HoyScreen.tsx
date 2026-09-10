import { motion } from 'framer-motion'
import { Header } from '../../components/shell/Header'
import { PickCard } from './PickCard'
import { NoBetCard } from './NoBetCard'
import { picksDeHoy, noBetsDeHoy } from '../../lib/mock/data'

const UMBRAL_VALOR_ALTO = 0.1 // edge_rel — provisional, solo para la interfaz de ejemplo

/* Pantalla principal — manual §7.3 módulo 2. */
export function HoyScreen() {
  return (
    <>
      <Header titulo="Hoy" />
      <main className="space-y-3 p-4 pb-24">
        {picksDeHoy.length === 0 && noBetsDeHoy.length === 0 && (
          <p className="pt-12 text-center text-sm text-[var(--text-secondary)]">
            Sin partidos analizados todavía.
          </p>
        )}

        {picksDeHoy.map((pick, i) => (
          <motion.div
            key={pick.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: Math.min(i, 8) * 0.04 }}
          >
            <PickCard pick={pick} esValorAlto={pick.edgeRelativo >= UMBRAL_VALOR_ALTO} />
          </motion.div>
        ))}

        {noBetsDeHoy.length > 0 && (
          <div className="pt-2">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
              Sin valor hoy
            </p>
            <div className="space-y-2">
              {noBetsDeHoy.map((nb) => (
                <NoBetCard key={nb.id} noBet={nb} />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
