
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/como-funciona', label: 'Como Funciona' },
  { to: '/pontos-de-coleta', label: 'Pontos de Coleta' },
  { to: '/minhas-doacoes', label: 'Minhas Doações' },
]

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false)

  const linkClass = ({ isActive }) =>
    `relative rounded-lg px-3 py-2 text-sm transition-all duration-300 ${
      isActive
        ? 'bg-emerald-400/10 font-semibold text-emerald-300'
        : 'font-medium text-gray-400 hover:bg-white/[0.04] hover:text-emerald-300'
    }`

  return (
    <nav className="relative z-50 border-b border-emerald-400/10 bg-[#0b1311]/95 font-sans shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white transition"
          onClick={() => setMenuAberto(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-xl transition duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/15">
            ♻
          </span>

          <span>
            E-<span className="text-emerald-400">Ciclo</span>
            <span className="text-emerald-300">.</span>
          </span>
        </Link>

        {/* Navegação desktop */}
        <div className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={linkClass}
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-emerald-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Ações da conta */}
          <div className="ml-3 flex items-center gap-3 border-l border-white/10 pl-5">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-300 transition duration-300 hover:bg-white/[0.05] hover:text-white"
            >
              Entrar
            </Link>

            <Link
              to="/cadastro"
              className="rounded-xl border border-emerald-300/20 bg-gradient-to-r from-emerald-500 to-green-400 px-5 py-2.5 text-sm font-bold text-[#07110d] shadow-lg shadow-emerald-950/30 transition duration-300 hover:-translate-y-0.5 hover:from-emerald-400 hover:to-green-300 hover:shadow-emerald-900/40"
            >
              Cadastrar
            </Link>
          </div>
        </div>

        {/* Botão mobile */}
        <button
          type="button"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-200 transition duration-300 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300 lg:hidden"
        >
          {menuAberto ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <div className="border-t border-emerald-400/10 bg-[#0b1311]/[0.98] px-4 py-4 shadow-xl shadow-black/20 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMenuAberto(false)}
                className={({ isActive }) =>
                  `rounded-xl border px-3 py-3 text-sm transition duration-200 ${
                    isActive
                      ? 'border-emerald-400/15 bg-emerald-400/[0.08] font-semibold text-emerald-300'
                      : 'border-transparent font-medium text-gray-400 hover:bg-white/[0.04] hover:text-emerald-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-3 flex gap-3 border-t border-white/10 pt-4">
              <Link
                to="/login"
                onClick={() => setMenuAberto(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm font-semibold text-gray-200 transition hover:border-emerald-400/30 hover:text-emerald-300"
              >
                Entrar
              </Link>

              <Link
                to="/cadastro"
                onClick={() => setMenuAberto(false)}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 px-4 py-3 text-center text-sm font-bold text-[#07110d] transition hover:from-emerald-400 hover:to-green-300"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
