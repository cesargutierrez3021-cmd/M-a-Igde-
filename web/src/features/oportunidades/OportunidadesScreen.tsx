import { motion } from 'framer-motion'
import { ShieldOff } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, Badge, SectionHeader, Divider } from '../../components/ui/primitives'
import { TarjetaPick } from './TarjetaPick'
import { IlustracionSinValor } from '../../components/brand/Illustrations'
import { picks, noBets } from '../../lib/mock/data'
import { listaEscalonada, elementoLista } from '../../design/motion'
import type { NoBet } from '../../lib/types'

const motivoLegible: Record<NoBet['motivo'], string> = {
  SIN_CALIBRACION: 'Sin calibración',
  EDGE_INSUFICIENTE: 'Sin valor suficiente',
  INCERTIDUMBRE_ALTA: 'Incertidumbre alta',
  MERCADO_APAGADO: 'Mercado apagado',
}

/*
 * Oportunidades — pantalla principal (manual §7.3, módulo 2).
 * Si no hay valor, la pantalla dice NO BET con dignidad y explica por qué;
 * no se rellena con relleno (invariante 10).
 */
export function OportunidadesScreen() {
  const hayPicks = picks.length > 0

  return (
    <Pantalla>
      <TituloPantalla
        kicker="Máx. 3 al día"
        titulo="Apuestas"
        destacado="listas"
        bajada="Solo lo que el motor emitió y sigue teniendo valor: revalidado antes de cada partido."
      />

      {hayPicks ? (
        <motion.div
          variants={listaEscalonada}
          initial="inicial"
          animate="entra"
          className="mt-5 space-y-3"
        >
          {picks.map((p, i) => (
            <TarjetaPick key={p.id} pick={p} indice={i} />
          ))}
        </motion.div>
      ) : (
        <Card className="mt-5 p-6 text-center">
          <IlustracionSinValor className="mx-auto w-full max-w-[220px] text-mute" />
          <h3 className="display mt-4 text-lg text-fg">Hoy no hay valor</h3>
          <p className="mx-auto mt-2 max-w-[36ch] text-[13px] leading-relaxed text-mute">
            Ningún candidato superó el listón. No apostar también es una decisión, y hoy es la
            correcta.
          </p>
        </Card>
      )}

      {/* NO BET: se publica, no se esconde */}
      {noBets.length > 0 && (
        <section className="mt-8">
          <SectionHeader
            icono={<ShieldOff size={16} strokeWidth={1.6} />}
            titulo="Descartados hoy"
            descripcion="Mercados que se analizaron y no llegaron al listón. Se publican con su motivo."
          />

          <motion.div
            variants={listaEscalonada}
            initial="inicial"
            animate="entra"
            className="mt-3 space-y-2"
          >
            {noBets.map((nb) => (
              <motion.div key={nb.id} variants={elementoLista}>
                <Card plano className="p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-dim">{nb.mercadoLegible}</p>
                      <p className="mt-1 text-[12px] leading-snug text-mute">{nb.detalle}</p>
                    </div>
                    <Badge tono="void">{motivoLegible[nb.motivo]}</Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-5">
            <Divider dorado />
            <p className="mt-3 text-center text-[11.5px] leading-relaxed text-mute">
              NOAH no promete rentabilidad. Muestra probabilidad, valor e incertidumbre.
              <br />
              +18 · Juego responsable.
            </p>
          </div>
        </section>
      )}
    </Pantalla>
  )
}
