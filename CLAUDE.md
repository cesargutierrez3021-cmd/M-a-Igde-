# NOAH

Sistema cuantitativo de detección de valor en apuestas de fútbol.
Python 3.12 · FastAPI · Supabase (Postgres + Auth + Storage) · Fly.io
Interfaz: React + Vite + TypeScript + Tailwind + shadcn/ui, PWA instalable.

## Las once invariantes. No se negocian. Si algo choca, gana esto.

1. `core/` es PURO: sin red, sin disco, sin BD, sin `datetime.now()`, sin
   aleatoriedad sin semilla. El tiempo entra como parámetro `as_of`.
2. Ninguna probabilidad llega al cálculo de valor sin pasar por un calibrador
   ajustado y versionado. Sin calibrador -> NO_BET("SIN_CALIBRACION").
3. Nada en `core/` sin consumidor en la ruta de decisión. Si escribes un
   módulo, conéctalo en el mismo PR o no lo escribas.
4. Todos los mercados usan el mismo contrato y el mismo evaluador. El
   evaluador NUNCA menciona un mercado por su nombre.
5. Las puertas no matan mercados: reducen el stake. Nada desaparece en silencio.
6. El edge se calcula y se filtra en RELATIVO y en absoluto.
7. Prohibido filtrar por rango de cuota como sustituto de calibración.
8. Los datos de observación son de solo-anexado. Nunca UPDATE. Todo lleva
   `observed_at`. Toda feature exige `as_of` explícito o lanza excepción.
9. Ningún modelo ni mercado se activa sin walk-forward y CLV medidos.
10. NO BET es un resultado válido y frecuente. PROHIBIDO bajar un umbral
    porque "no salen apuestas". Si no hay valor, no hay valor.
11. PAPER por defecto. REAL exige fila firmada en BD Y variable de entorno.

## Reglas de seguridad

- Prohibido `pickle`, `eval`, `exec`, `shell=True`, SQL concatenado, `Any`.
- El nivel del usuario (free/premium/admin) se comprueba SIEMPRE en el
  servidor. Ocultar en el cliente no es proteger.
- Todo dato externo (scraping, LLM, webhook) se valida contra esquema antes
  de tocar nada. Nunca se interpola en SQL ni en un prompt.
- El navegador NUNCA habla directo con Supabase para datos de negocio.
  Solo: Navegador -> FastAPI -> Supabase.

## Marca

NOAH. Husky siberiano: resistencia, jauría, lectura del terreno.
Colores: noir #0B0D10 · superficie #14181D · oro #C9A227 · plata #C3C7CC ·
blanco #F5F6F7 · ganada #3FA96A · perdida #C4553F.
Tipografía: Sora (titulares) · Inter (interfaz) · JetBrains Mono (números).
El oro nunca supera el 10% de la superficie de una pantalla.
Ninguna animación supera 300 ms ni bloquea la lectura de un dato.
Ninguna pantalla promete rentabilidad. Muestra probabilidad, valor e
incertidumbre, y marca como no concluyente lo que tiene muestra insuficiente.
