import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Moon, Sun } from 'lucide-react'
import { HuskyMark } from '../../components/brand/HuskyMark'
import { TramaJauria } from '../../components/brand/Illustrations'
import { Button, Divider } from '../../components/ui/primitives'
import { useTema } from '../../lib/theme'

/*
 * Acceso — manual §7.3, módulo 1.
 * En producción esto delega en Supabase Auth y el backend valida el JWT en
 * cada petición; la interfaz nunca decide el nivel del usuario.
 */
export function AccesoScreen() {
  const navigate = useNavigate()
  const { tema, alternar } = useTema()
  const [modo, setModo] = useState<'entrar' | 'registro'>('entrar')

  return (
    <div className="relative z-10 flex min-h-dvh flex-col">
      <TramaJauria className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-80" />

      <button
        onClick={alternar}
        aria-label="Cambiar tema"
        className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-line text-dim"
      >
        {tema === 'noir' ? <Sun size={17} strokeWidth={1.6} /> : <Moon size={17} strokeWidth={1.6} />}
      </button>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
        {/* Marca */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="float-slow inline-block">
            <HuskyMark size={68} vivo />
          </div>
          <h1 className="wordmark gold-text mt-4 text-[30px]">NOAH</h1>
          <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.2em] text-mute">
            Valor deportivo cuantitativo
          </p>
        </motion.div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <div className="flex rounded-[var(--radius-pill)] border border-line bg-surface-2 p-1">
            {(['entrar', 'registro'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModo(m)}
                className={`relative min-h-10 flex-1 rounded-[var(--radius-pill)] text-[13px] font-medium transition-colors ${
                  modo === m ? 'text-[#12140F]' : 'text-mute'
                }`}
              >
                {modo === m && (
                  <motion.span
                    layoutId="acceso-tab"
                    className="absolute inset-0 rounded-[var(--radius-pill)]"
                    style={{ background: 'var(--grad-gold)' }}
                    transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                  />
                )}
                <span className="relative">{m === 'entrar' ? 'Entrar' : 'Crear cuenta'}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            <Campo icono={<Mail size={16} strokeWidth={1.7} />} tipo="email" placeholder="tu@correo.com" />
            <Campo icono={<Lock size={16} strokeWidth={1.7} />} tipo="password" placeholder="Contraseña" />
          </div>

          <div className="mt-5">
            <Button variante="oro" ancho onClick={() => navigate('/')}>
              {modo === 'entrar' ? 'Entrar' : 'Crear cuenta'}
            </Button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <Divider />
            <span className="shrink-0 text-[11px] text-mute">o</span>
            <Divider />
          </div>

          <Button variante="contorno" ancho onClick={() => navigate('/')}>
            Continuar con Google
          </Button>

          {modo === 'entrar' && (
            <button className="mt-4 w-full text-center text-[12.5px] text-mute">
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </motion.div>

        {/* Legal */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center text-[11px] leading-relaxed text-mute"
        >
          NOAH es una herramienta de análisis. No acepta apuestas ni promete rentabilidad.
          <br />
          +18 · Juego responsable.
        </motion.p>
      </div>
    </div>
  )
}

function Campo({
  icono,
  tipo,
  placeholder,
}: {
  icono: React.ReactNode
  tipo: string
  placeholder: string
}) {
  return (
    <label className="flex items-center gap-3 rounded-[var(--radius-btn)] border border-line bg-surface px-3.5 focus-within:border-gold-line">
      <span className="shrink-0 text-mute">{icono}</span>
      <input
        type={tipo}
        placeholder={placeholder}
        className="min-h-12 w-full bg-transparent text-[15px] text-fg outline-none placeholder:text-mute"
      />
    </label>
  )
}
