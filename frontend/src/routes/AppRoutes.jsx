import { Routes, Route } from 'react-router-dom'

// Páginas Públicas
import Home from '../pages/Home'
import Doacao from '../pages/Doacao'
import ComoFunciona from '../pages/ComoFunciona'
import MinhasDoacoes from '../pages/MinhasDoacoes'
import DetalhesMinhaDoacao from '../pages/DetalhesMinhaDoacao'
import Confirmacao from '../pages/Confirmacao'

// Páginas de Autenticação
import LoginAdmin from '../pages/admin/Login'
import Cadastro from '../pages/cadastro'

// Páginas Administrativas
import DashboardAdmin from '../pages/admin/Dashboard'
import DoacoesAdmin from '../pages/admin/Doacoes'
import DetalhesDoacaoAdmin from '../pages/admin/DetalhesDoacao'

// Componente de Proteção
import ProtectedRoute from '../components/auth/ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/doar" element={<Doacao />} />
      <Route path="/como-funciona" element={<ComoFunciona />} />
      <Route path="/minhas-doacoes" element={<MinhasDoacoes />} />
      <Route path="/minhas-doacoes/:id" element={<DetalhesMinhaDoacao />} />
      <Route path="/confirmacao" element={<Confirmacao />} />

      {/* Autenticação - Rota /login apontando para o Login existente */}
      <Route path="/login" element={<LoginAdmin />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/admin/login" element={<LoginAdmin />} />

      {/* Painel Admin Protegido */}
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
    </Routes>
  )
}