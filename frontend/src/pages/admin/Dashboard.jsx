import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STATUS = {
  PENDENTE: {
    label: 'Pendente',
    color: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
    dot: 'bg-amber-400',
  },
  EM_ANALISE: {
    label: 'Em análise',
    color: 'border-blue-400/20 bg-blue-400/10 text-blue-300',
    dot: 'bg-blue-400',
  },
  AGUARDANDO_COLETA: {
    label: 'Aguardando coleta',
    color: 'border-violet-400/20 bg-violet-400/10 text-violet-300',
    dot: 'bg-violet-400',
  },
  CONCLUIDO: {
    label: 'Concluído',
    color: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  CANCELADO: {
    label: 'Cancelado',
    color: 'border-red-400/20 bg-red-400/10 text-red-300',
    dot: 'bg-red-400',
  },
}

const STATUS_INICIAL = 'PENDENTE'

function CardIndicador({
  titulo,
  valor,
  descricao,
  simbolo,
  cor,
  percentual,
}) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#111b16] p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-400/20 hover:shadow-xl hover:shadow-black/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">{titulo}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-white">
            {valor}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${cor}`}
        >
          {simbolo}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-xs text-slate-500">{descricao}</p>
        {percentual !== undefined && (
          <span className="text-xs font-bold text-slate-300">
            {percentual}%
          </span>
        )}
      </div>

      {percentual !== undefined && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-500"
            style={{ width: `${percentual}%` }}
          />
        </div>
      )}
    </article>
  )
}

export default function DashboardAdmin() {
  const navigate = useNavigate()
  const [doacoes, setDoacoes] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('TODOS')

  useEffect(() => {
    carregarDoacoes()
  }, [])

  function carregarDoacoes() {
    try {
      const dados = JSON.parse(
        localStorage.getItem('mock_doacoes') || '[]'
      )

      setDoacoes(Array.isArray(dados) ? dados : [])
    } catch {
      setDoacoes([])
    }
  }

  function handleLogout() {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  function handleAlterarStatus(id, novoStatus) {
    const atualizadas = doacoes.map((item) =>
      String(item.id) === String(id)
        ? { ...item, status: novoStatus }
        : item
    )

    setDoacoes(atualizadas)
    localStorage.setItem('mock_doacoes', JSON.stringify(atualizadas))
  }

  const estatisticas = useMemo(() => {
    const total = doacoes.length
    const contar = (status) =>
      doacoes.filter((item) => (item.status || STATUS_INICIAL) === status)
        .length

    return {
      total,
      pendentes: contar('PENDENTE'),
      analise: contar('EM_ANALISE'),
      aguardando: contar('AGUARDANDO_COLETA'),
      concluidas: contar('CONCLUIDO'),
      canceladas: contar('CANCELADO'),
    }
  }, [doacoes])

  const percentualConcluido = estatisticas.total
    ? Math.round((estatisticas.concluidas / estatisticas.total) * 100)
    : 0

  const doacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    return doacoes.filter((item) => {
      const correspondeStatus =
        filtroStatus === 'TODOS' ||
        (item.status || STATUS_INICIAL) === filtroStatus

      const texto = [
        item.id,
        item.equipamento,
        item.nomeDoador,
        item.cidade,
        item.estado,
        item.email,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return correspondeStatus && texto.includes(termo)
    })
  }, [doacoes, busca, filtroStatus])

  const percentualPendente = estatisticas.total
    ? Math.round((estatisticas.pendentes / estatisticas.total) * 100)
    : 0

  const navegacao = [
    { label: 'Visão geral', simbolo: '▦', rota: '/admin/dashboard' },
    { label: 'Doações', simbolo: '♧', rota: '/admin/doacoes' },
    {
      label: 'Pontos de coleta',
      simbolo: '⌖',
      rota: '/admin/pontos-de-coleta',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0b110e] font-sans text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/[0.08] bg-[#0e1712] lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-white/[0.08] px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-2xl text-emerald-400">
            ♻
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white">
              E-Ciclo
            </h1>
            <p className="text-xs text-slate-500">Painel administrativo</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <p className="px-3 pb-2 pt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Gerenciamento
          </p>

          {navegacao.map((item) => {
            const ativo = item.rota === '/admin/dashboard'

            return (
              <button
                key={item.rota}
                onClick={() => navigate(item.rota)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition ${
                  ativo
                    ? 'border-emerald-400/15 bg-emerald-400/10 font-semibold text-emerald-300'
                    : 'border-transparent font-medium text-slate-400 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-lg">
                  {item.simbolo}
                </span>
                {item.label}
                {ativo && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            )
          })}

          <div className="mt-8 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.05] p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
              ✳
            </div>
            <p className="mt-3 text-sm font-bold text-white">
              Um futuro mais sustentável
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Cada equipamento destinado corretamente faz a diferença.
            </p>
          </div>
        </nav>

        <div className="border-t border-white/[0.08] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 font-bold text-emerald-300">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Administrador
              </p>
              <p className="text-xs text-slate-500">Acesso administrativo</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
          >
            <span>↪</span> Sair do painel
          </button>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#0b110e]/90 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                Administração / Dashboard
              </p>
              <h2 className="mt-1 truncate text-xl font-extrabold text-white sm:text-2xl">
                Visão geral
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-white">
                  Administrador
                </p>
                <p className="text-xs text-slate-500">Gestão de doações</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 font-bold text-emerald-300">
                A
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] lg:hidden"
              >
                Sair
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-white/[0.06] px-4 py-3 lg:hidden">
            {navegacao.map((item) => (
              <button
                key={item.rota}
                onClick={() => navigate(item.rota)}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  item.rota === '/admin/dashboard'
                    ? 'bg-emerald-400/10 text-emerald-300'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] space-y-8 p-4 sm:p-8">
          <section className="relative overflow-hidden rounded-3xl border border-emerald-400/15 bg-[#111b16] p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-emerald-400/[0.08] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-teal-400/[0.06] blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Bem-vindo ao E-Ciclo
                </div>
                <h3 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
                  Gestão inteligente de
                  <span className="block text-emerald-400">
                    doações eletrônicas.
                  </span>
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  Acompanhe os registros, organize as etapas de atendimento e
                  gerencie as doações em um só lugar.
                </p>
              </div>

              <button
                onClick={() => navigate('/admin/doacoes')}
                className="shrink-0 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#07110b] transition hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/20"
              >
                Gerenciar doações →
              </button>
            </div>

            <div className="relative mt-8 grid grid-cols-1 gap-3 border-t border-white/[0.08] pt-5 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">Registros cadastrados</p>
                <p className="mt-1 text-lg font-bold text-white">
                  {estatisticas.total}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Aguardando atendimento</p>
                <p className="mt-1 text-lg font-bold text-amber-300">
                  {estatisticas.pendentes}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Doações concluídas</p>
                <p className="mt-1 text-lg font-bold text-emerald-300">
                  {estatisticas.concluidas}
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">
                Desempenho
              </p>
              <h3 className="mt-2 text-lg font-bold text-white">
                Indicadores gerais
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Resumo calculado com os registros disponíveis neste navegador.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <CardIndicador
                titulo="Total de doações"
                valor={estatisticas.total}
                descricao="Todos os registros"
                simbolo="♧"
                cor="bg-emerald-400/10 text-emerald-300"
              />
              <CardIndicador
                titulo="Pendentes"
                valor={estatisticas.pendentes}
                descricao="Aguardando atendimento"
                simbolo="◷"
                cor="bg-amber-400/10 text-amber-300"
                percentual={percentualPendente}
              />
              <CardIndicador
                titulo="Em análise"
                valor={estatisticas.analise}
                descricao="Em processo de avaliação"
                simbolo="⌕"
                cor="bg-blue-400/10 text-blue-300"
              />
              <CardIndicador
                titulo="Concluídas"
                valor={estatisticas.concluidas}
                descricao="Doações finalizadas"
                simbolo="✓"
                cor="bg-teal-400/10 text-teal-300"
                percentual={percentualConcluido}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <article className="rounded-2xl border border-white/[0.08] bg-[#111b16] p-5 sm:p-6 xl:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">
                    Distribuição das doações
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Acompanhamento por etapa
                  </p>
                </div>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-semibold text-slate-400">
                  {estatisticas.total} registros
                </span>
              </div>

              <div className="mt-7 space-y-5">
                {[
                  { status: 'PENDENTE', quantidade: estatisticas.pendentes },
                  { status: 'EM_ANALISE', quantidade: estatisticas.analise },
                  {
                    status: 'AGUARDANDO_COLETA',
                    quantidade: estatisticas.aguardando,
                  },
                  { status: 'CONCLUIDO', quantidade: estatisticas.concluidas },
                  { status: 'CANCELADO', quantidade: estatisticas.canceladas },
                ].map(({ status, quantidade }) => {
                  const info = STATUS[status]
                  const percentual = estatisticas.total
                    ? Math.round((quantidade / estatisticas.total) * 100)
                    : 0

                  return (
                    <div key={status}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${info.dot}`}
                          />
                          <span className="font-medium text-slate-300">
                            {info.label}
                          </span>
                        </div>
                        <span className="font-semibold text-white">
                          {quantidade}
                          <span className="ml-2 font-normal text-slate-500">
                            ({percentual}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={`h-full rounded-full ${info.dot} transition-all duration-500`}
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </article>

            <article className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#111b16] p-5 sm:p-6">
              <h3 className="font-bold text-white">Resumo operacional</h3>
              <p className="mt-1 text-sm text-slate-500">
                Situação atual dos registros
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-400/10 bg-amber-400/[0.05] p-4">
                  <div>
                    <p className="text-sm font-semibold text-amber-200">
                      Aguardando atendimento
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Pendentes</p>
                  </div>
                  <span className="text-2xl font-extrabold text-amber-300">
                    {estatisticas.pendentes}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl border border-violet-400/10 bg-violet-400/[0.05] p-4">
                  <div>
                    <p className="text-sm font-semibold text-violet-200">
                      Aguardando coleta
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Próxima etapa</p>
                  </div>
                  <span className="text-2xl font-extrabold text-violet-300">
                    {estatisticas.aguardando}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05] p-4">
                  <div>
                    <p className="text-sm font-semibold text-emerald-200">
                      Taxa de conclusão
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Sobre o total registrado
                    </p>
                  </div>
                  <span className="text-2xl font-extrabold text-emerald-300">
                    {percentualConcluido}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/admin/doacoes')}
                className="mt-6 w-full rounded-xl border border-emerald-400/20 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/[0.07]"
              >
                Ver todas as doações →
              </button>
            </article>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111b16]">
            <div className="space-y-4 border-b border-white/[0.08] p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">
                    Registros
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-white">
                    Gerenciamento de doações
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {doacoesFiltradas.length} de {doacoes.length} registros
                    exibidos
                  </p>
                </div>

                <button
                  onClick={carregarDoacoes}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/20 hover:bg-white/[0.03] hover:text-emerald-300"
                >
                  ↻ Atualizar lista
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    ⌕
                  </span>
                  <input
                    type="search"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar código, doador ou equipamento..."
                    className="w-full rounded-xl border border-white/10 bg-[#0b110e] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                  />
                </div>

                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0b110e] px-3 py-3 text-sm text-slate-200 outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                >
                  <option value="TODOS">Todos os status</option>
                  {Object.entries(STATUS).map(([valor, info]) => (
                    <option key={valor} value={valor}>
                      {info.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {doacoesFiltradas.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-3xl text-emerald-300">
                  ♧
                </div>
                <h4 className="mt-4 font-bold text-white">
                  {doacoes.length === 0
                    ? 'Nenhuma doação cadastrada'
                    : 'Nenhum resultado encontrado'}
                </h4>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {doacoes.length === 0
                    ? 'Quando houver registros em mock_doacoes, eles aparecerão nesta área. Este painel ainda utiliza os dados locais do navegador.'
                    : 'Tente alterar a pesquisa ou selecionar outro status.'}
                </p>
                {(busca || filtroStatus !== 'TODOS') && (
                  <button
                    onClick={() => {
                      setBusca('')
                      setFiltroStatus('TODOS')
                    }}
                    className="mt-4 text-sm font-semibold text-emerald-300 hover:text-emerald-200 hover:underline"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-white/[0.025] text-[11px] uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Código</th>
                      <th className="px-6 py-4 font-semibold">Equipamento</th>
                      <th className="px-6 py-4 font-semibold">Doador</th>
                      <th className="px-6 py-4 font-semibold">Localização</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 text-right font-semibold">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/[0.06]">
                    {doacoesFiltradas.map((item) => {
                      const status = item.status || STATUS_INICIAL
                      const info = STATUS[status] || STATUS.PENDENTE

                      return (
                        <tr
                          key={item.id}
                          className="transition hover:bg-white/[0.025]"
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono font-bold text-slate-300">
                              #{item.id ?? '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-white">
                              {item.equipamento || 'Não informado'}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.categoria || 'Categoria não informada'}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-200">
                              {item.nomeDoador || 'Não informado'}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.telefone || item.email || 'Sem contato'}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-slate-400">
                            {item.cidade
                              ? `${item.cidade}${item.estado ? ` / ${item.estado}` : ''}`
                              : 'Não informada'}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              aria-label={`Status da doação ${item.id}`}
                              value={status}
                              onChange={(e) =>
                                handleAlterarStatus(item.id, e.target.value)
                              }
                              className={`max-w-[190px] rounded-full border px-3 py-2 text-xs font-semibold outline-none ${info.color}`}
                            >
                              {Object.entries(STATUS).map(
                                ([valor, detalhe]) => (
                                  <option
                                    key={valor}
                                    value={valor}
                                    className="bg-[#111b16] text-slate-100"
                                  >
                                    {detalhe.label}
                                  </option>
                                )
                              )}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() =>
                                navigate(`/admin/doacoes/${item.id}`)
                              }
                              className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-400/10"
                            >
                              Ver detalhes →
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <footer className="flex flex-col justify-between gap-2 border-t border-white/[0.08] py-5 text-xs text-slate-600 sm:flex-row">
            <p>© E-Ciclo — Gestão de resíduos eletrônicos</p>
            <p>Painel administrativo</p>
          </footer>
        </main>
      </div>
    </div>
  )
}