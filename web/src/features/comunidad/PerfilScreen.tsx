import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPinned, GitCompareArrows, ShieldCheck } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { Card, Badge, SectionHeader, Button, FiloSuperior, Kicker } from '../../components/ui/primitives'
import { Cifra } from '../../components/ui/data'
import { Avatar, SelloVerificado, TarjetaSellado } from '../../components/comunidad/piezas'
import { CurvaTipster } from '../../components/charts'
import { useApariencia } from '../../lib/theme'
import { nombreDe, VOCABULARIO } from '../../lib/nombres'
import { porId, feed, tipsters } from '../../lib/mock/data'
import { formatearPorcentaje } from '../../lib/format'
import { cn } from '../../lib/utils'

/*
 * Perfil público — el historial verificado de cualquiera.
 *
 * Regla del perfil: no se puede ocultar una zona donde se pierde. Se muestra
 * entero o no se muestra. Un perfil con barras rojas visibles vale más que uno
 * perfecto, porque el perfecto no existe.
 */
export function PerfilScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tema } = useApariencia()
  const n = nombreDe('perfil', tema)
  const voz = VOCABULARIO[tema]

  const [siguiendo, setSiguiendo] = useState(false)
  const [comparando, setComparando] = useState(false)

  const tipster = porId(id ?? '') ?? tipsters[1]
  const yo = porId('yo')!
  const suyos = feed.filter((p) => p.autorId === tipster.id)

  return (
    <Pantalla>
      <button
        onClick={() => navigate(-1)}
        className="mb-3 inline-flex min-h-11 items-center gap-2 text-[13px] text-mute"
      >
        <ArrowLeft size={16} strokeWidth={1.7} />
        Volver
      </button>

      {/* Cabecera */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card realce className="p-5 text-center">
          <FiloSuperior dorado />
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.05 }}
            >
              <Avatar tipster={tipster} size={62} />
            </motion.div>
          </div>

          <h1 className="display mt-3 text-[23px] text-fg">{tipster.alias}</h1>
          <p className="mt-1 text-[11.5px] text-mute">
            En {tema === 'terreno' ? 'la jauría' : 'el escuadrón'} desde {tipster.desde} ·{' '}
            {tipster.especialidad}
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {tipster.verificado && <SelloVerificado />}
            {tipster.racha > 0 && <Badge tono="acento">racha {tipster.racha}</Badge>}
            <Badge tono="void">{tipster.sellados} sellados</Badge>
          </div>

          {tipster.id !== 'yo' && (
            <div className="mt-4 flex gap-2">
              <Button
                variante={siguiendo ? 'contorno' : 'acento'}
                ancho
                onClick={() => setSiguiendo((s) => !s)}
              >
                {siguiendo ? 'Siguiendo' : voz.seguir}
              </Button>
              <Button variante="contorno" ancho onClick={() => setComparando((c) => !c)}>
                {comparando ? 'Ocultar' : 'Comparar conmigo'}
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Métricas */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        <Metrica etiqueta="CLV" destacada>
          <Cifra valor={tipster.clv * 100} decimales={1} signo sufijo="%" />
        </Metrica>
        <Metrica etiqueta="ROI">
          <Cifra valor={tipster.roi * 100} decimales={1} signo sufijo="%" />
        </Metrica>
        <Metrica etiqueta="Acierto">
          <Cifra valor={tipster.acierto * 100} decimales={0} sufijo="%" />
        </Metrica>
      </div>

      {/* Curva */}
      <section className="mt-6">
        <SectionHeader
          icono={<GitCompareArrows size={16} strokeWidth={1.6} />}
          titulo={tema === 'terreno' ? 'Su ascenso' : 'Su trayectoria'}
          descripcion={
            comparando
              ? 'Su curva y la tuya superpuestas. La brecha es lo que te separa.'
              : `${tipster.sellados} ${voz.pronosticos} sellados desde ${tipster.desde}.`
          }
        />
        <Card className="mt-3 p-4">
          <CurvaTipster valores={tipster.curva} />
          {comparando && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <div className="mt-1 border-t border-line pt-3">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
                  La tuya
                </p>
                <CurvaTipster valores={yo.curva} alto={70} />
                <p className="mt-2 text-[12px] leading-relaxed text-mute">
                  Su CLV es{' '}
                  <span className="tabular text-acento-alto">{formatearPorcentaje(tipster.clv, 1)}</span>{' '}
                  frente a tu{' '}
                  <span className="tabular text-dim">{formatearPorcentaje(yo.clv, 1)}</span>, pero con{' '}
                  {tipster.sellados} sellados contra tus {yo.sellados}: la diferencia todavía puede
                  ser solo muestra.
                </p>
              </div>
            </motion.div>
          )}
        </Card>
      </section>

      {/* Zonas — incluidas las malas */}
      <section className="mt-6">
        <SectionHeader
          icono={<MapPinned size={16} strokeWidth={1.6} />}
          titulo={tema === 'terreno' ? 'Su terreno' : 'Su zona'}
          descripcion="Dónde acierta y dónde no. No se puede ocultar una liga mala."
        />
        <Card className="mt-3 p-4">
          <div className="space-y-3.5">
            {tipster.zonas.map((z, i) => {
              const positiva = z.rendimiento >= 0
              const ancho = Math.min(Math.abs(z.rendimiento) / 0.1, 1) * 50
              return (
                <div key={z.nombre}>
                  <div className="flex items-baseline justify-between text-[12px]">
                    <span className="text-dim">{z.nombre}</span>
                    <span className={cn('tabular font-semibold', positiva ? 'text-acento-alto' : 'text-loss')}>
                      {formatearPorcentaje(z.rendimiento, 1)}
                    </span>
                  </div>
                  {/* Barra bidireccional: las negativas crecen hacia la izquierda */}
                  <div className="relative mt-1.5 h-1.5 rounded-full bg-surface-3">
                    <span className="absolute left-1/2 top-[-3px] h-[12px] w-px bg-line-strong" />
                    <motion.span
                      className="absolute top-0 h-full rounded-full"
                      style={{
                        background: positiva ? 'var(--grad-acento)' : 'var(--c-loss)',
                        left: positiva ? '50%' : `${50 - ancho}%`,
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${ancho}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <p className="tabular mt-1 text-[10px] text-mute">{z.n} sellados</p>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      {/* Sus pronósticos abiertos */}
      {suyos.length > 0 && (
        <section className="mt-6">
          <SectionHeader
            icono={<ShieldCheck size={16} strokeWidth={1.6} />}
            titulo={`Sus ${voz.pronosticos}`}
            descripcion="Todo lo publicado, sin filtrar."
          />
          <div className="mt-3 space-y-3">
            {suyos.map((p) => (
              <TarjetaSellado key={p.id} pronostico={p} autor={tipster} />
            ))}
          </div>
        </section>
      )}

      <Card plano className="mt-5 p-4">
        <Kicker>{n.kicker}</Kicker>
        <p className="mt-2.5 text-[12px] leading-relaxed text-mute">
          Todo lo que ves aquí es histórico completo y automático: la cuota y la hora se sellan al
          publicar, y el resultado lo pone el sistema. No hay capturas de pantalla ni resultados
          escogidos a mano.
        </p>
      </Card>
    </Pantalla>
  )
}

function Metrica({
  etiqueta,
  children,
  destacada,
}: {
  etiqueta: string
  children: React.ReactNode
  destacada?: boolean
}) {
  return (
    <Card className="p-3 text-center" realce={destacada}>
      <FiloSuperior dorado={destacada} />
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-mute">{etiqueta}</p>
      <p className={cn('mt-1 text-[20px] font-semibold', destacada ? 'texto-acento' : 'text-fg')}>
        {children}
      </p>
    </Card>
  )
}
