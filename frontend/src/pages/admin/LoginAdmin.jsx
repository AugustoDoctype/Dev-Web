import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/public/Navbar'
import { apiFetch } from '../../services/api'
import '../../tema.css'

export default function LoginAdmin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const [tema, setTema] = useState(() =>
    localStorage.getItem('eciclo-tema') === 'claro'
      ? 'claro'
      : 'escuro'
  )

  const modoClaro = tema === 'claro'

  // Sincroniza o tema com o botão existente no Navbar.
  useEffect(() => {
    const atualizarTema = (evento) => {
      const novoTema =
        evento?.detail ||
        (localStorage.getItem('eciclo-tema') === 'claro'
          ? 'claro'
          : 'escuro')

      setTema(novoTema)
    }

    const temaSalvo =
      localStorage.getItem('eciclo-tema') === 'claro'
        ? 'claro'
        : 'escuro'

    setTema(temaSalvo)

    window.addEventListener(
      'eciclo-tema-alterado',
      atualizarTema
    )

    return () => {
      window.removeEventListener(
        'eciclo-tema-alterado',
        atualizarTema
      )
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      let data

      try {
        data = await apiFetch('/admin/login', {
          method: 'POST',
          body: JSON.stringify({ email, senha }),
        })
      } catch (err) {
        // Login local de demonstração.
        if (
          email === 'admin@eciclo.com' &&
          senha === 'admin123'
        ) {
          data = { token: 'mock-token-admin-123' }
        } else {
          throw new Error(
            'E-mail ou senha incorretos. Verifique seus dados e tente novamente.'
          )
        }
      }

      localStorage.setItem('adminToken', data.token)

      localStorage.setItem(
        'userPerfil',
        JSON.stringify({
          nome: 'Administrador',
          tipo: 'ADMIN',
        })
      )

      navigate('/admin/dashboard')
    } catch (err) {
      setErro(
        err.message || 'Não foi possível entrar. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`login-page flex min-h-screen flex-col font-sans transition-colors duration-300 ${
        modoClaro
          ? 'tema-claro bg-slate-50 text-slate-800'
          : 'tema-escuro bg-[#0b110e] text-slate-100'
      }`}
    >
      <Navbar />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
        {/* Efeitos de iluminação do fundo */}
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div
          className={`login-card relative grid w-full max-w-5xl overflow-hidden rounded-3xl border shadow-2xl transition-colors duration-300 md:grid-cols-2 ${
            modoClaro
              ? 'border-slate-200 bg-white shadow-slate-300/30'
              : 'border-white/[0.08] bg-[#111b16] shadow-black/20'
          }`}
        >
          {/* Painel de apresentação */}
          <section
            className={`login-apresentacao relative flex flex-col justify-between overflow-hidden border-b p-7 transition-colors duration-300 sm:p-10 md:border-b-0 md:border-r ${
              modoClaro
                ? 'border-slate-200 bg-emerald-50/70 md:border-r-slate-200'
                : 'border-white/[0.08] bg-emerald-500/[0.05] md:border-r-white/[0.08]'
            }`}
          >
            <div>
              <Link
                to="/"
                className={`inline-flex items-center gap-2 text-sm font-medium transition ${
                  modoClaro
                    ? 'text-slate-500 hover:text-emerald-600'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
              >
                <span aria-hidden="true">←</span>
                Voltar ao início
              </Link>

              <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-3xl text-emerald-500">
                ♻
              </div>

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">
                Área administrativa
              </p>

              <h1
                className={`mt-3 text-3xl font-extrabold leading-tight transition-colors sm:text-4xl ${
                  modoClaro ? 'text-slate-900' : 'text-white'
                }`}
              >
                Gerencie o E-Ciclo.
                <span className="mt-1 block text-emerald-500">
                  Transforme o futuro.
                </span>
              </h1>

              <p
                className={`mt-5 text-sm leading-7 ${
                  modoClaro ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                Acesse o painel administrativo para acompanhar as
                doações, gerenciar os registros e contribuir para
                uma gestão eficiente dos resíduos eletrônicos.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-500">
                  ✓
                </span>

                <span
                  className={`text-sm ${
                    modoClaro ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  Gerencie as doações recebidas
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-500">
                  ✓
                </span>

                <span
                  className={`text-sm ${
                    modoClaro ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  Organize as informações do sistema
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-500">
                  ✓
                </span>

                <span
                  className={`text-sm ${
                    modoClaro ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  Apoie o descarte eletrônico responsável
                </span>
              </div>
            </div>
          </section>

          {/* Formulário administrativo */}
          <section className="p-6 sm:p-10">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">
                Acesso restrito
              </span>

              <h2
                className={`mt-3 text-2xl font-extrabold ${
                  modoClaro ? 'text-slate-900' : 'text-white'
                }`}
              >
                Entrar como administrador
              </h2>

              <p
                className={`mt-2 text-sm leading-6 ${
                  modoClaro ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                Informe suas credenciais administrativas para
                acessar o painel.
              </p>
            </div>

            {/* Mensagem de erro */}
            {erro && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500"
              >
                <span className="font-bold">
                  Não foi possível entrar.
                </span>

                <p className="mt-1">{erro}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email-admin"
                  className={`mb-2 block text-sm font-semibold ${
                    modoClaro ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  E-mail administrativo
                </label>

                <input
                  id="email-admin"
                  type="email"
                  autoComplete="username"
                  required
                  placeholder="admin@eciclo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`login-input block w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                    modoClaro
                      ? 'border-slate-300 bg-white text-slate-900'
                      : 'border-white/10 bg-[#0b110e] text-slate-100 placeholder:text-slate-600'
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor="senha-admin"
                  className={`mb-2 block text-sm font-semibold ${
                    modoClaro ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  Senha
                </label>

                <input
                  id="senha-admin"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className={`login-input block w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                    modoClaro
                      ? 'border-slate-300 bg-white text-slate-900'
                      : 'border-white/10 bg-[#0b110e] text-slate-100 placeholder:text-slate-600'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-[#07110b] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Acessar painel'}

                {!loading && (
                  <span aria-hidden="true">→</span>
                )}
              </button>
            </form>

            {/* Informações sobre o acesso */}
            <div
              className={`mt-6 rounded-2xl border p-4 transition-colors duration-300 ${
                modoClaro
                  ? 'border-slate-200 bg-slate-50'
                  : 'border-white/[0.08] bg-[#0b110e]'
              }`}
            >
              <p
                className={`text-sm font-bold ${
                  modoClaro ? 'text-slate-800' : 'text-slate-200'
                }`}
              >
                Área exclusiva
              </p>

              <p
                className={`mt-2 text-sm leading-6 ${
                  modoClaro ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                Este acesso é destinado à administração da
                plataforma E-Ciclo.
              </p>

              <Link
                to="/login"
                className="mt-4 flex w-full items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-600 transition hover:bg-emerald-500/15"
              >
                Ir para o login de usuário
              </Link>
            </div>

            <p
              className={`mt-6 text-center text-xs leading-5 ${
                modoClaro ? 'text-slate-500' : 'text-slate-500'
              }`}
            >
              E-Ciclo — Tecnologia e sustentabilidade.
            </p>
          </section>
        </div>
      </main>

      <footer
        className={`border-t px-4 py-5 text-center text-xs transition-colors duration-300 ${
          modoClaro
            ? 'border-slate-200 bg-white text-slate-500'
            : 'border-white/[0.08] bg-[#0b110e] text-slate-500'
        }`}
      >
        © {new Date().getFullYear()} E-Ciclo. Um destino melhor
        para seus eletrônicos.
      </footer>
    </div>
  )
}