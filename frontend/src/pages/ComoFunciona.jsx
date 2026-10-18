import { Link } from 'react-router-dom'
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
  return (
    <div className="min-h-screen bg-[#0b110e] font-sans text-slate-100">
      <Navbar />

      <main>
        {/* Apresentação */}
        <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-[#10251a] via-[#0b110e] to-[#101b16]">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 sm:py-20 lg:py-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold tracking-wide text-emerald-300 sm:text-sm">
              <span aria-hidden="true">♻️</span>
              UM NOVO CICLO COMEÇA AQUI
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Descartar melhor pode ser{' '}
              <span className="text-emerald-400">
                mais simples.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              O E-Ciclo foi pensado para ajudar você a entender o descarte
              de resíduos eletrônicos, registrar doações e consultar
              informações em um só lugar.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/doar"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-sm font-bold text-[#07120b] shadow-lg shadow-emerald-950/30 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                Registrar uma doação
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                to="/pontos-de-coleta"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/5 hover:text-emerald-300"
              >
                <span aria-hidden="true">📍</span>
                Explorar o mapa
              </Link>
            </div>

            <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-2xl font-extrabold text-emerald-400">
                  01
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Registre sua doação
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-2xl font-extrabold text-emerald-400">
                  02
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Consulte informações
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-2xl font-extrabold text-emerald-400">
                  03
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Encontre pontos de coleta
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Etapas */}
        <section className="bg-[#0b110e] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                Passo a passo
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Como funciona na prática?
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                Veja como utilizar os principais recursos do E-Ciclo.
                O fluxo abaixo descreve a proposta da plataforma.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {passos.map((passo) => (
                <article
                  key={passo.numero}
                  className="group relative rounded-3xl border border-white/[0.08] bg-[#111b16] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-[#14221a] sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/10 text-3xl transition duration-300 group-hover:scale-105 group-hover:bg-emerald-400/15">
                      {passo.icone}
                    </div>

                    <span className="text-4xl font-black tracking-tight text-emerald-400/20">
                      {passo.numero}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-extrabold text-white">
                    {passo.titulo}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {passo.descricao}
                  </p>

                  <div className="mt-6 border-t border-white/[0.08] pt-4">
                    <p className="flex items-center gap-2 text-xs font-bold text-emerald-400 sm:text-sm">
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
        <section className="border-y border-white/5 bg-[#0e1712] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                Por que isso importa?
              </p>

              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                Pequenas atitudes podem gerar grandes mudanças.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-400">
                Celulares, computadores, cabos e outros equipamentos
                podem conter materiais que exigem cuidados específicos
                no descarte. Por isso, buscar informações confiáveis é
                um passo importante para uma destinação mais responsável.
              </p>

              <Link
                to="/pontos-de-coleta"
                className="mt-7 inline-flex items-center gap-2 font-bold text-emerald-400 transition duration-300 hover:gap-3 hover:text-emerald-300"
              >
                Consultar o mapa de coleta
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {beneficios.map((beneficio) => (
                <article
                  key={beneficio.titulo}
                  className="rounded-2xl border border-white/[0.08] bg-[#111b16] p-6 transition duration-300 hover:border-emerald-400/30 hover:bg-[#14221a]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10 text-2xl">
                    {beneficio.icone}
                  </div>

                  <h3 className="mt-4 font-extrabold text-white">
                    {beneficio.titulo}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {beneficio.descricao}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Chamada final */}
        <section className="bg-[#0b110e] px-5 py-16 sm:px-8 sm:py-20">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-[#123b25] via-[#0e2c1c] to-[#102019] px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[40px] border-white/5" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full border-[35px] border-white/5" />

            <div className="relative mx-auto max-w-2xl">
              <span className="text-4xl" aria-hidden="true">
                🌎
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Vamos dar um novo destino aos eletrônicos?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-emerald-100/80 sm:text-base">
                Conheça as funcionalidades do E-Ciclo e descubra como
                a tecnologia pode apoiar escolhas mais conscientes.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/doar"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-[#07120b] transition duration-300 hover:bg-emerald-300"
                >
                  Começar agora
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-xl border border-emerald-400/30 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition duration-300 hover:bg-white/10"
                >
                  Voltar ao início
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="border-t border-white/[0.08] bg-[#080d0a]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight text-emerald-400"
          >
            E-Ciclo<span className="text-emerald-300">.</span>
          </Link>

          <p className="text-sm leading-6 text-slate-500">
            Tecnologia e sustentabilidade em um novo ciclo.
          </p>

          <Link
            to="/"
            className="text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
          >
            Página inicial →
          </Link>
        </div>
      </footer>
    </div>
  )
}