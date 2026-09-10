import { HashRouter, Route, Routes } from 'react-router-dom'
import { ProveedorApariencia, useApariencia } from './lib/theme'
import { EleccionApariencia } from './features/apariencia/EleccionApariencia'
import { Encabezado } from './components/shell/Header'
import { NavInferior } from './components/shell/BottomNav'
import { TrabajoScreen } from './features/trabajo/TrabajoScreen'
import { HogarScreen } from './features/hogar/HogarScreen'
import { DeudasScreen } from './features/deudas/DeudasScreen'
import { BalanceScreen } from './features/balance/BalanceScreen'
import { AvisosScreen } from './features/avisos/AvisosScreen'
import { RutinaScreen } from './features/rutina/RutinaScreen'
import { AjustesScreen } from './features/ajustes/AjustesScreen'
import { useEffect } from 'react'
import { useTienda } from './lib/store'

function Interior() {
  const { yaEligio } = useApariencia()
  const generar = useTienda((s) => s.generarGastosFijosDelMes)

  useEffect(() => {
    generar()
  }, [generar])

  if (!yaEligio) return <EleccionApariencia />

  return (
    <HashRouter>
      <div className="min-h-dvh">
        <Encabezado />
        <Routes>
          <Route path="/" element={<TrabajoScreen />} />
          <Route path="/hogar" element={<HogarScreen />} />
          <Route path="/deudas" element={<DeudasScreen />} />
          <Route path="/balance" element={<BalanceScreen />} />
          <Route path="/avisos" element={<AvisosScreen />} />
          <Route path="/rutina" element={<RutinaScreen />} />
          <Route path="/ajustes" element={<AjustesScreen />} />
        </Routes>
        <NavInferior />
      </div>
    </HashRouter>
  )
}

export default function App() {
  return (
    <ProveedorApariencia>
      <Interior />
    </ProveedorApariencia>
  )
}
