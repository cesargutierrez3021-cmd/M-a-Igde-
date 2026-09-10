import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Header } from '../../components/shell/Header'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { NumeroAnimado } from '../../components/ui/numero-animado'
import { curvaCapital, resumenEstadisticas } from '../../lib/mock/data'

/*
 * Estadísticas — comparativa — manual §7.3 módulo 6, "el módulo estrella".
 * Dos curvas superpuestas: lo que habría ganado el bot siguiendo todo,
 * y lo que ganó el usuario realmente.
 *
 * Regla de honestidad (§7.4): toda métrica con muestra insuficiente se marca
 * "no concluyente", nunca se esconde.
 */
export function EstadisticasScreen() {
  const r = resumenEstadisticas
  const datos = curvaCapital.map((p) => ({
    fecha: new Date(p.fechaISO).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }),
    bot: Number(p.capitalBot.toFixed(2)),
    usuario: Number(p.capitalUsuario.toFixed(2)),
  }))

  return (
    <>
      <Header titulo="Estadísticas" />
      <main className="space-y-4 p-4 pb-24">
        {!r.muestraSuficiente && (
          <Card className="border-[var(--color-void)]">
            <p className="text-xs text-[var(--text-secondary)]">
              <Badge tono="void" className="mr-2">No concluyente</Badge>
              Muestra aún pequeña para sacar conclusiones. Estas cifras se estabilizan con más picks.
            </p>
          </Card>
        )}

        <Card>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
            Bot vs. tú
          </p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={datos} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradBot" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#C9A227" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#E8C766" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="fecha" stroke="var(--color-silver)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                />
                <Area type="monotone" dataKey="bot" stroke="#C9A227" fill="url(#gradBot)" strokeWidth={2} isAnimationActive />
                <Area type="monotone" dataKey="usuario" stroke="#C3C7CC" fill="transparent" strokeWidth={1.5} strokeDasharray="4 3" isAnimationActive />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex gap-4 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--color-gold)]" /> Bot (todo)</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--color-silver)]" /> Tú</span>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <p className="text-xs text-[var(--text-secondary)]">ROI</p>
            <p className="tabular text-xl font-semibold">
              <NumeroAnimado valor={r.roi * 100} decimales={1} sufijo="%" />
            </p>
          </Card>
          <Card>
            <p className="text-xs text-[var(--text-secondary)]">CLV medio</p>
            <p className="tabular text-xl font-semibold text-[var(--color-gold-lite)]">
              <NumeroAnimado valor={r.clvMedio * 100} decimales={1} sufijo="%" />
            </p>
          </Card>
          <Card>
            <p className="text-xs text-[var(--text-secondary)]">Sharpe</p>
            <p className="tabular text-xl font-semibold"><NumeroAnimado valor={r.sharpe} decimales={2} /></p>
          </Card>
          <Card>
            <p className="text-xs text-[var(--text-secondary)]">Drawdown máx.</p>
            <p className="tabular text-xl font-semibold text-[var(--color-loss)]">
              <NumeroAnimado valor={r.drawdownMaximo * 100} decimales={1} sufijo="%" />
            </p>
          </Card>
        </div>
      </main>
    </>
  )
}
