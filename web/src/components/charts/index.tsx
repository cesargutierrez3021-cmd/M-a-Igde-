import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PuntoCurva, YieldMercado, PuntoCalibracion } from '../../lib/types'
import { formatearFechaCorta } from '../../lib/format'

/*
 * Gráficas de NOAH.
 *
 * Todos los colores se expresan como var(--…) y se resuelven en el SVG, así que
 * las gráficas cambian de tema sin volver a montarse ni recalcular nada.
 *
 * Manual §7.5: ejes discretos en plata, tooltip con fondo SÓLIDO (nunca
 * translúcido sobre datos) y trazado que se dibuja al entrar.
 */

const ejeComun = {
  stroke: 'var(--c-mute)',
  fontSize: 10,
  tickLine: false,
  axisLine: false,
} as const

function CajaTooltip({
  active,
  payload,
  label,
  formato,
}: {
  active?: boolean
  payload?: { name?: string; value?: number | string; color?: string }[]
  label?: string | number
  formato?: (v: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[10px] border border-line-strong bg-surface px-3 py-2 text-[12px] shadow-lg">
      {label !== undefined && <p className="mb-1 font-medium text-dim">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-fg">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="text-mute">{p.name}</span>
          <span className="tabular font-semibold">
            {formato && typeof p.value === 'number' ? formato(p.value) : p.value}
          </span>
        </p>
      ))}
    </div>
  )
}

/* ── Curva de capital: bot frente a usuario ──────────────────────────────── */
export function CurvaCapital({ datos, alto = 190 }: { datos: PuntoCurva[]; alto?: number }) {
  const serie = datos.map((d) => ({ ...d, fecha: formatearFechaCorta(d.fechaISO) }))

  return (
    <div style={{ height: alto }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={serie} margin={{ top: 6, right: 4, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="grad-bot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--c-goldlite)" stopOpacity={0.42} />
              <stop offset="100%" stopColor="var(--c-gold)" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="var(--c-line)" strokeDasharray="3 5" vertical={false} />
          <XAxis dataKey="fecha" {...ejeComun} minTickGap={44} />
          <YAxis
            {...ejeComun}
            width={30}
            domain={['dataMin - 0.6', 'dataMax + 0.6']}
            tickFormatter={(v: number) => v.toFixed(0)}
          />
          <Tooltip
            content={<CajaTooltip formato={(v) => `${v.toFixed(2)} u`} />}
            cursor={{ stroke: 'var(--c-gold-line)', strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="bot"
            name="Bot"
            stroke="var(--c-goldlite)"
            strokeWidth={2}
            fill="url(#grad-bot)"
            animationDuration={900}
          />
          <Area
            type="monotone"
            dataKey="usuario"
            name="Tú"
            stroke="var(--c-dim)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="transparent"
            animationDuration={900}
            animationBegin={180}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ── Rendimiento por mercado ──────────────────────────────────────────────
 * Las barras negativas se pintan en rojo: un mercado que pierde tiene que
 * verse que pierde, no camuflarse en el mismo dorado que los que ganan.
 */
export function BarrasRendimiento({ datos }: { datos: YieldMercado[] }) {
  return (
    <div style={{ height: 200 }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="grad-barra" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--c-goldlite)" />
              <stop offset="100%" stopColor="var(--c-gold)" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--c-line)" strokeDasharray="3 5" vertical={false} />
          <XAxis dataKey="mercado" {...ejeComun} interval={0} />
          <YAxis {...ejeComun} width={46} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
          <Tooltip
            content={<CajaTooltip formato={(v) => `${(v * 100).toFixed(1)}%`} />}
            cursor={{ fill: 'var(--c-line)' }}
          />
          <ReferenceLine y={0} stroke="var(--c-line-strong)" />
          <Bar dataKey="rendimiento" name="Rendimiento" radius={[4, 4, 0, 0]} animationDuration={800}>
            {datos.map((d, i) => (
              <Cell key={i} fill={d.rendimiento >= 0 ? 'url(#grad-barra)' : 'var(--c-loss)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ── Calibración: predicha frente a observada ─────────────────────────────
 * El panel que dice si el sistema sigue siendo honesto (manual §7.3 módulo 10).
 */
export function GraficoCalibracion({ datos }: { datos: PuntoCalibracion[] }) {
  const serie = datos.map((d) => ({
    ...d,
    predichaPct: d.predicha * 100,
    observadaPct: d.observada * 100,
  }))

  return (
    <div style={{ height: 200 }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={serie} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid stroke="var(--c-line)" strokeDasharray="3 5" vertical={false} />
          <XAxis dataKey="intervalo" {...ejeComun} interval={0} />
          <YAxis {...ejeComun} width={46} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
          <Tooltip
            content={<CajaTooltip formato={(v) => `${v.toFixed(1)}%`} />}
            cursor={{ fill: 'var(--c-line)' }}
          />
          <Bar
            dataKey="predichaPct"
            name="Predicha"
            fill="var(--c-line-strong)"
            radius={[3, 3, 0, 0]}
            animationDuration={700}
          />
          <Bar
            dataKey="observadaPct"
            name="Observada"
            fill="var(--c-gold)"
            radius={[3, 3, 0, 0]}
            animationDuration={700}
            animationBegin={140}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ── Miniatura de tendencia ──────────────────────────────────────────────── */
export function Sparkline({ datos, alto = 34 }: { datos: PuntoCurva[]; alto?: number }) {
  return (
    <div style={{ height: alto }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={datos} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <YAxis hide domain={['dataMin - 0.4', 'dataMax + 0.4']} />
          <defs>
            <linearGradient id="grad-spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--c-goldlite)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--c-gold)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="bot"
            stroke="var(--c-goldlite)"
            strokeWidth={1.5}
            fill="url(#grad-spark)"
            animationDuration={700}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
