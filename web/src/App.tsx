import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { Header } from './components/shell/Header'
import { BottomNav } from './components/shell/BottomNav'

import { PanelScreen } from './features/panel/PanelScreen'
import { OportunidadesScreen } from './features/oportunidades/OportunidadesScreen'
import { DetalleScreen } from './features/detalle/DetalleScreen'
import { ApuestasScreen } from './features/apuestas/ApuestasScreen'
import { RendimientoScreen } from './features/rendimiento/RendimientoScreen'
import { CapitalScreen } from './features/capital/CapitalScreen'
import { HistorialScreen } from './features/historial/HistorialScreen'
import { AjustesScreen } from './features/ajustes/AjustesScreen'
import { PlanesScreen } from './features/planes/PlanesScreen'
import { SaludScreen } from './features/salud/SaludScreen'
import { AdminScreen } from './features/admin/AdminScreen'
import { CalibracionScreen } from './features/calibracion/CalibracionScreen'
import { AccesoScreen } from './features/acceso/AccesoScreen'

/*
 * NOAH — interfaz.
 *
 * Las doce pantallas del manual §7.3. Todo lo que muestran viene de
 * lib/mock/data.ts mientras el motor (fases 1-7) no exponga API: cuando exista,
 * se sustituye esa capa por TanStack Query y ninguna pantalla cambia.
 *
 * La pantalla de acceso vive fuera del armazón (sin cabecera ni navegación).
 */
export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const enAcceso = location.pathname === '/acceso'

  if (enAcceso) {
    return (
      <AnimatePresence mode="wait">
        <AccesoScreen key="acceso" />
      </AnimatePresence>
    )
  }

  return (
    <div className="min-h-dvh">
      <Header onSalir={() => navigate('/acceso')} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PanelScreen />} />
          <Route path="/hoy" element={<OportunidadesScreen />} />
          <Route path="/detalle/:id" element={<DetalleScreen />} />
          <Route path="/apuestas" element={<ApuestasScreen />} />
          <Route path="/rendimiento" element={<RendimientoScreen />} />
          <Route path="/capital" element={<CapitalScreen />} />
          <Route path="/historial" element={<HistorialScreen />} />
          <Route path="/ajustes" element={<AjustesScreen />} />
          <Route path="/planes" element={<PlanesScreen />} />
          <Route path="/salud" element={<SaludScreen />} />
          <Route path="/admin" element={<AdminScreen />} />
          <Route path="/calibracion" element={<CalibracionScreen />} />
          <Route path="*" element={<PanelScreen />} />
        </Routes>
      </AnimatePresence>

      <BottomNav />
    </div>
  )
}
