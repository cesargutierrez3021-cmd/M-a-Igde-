# Arquitectura de paneles · Terreno y Puesto de mando

Maquetas navegables de los ocho paneles principales en las dos direcciones
finalistas. Acompañan al PDF `../NOAH_Paneles_Dos_Temas.pdf`.

| Archivo | Tema | Paneles |
|---|---|---|
| `terreno.html` | Terreno | Base · Mapa del día · Cuaderno de campo · La jauría · Cumbres · Ascenso · Ficha de expedición · Puesto de control |
| `mando.html` | Puesto de mando | Mando · Objetivos · Sala de trazado · El escuadrón · Tabla de mando · Telemetría · Hoja de servicio · Sala de control |

## Los dos módulos nuevos

**Mis pronósticos** (`Cuaderno de campo` / `Sala de trazado`) — el usuario publica
sus propias apuestas. Al publicar se congelan cuota y hora, el pronóstico deja de
ser editable y se liquida solo. La pantalla muestra tres curvas superpuestas: el
bot, el usuario siguiendo al bot, y los pronósticos propios del usuario.

**Comunidad** (`La jauría` / `El escuadrón`) — feed de todos los pronósticos
sellados, cada uno con el CLV histórico de quien lo publicó. El consenso de la
comunidad se contrasta siempre con la posición del bot, y se dice explícitamente
que ser mayoría no da la razón.

## Por qué el ranking va por CLV

Ordenar por aciertos premia a quien apuesta a favoritos a cuota baja. Ordenar por
CLV premia a quien encuentra precio, que es lo único que sobrevive a una muestra
larga. Es la misma métrica con la que NOAH se juzga a sí mismo.

Umbral de entrada a la clasificación: 30 pronósticos sellados. Con menos, un
primer puesto es ruido con nombre propio.
