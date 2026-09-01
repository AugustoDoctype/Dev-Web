import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Nome do Projeto */}
        <Link to="/" className="text-xl font-bold text-emerald-600 tracking-tight">
          E-Ciclo
        </Link>

        {/* Links Principais de Navegação */}
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-emerald-600 transition">
            Início
          </Link>
          <Link to="/como-funciona" className="hover:text-emerald-600 transition">
            Como Funciona
          </Link>
          <Link to="/minhas-doacoes" className="hover:text-emerald-600 transition">
            Minhas Doações
          </Link>

          {/* Divisória e Acesso do Usuário */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <Link
              to="/login"
              className="text-gray-700 hover:text-emerald-600 font-semibold text-xs transition"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition text-xs"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}