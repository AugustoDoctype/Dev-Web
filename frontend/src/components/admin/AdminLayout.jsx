import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

// ============================================================
// LAYOUT COMPARTILHADO DO PAINEL ADMINISTRATIVO
// Organiza navegação, logout e tema sem repetir código nas telas.
// ============================================================
const links = [
  { to: '/admin/dashboard', nome: 'Visão geral', icone: '▦' },
  { to: '/admin/doacoes', nome: 'Doações', icone: '♻' },
  { to: '/admin/pontos-de-coleta', nome: 'Pontos de coleta', icone: '⌖' },
]

function lerTema() {
  return localStorage.getItem('eciclo-tema') === 'claro' ? 'claro' : 'escuro'
}

export default function AdminLayout({ titulo, descricao, children }) {
  const navigate = useNavigate()
  const [tema, setTema] = useState(lerTema)
  const claro = tema === 'claro'

  useEffect(() => {
    const atualizarTema = (evento) => {
      setTema(evento?.detail === 'claro' ? 'claro' : lerTema())
    }
    window.addEventListener('eciclo-tema-alterado', atualizarTema)
    window.addEventListener('storage', atualizarTema)
    return () => {
      window.removeEventListener('eciclo-tema-alterado', atualizarTema)
      window.removeEventListener('storage', atualizarTema)
    }
  }, [])

  function alternarTema() {
    const novoTema = claro ? 'escuro' : 'claro'
    localStorage.setItem('eciclo-tema', novoTema)
    document.documentElement.classList.toggle('dark', novoTema === 'escuro')
    document.documentElement.style.colorScheme = novoTema
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${fundo}`}>
      {/* 1. Menu lateral e navegação acessível */}
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className={`w-full shrink-0 border-b p-5 lg:w-64 lg:border-b-0 lg:border-r lg:p-7 ${claro ? 'border-slate-200' : 'border-white/10'}`}>
          <div className="mb-6">
            <p className="text-2xl font-black tracking-tight text-emerald-500">♻ E-Ciclo</p>
            <p className={`mt-1 text-xs font-semibold uppercase tracking-widest ${secundario}`}>Administração</p>
          </div>
          <nav aria-label="Navegação administrativa" className="flex flex-wrap gap-2 lg:flex-col">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-emerald-500/15 text-emerald-500' : claro ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <span aria-hidden="true">{link.icone}</span>{link.nome}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6 flex flex-wrap gap-2 lg:flex-col">
            <button type="button" onClick={alternarTema} className={`rounded-xl border px-4 py-2 text-left text-sm ${painel}`}>
              {claro ? '☾ Modo escuro' : '☀ Modo claro'}
            </button>
            <button type="button" onClick={sair} className="rounded-xl border border-rose-400/20 px-4 py-2 text-left text-sm text-rose-400 transition hover:bg-rose-400/10">
              Sair da conta
            </button>
          </div>
        </aside>

        {/* 2. Conteúdo específico de cada página */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
          <header className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">Painel administrativo</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{titulo}</h1>
            {descricao && <p className={`mt-3 max-w-3xl text-sm leading-6 ${secundario}`}>{descricao}</p>}
          </header>
          {children({ claro, painel, secundario })}
        </main>
      </div>
    </div>
  )
}
