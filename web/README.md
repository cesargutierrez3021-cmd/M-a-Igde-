# NOAH — interfaz

PWA (React + Vite + TypeScript + Tailwind + shadcn/ui + Framer Motion + Recharts),
construida según el manual maestro de NOAH, sección 7.

## Estado actual

Todos los módulos están montados con **datos de ejemplo** (`src/lib/mock/data.ts`),
porque el motor (Fases 1-7) aún no expone una API. Cuando exista FastAPI, se
reemplazan las funciones de `lib/mock` por llamadas reales vía TanStack Query —
ningún componente de pantalla necesita cambiar.

## Módulos implementados (manual §7.3)

- Hoy — pronósticos del día + NO BET con dignidad
- Detalle del pronóstico — traza de decisión completa
- Mis apuestas — registro Aposté/No aposté
- Capital — bankroll, fracción de Kelly, tope por apuesta
- Estadísticas — comparativa bot vs. usuario, regla de honestidad (muestra insuficiente)
- Historial
- Ajustes — notificaciones, tema
- Planes — comparativa de niveles

Pendientes de fases posteriores: Acceso (Supabase Auth), Salud del sistema,
Administración, Calibración y modelos (todos Admin — requieren backend).

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # build de producción + genera el service worker PWA
```

## Diseño

Tokens de marca en `src/design/tokens.css` — paleta, tipografía y reglas de
animación, todos tomados literalmente del manual maestro (§1.1, §1.2, §7.5).
No se hardcodea ningún color fuera de ese archivo.
