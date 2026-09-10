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
import { BienvenidaScreen } from './features/bienvenida/BienvenidaScreen'
import { useApariencia } from './lib/theme'

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
  const { yaEligio } = useApariencia()
  const enAcceso = location.pathname === '/acceso'

  // En el primer arranque se elige apariencia antes que nada: el resto de la
  // app se ve distinta según lo que escoja, así que preguntarlo después sería
  // enseñarle un tema que quizá no quiere.
  if (!yaEligio) {
    return (
      <AnimatePresence mode="wait">
        <BienvenidaScreen key="bienvenida" />
      </AnimatePresence>
    )
  }

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
