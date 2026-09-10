import { motion } from 'framer-motion'
import { Activity, Database, Gauge, RefreshCw } from 'lucide-react'
import { Pantalla } from '../../components/shell/Pantalla'
import { TituloPantalla } from '../../components/shell/Header'
import { Card, SectionHeader, Badge, Button, PuntoEstado, FiloSuperior } from '../../components/ui/primitives'
import { Barra } from '../../components/ui/data'
import { componentes, cupos } from '../../lib/mock/data'
import { faltanPara } from '../../lib/format'
import { listaEscalonada, elementoLista } from '../../design/motion'
import type { EstadoSalud } from '../../lib/types'

const etiquetaEstado: Record<EstadoSalud, { texto: string; tono: 'win' | 'oro' | 'loss' }> = {
  correcto: { texto: 'Correcto', tono: 'win' },
  atencion: { texto: 'Revisar', tono: 'oro' },
  critico: { texto: 'Crítico', tono: 'loss' },
}

/*
 * Salud del sistema — manual §7.3, módulo 8 (Admin).
 * "Cuando algo diga «desconectado», aquí estará escrito por qué."
 * Cada fila es un hecho con su último latido, no una suposición.
 */
export function SaludScreen() {
  const criticos = componentes.filter((c) => c.estado === 'critico').length
  const atencion = componentes.filter((c) => c.estado === 'atencion').length
  const global: EstadoSalud = criticos > 0 ? 'critico' : atencion > 0 ? 'atencion' : 'correcto'

  return (
    <Pantalla>
      <TituloPantalla
        kicker="Control del sistema"
        titulo="Salud del"
        destacado="sistema"
        bajada="Latidos por componente, cuotas de API y estado del artefacto de modelo."
      />

      {/* Semáforo global */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
        <Card realce={global !== 'correcto'} className="mt-5 p-4">
          <FiloSuperior dorado={global !== 'correcto'} />
          <div className="flex items-center gap-3">
            <PuntoEstado estado={global} />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-fg">
                {global === 'correcto'
                  ? 'Todo operativo'
                  : global === 'atencion'
                    ? `${atencion} componente(s) para revisar`
                    : `${criticos} componente(s) en fallo`}
              </p>
              <p className="text-[12px] text-mute">
                {componentes.length} componentes vigilados · última corrida hace pocos minutos
              </p>
            </div>
            <Button variante="contorno" className="min-h-10 px-3" aria-label="Actualizar">
              <RefreshCw size={15} strokeWidth={1.7} />
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Componentes */}
      <section className="mt-6">
        <SectionHeader
          icono={<Activity size={16} strokeWidth={1.6} />}
          titulo="Componentes"
          descripcion="«¿Está vivo?» es un hecho registrado, no una suposición."
        />

        <motion.ul variants={listaEscalonada} initial="inicial" animate="entra" className="mt-3 space-y-2">
          {componentes.map((c) => {
            const e = etiquetaEstado[c.estado]
            return (
              <motion.li key={c.nombre} variants={elementoLista}>
                <Card plano className="flex items-center gap-3 p-3.5">
                  <PuntoEstado estado={c.estado} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-fg">{c.nombre}</p>
                    <p className="truncate text-[11.5px] text-mute">
                      {c.detalle} · latido {faltanPara(c.ultimoLatidoISO)}
                    </p>
                  </div>
                  <Badge tono={e.tono}>{e.texto}</Badge>
                </Card>
              </motion.li>
            )
          })}
        </motion.ul>
      </section>

      {/* Cupos de API */}
      <section className="mt-8">
        <SectionHeader
          icono={<Gauge size={16} strokeWidth={1.6} />}
          titulo="Cupo de APIs"
          descripcion="El presupuesto es un tope duro en código: la ejecución no puede pasarse."
        />

        <motion.ul variants={listaEscalonada} initial="inicial" animate="entra" className="mt-3 space-y-2">
          {cupos.map((c) => {
            const fraccion = c.usado / c.total
            return (
              <motion.li key={c.nombre} variants={elementoLista}>
                <Card plano className="p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-fg">{c.nombre}</p>
                      <p className="text-[11.5px] text-mute">{c.descripcion}</p>
                    </div>
                    <Badge tono={etiquetaEstado[c.estado].tono}>
                      {etiquetaEstado[c.estado].texto}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <Barra fraccion={fraccion} tono={fraccion > 0.8 ? 'loss' : 'win'} alto={5} />
                  </div>
                  <p className="tabular mt-1.5 text-[11.5px] text-mute">
                    {c.usado} de {c.total} usados
                  </p>
                </Card>
              </motion.li>
            )
          })}
        </motion.ul>
      </section>

      {/* Artefacto */}
      <section className="mt-8">
        <SectionHeader
          icono={<Database size={16} strokeWidth={1.6} />}
          titulo="Artefacto de modelo"
          descripcion="El motor verifica su hash antes de cargarlo. Si no cuadra, no arranca."
        />
        <Card className="mt-3 p-4">
          <dl className="space-y-2.5 text-[13px]">
            {[
              ['Versión', 'v2026.09.03'],
              ['Hash SHA-256', 'a3f9…c218 ✓ verificado'],
              ['Corte de entrenamiento', '2026-08-28'],
              ['Cobertura', '7 ligas · 238.858 partidos'],
              ['Modo', 'PAPER'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3">
                <dt className="text-mute">{k}</dt>
                <dd className="tabular text-right font-medium text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </section>
    </Pantalla>
  )
}
