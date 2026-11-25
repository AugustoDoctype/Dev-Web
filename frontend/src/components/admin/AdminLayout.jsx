import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import AdminIcone from './AdminIcone'

// Estrutura única para Dashboard, Doações, Detalhes e Pontos de Coleta.
// A API e os estados de cada tela continuam sob responsabilidade das páginas.
const links = [
  { to: '/admin/dashboard', nome: 'Visão geral', icone: '▦' },
  { to: '/admin/doacoes', nome: 'Doações', icone: '♻' },
  { to: '/admin/pontos-de-coleta', nome: 'Pontos de coleta', icone: '⌖' },
]

function lerTema() {
  return localStorage.getItem('eciclo-tema') === 'claro' ? 'claro' : 'escuro'
}

export default function AdminLayout({
  titulo,
  descricao,
  children,
  acao = null,
  overlay = null,
  className = '',
}) {
  const navigate = useNavigate()
  const [tema, setTema] = useState(lerTema)
  const claro = tema === 'claro'

  useEffect(() => {
    const atualizarTema = () => setTema(lerTema())
    const atualizarStorage = (evento) => {
      if (evento.key === null || evento.key === 'eciclo-tema') atualizarTema()
    }
    window.addEventListener('eciclo-tema-alterado', atualizarTema)
    window.addEventListener('storage', atualizarStorage)
    return () => {
      window.removeEventListener('eciclo-tema-alterado', atualizarTema)
      window.removeEventListener('storage', atualizarStorage)
    }
  }, [])

  function alternarTema() {
    const novoTema = claro ? 'escuro' : 'claro'
    localStorage.setItem('eciclo-tema', novoTema)
    document.documentElement.classList.toggle('dark', novoTema === 'escuro')
    document.documentElement.style.colorScheme = novoTema === 'escuro' ? 'dark' : 'light'
    setTema(novoTema)
    window.dispatchEvent(new CustomEvent('eciclo-tema-alterado', { detail: novoTema }))
  }

  function sair() {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('userPerfil')
    navigate('/admin/login', { replace: true })
  }

  const fundo = claro ? 'bg-slate-50 text-slate-900' : 'bg-[#0b110e] text-slate-100'
  const painel = claro ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#111b16]'
  const secundario = claro ? 'text-slate-600' : 'text-slate-400'
  const borda = claro ? 'border-slate-200' : 'border-white/10'
  const temaBotao = claro
    ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
    : 'border-white/10 bg-white/5 text-white hover:bg-white/10'

  const classeLink = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
        : 'border-transparent text-emerald-50/80 hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-white'
    }`

  return (
    <div className={`ec-admin ec-admin--layout ${className} ${claro ? 'ec-admin--claro' : 'ec-admin--escuro'} min-h-screen transition-colors duration-300 ${fundo}`}>
      {/* O mesmo menu lateral é usado em todas as áreas administrativas. */}
      <aside className="ec-admin-sidebar fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r lg:flex">
        <NavLink to="/admin/dashboard" className="flex h-20 shrink-0 items-center gap-3 border-b border-emerald-400/15 px-6">
          <span className="ec-admin-brand">
            <img src="/branding/icon-192.png" alt="" width="46" height="46" />
          </span>
          <span className="min-w-0">
            <strong className="block text-xl font-extrabold tracking-tight text-white">E-Ciclo<span className="text-emerald-300">.</span></strong>
            <small className="block text-xs text-emerald-100/70">Painel administrativo</small>
          </span>
        </NavLink>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[.18em] text-emerald-100/65">Menu principal</p>
          <nav aria-label="Navegação administrativa" className="space-y-2">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={classeLink}>
                <AdminIcone tipo={link.icone} />
                {link.nome}
              </NavLink>
            ))}
          </nav>
          <div className="mt-10 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.065] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-lg" aria-hidden="true">🌱</div>
            <p className="text-sm font-bold text-emerald-50">Um futuro mais sustentável</p>
            <p className="mt-2 text-xs leading-5 text-emerald-100/75">Tecnologia e descarte consciente em um só lugar.</p>
          </div>
        </div>

        <div className="border-t border-emerald-400/15 p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 font-bold text-emerald-300" aria-hidden="true">A</span>
            <div>
              <p className="text-sm font-bold text-white">Administrador</p>
              <p className="text-xs text-emerald-100/65">Gerenciamento do sistema</p>
            </div>
          </div>
          <button type="button" onClick={sair} className="w-full rounded-xl border border-red-400/15 px-4 py-2.5 text-left text-sm font-semibold text-red-200 transition hover:bg-red-400/10">
            ↪ Sair do painel
          </button>
        </div>
      </aside>

      <div className="min-w-0 lg:ml-64">
        <header className={`ec-admin-topbar sticky top-0 z-20 border-b backdrop-blur-xl ${borda}`}>
          <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div className="min-w-0">
              <p className={`text-xs font-semibold ${secundario}`}>E-Ciclo / Administração</p>
              <p className="mt-1 truncate text-base font-bold sm:text-lg">{titulo}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button type="button" onClick={alternarTema}
                aria-label={claro ? 'Ativar tema escuro' : 'Ativar tema claro'}
                title={claro ? 'Ativar tema escuro' : 'Ativar tema claro'}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl transition ${temaBotao}`}>
                {claro ? '🌙' : '☀️'}
              </button>
              <div className={`hidden items-center gap-3 rounded-xl border px-3 py-2 sm:flex ${borda}`}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 font-bold text-emerald-500" aria-hidden="true">A</span>
                <div>
                  <p className="text-sm font-bold">Administrador</p>
                  <p className={`text-xs ${secundario}`}>Painel administrativo</p>
                </div>
              </div>
            </div>
          </div>
          <nav aria-label="Navegação administrativa móvel" className={`ec-admin-mobile-nav flex gap-2 overflow-x-auto border-t px-5 py-3 lg:hidden ${borda}`}>
            {links.map((link) => (
              <NavLink key={link.to} to={link.to}
                className={({ isActive }) => `inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${
                  isActive
                    ? claro ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                    : claro ? 'border-transparent text-slate-600 hover:bg-slate-100' : 'border-transparent text-slate-300 hover:bg-white/5'
                }`}>
                <AdminIcone tipo={link.icone} />{link.nome}
              </NavLink>
            ))}
            <button type="button" onClick={sair}
              className={`shrink-0 rounded-lg border border-transparent px-3 py-2 text-xs font-semibold ${claro ? 'text-red-700 hover:bg-red-50' : 'text-red-200 hover:bg-red-400/10'}`}>
              Sair ↪
            </button>
          </nav>
        </header>

        <main className="ec-admin-main mx-auto max-w-[1600px] px-5 py-8 sm:px-8 sm:py-10">
          <section className="ec-admin-heading mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-emerald-500">Painel administrativo</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{titulo}</h1>
              {descricao && <p className={`mt-3 max-w-3xl text-sm leading-6 sm:text-base ${secundario}`}>{descricao}</p>}
            </div>
            {acao && <div className="shrink-0 self-start xl:self-auto">{acao}</div>}
          </section>
          {typeof children === 'function' ? children({ claro, painel, secundario }) : children}
        </main>
      </div>

      {/* Modais ficam fora do main para sobrepor o cabeçalho sticky. */}
      {overlay}
    </div>
  )
}
