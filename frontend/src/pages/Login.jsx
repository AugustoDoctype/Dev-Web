
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setErro('')

    // 1. Verificação de Perfil Administrador
    if (email === 'admin@eciclo.com' && senha === 'admin123') {
      localStorage.setItem('adminToken', 'mock-token-admin-123')
      localStorage.setItem(
        'userPerfil',
        JSON.stringify({ nome: 'Administrador', tipo: 'ADMIN' })
      )
      navigate('/admin/dashboard')
      return
    }

    // 2. Verificação de Usuário Comum no LocalStorage
    const usuarios = JSON.parse(localStorage.getItem('mock_usuarios') || '[]')
    const usuarioEncontrado = usuarios.find(
      (u) => u.email === email && u.senha === senha
    )

    if (usuarioEncontrado) {
      localStorage.setItem('userToken', 'mock-token-user')
      localStorage.setItem(
        'userPerfil',
        JSON.stringify({
          nome: usuarioEncontrado.nome,
          email: usuarioEncontrado.email,
          tipo: 'USER',
        })
      )
      navigate('/minhas-doacoes')
      return
    }

    setErro('E-mail ou senha incorretos.')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0b110e] font-sans text-slate-100">
      <Navbar />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111b16] shadow-2xl shadow-black/20 md:grid-cols-2">
          <section className="relative flex flex-col justify-between overflow-hidden border-b border-white/[0.08] bg-emerald-500/[0.05] p-7 sm:p-10 md:border-b-0 md:border-r">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-400"
              >
                <span aria-hidden="true">←</span>
                Voltar ao início
              </Link>

              <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-3xl text-emerald-400">
                ♻
              </div>

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                Bem-vindo ao E-Ciclo
              </p>

              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Pequenas atitudes.
                <span className="block text-emerald-400">
                  Grandes mudanças.
                </span>
              </h1>

              <p className="mt-5 text-sm leading-7 text-slate-400">
                Entre na sua conta para acompanhar suas doações e fazer parte
                de um futuro com descarte eletrônico mais responsável.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  ✓
                </span>
                <span className="text-sm text-slate-300">
                  Acompanhe suas doações
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  ✓
                </span>
                <span className="text-sm text-slate-300">
                  Contribua para reduzir o lixo eletrônico
                </span>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                Acesse sua conta
              </span>

              <h2 className="mt-3 text-2xl font-extrabold text-white">
                Entrar no E-Ciclo
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Informe seus dados para continuar.
              </p>
            </div>

            {erro && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                <span className="font-bold">Não foi possível entrar.</span>
                <p className="mt-1">{erro}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Senha
                </label>

                <input
                  id="senha"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-[#07110b] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              >
                Entrar na conta
                <span aria-hidden="true">→</span>
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0b110e] p-4">
              <p className="text-sm font-bold text-slate-200">
                Primeiro acesso?
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Crie sua conta para registrar equipamentos e acompanhar suas
                doações pelo sistema.
              </p>

              <Link
                to="/cadastro"
                className="mt-4 flex w-full items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-400 transition hover:bg-emerald-400/15"
              >
                Criar minha conta
              </Link>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-500">
              Ao entrar, você acessará a área correspondente ao seu perfil.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/[0.08] px-4 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} E-Ciclo. Um destino melhor para seus eletrônicos.
      </footer>
    </div>
  )
}
