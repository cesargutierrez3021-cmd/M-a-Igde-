import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine, Lock, GitCompareArrows, ShieldCheck } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, SectionHeader, Badge, Button, FiloSuperior, Divider } from '../../components/ui/primitives'
import { Confianza, TarjetaSellado } from '../../components/comunidad/piezas'
import { TresCurvas } from '../../components/charts'
import { useApariencia } from '../../lib/theme'
import { nombreDe, VOCABULARIO } from '../../lib/nombres'
import { mios, porId, curva, curvaPropia, resumen } from '../../lib/mock/data'
import { formatearPesos } from '../../lib/format'
import { listaEscalonada, elementoLista } from '../../design/motion'
import { cn } from '../../lib/utils'

const MERCADOS = ['1X2', 'Más / menos', 'Hándicap', 'Ambos marcan', 'Doble oportunidad']

/** Mejor cuota que ofrece el mercado ahora mismo. En producción llega de la API. */
const MEJOR_CUOTA_MERCADO = 2.05

/*
 * Mis pronósticos — el módulo que convierte NOAH en algo más que un canal.
 *
 * Al publicar se congelan la cuota y la hora, el pronóstico deja de ser editable
 * y se liquida solo. Es la diferencia entre un historial verificado y una captura
 * de pantalla, y por eso el formulario avisa antes de sellar.
 */
export function PronosticosScreen() {
  const { tema } = useApariencia()
  const n = nombreDe('pronosticos', tema)
  const voz = VOCABULARIO[tema]

  const [mercado, setMercado] = useState(MERCADOS[0])
  const [cuota, setCuota] = useState(String(MEJOR_CUOTA_MERCADO))
  const [confianza, setConfianza] = useState(6)
  const [razon, setRazon] = useState('')
  const [sellando, setSellando] = useState(false)
  const [sellado, setSellado] = useState(false)

  const cuotaNum = Number(cuota) || 0
  const desvio = (cuotaNum - MEJOR_CUOTA_MERCADO) / MEJOR_CUOTA_MERCADO
  const peorQueMercado = desvio < -0.02

  const abiertos = mios.filter((p) => p.resultado === 'pendiente')
  const liquidados = mios.filter((p) => p.resultado !== 'pendiente')
  const conClv = liquidados.filter((p) => p.clv !== undefined)
  const clvPropio = conClv.length
    ? conClv.reduce((s, p) => s + (p.clv ?? 0), 0) / conClv.length
    : 0

  function sellar() {
    setSellando(true)
    window.setTimeout(() => {
      setSellando(false)
      setSellado(true)
      window.setTimeout(() => setSellado(false), 2600)
    }, 700)
  }

  return (
    <Pantalla>
      <TituloPantalla
        kicker={n.kicker}
        titulo="Tus"
        destacado={voz.pronosticos}
        bajada="Sellados con hora antes del pitido inicial. Se liquidan solos. Nadie puede editarlos después."
      />

      {/* ── Formulario ─────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card realce className="relative mt-5 p-4">
          <FiloSuperior dorado />

          {/* El sello cae encima al publicar */}
          <AnimatePresence>
            {sellado && (
              <motion.div
                initial={{ opacity: 0, scale: 1.6, rotate: -14 }}
                animate={{ opacity: 1, scale: 1, rotate: -8 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                className="pointer-events-none absolute inset-0 z-10 grid place-items-center"
              >
                <div
                  className="rounded-[10px] border-2 px-5 py-3 text-center"
                  style={{ borderColor: 'var(--c-acento)', background: 'var(--c-surface)' }}
                >
                  <Lock size={18} className="mx-auto text-acento-alto" strokeWidth={2} />
                  <p className="display mt-1.5 text-[15px] text-fg">Sellado</p>
                  <p className="tabular text-[10.5px] text-mute">
                    {new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
              {voz.nuevo}
            </p>
            <Badge tono="acento">se sella al publicar</Badge>
          </div>

          <div className="mt-3 flex gap-2">
            <label className="min-w-0 flex-1">
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-mute">
                Partido
              </span>
              <input
                defaultValue="Sevilla — Valencia"
                className="mt-1 min-h-11 w-full rounded-[var(--radius-btn)] border border-line bg-surface-2 px-2.5 text-[14px] text-fg outline-none focus:border-acento-linea"
              />
            </label>
            <label className="w-[86px] shrink-0">
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-mute">
                Cuota
              </span>
              <input
                type="number"
                step="0.01"
                value={cuota}
                onChange={(e) => setCuota(e.target.value)}
                className="tabular mt-1 min-h-11 w-full rounded-[var(--radius-btn)] border border-line bg-surface-2 px-2.5 text-[15px] font-semibold text-acento-alto outline-none focus:border-acento-linea"
              />
            </label>
          </div>

          {/* Aviso de precio: te dice si estás aceptando peor cuota que el mercado */}
          {peorQueMercado && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-[11px] leading-snug text-loss"
            >
              Estás sellando un {Math.abs(desvio * 100).toFixed(1)}% por debajo de la mejor cuota
              disponible ({MEJOR_CUOTA_MERCADO.toFixed(2)}). Eso sale de tu CLV.
            </motion.p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {MERCADOS.map((m) => (
              <button
                key={m}
                onClick={() => setMercado(m)}
                className={cn(
                  'rounded-[var(--radius-pill)] border px-2.5 py-1.5 text-[11.5px] transition-colors',
                  mercado === m
                    ? 'border-acento-linea text-acento-alto'
                    : 'border-line text-mute'
                )}
                style={mercado === m ? { background: 'var(--grad-acento-suave)' } : undefined}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <Confianza nivel={confianza} />
            <input
              type="range"
              min={1}
              max={10}
              value={confianza}
              onChange={(e) => setConfianza(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--c-acento)]"
              aria-label="Confianza declarada"
            />
          </div>

          <label className="mt-3 block">
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-mute">
              Por qué (opcional, pero es lo que te van a leer)
            </span>
            <textarea
              rows={2}
              value={razon}
              onChange={(e) => setRazon(e.target.value)}
              placeholder="El Valencia llega con tres bajas en defensa y el Sevilla…"
              className="mt-1 w-full resize-none rounded-[var(--radius-btn)] border border-dashed border-line bg-surface-2 p-2.5 text-[12.5px] leading-relaxed text-fg outline-none placeholder:text-mute focus:border-acento-linea"
            />
          </label>

          <div className="mt-3">
            <Button variante="acento" ancho onClick={sellar} disabled={sellando || sellado}>
              {sellando ? 'Sellando…' : voz.publicar}
            </Button>
          </div>
          <p className="mt-2 text-center text-[10.5px] leading-relaxed text-mute">
            Se guardarán la cuota y la hora exactas. <span className="text-dim">No podrás editarlo.</span>
          </p>
        </Card>
      </motion.div>

      {/* ── Abiertos ───────────────────────────────────────────────── */}
      <section className="mt-7">
        <SectionHeader
          icono={<PenLine size={16} strokeWidth={1.6} />}
          titulo={`Tuyos, abiertos`}
          descripcion="Esperando a que termine el partido. Se liquidan sin que hagas nada."
          accion={<span className="tabular text-[12px] text-mute">{abiertos.length}</span>}
        />
        <motion.div variants={listaEscalonada} initial="inicial" animate="entra" className="mt-3 space-y-2">
          {abiertos.map((p) => (
            <motion.div key={p.id} variants={elementoLista}>
              <TarjetaSellado pronostico={p} autor={porId(p.autorId)!} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Liquidados ─────────────────────────────────────────────── */}
      <section className="mt-7">
        <SectionHeader
          icono={<ShieldCheck size={16} strokeWidth={1.6} />}
          titulo="Tuyos, liquidados"
          descripcion="Con la cuota de cierre al lado: ahí se ve si cogiste buen precio."
        />
        <motion.div variants={listaEscalonada} initial="inicial" animate="entra" className="mt-3 space-y-2">
          {liquidados.map((p) => (
            <motion.div key={p.id} variants={elementoLista}>
              <TarjetaSellado pronostico={p} autor={porId(p.autorId)!} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Comparativa triple ─────────────────────────────────────── */}
      <section className="mt-7">
        <SectionHeader
          icono={<GitCompareArrows size={16} strokeWidth={1.6} />}
          titulo={`Tú frente a ${voz.bot}`}
          descripcion="Tres curvas: lo que hizo el motor, lo que hiciste tú siguiéndolo, y lo tuyo propio."
        />

        <Card className="mt-3 p-4">
          <TresCurvas
            bot={curva.map((c) => c.bot)}
            siguiendo={curva.map((c) => c.usuario)}
            propios={curvaPropia}
            etiquetas={{
              bot: `${voz.bot} (todo)`,
              siguiendo: `Tú siguiendo a ${voz.bot}`,
              propios: `Tus ${voz.pronosticos}`,
            }}
          />

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px]">
            <span className="flex items-center gap-1.5 text-mute">
              <span className="h-0.5 w-4 rounded-full" style={{ background: 'var(--c-acento-alto)' }} />
              {voz.bot}
            </span>
            <span className="flex items-center gap-1.5 text-mute">
              <span className="h-0.5 w-4 rounded-full border-t border-dashed" style={{ borderColor: 'var(--c-alt)' }} />
              Tú siguiéndolo
            </span>
            <span className="flex items-center gap-1.5 text-mute">
              <span className="h-0.5 w-4 rounded-full" style={{ background: 'var(--c-dim)' }} />
              Tus {voz.pronosticos}
            </span>
          </div>

          <Divider />

          <div className="mt-3 grid grid-cols-3 gap-3">
            <Mini etiqueta="Tu CLV propio" valor={`${(clvPropio * 100).toFixed(1)}%`} bueno={clvPropio > 0} />
            <Mini etiqueta="Sellados" valor={String(mios.length)} />
            <Mini etiqueta="Con CLV +" valor={`${conClv.filter((p) => (p.clv ?? 0) > 0).length}/${conClv.length}`} />
          </div>

          <p className="mt-3 border-l-2 pl-3 text-[12px] leading-relaxed text-mute" style={{ borderColor: 'var(--c-acento)' }}>
            Tus {voz.pronosticos} van{' '}
            <span className="tabular text-dim">
              {formatearPesos(Math.abs(resumen.beneficio * 0.28))} por debajo
            </span>{' '}
            de {voz.bot}, pero tu CLV propio es{' '}
            <span className="tabular text-acento-alto">{(clvPropio * 100).toFixed(1)}%</span>: eliges
            bien el precio, no tanto el partido.
          </p>
        </Card>
      </section>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-mute">
        Con {mios.length} sellados nada de esto es concluyente todavía.
        <br />
        Hacen falta 30 para entrar en la clasificación.
      </p>
    </Pantalla>
  )
}

function Mini({ etiqueta, valor, bueno }: { etiqueta: string; valor: string; bueno?: boolean }) {
  return (
    <div className="rounded-[10px] border border-line bg-surface-2 px-3 py-2">
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-mute">{etiqueta}</p>
      <p className={cn('tabular mt-0.5 text-[15px] font-semibold', bueno ? 'text-win' : 'text-fg')}>
        {valor}
      </p>
    </div>
  )
}
