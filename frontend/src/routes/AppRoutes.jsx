import { Routes, Route } from 'react-router-dom'

// Páginas públicas
import Home from '../pages/Home'
import Doacao from '../pages/Doacao'
import ComoFunciona from '../pages/ComoFunciona'
import PontosDeColeta from '../pages/PontosDeColeta'
import MinhasDoacoes from '../pages/MinhasDoacoes'
import DetalhesMinhaDoacao from '../pages/DetalhesMinhaDoacao'
import Confirmacao from '../pages/Confirmacao'

// Páginas de autenticação
import Login from '../pages/Login'
import LoginAdmin from '../pages/admin/Login'
import Cadastro from '../pages/cadastro'

// Páginas administrativas
import DashboardAdmin from '../pages/admin/Dashboard'
import DoacoesAdmin from '../pages/admin/Doacoes'
import DetalhesDoacaoAdmin from '../pages/admin/DetalhesDoacao'
import PontosDeColetaAdmin from '../pages/admin/PontosDeColetaAdmin'

// Proteção de rotas
import ProtectedRoute from '../components/auth/ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/doar" element={<Doacao />} />
      <Route path="/como-funciona" element={<ComoFunciona />} />

      <Route
        path="/pontos-de-coleta"
        element={<PontosDeColeta />}
      />

      <Route path="/minhas-doacoes" element={<MinhasDoacoes />} />

      <Route
        path="/minhas-doacoes/:id"
        element={<DetalhesMinhaDoacao />}
      />

      <Route path="/confirmacao" element={<Confirmacao />} />

      {/* Autenticação */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/admin/login" element={<LoginAdmin />} />

      {/* Painel administrativo protegido */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/doacoes"
        element={
          <ProtectedRoute>
            <DoacoesAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/doacoes/:id"
        element={
          <ProtectedRoute>
            <DetalhesDoacaoAdmin />
          </ProtectedRoute>
        }
      />

      {/* Gerenciamento de pontos de coleta */}
      <Route
        path="/admin/pontos-de-coleta"
        element={
          <ProtectedRoute>
            <PontosDeColetaAdmin />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}