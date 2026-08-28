import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import ComoFunciona from '../pages/ComoFunciona'
import Doacao from '../pages/Doacao'
import Confirmacao from '../pages/Confirmacao'
import MinhasDoacoes from '../pages/MinhasDoacoes'
import DetalhesMinhaDoacao from '../pages/DetalhesMinhaDoacao'

import Login from '../pages/admin/Login'
import Dashboard from '../pages/admin/Dashboard'
import Doacoes from '../pages/admin/Doacoes'
import DetalhesDoacao from '../pages/admin/DetalhesDoacao'

import ProtectedRoute from '../components/auth/ProtectedRoute'

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Páginas públicas */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/como-funciona"
          element={<ComoFunciona />}
        />

        <Route
          path="/doacao"
          element={<Doacao />}
        />

        <Route
          path="/confirmacao"
          element={<Confirmacao />}
        />

        <Route
          path="/minhas-doacoes"
          element={<MinhasDoacoes />}
        />

        <Route
          path="/minhas-doacoes/:id"
          element={<DetalhesMinhaDoacao />}
        />

        {/* Login administrativo */}

        <Route
          path="/admin/login"
          element={<Login />}
        />

        {/* Área administrativa protegida */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doacoes"
          element={
            <ProtectedRoute>
              <Doacoes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doacoes/:id"
          element={
            <ProtectedRoute>
              <DetalhesDoacao />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default AppRoutes