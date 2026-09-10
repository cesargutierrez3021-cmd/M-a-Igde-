import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { pantalla } from '../../design/motion'

/*
 * Envoltorio de pantalla: aplica la transición de entrada y el espaciado
 * común (incluido el hueco para la navegación inferior). Que viva en un solo
 * sitio es lo que hace que todas las pantallas se sientan de la misma app.
 */
export function Pantalla({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.main
      variants={pantalla}
      initial="inicial"
      animate="entra"
      exit="sale"
      className={`relative z-10 mx-auto max-w-md px-4 pt-5 pb-28 ${className ?? ''}`}
    >
      {children}
    </motion.main>
  )
}
