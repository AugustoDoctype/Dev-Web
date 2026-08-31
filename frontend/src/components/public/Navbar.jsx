import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-emerald-600">
          E-Ciclo
        </Link>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-emerald-600 transition">Início</Link>
          <Link to="/doar" className="hover:text-emerald-600 transition">Fazer Doação</Link>
          <Link to="/como-funciona" className="hover:text-emerald-600 transition">Como Funciona</Link>
          <Link to="/minhas-doacoes" className="hover:text-emerald-600 transition">Minhas Doações</Link>
        </div>
      </div>
    </nav>
  )
}