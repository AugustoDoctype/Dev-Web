import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const THEME_KEY = 'eciclo-tema'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/como-funciona', label: 'Como Funciona' },
  { to: '/pontos-de-coleta', label: 'Pontos de Coleta' },
  { to: '/minhas-doacoes', label: 'Minhas Doações' },
]

function lerTemaSalvo() {
  return localStorage.getItem(THEME_KEY) === 'claro' ? 'claro' : 'escuro'
}

export default function Navbar() {
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)
  const [tema, setTema] = useState(lerTemaSalvo)
  const [doadorLogado, setDoadorLogado] = useState(
    () => Boolean(localStorage.getItem('doadorToken'))
  )

  // A mesma Navbar atende login, logout e alterações feitas em outra aba.
  useEffect(() => {
    function atualizarAutenticacao() {
      setDoadorLogado(Boolean(localStorage.getItem('doadorToken')))
    }

    function atualizarTema(evento) {
      setTema(evento.detail === 'claro' ? 'claro' : 'escuro')
    }

    function atualizarStorage(evento) {
      if (evento.key === null || evento.key === 'doadorToken') {
        atualizarAutenticacao()
      }
      if (evento.key === null || evento.key === THEME_KEY) {
        setTema(lerTemaSalvo())
      }
    }

    window.addEventListener('eciclo-auth-alterado', atualizarAutenticacao)
    window.addEventListener('eciclo-tema-alterado', atualizarTema)
    window.addEventListener('storage', atualizarStorage)

    return () => {
      window.removeEventListener('eciclo-auth-alterado', atualizarAutenticacao)
      window.removeEventListener('eciclo-tema-alterado', atualizarTema)
      window.removeEventListener('storage', atualizarStorage)
    }
  }, [])

  // Aplica o tema global mesmo após trocar de rota.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'escuro')
    document.documentElement.style.colorScheme = tema === 'escuro' ? 'dark' : 'light'
  }, [tema])

  const modoClaro = tema === 'claro'
  // O acesso ao histórico já aparece em 'Minha área' quando há login.
  const linksVisiveis = doadorLogado
    ? links.filter((link) => link.to !== '/minhas-doacoes')
    : links

  function alternarTema() {
    const novoTema = modoClaro ? 'escuro' : 'claro'
    localStorage.setItem(THEME_KEY, novoTema)
    setTema(novoTema)
    window.dispatchEvent(new CustomEvent('eciclo-tema-alterado', { detail: novoTema }))
  }

  function sairDaConta() {
    localStorage.removeItem('doadorToken')
    localStorage.removeItem('doadorPerfil')
    setDoadorLogado(false)
    setMenuAberto(false)
    window.dispatchEvent(new Event('eciclo-auth-alterado'))
    navigate('/')
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

  const linkContaClass = `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    modoClaro
      ? 'text-gray-700 hover:bg-gray-100'
      : 'text-gray-300 hover:bg-white/[0.05]'
  }`

  const linkMobileClass = `flex min-h-11 items-center justify-center rounded-xl border px-3 py-3 text-center text-sm font-semibold transition ${
    modoClaro
      ? 'border-emerald-200 text-emerald-800 hover:bg-emerald-50'
      : 'border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/10'
  }`

  return (
    <nav
      aria-label="Navegação principal"
      className={`ec-nav relative z-50 border-b font-sans shadow-lg backdrop-blur-xl transition-colors duration-300 ${
        modoClaro
          ? 'border-emerald-100 bg-white/95 shadow-gray-200/40'
          : 'border-emerald-400/10 bg-[#0b1311]/95 shadow-black/10'
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => setMenuAberto(false)}
          className={`group flex items-center gap-2 text-2xl font-extrabold tracking-tight transition ${
            modoClaro ? 'text-gray-900' : 'text-white'
          }`}
        >
          <span
            aria-hidden="true"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl transition duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/15 ${
              modoClaro
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-emerald-400/20 bg-emerald-400/10'
            }`}
          >
            <img src="/branding/simbolo-eciclo-transparente.png" alt="" className="h-8 w-10 object-contain" />
          </span>
          <span>
            E-<span className="text-emerald-500">Ciclo</span>
            <span className="text-emerald-400">.</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-2 lg:flex">
          {linksVisiveis.map((link) => (
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
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-emerald-400"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <div
            className={`ml-2 flex items-center gap-2 border-l pl-3 ${
              modoClaro ? 'border-gray-200' : 'border-white/10'
            }`}
          >
            <button
              type="button"
              onClick={alternarTema}
              aria-label={modoClaro ? 'Ativar modo escuro' : 'Ativar modo claro'}
              title={modoClaro ? 'Ativar modo escuro' : 'Ativar modo claro'}
              className={botaoTemaClass}
            >
              {modoClaro ? '🌙' : '☀️'}
            </button>

            {doadorLogado ? (
              <>
                <NavLink to="/meu-perfil" className={linkClass}>
                  Meu Perfil
                </NavLink>
                <NavLink to="/minhas-doacoes" className={linkClass}>
                  Minha área
                </NavLink>
                <button
                  type="button"
                  onClick={sairDaConta}
                  className="rounded-xl border border-emerald-400/20 px-4 py-2.5 text-sm font-bold text-emerald-500 transition hover:bg-emerald-500/10"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkContaClass}>
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="rounded-xl border border-emerald-300/20 bg-gradient-to-r from-emerald-500 to-green-400 px-4 py-2.5 text-sm font-bold text-[#07110d] shadow-lg shadow-emerald-950/10 transition duration-300 hover:-translate-y-0.5 hover:from-emerald-400 hover:to-green-300"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Controles mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={alternarTema}
            aria-label={modoClaro ? 'Ativar modo escuro' : 'Ativar modo claro'}
            title={modoClaro ? 'Ativar modo escuro' : 'Ativar modo claro'}
            className={botaoTemaClass}
          >
            {modoClaro ? '🌙' : '☀️'}
          </button>
          <button
            type="button"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            aria-controls="eciclo-menu-mobile"
            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition duration-300 ${
              modoClaro
                ? 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50'
                : 'border-white/10 bg-white/[0.03] text-gray-200 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300'
            }`}
          >
            {menuAberto ? (
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
          id="eciclo-menu-mobile"
          className={`border-t px-4 py-4 shadow-xl backdrop-blur-xl transition-colors duration-300 lg:hidden ${
            modoClaro
              ? 'border-emerald-100 bg-white/95 shadow-gray-200/40'
              : 'border-emerald-400/10 bg-[#0b1311]/[0.98] shadow-black/20'
          }`}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {linksVisiveis.map((link) => (
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
              className={`mt-3 grid grid-cols-2 gap-2 border-t pt-4 ${
                modoClaro ? 'border-gray-200' : 'border-white/10'
              }`}
            >
              {doadorLogado ? (
                <>
                  <Link
                    to="/meu-perfil"
                    onClick={() => setMenuAberto(false)}
                    className={linkMobileClass}
                  >
                    Meu Perfil
                  </Link>
                  <Link
                    to="/minhas-doacoes"
                    onClick={() => setMenuAberto(false)}
                    className={linkMobileClass}
                  >
                    Minha área
                  </Link>
                  <button
                    type="button"
                    onClick={sairDaConta}
                    className="col-span-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-[#07110b] transition hover:bg-emerald-400"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuAberto(false)}
                    className={linkMobileClass}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/cadastro"
                    onClick={() => setMenuAberto(false)}
                    className="flex min-h-11 items-center justify-center rounded-xl bg-emerald-500 px-3 py-3 text-center text-sm font-bold text-[#07110b] transition hover:bg-emerald-400"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
