import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/como-funciona', label: 'Como Funciona' },
  { to: '/pontos-de-coleta', label: 'Pontos de Coleta' },
  { to: '/minhas-doacoes', label: 'Minhas Doações' },
]

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false)

  const [tema, setTema] = useState(
    () => localStorage.getItem('eciclo-tema') || 'escuro'
  )

  // Aplica e sincroniza o tema em todo o projeto.
  useEffect(() => {
    const aplicarTema = (novoTema) => {
      const temaAtual = novoTema === 'claro' ? 'claro' : 'escuro'

      setTema(temaAtual)

      document.documentElement.classList.toggle(
        'dark',
        temaAtual === 'escuro'
      )

      document.documentElement.style.colorScheme =
        temaAtual === 'escuro' ? 'dark' : 'light'

      localStorage.setItem('eciclo-tema', temaAtual)
    }

    // Restaura o tema salvo ao carregar a página.
    aplicarTema(localStorage.getItem('eciclo-tema') || 'escuro')

    // Atualiza o Navbar quando outra página muda o tema.
    const handleTemaAlterado = (event) => {
      const temaAtual =
        event.detail ||
        localStorage.getItem('eciclo-tema') ||
        'escuro'

      aplicarTema(temaAtual)
    }

    window.addEventListener(
      'eciclo-tema-alterado',
      handleTemaAlterado
    )

    return () => {
      window.removeEventListener(
        'eciclo-tema-alterado',
        handleTemaAlterado
      )
    }
  }, [])

  const modoClaro = tema === 'claro'

  const alternarTema = () => {
    const novoTema = modoClaro ? 'escuro' : 'claro'

    // Salva a preferência.
    localStorage.setItem('eciclo-tema', novoTema)

    // Atualiza a aparência global.
    document.documentElement.classList.toggle(
      'dark',
      novoTema === 'escuro'
    )

    document.documentElement.style.colorScheme =
      novoTema === 'escuro' ? 'dark' : 'light'

    setTema(novoTema)

    // Notifica as páginas que acompanham o tema.
    window.dispatchEvent(
      new CustomEvent('eciclo-tema-alterado', {
        detail: novoTema,
      })
    )
  }

  const linkClass = ({ isActive }) =>
    `relative rounded-lg px-3 py-2 text-sm transition-all duration-300 ${
      isActive
        ? modoClaro
          ? 'bg-emerald-100 font-semibold text-emerald-800'
          : 'bg-emerald-400/10 font-semibold text-emerald-300'
        : modoClaro
          ? 'font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
          : 'font-medium text-gray-400 hover:bg-white/[0.04] hover:text-emerald-300'
    }`

  const botaoTemaClass = `flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition duration-300 ${
    modoClaro
      ? 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50'
      : 'border-white/10 bg-white/[0.03] text-gray-200 hover:border-emerald-400/30 hover:bg-emerald-400/10'
  }`

  return (
    <nav
      className={`relative z-50 border-b font-sans shadow-lg backdrop-blur-xl transition-colors duration-300 ${
        modoClaro
          ? 'border-emerald-100 bg-white/95 shadow-gray-200/40'
          : 'border-emerald-400/10 bg-[#0b1311]/95 shadow-black/10'
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className={`group flex items-center gap-2 text-2xl font-extrabold tracking-tight transition ${
            modoClaro ? 'text-gray-900' : 'text-white'
          }`}
          onClick={() => setMenuAberto(false)}
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl transition duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/15 ${
              modoClaro
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-emerald-400/20 bg-emerald-400/10'
            }`}
          >
            ♻
          </span>

          <span>
            E-<span className="text-emerald-500">Ciclo</span>
            <span className="text-emerald-400">.</span>
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
          <div
            className={`ml-3 flex items-center gap-3 border-l pl-5 ${
              modoClaro ? 'border-gray-200' : 'border-white/10'
            }`}
          >
            <button
              type="button"
              onClick={alternarTema}
              aria-label={
                modoClaro ? 'Ativar modo escuro' : 'Ativar modo claro'
              }
              title={
                modoClaro ? 'Ativar modo escuro' : 'Ativar modo claro'
              }
              className={botaoTemaClass}
            >
              {modoClaro ? '🌙' : '☀️'}
            </button>

            <Link
              to="/login"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition duration-300 ${
                modoClaro
                  ? 'text-gray-700 hover:bg-gray-100 hover:text-emerald-700'
                  : 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              Entrar
            </Link>

            <Link
              to="/cadastro"
              className="rounded-xl border border-emerald-300/20 bg-gradient-to-r from-emerald-500 to-green-400 px-5 py-2.5 text-sm font-bold text-[#07110d] shadow-lg shadow-emerald-950/10 transition duration-300 hover:-translate-y-0.5 hover:from-emerald-400 hover:to-green-300"
            >
              Cadastrar
            </Link>
          </div>
        </div>

        {/* Controles mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={alternarTema}
            aria-label={
              modoClaro ? 'Ativar modo escuro' : 'Ativar modo claro'
            }
            title={
              modoClaro ? 'Ativar modo escuro' : 'Ativar modo claro'
            }
            className={botaoTemaClass}
          >
            {modoClaro ? '🌙' : '☀️'}
          </button>

          <button
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition duration-300 ${
              modoClaro
                ? 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50'
                : 'border-white/10 bg-white/[0.03] text-gray-200 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300'
            }`}
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
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <div
          className={`border-t px-4 py-4 shadow-xl backdrop-blur-xl transition-colors duration-300 lg:hidden ${
            modoClaro
              ? 'border-emerald-100 bg-white/95 shadow-gray-200/40'
              : 'border-emerald-400/10 bg-[#0b1311]/[0.98] shadow-black/20'
          }`}
        >
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
                      ? modoClaro
                        ? 'border-emerald-200 bg-emerald-50 font-semibold text-emerald-800'
                        : 'border-emerald-400/15 bg-emerald-400/[0.08] font-semibold text-emerald-300'
                      : modoClaro
                        ? 'border-transparent font-medium text-gray-600 hover:bg-gray-100 hover:text-emerald-700'
                        : 'border-transparent font-medium text-gray-400 hover:bg-white/[0.04] hover:text-emerald-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div
              className={`mt-3 flex gap-3 border-t pt-4 ${
                modoClaro ? 'border-gray-200' : 'border-white/10'
              }`}
            >
              <Link
                to="/login"
                onClick={() => setMenuAberto(false)}
                className={`flex-1 rounded-xl border px-4 py-3 text-center text-sm font-semibold transition ${
                  modoClaro
                    ? 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:text-emerald-700'
                    : 'border-white/10 bg-white/[0.03] text-gray-200 hover:border-emerald-400/30 hover:text-emerald-300'
                }`}
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