import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Tono = 'gold' | 'win' | 'loss' | 'void' | 'silver'

const tonoClase: Record<Tono, string> = {
  gold: 'bg-[color-mix(in_srgb,var(--color-gold)_16%,transparent)] text-[var(--color-gold-lite)]',
  win: 'bg-[color-mix(in_srgb,var(--color-win)_16%,transparent)] text-[var(--color-win)]',
  loss: 'bg-[color-mix(in_srgb,var(--color-loss)_16%,transparent)] text-[var(--color-loss)]',
  void: 'bg-[color-mix(in_srgb,var(--color-void)_20%,transparent)] text-[var(--color-silver)]',
  silver: 'bg-[color-mix(in_srgb,var(--color-silver)_12%,transparent)] text-[var(--text-secondary)]',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tono?: Tono
}

/* Etiqueta — manual §7.5: radio 999px (píldora). El dorado se reserva para lo que importa. */
export function Badge({ className, tono = 'silver', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-medium',
        tonoClase[tono],
        className
      )}
      {...props}
    />
  )
}
