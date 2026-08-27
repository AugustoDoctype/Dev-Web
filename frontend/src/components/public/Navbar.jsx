import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-green-700 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          E-Ciclo
        </Link>

        <div className="flex gap-6">
          <Link
            to="/"
            className="hover:text-green-200 transition"
          >
            Início
          </Link>

          <Link
            to="/como-funciona"
            className="hover:text-green-200 transition"
          >
            Como Funciona
          </Link>

          <Link
            to="/doacao"
            className="hover:text-green-200 transition"
          >
            Doar
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar