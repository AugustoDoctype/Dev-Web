import { Routes, Route } from 'react-router-dom'

// Páginas Públicas
import Home from '../pages/Home'
import Doacao from '../pages/Doacao'
import ComoFunciona from '../pages/ComoFunciona'
import MinhasDoacoes from '../pages/MinhasDoacoes'
import DetalhesMinhaDoacao from '../pages/DetalhesMinhaDoacao'
import Confirmacao from '../pages/Confirmacao'

// Páginas Administrativas
import LoginAdmin from '../pages/admin/Login'
import DashboardAdmin from '../pages/admin/Dashboard'
import DoacoesAdmin from '../pages/admin/Doacoes'
import DetalhesDoacaoAdmin from '../pages/admin/DetalhesDoacao'

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

      {/* Rotas Admin */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      <Route path="/admin/doacoes" element={<DoacoesAdmin />} />
      <Route path="/admin/doacoes/:id" element={<DetalhesDoacaoAdmin />} />
    </Routes>
  )
}