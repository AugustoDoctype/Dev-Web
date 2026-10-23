import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

export default function Cadastro() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  })

  const [erro, setErro] = useState('')

  const [tema, setTema] = useState(() =>
    localStorage.getItem('eciclo-tema') === 'claro' ? 'claro' : 'escuro'
  )

  const modoClaro = tema === 'claro'

  useEffect(() => {
    const atualizarTema = (evento) => {
      const novoTema =
        evento.detail ||
        (localStorage.getItem('eciclo-tema') === 'claro' ? 'claro' : 'escuro')

      setTema(novoTema)
    }

    setTema(
      localStorage.getItem('eciclo-tema') === 'claro' ? 'claro' : 'escuro'
    )

    window.addEventListener('eciclo-tema-alterado', atualizarTema)

    return () => {
      window.removeEventListener('eciclo-tema-alterado', atualizarTema)
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    if (formData.senha.length < 6) {
      setErro('Sua senha deve ter pelo menos 6 caracteres.')
      return
    }

    const usuarios = JSON.parse(
      localStorage.getItem('mock_usuarios') || '[]'
    )

    const emailNormalizado = formData.email.trim().toLowerCase()

    const usuarioExiste = usuarios.some(
      (u) => u.email.toLowerCase() === emailNormalizado
    )

    if (usuarioExiste) {
      setErro('Este e-mail já está cadastrado.')
      return
    }

    const novoUsuario = {
      id: Date.now(),
      nome: formData.nome.trim(),
      email: emailNormalizado,
      senha: formData.senha,
      tipo: 'USER',
    }

    usuarios.push(novoUsuario)

    localStorage.setItem('mock_usuarios', JSON.stringify(usuarios))
    localStorage.setItem('userToken', 'mock-token-user')

    localStorage.setItem(
      'userPerfil',
      JSON.stringify({
        nome: novoUsuario.nome,
        email: novoUsuario.email,
      })
    )

    navigate('/minhas-doacoes')
  }

  const classeTexto = modoClaro ? 'text-slate-700' : 'text-slate-300'

  const classeTextoSecundario = modoClaro
    ? 'text-slate-600'
    : 'text-slate-400'

  const classeTitulo = modoClaro ? 'text-slate-900' : 'text-white'

  const classeCampo = modoClaro
    ? 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400'
    : 'border-white/10 bg-[#0b110e] text-slate-100 placeholder:text-slate-600'

  return (
    <div
      className={`cadastro-page flex min-h-screen flex-col font-sans transition-colors duration-300 ${
        modoClaro
          ? 'tema-claro bg-slate-50 text-slate-800'
          : 'tema-escuro bg-[#0b110e] text-slate-100'
      }`}
    >
      <Navbar />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div
          className={`relative grid w-full max-w-5xl overflow-hidden rounded-3xl border shadow-2xl transition-colors duration-300 md:grid-cols-2 ${
            modoClaro
              ? 'border-slate-200 bg-white shadow-slate-300/30'
              : 'border-white/[0.08] bg-[#111b16] shadow-black/20'
          }`}
        >
          <section
            className={`flex flex-col justify-between border-b p-7 transition-colors duration-300 sm:p-10 md:border-b-0 md:border-r ${
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
                Faça parte da mudança
              </p>

              <h1
                className={`mt-3 text-3xl font-extrabold leading-tight transition-colors sm:text-4xl ${classeTitulo}`}
              >
                Sua próxima atitude pode transformar o futuro.
              </h1>

              <p className={`mt-5 text-sm leading-7 ${classeTextoSecundario}`}>
                Crie sua conta no E-Ciclo para acompanhar suas doações e
                contribuir para um destino mais responsável para os
                equipamentos eletrônicos.
              </p>
            </div>

            <div
              className={`mt-10 rounded-2xl border p-5 transition-colors duration-300 ${
                modoClaro
                  ? 'border-emerald-200 bg-white/80'
                  : 'border-emerald-400/10 bg-[#0b110e]/60'
              }`}
            >
              <p className={`text-sm font-bold ${classeTitulo}`}>
                Por que participar?
              </p>

              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-500">
                    ✓
                  </span>
                  <p className={`text-sm ${classeTexto}`}>
                    Registre seus equipamentos para doação.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-500">
                    ✓
                  </span>
                  <p className={`text-sm ${classeTexto}`}>
                    Consulte suas doações pelo sistema.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-500">
                    ✓
                  </span>
                  <p className={`text-sm ${classeTexto}`}>
                    Incentive o descarte consciente.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">
                Cadastro gratuito
              </span>

              <h2 className={`mt-3 text-2xl font-extrabold ${classeTitulo}`}>
                Criar minha conta
              </h2>

              <p className={`mt-2 text-sm leading-6 ${classeTextoSecundario}`}>
                Preencha os campos para começar.
              </p>
            </div>

            {erro && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600"
              >
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="nome"
                  className={`mb-2 block text-sm font-semibold ${classeTexto}`}
                >
                  Nome completo
                </label>

                <input
                  id="nome"
                  type="text"
                  name="nome"
                  autoComplete="name"
                  required
                  minLength={2}
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${classeCampo}`}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className={`mb-2 block text-sm font-semibold ${classeTexto}`}
                >
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${classeCampo}`}
                />
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className={`mb-2 block text-sm font-semibold ${classeTexto}`}
                >
                  Senha
                </label>

                <input
                  id="senha"
                  type="password"
                  name="senha"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  placeholder="Mínimo de 6 caracteres"
                  value={formData.senha}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${classeCampo}`}
                />

                <p className="mt-2 text-xs text-slate-500">
                  Utilize pelo menos 6 caracteres.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmarSenha"
                  className={`mb-2 block text-sm font-semibold ${classeTexto}`}
                >
                  Confirmar senha
                </label>

                <input
                  id="confirmarSenha"
                  type="password"
                  name="confirmarSenha"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  placeholder="Digite a senha novamente"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${classeCampo}`}
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-[#07110b] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              >
                Criar conta
                <span aria-hidden="true">→</span>
              </button>
            </form>

            <div
              className={`mt-6 border-t pt-6 transition-colors duration-300 ${
                modoClaro ? 'border-slate-200' : 'border-white/[0.08]'
              }`}
            >
              <p className={`text-center text-sm ${classeTextoSecundario}`}>
                Já possui uma conta?
              </p>

              <Link
                to="/login"
                className={`mt-3 flex w-full items-center justify-center rounded-xl border px-4 py-3 text-sm font-bold text-emerald-600 transition hover:border-emerald-400/30 hover:bg-emerald-400/[0.05] ${
                  modoClaro ? 'border-slate-300' : 'border-white/10'
                }`}
              >
                Fazer login
              </Link>
            </div>
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
        © {new Date().getFullYear()} E-Ciclo. Um destino melhor para seus
        eletrônicos.
      </footer>
    </div>
  )
}