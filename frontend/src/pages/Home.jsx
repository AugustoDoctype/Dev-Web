import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import '../tema.css'

const beneficios = [
  {
    numero: '01',
    titulo: 'Descarte consciente',
    descricao:
      'Descubra como encaminhar celulares, computadores e componentes eletrônicos para a destinação adequada.',
    icone: '♻️',
  },
  {
    numero: '02',
    titulo: 'Acompanhe suas doações',
    descricao:
      'Consulte suas doações e acompanhe o andamento de cada registro diretamente pela plataforma.',
    icone: '📦',
  },
  {
    numero: '03',
    titulo: 'Encontre pontos de coleta',
    descricao:
      'Explore o mapa interativo e consulte os pontos de coleta demonstrativos disponíveis no sistema.',
    icone: '📍',
  },
]

const materiais = [
  { emoji: '📱', nome: 'Celulares e tablets' },
  { emoji: '💻', nome: 'Computadores e notebooks' },
  { emoji: '🎧', nome: 'Periféricos e acessórios' },
  { emoji: '🔌', nome: 'Cabos e componentes' },
]

function IconeSeta() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function IconeFolha() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 20A7 7 0 0 1 4 13C4 5 12 3 20 3c0 8-2 16-10 16" />
      <path d="M8 16c2-3 5-5 9-7" />
    </svg>
  )
}

export default function Home() {
  const [tema, setTema] = useState(
    () => localStorage.getItem('eciclo-tema') || 'escuro'
  )

  useEffect(() => {
    const atualizarTema = (evento) => {
      setTema(
        evento?.detail ||
          localStorage.getItem('eciclo-tema') ||
          'escuro'
      )
    }

    window.addEventListener('eciclo-tema-alterado', atualizarTema)

    return () => {
      window.removeEventListener('eciclo-tema-alterado', atualizarTema)
    }
  }, [])

  const modoClaro = tema === 'claro'

  return (
    <div
      className={`min-h-screen overflow-hidden font-sans transition-colors duration-300 ${
        modoClaro
          ? 'tema-claro bg-gray-50 text-gray-800'
          : 'bg-[#080e0d] text-slate-100'
      }`}
    >
      <Navbar />

      <main>
        {/* Hero */}
        <section
          className={`relative isolate overflow-hidden border-b ${
            modoClaro
              ? 'border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50'
              : 'border-white/[0.06] bg-gradient-to-br from-[#0c1914] via-[#080e0d] to-[#0b1514]'
          }`}
        >
          <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-emerald-500/[0.12] blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-96 w-96 rounded-full bg-teal-500/[0.08] blur-[100px]" />

          <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
            <div className="text-center lg:text-left">
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 text-[10px] font-bold tracking-[0.16em] text-emerald-300 shadow-lg shadow-emerald-950/10 sm:text-xs">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                  <IconeFolha />
                </span>
                TECNOLOGIA COM RESPONSABILIDADE
              </div>

              <h1
                className={`text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl ${
                  modoClaro ? 'text-gray-900' : 'text-white'
                }`}
              >
                Seu eletrônico antigo pode ter um{' '}
                <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  novo destino.
                </span>
              </h1>

              <p
                className={`mx-auto mt-6 max-w-xl text-base leading-8 sm:text-lg lg:mx-0 ${
                  modoClaro ? 'text-gray-600' : 'text-slate-400'
                }`}
              >
                O E-Ciclo conecta você a uma forma mais consciente de lidar
                com resíduos eletrônicos. Consulte informações, registre
                doações e descubra opções de descarte adequado.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  to="/doar"
                  className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 px-6 py-4 text-sm font-extrabold text-[#07110d] shadow-lg shadow-emerald-950/30 transition duration-300 hover:-translate-y-1 hover:from-emerald-400 hover:to-green-300 hover:shadow-emerald-500/10"
                >
                  Quero fazer uma doação
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <IconeSeta />
                  </span>
                </Link>

                <Link
                  to="/pontos-de-coleta"
                  className={`inline-flex items-center justify-center gap-3 rounded-xl border px-6 py-4 text-sm font-bold transition duration-300 hover:-translate-y-1 ${
                    modoClaro
                      ? 'border-gray-300 bg-white text-gray-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700'
                      : 'border-white/10 bg-white/[0.035] text-slate-200 hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] hover:text-emerald-300'
                  }`}
                >
                  <span aria-hidden="true">⌖</span>
                  Explorar o mapa
                </Link>
              </div>

              <div
                className={`mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm lg:justify-start ${
                  modoClaro ? 'text-gray-500' : 'text-slate-500'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                  Descarte responsável
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                  Consciência ambiental
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="pointer-events-none absolute -inset-5 rounded-[2.5rem] bg-emerald-400/[0.10] blur-3xl" />

              <div
                className={`relative rounded-[2rem] border p-3 shadow-2xl backdrop-blur sm:p-4 ${
                  modoClaro
                    ? 'border-gray-200 bg-white/90 shadow-gray-300/30'
                    : 'border-white/10 bg-[#101b17]/90 shadow-black/30'
                }`}
              >
                <div
                  className={`overflow-hidden rounded-3xl border ${
                    modoClaro
                      ? 'border-gray-100 bg-gray-100'
                      : 'border-white/[0.06] bg-[#13221b]'
                  }`}
                >
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/073/346/496/non_2x/recycling-electronics-sustainability-illustration-vector.jpg"
                    alt="Ilustração de reciclagem e sustentabilidade eletrônica"
                    className="aspect-[4/3] w-full object-cover"
                    fetchPriority="high"
                  />
                </div>

                <div className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.08] text-2xl">
                    ♻️
                  </div>

                  <div>
                    <p
                      className={`font-bold leading-6 ${
                        modoClaro ? 'text-gray-900' : 'text-white'
                      }`}
                    >
                      Dê um destino melhor aos seus eletrônicos
                    </p>
                    <p
                      className={`mt-1 text-sm ${
                        modoClaro ? 'text-gray-500' : 'text-slate-400'
                      }`}
                    >
                      Pequenas atitudes fazem diferença.
                    </p>
                  </div>

                  <span className="ml-auto hidden text-emerald-400 sm:block">
                    <IconeSeta />
                  </span>
                </div>
              </div>

              <div
                className={`absolute -left-3 top-10 hidden rounded-2xl border px-4 py-3 shadow-xl backdrop-blur sm:block lg:-left-8 ${
                  modoClaro
                    ? 'border-gray-200 bg-white/95 shadow-gray-300/30'
                    : 'border-emerald-400/15 bg-[#101b17]/95 shadow-black/20'
                }`}
              >
                <p
                  className={`text-xs font-medium ${
                    modoClaro ? 'text-gray-500' : 'text-slate-400'
                  }`}
                >
                  Nossa missão
                </p>
                <p className="mt-1 text-sm font-extrabold text-emerald-600">
                  Um ciclo mais sustentável
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Materiais */}
        <section
          className={`border-b py-16 sm:py-20 ${
            modoClaro
              ? 'border-gray-200 bg-gray-50'
              : 'border-white/[0.06] bg-[#0a100e]'
          }`}
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">
                  O que fazer circular?
                </p>

                <h2
                  className={`mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl ${
                    modoClaro ? 'text-gray-900' : 'text-white'
                  }`}
                >
                  Seus eletrônicos merecem o destino certo.
                </h2>

                <p
                  className={`mt-3 max-w-2xl text-sm leading-7 sm:text-base ${
                    modoClaro ? 'text-gray-600' : 'text-slate-400'
                  }`}
                >
                  Conheça algumas categorias de equipamentos que podem
                  precisar de descarte ou encaminhamento especializado.
                </p>
              </div>

              <Link
                to="/como-funciona"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
              >
                Saiba como funciona
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <IconeSeta />
                </span>
              </Link>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {materiais.map((material, index) => (
                <div
                  key={material.nome}
                  className={`group relative overflow-hidden rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 ${
                    modoClaro
                      ? 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-emerald-100'
                      : 'border-white/[0.08] bg-gradient-to-br from-[#111d18] to-[#0c1411] hover:border-emerald-400/25 hover:shadow-emerald-950/20'
                  }`}
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/[0.06] blur-2xl transition duration-300 group-hover:bg-emerald-400/[0.10]" />

                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border text-3xl transition duration-300 group-hover:scale-105 ${
                      modoClaro
                        ? 'border-gray-200 bg-gray-50 group-hover:border-emerald-200 group-hover:bg-emerald-50'
                        : 'border-white/[0.07] bg-white/[0.035] group-hover:border-emerald-400/20 group-hover:bg-emerald-400/[0.08]'
                    }`}
                  >
                    {material.emoji}
                  </div>

                  <p className="relative mt-5 text-[10px] font-bold tracking-[0.18em] text-emerald-600">
                    CATEGORIA 0{index + 1}
                  </p>

                  <h3
                    className={`relative mt-2 text-sm font-bold leading-6 sm:text-base ${
                      modoClaro ? 'text-gray-800' : 'text-slate-100'
                    }`}
                  >
                    {material.nome}
                  </h3>

                  <p
                    className={`relative mt-2 text-xs leading-5 sm:text-sm ${
                      modoClaro ? 'text-gray-600' : 'text-slate-400'
                    }`}
                  >
                    Consulte as orientações de descarte adequado.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Funcionalidades */}
        <section
          className={`relative overflow-hidden py-16 sm:py-24 ${
            modoClaro ? 'bg-white' : 'bg-[#080e0d]'
          }`}
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">
                Simples e acessível
              </p>

              <h2
                className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${
                  modoClaro ? 'text-gray-900' : 'text-white'
                }`}
              >
                Tudo para começar um{' '}
                <span className="text-emerald-500">novo ciclo.</span>
              </h2>

              <p
                className={`mt-4 text-sm leading-7 sm:text-base ${
                  modoClaro ? 'text-gray-600' : 'text-slate-400'
                }`}
              >
                Utilize as ferramentas do E-Ciclo para registrar suas
                doações, consultar informações e conhecer o funcionamento
                da plataforma.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {beneficios.map((beneficio) => (
                <article
                  key={beneficio.numero}
                  className={`group relative overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8 ${
                    modoClaro
                      ? 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-emerald-300 hover:shadow-emerald-100'
                      : 'border-white/[0.08] bg-gradient-to-br from-[#111c17] to-[#0b1210] hover:border-emerald-400/25 hover:shadow-emerald-950/20'
                  }`}
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-400/[0.05] blur-2xl transition duration-300 group-hover:bg-emerald-400/[0.09]" />

                  <div className="relative flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] text-3xl transition duration-300 group-hover:border-emerald-400/30 group-hover:bg-emerald-400/[0.12]">
                      {beneficio.icone}
                    </span>

                    <span className="text-sm font-extrabold tracking-widest text-emerald-500/70">
                      {beneficio.numero}
                    </span>
                  </div>

                  <h3
                    className={`relative mt-6 text-xl font-extrabold transition ${
                      modoClaro
                        ? 'text-gray-900 group-hover:text-emerald-700'
                        : 'text-white group-hover:text-emerald-300'
                    }`}
                  >
                    {beneficio.titulo}
                  </h3>

                  <p
                    className={`relative mt-3 text-sm leading-7 ${
                      modoClaro ? 'text-gray-600' : 'text-slate-400'
                    }`}
                  >
                    {beneficio.descricao}
                  </p>

                  <div className="mt-6 h-px w-10 bg-emerald-400/60 transition-all duration-300 group-hover:w-16 group-hover:bg-emerald-500" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Chamada final */}
        <section
          className={`px-5 py-16 sm:px-8 sm:py-20 ${
            modoClaro ? 'bg-gray-50' : 'bg-[#0a100e]'
          }`}
        >
          <div
            className={`relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border px-6 py-12 text-center shadow-2xl sm:px-12 sm:py-16 ${
              modoClaro
                ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-gray-200'
                : 'border-emerald-400/20 bg-gradient-to-br from-[#123426] via-[#0d241a] to-[#0b1712] shadow-black/20'
            }`}
          >
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[40px] border-emerald-300/[0.06]" />
            <div className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full border-[35px] border-emerald-300/[0.05]" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-400/[0.08] blur-[80px]" />

            <div className="relative mx-auto max-w-2xl">
              <span
                className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.08] text-3xl"
                aria-hidden="true"
              >
                🌱
              </span>

              <h2
                className={`mt-5 text-3xl font-extrabold leading-tight sm:text-4xl ${
                  modoClaro ? 'text-gray-900' : 'text-white'
                }`}
              >
                O próximo passo para um futuro melhor começa com você.
              </h2>

              <p
                className={`mx-auto mt-4 max-w-xl text-sm leading-7 sm:text-base ${
                  modoClaro ? 'text-gray-600' : 'text-emerald-50/75'
                }`}
              >
                Descubra como funciona o E-Ciclo e participe de uma
                iniciativa que incentiva o descarte responsável de resíduos
                eletrônicos.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/doar"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-extrabold text-[#07110d] transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-300"
                >
                  Começar agora
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <IconeSeta />
                  </span>
                </Link>

                <Link
                  to="/pontos-de-coleta"
                  className={`inline-flex items-center justify-center rounded-xl border px-6 py-3.5 text-sm font-bold transition duration-300 ${
                    modoClaro
                      ? 'border-gray-300 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'
                      : 'border-emerald-200/20 bg-white/[0.03] text-white hover:border-emerald-300/40 hover:bg-emerald-300/[0.08] hover:text-emerald-200'
                  }`}
                >
                  Ver pontos de coleta
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer
        className={`border-t ${
          modoClaro
            ? 'border-gray-200 bg-white'
            : 'border-white/[0.07] bg-[#070c0b]'
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-8">
          <Link
            to="/"
            className={`text-xl font-extrabold tracking-tight transition hover:text-emerald-500 ${
              modoClaro ? 'text-gray-900' : 'text-white'
            }`}
          >
            E-<span className="text-emerald-500">Ciclo</span>
            <span className="text-emerald-300">.</span>
          </Link>

          <p
            className={`text-sm leading-6 ${
              modoClaro ? 'text-gray-600' : 'text-slate-400'
            }`}
          >
            Tecnologia e sustentabilidade em um novo ciclo.
          </p>

          <Link
            to="/como-funciona"
            className={`text-sm font-semibold transition hover:text-emerald-500 ${
              modoClaro ? 'text-gray-600' : 'text-slate-400'
            }`}
          >
            Conheça o projeto →
          </Link>
        </div>
      </footer>
    </div>
  )
}