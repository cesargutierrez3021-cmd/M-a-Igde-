import { Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/shell/BottomNav'
import { HoyScreen } from './features/hoy/HoyScreen'
import { DetalleScreen } from './features/detalle/DetalleScreen'
import { MisApuestasScreen } from './features/mis-apuestas/MisApuestasScreen'
import { CapitalScreen } from './features/capital/CapitalScreen'
import { EstadisticasScreen } from './features/estadisticas/EstadisticasScreen'
import { HistorialScreen } from './features/historial/HistorialScreen'
import { AjustesScreen } from './features/ajustes/AjustesScreen'
import { PlanesScreen } from './features/planes/PlanesScreen'

/*
 * NOAH — interfaz. Estructura de módulos según manual §7.3.
 * Todo lo que ve el usuario viene de mocks por ahora (lib/mock/data.ts):
 * se reemplaza por llamadas a FastAPI cuando exista la Fase 7 (API + niveles).
 */
export default function App() {
  return (
    <div className="mx-auto min-h-dvh max-w-md bg-[var(--bg)]">
      <Routes>
        <Route path="/" element={<HoyScreen />} />
        <Route path="/detalle/:id" element={<DetalleScreen />} />
        <Route path="/apuestas" element={<MisApuestasScreen />} />
        <Route path="/capital" element={<CapitalScreen />} />
        <Route path="/estadisticas" element={<EstadisticasScreen />} />
        <Route path="/historial" element={<HistorialScreen />} />
        <Route path="/ajustes" element={<AjustesScreen />} />
        <Route path="/planes" element={<PlanesScreen />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
