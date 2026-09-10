import type { Variants, Transition } from 'framer-motion'

/*
 * Vocabulario de movimiento de NOAH.
 * Manual §7.5: entre pantallas 12px + desvanecido en 220ms; listas escalonadas
 * a 40ms por elemento, máximo 8; ninguna animación supera 300ms ni bloquea
 * la lectura de un dato.
 */

export const EASE_SALIDA: Transition['ease'] = [0.16, 1, 0.3, 1]

export const transicionPantalla: Transition = {
  duration: 0.22,
  ease: EASE_SALIDA,
}

export const pantalla: Variants = {
  entra: { opacity: 1, y: 0, transition: transicionPantalla },
  inicial: { opacity: 0, y: 12 },
  sale: { opacity: 0, y: -8, transition: { duration: 0.16, ease: 'easeIn' } },
}

/** Contenedor de lista: escalona a sus hijos, con tope de 8 elementos visibles. */
export const listaEscalonada: Variants = {
  inicial: {},
  entra: {
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
}

export const elementoLista: Variants = {
  inicial: { opacity: 0, y: 14 },
  entra: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE_SALIDA } },
}

/** Aparición de tarjetas grandes: un punto más de recorrido y escala mínima. */
export const tarjeta: Variants = {
  inicial: { opacity: 0, y: 16, scale: 0.985 },
  entra: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: EASE_SALIDA } },
}

/** Hoja inferior (menú "Más", filtros). */
export const hoja: Variants = {
  inicial: { y: '100%' },
  entra: { y: 0, transition: { duration: 0.28, ease: EASE_SALIDA } },
  sale: { y: '100%', transition: { duration: 0.2, ease: 'easeIn' } },
}

export const velo: Variants = {
  inicial: { opacity: 0 },
  entra: { opacity: 1, transition: { duration: 0.2 } },
  sale: { opacity: 0, transition: { duration: 0.16 } },
}

/** Pulsación táctil: feedback inmediato, sin rebote infantil. */
export const pulsable = {
  whileTap: { scale: 0.975 },
  transition: { duration: 0.12 },
}
