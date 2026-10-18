import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Doacoes() {
  const [doacoes, setDoacoes] = useState([])
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    carregarDoacoes()
  }, [])

  function carregarDoacoes() {
    const doacoesSalvas = JSON.parse(
      localStorage.getItem('doacoes') || '[]'
    )

    setDoacoes(doacoesSalvas)
  }

  function atualizarStatus(id, novoStatus) {
    const doacoesAtualizadas = doacoes.map((doacao) =>
      doacao.id === id
        ? { ...doacao, status: novoStatus }
        : doacao
    )

    localStorage.setItem(
      'doacoes',
      JSON.stringify(doacoesAtualizadas)
    )

    setDoacoes(doacoesAtualizadas)
  }

  const totalDoacoes = doacoes.length

  const pendentes = doacoes.filter(
    (doacao) => doacao.status === 'Pendente'
  ).length

  const aprovadas = doacoes.filter(
    (doacao) => doacao.status === 'Aprovada'
  ).length

  const rejeitadas = doacoes.filter(
    (doacao) => doacao.status === 'Rejeitada'
  ).length

  const doacoesFiltradas = doacoes.filter((doacao) => {
    const correspondeStatus =
      filtroStatus === 'Todos' ||
      doacao.status === filtroStatus

    const nomeEquipamento = String(
      doacao.equipamento || ''
    ).toLowerCase()

    const correspondeBusca = nomeEquipamento.includes(
      busca.toLowerCase().trim()
    )

    return correspondeStatus && correspondeBusca
  })

  const statusEstilo = {
    Pendente:
      'bg-amber-400/10 text-amber-300 border-amber-400/20',
    Aprovada:
      'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
    Rejeitada:
      'bg-red-400/10 text-red-300 border-red-400/20',
  }

  return (
    <div className="min-h-screen bg-[#0b110e] text-slate-100">
      {/* Cabeçalho */}

      <header className="border-b border-white/5 bg-[#0e1712]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl">
              ♻️
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                E-Ciclo
              </h1>
              <p className="text-sm text-slate-400">
                Painel administrativo
              </p>
            </div>
          </Link>

          <Link
            to="/admin/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
          >
            <span>←</span>
            Voltar ao dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        {/* Título */}

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            ADMINISTRAÇÃO / DOAÇÕES
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Gerenciamento de doações
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Acompanhe os equipamentos cadastrados, analise as
            solicitações e gerencie o andamento das doações.
          </p>
        </div>

        {/* Indicadores */}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/5 bg-[#111b16] p-5 transition hover:border-emerald-400/20">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Total de doações
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-xl">
                ♻️
              </span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-white">
              {totalDoacoes}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Todas as solicitações cadastradas
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#111b16] p-5 transition hover:border-amber-400/20">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Pendentes
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-xl">
                ◷
              </span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-amber-300">
              {pendentes}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Aguardando análise
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#111b16] p-5 transition hover:border-emerald-400/20">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Aprovadas
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-xl">
                ✓
              </span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-emerald-300">
              {aprovadas}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Doações autorizadas
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#111b16] p-5 transition hover:border-red-400/20">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Rejeitadas
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-xl">
                ×
              </span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-red-300">
              {rejeitadas}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Solicitações não aprovadas
            </p>
          </div>
        </section>

        {/* Filtros */}

        <section className="mb-6 rounded-2xl border border-white/5 bg-[#111b16] p-5 sm:p-6">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-white">
              Buscar e filtrar
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Encontre rapidamente uma doação pelo equipamento ou status.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="busca"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Equipamento
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  ⌕
                </span>

                <input
                  id="busca"
                  type="text"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Ex.: placa de vídeo, monitor..."
                  className="w-full rounded-xl border border-white/10 bg-[#0b110e] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Status da doação
              </label>

              <select
                id="status"
                value={filtroStatus}
                onChange={(event) => setFiltroStatus(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
              >
                <option value="Todos">Todos os status</option>
                <option value="Pendente">Pendentes</option>
                <option value="Aprovada">Aprovadas</option>
                <option value="Rejeitada">Rejeitadas</option>
              </select>
            </div>
          </div>

          {(busca || filtroStatus !== 'Todos') && (
            <button
              type="button"
              onClick={() => {
                setBusca('')
                setFiltroStatus('Todos')
              }}
              className="mt-4 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              Limpar filtros ×
            </button>
          )}
        </section>

        {/* Tabela */}

        <section className="overflow-hidden rounded-2xl border border-white/5 bg-[#111b16]">
          <div className="flex flex-col gap-2 border-b border-white/5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h3 className="text-lg font-bold text-white">
                Doações cadastradas
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Gerencie as solicitações recebidas pelo sistema.
              </p>
            </div>

            <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              {doacoesFiltradas.length}{' '}
              {doacoesFiltradas.length === 1
                ? 'resultado'
                : 'resultados'}
            </span>
          </div>

          {doacoesFiltradas.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-3xl">
                🔎
              </div>

              <h4 className="text-lg font-bold text-white">
                Nenhuma doação encontrada
              </h4>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Não encontramos doações com esses critérios. Tente
                alterar a busca ou selecionar outro status.
              </p>

              {(busca || filtroStatus !== 'Todos') && (
                <button
                  type="button"
                  onClick={() => {
                    setBusca('')
                    setFiltroStatus('Todos')
                  }}
                  className="mt-5 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-[#0b110e] transition hover:bg-emerald-300"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-white/[0.025]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Equipamento
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Categoria
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Quantidade
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Data
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {doacoesFiltradas.map((doacao) => (
                    <tr
                      key={doacao.id}
                      className="transition hover:bg-white/[0.025]"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-100">
                          {doacao.equipamento || 'Equipamento não informado'}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          ID: {doacao.id ?? '—'}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-400">
                        {doacao.categoria || '—'}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-300">
                        {doacao.quantidade ?? '—'}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${
                            statusEstilo[doacao.status] ||
                            'border-slate-500/20 bg-slate-500/10 text-slate-300'
                          }`}
                        >
                          {doacao.status || 'Sem status'}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-400">
                        {doacao.data || '—'}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to={`/admin/doacoes/${doacao.id}`}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-300"
                          >
                            Ver detalhes
                          </Link>

                          {doacao.status === 'Pendente' && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  atualizarStatus(doacao.id, 'Aprovada')
                                }
                                className="rounded-lg bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-400 hover:text-[#0b110e]"
                              >
                                ✓ Aprovar
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  atualizarStatus(doacao.id, 'Rejeitada')
                                }
                                className="rounded-lg bg-red-400/10 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-400 hover:text-white"
                              >
                                ✕ Rejeitar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-slate-600">
          E-Ciclo · Painel de gerenciamento de doações
        </p>
      </main>
    </div>
  )
}

export default Doacoes