import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import ComoFunciona from '../pages/ComoFunciona'
import Doacao from '../pages/Doacao'
import Confirmacao from '../pages/Confirmacao'
import Login from '../pages/admin/Login'
import Dashboard from '../pages/admin/Dashboard'
import Doacoes from '../pages/admin/Doacoes'
import DetalhesDoacao from '../pages/admin/DetalhesDoacao'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/doacao" element={<Doacao />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/doacoes" element={<Doacoes />} />
        <Route path="/admin/doacoes/:id" element={<DetalhesDoacao />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes