import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BadgeCheck, Heart, MessageCircle, Copy, Flag } from 'lucide-react'
import { Card, Badge } from '../ui/primitives'
import { cn } from '../../lib/utils'
import { formatearCuota, formatearPorcentaje, faltanPara } from '../../lib/format'
import type { Tipster, PronosticoSellado, Consenso } from '../../lib/types'

/* ── Avatar ─────────────────────────────────────────────────────────────── */
export function Avatar({ tipster, size = 34 }: { tipster: Tipster; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[10px] border border-line bg-surface-2 font-semibold text-acento-alto"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden
    >
      {tipster.inicial}
    </span>
  )
}

/* ── Sello de verificación ──────────────────────────────────────────────
 * No es un adorno: significa que la cuota y la hora las puso el servidor al
 * publicar, y que el resultado lo liquidó el sistema. Nadie se auto-reporta.
 */
export function SelloVerificado({ compacto }: { compacto?: boolean }) {
  return (
    <Badge tono="win" className="gap-1">
      <BadgeCheck size={11} strokeWidth={2.4} />
      {compacto ? 'sellado' : 'verificado'}
    </Badge>
  )
}

/* ── Ficha resumida de un tipster, para cabeceras de tarjeta ────────────── */
export function LineaTipster({ tipster }: { tipster: Tipster }) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-1.5">
        <Link to={`/perfil/${tipster.id}`} className="text-[13px] font-semibold text-fg">
          {tipster.alias}
        </Link>
        {tipster.verificado && <SelloVerificado />}
      </div>
      <p className="tabular mt-0.5 text-[10.5px] text-mute">
        CLV {formatearPorcentaje(tipster.clv, 1)} · {tipster.sellados} sellados
        {tipster.racha > 0 && ` · racha ${tipster.racha}`}
      </p>
    </div>
  )
}

/* ── Medidor de confianza declarada, en escala de 10 ────────────────────── */
export function Confianza({ nivel }: { nivel: number }) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-mute">
        Confianza declarada · {nivel}/10
      </p>
      <div className="mt-1.5 flex gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <motion.span
            key={i}
            className="h-1.5 flex-1 rounded-full"
            style={{ background: i < nivel ? 'var(--grad-acento)' : 'var(--c-line-strong)' }}
            initial={{ opacity: 0, scaleX: 0.3 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.025, duration: 0.2 }}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Tarjeta de pronóstico sellado ──────────────────────────────────────── */
interface TarjetaSelladoProps {
  pronostico: PronosticoSellado
  autor: Tipster
  onCopiar?: () => void
  copiado?: boolean
}

export function TarjetaSellado({ pronostico: p, autor, onCopiar, copiado }: TarjetaSelladoProps) {
  const liquidado = p.resultado !== 'pendiente'

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Avatar tipster={autor} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <LineaTipster tipster={autor} />
            <span className="shrink-0 text-[10px] text-mute">{faltanPara(p.selladoISO)}</span>
          </div>

          {/* El pronóstico, en su caja: es el objeto sellado, no texto suelto */}
          <div className="mt-3 rounded-[10px] border border-line bg-surface-2 p-3">
            <p className="text-[10.5px] text-mute">
              {p.partido} · {p.liga}
            </p>
            <p className="mt-0.5 text-[14.5px] font-semibold text-fg">
              {p.mercadoLegible}{' '}
              <span className="tabular text-acento-alto">@ {formatearCuota(p.cuotaSellada)}</span>
            </p>
            <div className="mt-2.5">
              <Confianza nivel={p.confianza} />
            </div>

            {liquidado && p.clv !== undefined && (
              <div className="mt-2.5 flex items-center gap-2 border-t border-line pt-2.5 text-[10.5px]">
                <Badge tono={p.resultado === 'ganada' ? 'win' : p.resultado === 'perdida' ? 'loss' : 'void'}>
                  {p.resultado}
                </Badge>
                <span className="text-mute">
                  cerró en <span className="tabular">{formatearCuota(p.cuotaCierre ?? 0)}</span>
                </span>
                <span className={cn('tabular font-semibold', p.clv >= 0 ? 'text-win' : 'text-loss')}>
                  CLV {formatearPorcentaje(p.clv, 1)}
                </span>
              </div>
            )}
          </div>

          {p.razonamiento && (
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-dim">{p.razonamiento}</p>
          )}

          <div className="mt-3 flex items-center gap-4 text-[11.5px] text-mute">
            <button className="flex items-center gap-1.5">
              <Heart size={14} strokeWidth={1.7} /> {p.meGusta}
            </button>
            <button className="flex items-center gap-1.5">
              <MessageCircle size={14} strokeWidth={1.7} /> {p.comentarios}
            </button>
            {!p.propio && !liquidado && onCopiar && (
              <button
                onClick={onCopiar}
                className={cn('flex items-center gap-1.5', copiado && 'text-acento-alto')}
              >
                <Copy size={14} strokeWidth={1.7} /> {copiado ? 'copiado' : 'copiar'}
              </button>
            )}
            <button className="ml-auto" aria-label="Reportar">
              <Flag size={13} strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ── Barra de consenso ──────────────────────────────────────────────────
 * Muestra hacia dónde se inclina la gente Y, debajo, lo que dice el bot.
 * Cuando no coinciden se dice en voz alta: ser mayoría no da la razón.
 */
export function BarraConsenso({ consenso, nombreBot }: { consenso: Consenso; nombreBot: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-fg">{consenso.partido}</p>
          <p className="text-[10.5px] text-mute">
            {consenso.liga} · {faltanPara(consenso.inicioISO)}
          </p>
        </div>
        <span className="tabular shrink-0 text-[11px] text-mute">
          {consenso.totalSellados} sellados
        </span>
      </div>

      <div className="mt-3 flex h-6 overflow-hidden rounded-[6px]">
        {consenso.opciones.map((op, i) => (
          <motion.div
            key={op.etiqueta}
            className="grid place-items-center overflow-hidden whitespace-nowrap px-1 text-[10px] font-semibold"
            style={{
              background: i === 0 ? 'var(--grad-acento)' : i === 1 ? 'var(--c-surface-3)' : 'var(--c-surface-2)',
              color: i === 0 ? 'var(--btn-fg)' : 'var(--c-dim)',
            }}
            initial={{ width: 0 }}
            whileInView={{ width: `${op.fraccion * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {op.fraccion >= 0.3
              ? `${op.etiqueta} ${Math.round(op.fraccion * 100)}%`
              : op.fraccion >= 0.12
                ? `${Math.round(op.fraccion * 100)}%`
                : ''}
          </motion.div>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-mute">
        {consenso.opciones.map((op, i) => (
          <span key={op.etiqueta} className="flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{
                background:
                  i === 0 ? 'var(--c-acento)' : i === 1 ? 'var(--c-surface-3)' : 'var(--c-line-strong)',
              }}
            />
            {op.etiqueta} <span className="tabular">{Math.round(op.fraccion * 100)}%</span>
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[11.5px]">
        <span className="text-mute">Lo que dice {nombreBot}</span>
        <span className="text-acento-alto">
          {consenso.posicionBot} · <span className="tabular">{formatearCuota(consenso.cuotaBot)}</span>
        </span>
      </div>

      <p
        className="mt-2.5 border-l-2 pl-3 text-[11.5px] leading-relaxed text-mute"
        style={{ borderColor: consenso.coincide ? 'var(--c-win)' : 'var(--c-loss)' }}
      >
        {consenso.coincide ? (
          <>Coinciden. Coincidir tampoco es una garantía: solo significa que hoy miran lo mismo.</>
        ) : (
          <>
            No coinciden. <span className="text-fg">Ninguno tiene razón por ser mayoría</span> — el
            cierre lo dirá.
          </>
        )}
      </p>
    </Card>
  )
}
