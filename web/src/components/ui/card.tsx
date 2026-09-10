import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

/*
 * Tarjeta base — manual §7.5: radio 12px, borde 1px plata al 12%, sin sombras difusas.
 * Elevación por contraste de superficie, no por sombra.
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4',
        className
      )}
      {...props}
    />
  )
}
