import type { Tema } from './theme'

/*
 * Nomenclatura por tema.
 *
 * Terreno y Puesto de mando no son dos paletas: son dos formas de nombrar lo
 * mismo. Un pronóstico propio es una entrada del cuaderno de campo o un trazado;
 * la comunidad es la jauría o el escuadrón. Cambiar de tema cambia el idioma de
 * la app, no solo sus colores.
 *
 * Todas las pantallas leen de aquí. Añadir un tema nuevo = añadir una columna.
 */

export type ClavePanel =
  | 'inicio'
  | 'oportunidades'
  | 'detalle'
  | 'pronosticos'
  | 'comunidad'
  | 'clasificacion'
  | 'perfil'
  | 'apuestas'
  | 'capital'
  | 'rendimiento'
  | 'historial'
  | 'planes'
  | 'ajustes'
  | 'salud'
  | 'admin'
  | 'calibracion'

interface Nombre {
  /** Etiqueta corta, para la navegación inferior. */
  corto: string
  /** Título de la pantalla. */
  largo: string
  /** Píldora que corona la pantalla. */
  kicker: string
}

type Tabla = Record<ClavePanel, Record<Tema, Nombre>>

export const NOMBRES: Tabla = {
  inicio: {
    terreno: { corto: 'Base', largo: 'Campamento base', kicker: 'Reconocimiento del día' },
    mando: { corto: 'Mando', largo: 'Puesto de mando', kicker: 'Estado del sistema' },
  },
  oportunidades: {
    terreno: { corto: 'Mapa', largo: 'Mapa del día', kicker: 'Máx. 3 cotas' },
    mando: { corto: 'Objetivos', largo: 'Objetivos fijados', kicker: 'Barrido completado' },
  },
  detalle: {
    terreno: { corto: 'Cota', largo: 'La cota', kicker: 'Ficha de cota' },
    mando: { corto: 'Objetivo', largo: 'Ficha de objetivo', kicker: 'Análisis del objetivo' },
  },
  pronosticos: {
    terreno: { corto: 'Cuaderno', largo: 'Cuaderno de campo', kicker: 'Tus anotaciones' },
    mando: { corto: 'Trazado', largo: 'Sala de trazado', kicker: 'Tus transmisiones' },
  },
  comunidad: {
    terreno: { corto: 'Jauría', largo: 'La jauría', kicker: 'Rastros de la manada' },
    mando: { corto: 'Escuadrón', largo: 'El escuadrón', kicker: 'Canal abierto' },
  },
  clasificacion: {
    terreno: { corto: 'Cumbres', largo: 'Cumbres', kicker: 'Quién llegó más alto' },
    mando: { corto: 'Tabla', largo: 'Tabla de mando', kicker: 'Quién vuela más alto' },
  },
  perfil: {
    terreno: { corto: 'Ficha', largo: 'Ficha de expedición', kicker: 'Historial verificado' },
    mando: { corto: 'Hoja', largo: 'Hoja de servicio', kicker: 'Historial verificado' },
  },
  apuestas: {
    terreno: { corto: 'Bitácora', largo: 'Bitácora', kicker: 'Lo que seguiste del bot' },
    mando: { corto: 'Registro', largo: 'Registro de vuelo', kicker: 'Lo que seguiste del motor' },
  },
  capital: {
    terreno: { corto: 'Provisiones', largo: 'Provisiones', kicker: 'Gestión de riesgo' },
    mando: { corto: 'Combustible', largo: 'Combustible', kicker: 'Gestión de riesgo' },
  },
  rendimiento: {
    terreno: { corto: 'Ascenso', largo: 'Perfil del ascenso', kicker: 'Histórico completo' },
    mando: { corto: 'Telemetría', largo: 'Telemetría', kicker: 'Trayectoria del capital' },
  },
  historial: {
    terreno: { corto: 'Rutas', largo: 'Rutas recorridas', kicker: 'Todo lo liquidado' },
    mando: { corto: 'Caja negra', largo: 'Caja negra', kicker: 'Todo lo liquidado' },
  },
  planes: {
    terreno: { corto: 'Equipo', largo: 'Equipamiento', kicker: 'Niveles' },
    mando: { corto: 'Permisos', largo: 'Autorizaciones', kicker: 'Niveles' },
  },
  ajustes: {
    terreno: { corto: 'Ajustes', largo: 'Preparación', kicker: 'Preferencias' },
    mando: { corto: 'Ajustes', largo: 'Consola', kicker: 'Preferencias' },
  },
  salud: {
    terreno: { corto: 'Estación', largo: 'Estación meteorológica', kicker: 'Control del sistema' },
    mando: { corto: 'Diagnóstico', largo: 'Diagnóstico', kicker: 'Control del sistema' },
  },
  admin: {
    terreno: { corto: 'Control', largo: 'Puesto de control', kicker: 'Solo administración' },
    mando: { corto: 'Control', largo: 'Sala de control', kicker: 'Solo administración' },
  },
  calibracion: {
    terreno: { corto: 'Instrumentos', largo: 'Instrumentos', kicker: 'Control del sistema' },
    mando: { corto: 'Banco', largo: 'Banco de pruebas', kicker: 'Control del sistema' },
  },
}

/** Vocabulario suelto que también cambia con el tema. */
export const VOCABULARIO: Record<Tema, Record<string, string>> = {
  terreno: {
    bot: 'el bot',
    pronostico: 'cota',
    pronosticos: 'cotas',
    sellar: 'Sellar',
    publicar: 'Sellar y publicar',
    miembro: 'explorador',
    miembros: 'exploradores',
    actividad: 'rastros',
    seguir: 'Rastrear',
    nuevo: 'Nueva cota',
    cadaSellado: 'cada cota sellada con su hora',
    tusPropios: 'Tus cotas propias',
  },
  mando: {
    bot: 'el motor',
    pronostico: 'objetivo',
    pronosticos: 'objetivos',
    sellar: 'Registrar',
    publicar: 'Sellar y transmitir',
    miembro: 'operador',
    miembros: 'operadores',
    actividad: 'transmisiones',
    seguir: 'Seguir',
    nuevo: 'Nuevo objetivo',
    cadaSellado: 'cada objetivo sellado con su hora',
    tusPropios: 'Tus objetivos propios',
  },
}

export function nombreDe(clave: ClavePanel, tema: Tema): Nombre {
  return NOMBRES[clave][tema]
}
