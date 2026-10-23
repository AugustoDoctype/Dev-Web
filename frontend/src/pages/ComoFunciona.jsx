
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from '../components/public/Navbar'

const passos = [
  {
    numero: '01',
    icone: '📋',
    titulo: 'Registre sua doação',
    descricao:
      'Acesse o formulário e informe qual equipamento eletrônico deseja encaminhar, incluindo seu tipo e estado de conservação.',
    detalhe: 'Tudo começa com algumas informações.',
  },
  {
    numero: '02',
    icone: '🔎',
    titulo: 'Consulte as informações',
    descricao:
      'Confira os dados registrados e acompanhe o andamento da sua doação pela plataforma, conforme as funcionalidades disponíveis.',
    detalhe: 'Mais organização e transparência.',
  },
  {
    numero: '03',
    icone: '♻️',
    titulo: 'Busque o destino adequado',
    descricao:
      'Consulte as orientações de descarte e explore o mapa para conhecer os pontos de coleta demonstrativos cadastrados no sistema.',
    detalhe: 'Tecnologia a favor do meio ambiente.',
  },
]

const beneficios = [
  {
    icone: '🌱',
    titulo: 'Consciência ambiental',
    descricao:
      'O descarte adequado ajuda a reduzir os impactos ambientais causados pelos resíduos eletrônicos.',
  },
  {
    icone: '📍',
    titulo: 'Informação acessível',
    descricao:
      'Encontre orientações e consulte o mapa de pontos de coleta disponibilizado pela plataforma.',
  },
  {
    icone: '💚',
    titulo: 'Consumo responsável',
    descricao:
      'Repense o destino dos equipamentos que já não utiliza e contribua para hábitos mais sustentáveis.',
  },
]

export default function ComoFunciona() {
  const [temaClaro, setTemaClaro] = useState(
    () => localStorage.getItem('eciclo-tema') === 'claro'
  )

  useEffect(() => {
    const atualizarTema = (evento) => {
      const tema = evento?.detail || localStorage.getItem('eciclo-tema') || 'escuro'
      setTemaClaro(tema === 'claro')
    }

    const observarClasse = () => {
      setTemaClaro(document.documentElement.classList.contains('light'))
    }

    window.addEventListener('eciclo-tema-alterado', atualizarTema)

    const observador = new MutationObserver(() => {
      const temaSalvo = localStorage.getItem('eciclo-tema')
      if (temaSalvo) {
        setTemaClaro(temaSalvo === 'claro')
      } else {
        observarClasse()
      }
    })

    observador.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      window.removeEventListener('eciclo-tema-alterado', atualizarTema)
      observador.disconnect()
    }
  }, [])

  const cores = {
    pagina: temaClaro ? 'bg-slate-50 text-slate-800' : 'bg-[#0b110e] text-slate-100',
    hero: temaClaro
      ? 'border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50'
      : 'border-white/5 bg-gradient-to-br from-[#10251a] via-[#0b110e] to-[#101b16]',
    titulo: temaClaro ? 'text-slate-900' : 'text-white',
    texto: temaClaro ? 'text-slate-600' : 'text-slate-400',
    card: temaClaro
      ? 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/60'
      : 'border-white/[0.08] bg-[#111b16] hover:border-emerald-400/30 hover:bg-[#14221a]',
    estatistica: temaClaro
      ? 'border-slate-200 bg-white/80'
      : 'border-white/5 bg-white/[0.03]',
    secao: temaClaro ? 'bg-white' : 'bg-[#0b110e]',
    secaoAlternativa: temaClaro
      ? 'border-y border-slate-200 bg-emerald-50/60'
      : 'border-y border-white/5 bg-[#0e1712]',
    borda: temaClaro ? 'border-slate-200' : 'border-white/[0.08]',
    rodape: temaClaro
      ? 'border-slate-200 bg-slate-100'
      : 'border-white/[0.08] bg-[#080d0a]',
    textoRodape: temaClaro ? 'text-slate-500' : 'text-slate-500',
    linkSecundario: temaClaro
      ? 'border-slate-300 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700'
      : 'border-white/10 bg-white/5 text-slate-200 hover:border-emerald-400/40 hover:bg-emerald-400/5 hover:text-emerald-300',
    chamada: temaClaro
      ? 'border-emerald-200 bg-gradient-to-br from-emerald-100 via-teal-50 to-white'
      : 'border-emerald-400/20 bg-gradient-to-br from-[#123b25] via-[#0e2c1c] to-[#102019]',
    chamadaTitulo: temaClaro ? 'text-slate-900' : 'text-white',
    chamadaTexto: temaClaro ? 'text-slate-600' : 'text-emerald-100/80',
    chamadaBotaoSecundario: temaClaro
      ? 'border-emerald-300 bg-white/70 text-emerald-900 hover:bg-white'
      : 'border-emerald-400/30 bg-white/5 text-white hover:bg-white/10',
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${cores.pagina}`}>
      <Navbar />

      <main>
        {/* Apresentação */}
        <section className={`relative overflow-hidden border-b transition-colors duration-300 ${cores.hero}`}>
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 sm:py-20 lg:py-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold tracking-wide text-emerald-600 sm:text-sm dark:text-emerald-300">
              <span aria-hidden="true">♻️</span>
              UM NOVO CICLO COMEÇA AQUI
            </span>

            <h1 className={`mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl ${cores.titulo}`}>
              Descartar melhor pode ser{' '}
              <span className="text-emerald-500 dark:text-emerald-400">
                mais simples.
              </span>
            </h1>

            <p className={`mx-auto mt-6 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 ${cores.texto}`}>
              O E-Ciclo foi pensado para ajudar você a entender o descarte
              de resíduos eletrônicos, registrar doações e consultar
              informações em um só lugar.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/doar"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-sm font-bold text-[#07120b] shadow-lg shadow-emerald-950/20 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                Registrar uma doação <span aria-hidden="true">→</span>
              </Link>

              <Link
                to="/pontos-de-coleta"
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-4 text-sm font-bold transition duration-300 hover:-translate-y-0.5 ${cores.linkSecundario}`}
              >
                <span aria-hidden="true">📍</span>
                Explorar o mapa
              </Link>
            </div>

            <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                'Registre sua doação',
                'Consulte informações',
                'Encontre pontos de coleta',
              ].map((texto, indice) => (
                <div
                  key={texto}
                  className={`rounded-2xl border p-4 transition-colors duration-300 ${cores.estatistica}`}
                >
                  <p className="text-2xl font-extrabold text-emerald-500 dark:text-emerald-400">
                    0{indice + 1}
                  </p>
                  <p className={`mt-1 text-sm ${cores.texto}`}>{texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Etapas */}
        <section className={`px-5 py-16 transition-colors duration-300 sm:px-8 sm:py-20 ${cores.secao}`}>
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Passo a passo
              </p>

              <h2 className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${cores.titulo}`}>
                Como funciona na prática?
              </h2>

              <p className={`mt-4 text-sm leading-7 sm:text-base ${cores.texto}`}>
                Veja como utilizar os principais recursos do E-Ciclo.
                O fluxo abaixo descreve a proposta da plataforma.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {passos.map((passo) => (
                <article
                  key={passo.numero}
                  className={`group relative rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 sm:p-8 ${cores.card}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/15 bg-emerald-500/10 text-3xl transition duration-300 group-hover:scale-105 group-hover:bg-emerald-500/15">
                      {passo.icone}
                    </div>
                    <span className="text-4xl font-black tracking-tight text-emerald-500/30">
                      {passo.numero}
                    </span>
                  </div>

                  <h3 className={`mt-7 text-xl font-extrabold ${cores.titulo}`}>
                    {passo.titulo}
                  </h3>

                  <p className={`mt-3 text-sm leading-7 ${cores.texto}`}>
                    {passo.descricao}
                  </p>

                  <div className={`mt-6 border-t pt-4 ${cores.borda}`}>
                    <p className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 sm:text-sm">
                      <span aria-hidden="true">✓</span>
                      {passo.detalhe}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className={`px-5 py-16 transition-colors duration-300 sm:px-8 sm:py-20 ${cores.secaoAlternativa}`}>
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Por que isso importa?
              </p>

              <h2 className={`mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${cores.titulo}`}>
                Pequenas atitudes podem gerar grandes mudanças.
              </h2>

              <p className={`mt-5 text-base leading-7 ${cores.texto}`}>
                Celulares, computadores, cabos e outros equipamentos
                podem conter materiais que exigem cuidados específicos
                no descarte. Por isso, buscar informações confiáveis é
                um passo importante para uma destinação mais responsável.
              </p>

              <Link
                to="/pontos-de-coleta"
                className="mt-7 inline-flex items-center gap-2 font-bold text-emerald-600 transition duration-300 hover:gap-3 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Consultar o mapa de coleta <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {beneficios.map((beneficio) => (
                <article
                  key={beneficio.titulo}
                  className={`rounded-2xl border p-6 transition duration-300 ${cores.card}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/15 bg-emerald-500/10 text-2xl">
                    {beneficio.icone}
                  </div>

                  <h3 className={`mt-4 font-extrabold ${cores.titulo}`}>
                    {beneficio.titulo}
                  </h3>

                  <p className={`mt-2 text-sm leading-6 ${cores.texto}`}>
                    {beneficio.descricao}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Chamada final */}
        <section className={`px-5 py-16 transition-colors duration-300 sm:px-8 sm:py-20 ${cores.secao}`}>
          <div className={`relative mx-auto max-w-7xl overflow-hidden rounded-3xl border px-6 py-12 text-center transition-colors duration-300 sm:px-12 sm:py-16 ${cores.chamada}`}>
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[40px] border-emerald-500/5" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full border-[35px] border-emerald-500/5" />

            <div className="relative mx-auto max-w-2xl">
              <span className="text-4xl" aria-hidden="true">🌎</span>

              <h2 className={`mt-5 text-3xl font-extrabold leading-tight sm:text-4xl ${cores.chamadaTitulo}`}>
                Vamos dar um novo destino aos eletrônicos?
              </h2>

              <p className={`mx-auto mt-4 max-w-xl text-sm leading-7 sm:text-base ${cores.chamadaTexto}`}>
                Conheça as funcionalidades do E-Ciclo e descubra como
                a tecnologia pode apoiar escolhas mais conscientes.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/doar"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-[#07120b] transition duration-300 hover:bg-emerald-400"
                >
                  Começar agora <span aria-hidden="true">→</span>
                </Link>

                <Link
                  to="/"
                  className={`inline-flex items-center justify-center rounded-xl border px-6 py-3.5 text-sm font-bold transition duration-300 ${cores.chamadaBotaoSecundario}`}
                >
                  Voltar ao início
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className={`border-t transition-colors duration-300 ${cores.rodape}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400"
          >
            E-Ciclo<span className="text-emerald-500">.</span>
          </Link>

          <p className={`text-sm leading-6 ${cores.textoRodape}`}>
            Tecnologia e sustentabilidade em um novo ciclo.
          </p>

          <Link
            to="/"
            className={`text-sm font-semibold transition hover:text-emerald-500 dark:hover:text-emerald-400 ${cores.texto}`}
          >
            Página inicial →
          </Link>
        </div>
      </footer>
    </div>
  )
}
