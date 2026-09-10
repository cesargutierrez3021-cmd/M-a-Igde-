interface HeaderProps {
  titulo: string
}

/* Cabecera simple — logotipo NOAH usa Sora 800 con tracking amplio (manual §1.2). */
export function Header({ titulo }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg)]/95 px-4 py-3 backdrop-blur">
      <span className="font-[var(--font-display)] text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--color-gold)]">
        NOAH
      </span>
      <h1 className="font-[var(--font-sans)] text-sm font-medium text-[var(--text-secondary)]">{titulo}</h1>
    </header>
  )
}
