import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Doacoes() {
  const navigate = useNavigate()

  const [doacoes, setDoacoes] = useState([])
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [busca, setBusca] = useState('')

  const [tema, setTema] = useState(() =>
    localStorage.getItem('eciclo-tema') === 'claro'
      ? 'claro'
      : 'escuro'
  )

  const modoClaro = tema === 'claro'

  useEffect(() => {
    carregarDoacoes()
  }, [])

  useEffect(() => {
    function atualizarTema(evento) {
      const novoTema =
        evento.detail ||
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

  function alternarTema() {
    const novoTema = modoClaro ? 'escuro' : 'claro'

    localStorage.setItem('eciclo-tema', novoTema)

    document.documentElement.classList.toggle(
      'dark',
      novoTema === 'escuro'
    )

    document.documentElement.style.colorScheme = novoTema

    setTema(novoTema)

    window.dispatchEvent(
      new CustomEvent('eciclo-tema-alterado', {
        detail: novoTema,
      })
    )
  }

  function carregarDoacoes() {
    try {
      const doacoesSalvas = JSON.parse(
        localStorage.getItem('doacoes') || '[]'
      )

      setDoacoes(
        Array.isArray(doacoesSalvas) ? doacoesSalvas : []
      )
    } catch {
      setDoacoes([])
    }
  }

  function atualizarStatus(id, novoStatus) {
    const doacoesAtualizadas = doacoes.map((doacao) =>
      String(doacao.id) === String(id)
        ? { ...doacao, status: novoStatus }
        : doacao
    )

    localStorage.setItem(
      'doacoes',
      JSON.stringify(doacoesAtualizadas)
    )

    setDoacoes(doacoesAtualizadas)
  }

  function sair() {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
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

    const termo = busca.toLowerCase().trim()

    const correspondeBusca = [
      doacao.equipamento,
      doacao.categoria,
      doacao.id,
    ].some((valor) =>
      String(valor ?? '').toLowerCase().includes(termo)
    )

    return correspondeStatus && correspondeBusca
  })

  const fundoPagina = modoClaro
    ? 'bg-slate-50 text-slate-800'
    : 'bg-[#0b110e] text-slate-100'

  const fundoPainel = modoClaro
    ? 'border-slate-200 bg-white'
    : 'border-white/5 bg-[#111b16]'

  const fundoSecundario = modoClaro
    ? 'bg-slate-100'
    : 'bg-white/5'

  const textoPrincipal = modoClaro
    ? 'text-slate-900'
    : 'text-white'

  const textoSecundario = modoClaro
    ? 'text-slate-600'
    : 'text-slate-400'

  const textoDiscreto = modoClaro
    ? 'text-slate-500'
    : 'text-slate-500'

  const borda = modoClaro
    ? 'border-slate-200'
    : 'border-white/5'

  const fundoCampo = modoClaro
    ? 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400'
    : 'border-white/10 bg-[#0b110e] text-white placeholder:text-slate-600'

  const statusEstilo = {
    Pendente: modoClaro
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : 'border-amber-400/20 bg-amber-400/10 text-amber-300',

    Aprovada: modoClaro
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',

    Rejeitada: modoClaro
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-red-400/20 bg-red-400/10 text-red-300',
  }

  const menuLink = (ativo) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      ativo
        ? modoClaro
          ? 'bg-emerald-50 text-emerald-800'
          : 'bg-emerald-400/10 text-emerald-300'
        : modoClaro
          ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`

  return (
    <div
      className={`doacoes-admin min-h-screen transition-colors duration-300 ${fundoPagina}`}
    >
      {/* Barra lateral para computadores */}

      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r lg:flex ${
          modoClaro
            ? 'border-slate-200 bg-white'
            : 'border-white/5 bg-[#0e1712]'
        }`}
      >
        <Link
          to="/admin/dashboard"
          className={`flex h-20 shrink-0 items-center gap-3 border-b px-6 ${
            modoClaro ? 'border-slate-200' : 'border-white/5'
          }`}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl">
            ♻️
          </div>

          <div>
            <h1 className={`text-xl font-extrabold ${textoPrincipal}`}>
              E-Ciclo
            </h1>
            <p className={`text-xs ${textoSecundario}`}>
              Painel administrativo
            </p>
          </div>
        </Link>

        <div className="flex-1 px-4 py-6">
          <p
            className={`mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.18em] ${textoDiscreto}`}
          >
            Menu principal
          </p>

          <nav className="space-y-2">
            <Link
              to="/admin/dashboard"
              className={menuLink(false)}
            >
              <span className="text-lg">▦</span>
              Visão geral
            </Link>

            <Link
              to="/admin/doacoes"
              className={menuLink(true)}
            >
              <span className="text-lg">♻</span>
              Doações
              <span className="ml-auto rounded-lg bg-emerald-400/15 px-2 py-1 text-xs text-emerald-500">
                {totalDoacoes}
              </span>
            </Link>

            <Link
              to="/admin/pontos-de-coleta"
              className={menuLink(false)}
            >
              <span className="text-lg">⌖</span>
              Pontos de coleta
            </Link>
          </nav>

          <div
            className={`mt-10 rounded-2xl border p-4 ${
              modoClaro
                ? 'border-emerald-100 bg-emerald-50'
                : 'border-emerald-400/10 bg-emerald-400/5'
            }`}
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/15 text-lg">
              🌱
            </div>

            <p className={`text-sm font-bold ${textoPrincipal}`}>
              Um futuro mais sustentável
            </p>

            <p className={`mt-2 text-xs leading-5 ${textoSecundario}`}>
              Cada equipamento encaminhado corretamente faz a diferença.
            </p>
          </div>
        </div>

        <div
          className={`border-t p-4 ${
            modoClaro ? 'border-slate-200' : 'border-white/5'
          }`}
        >
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 font-bold text-emerald-500">
              A
            </div>

            <div className="min-w-0">
              <p className={`text-sm font-bold ${textoPrincipal}`}>
                Administrador
              </p>
              <p className={`text-xs ${textoSecundario}`}>
                Gerenciamento do sistema
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={sair}
            className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
              modoClaro
                ? 'text-red-600 hover:bg-red-50'
                : 'text-red-300 hover:bg-red-400/10'
            }`}
          >
            ↪ Sair do painel
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}

      <div className="min-w-0 lg:ml-64">
        {/* Cabeçalho */}

        <header
          className={`sticky top-0 z-20 border-b backdrop-blur-xl ${
            modoClaro
              ? 'border-slate-200 bg-white/90'
              : 'border-white/5 bg-[#0e1712]/90'
          }`}
        >
          <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div>
              <p className={`text-xs font-semibold ${textoSecundario}`}>
                E-Ciclo / Administração
              </p>
              <h2 className={`mt-1 text-lg font-bold ${textoPrincipal}`}>
                Gerenciamento de doações
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={alternarTema}
                aria-label={
                  modoClaro
                    ? 'Ativar tema escuro'
                    : 'Ativar tema claro'
                }
                title={
                  modoClaro
                    ? 'Ativar tema escuro'
                    : 'Ativar tema claro'
                }
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl transition ${
                  modoClaro
                    ? 'border-slate-200 bg-white hover:bg-slate-100'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {modoClaro ? '🌙' : '☀️'}
              </button>

              <div
                className={`hidden items-center gap-3 rounded-xl border px-3 py-2 sm:flex ${borda}`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 font-bold text-emerald-500">
                  A
                </div>
                <div>
                  <p className={`text-sm font-bold ${textoPrincipal}`}>
                    Administrador
                  </p>
                  <p className={`text-xs ${textoSecundario}`}>
                    Painel administrativo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu para dispositivos móveis */}

          <nav
            className={`flex gap-2 overflow-x-auto border-t px-5 py-3 lg:hidden ${
              modoClaro ? 'border-slate-200' : 'border-white/5'
            }`}
          >
            <Link
              to="/admin/dashboard"
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
                modoClaro
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              ▦ Visão geral
            </Link>

            <Link
              to="/admin/doacoes"
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold ${
                modoClaro
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-emerald-400/10 text-emerald-300'
              }`}
            >
              ♻ Doações
            </Link>

            <Link
              to="/admin/pontos-de-coleta"
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
                modoClaro
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              ⌖ Pontos de coleta
            </Link>

            <button
              type="button"
              onClick={sair}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
                modoClaro ? 'text-red-600' : 'text-red-300'
              }`}
            >
              Sair ↪
            </button>
          </nav>
        </header>

        <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 sm:py-10">
          {/* Título */}

          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-500">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              ADMINISTRAÇÃO / DOAÇÕES
            </div>

            <h1
              className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${textoPrincipal}`}
            >
              Gerenciamento de doações
            </h1>

            <p
              className={`mt-3 max-w-2xl text-sm leading-6 sm:text-base ${textoSecundario}`}
            >
              Acompanhe os equipamentos cadastrados, analise as
              solicitações e gerencie o andamento das doações.
            </p>
          </div>

          {/* Indicadores */}

          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                titulo: 'Total de doações',
                valor: totalDoacoes,
                icone: '♻️',
                detalhe: 'Todas as solicitações cadastradas',
                cor: 'emerald',
              },
              {
                titulo: 'Pendentes',
                valor: pendentes,
                icone: '◷',
                detalhe: 'Aguardando análise',
                cor: 'amber',
              },
              {
                titulo: 'Aprovadas',
                valor: aprovadas,
                icone: '✓',
                detalhe: 'Doações autorizadas',
                cor: 'emerald',
              },
              {
                titulo: 'Rejeitadas',
                valor: rejeitadas,
                icone: '×',
                detalhe: 'Solicitações não aprovadas',
                cor: 'red',
              },
            ].map((indicador) => (
              <div
                key={indicador.titulo}
                className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${fundoPainel}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className={`text-sm font-medium ${textoSecundario}`}>
                    {indicador.titulo}
                  </p>

                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
                      indicador.cor === 'amber'
                        ? 'bg-amber-400/10 text-amber-500'
                        : indicador.cor === 'red'
                          ? 'bg-red-400/10 text-red-500'
                          : 'bg-emerald-400/10 text-emerald-500'
                    }`}
                  >
                    {indicador.icone}
                  </span>
                </div>

                <p
                  className={`mt-4 text-3xl font-extrabold ${
                    indicador.cor === 'amber'
                      ? modoClaro
                        ? 'text-amber-600'
                        : 'text-amber-300'
                      : indicador.cor === 'red'
                        ? modoClaro
                          ? 'text-red-600'
                          : 'text-red-300'
                        : modoClaro
                          ? 'text-emerald-700'
                          : 'text-emerald-300'
                  }`}
                >
                  {indicador.valor}
                </p>

                <p className={`mt-2 text-xs ${textoDiscreto}`}>
                  {indicador.detalhe}
                </p>
              </div>
            ))}
          </section>

          {/* Busca e filtros */}

          <section className={`mb-6 rounded-2xl border p-5 sm:p-6 ${fundoPainel}`}>
            <div className="mb-5">
              <h3 className={`text-lg font-bold ${textoPrincipal}`}>
                Buscar e filtrar
              </h3>
              <p className={`mt-1 text-sm ${textoSecundario}`}>
                Encontre uma doação pelo equipamento, categoria ou status.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="busca"
                  className={`mb-2 block text-sm font-semibold ${textoSecundario}`}
                >
                  Equipamento ou categoria
                </label>

                <div className="relative">
                  <span className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${textoDiscreto}`}>
                    ⌕
                  </span>

                  <input
                    id="busca"
                    type="text"
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                    placeholder="Ex.: placa de vídeo, monitor..."
                    className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15 ${fundoCampo}`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className={`mb-2 block text-sm font-semibold ${textoSecundario}`}
                >
                  Status da doação
                </label>

                <select
                  id="status"
                  value={filtroStatus}
                  onChange={(event) => setFiltroStatus(event.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15 ${fundoCampo}`}
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
                className="mt-4 text-sm font-semibold text-emerald-600 transition hover:text-emerald-500"
              >
                Limpar filtros ×
              </button>
            )}
          </section>

          {/* Tabela de doações */}

          <section className={`overflow-hidden rounded-2xl border ${fundoPainel}`}>
            <div
              className={`flex flex-col gap-3 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${borda}`}
            >
              <div>
                <h3 className={`text-lg font-bold ${textoPrincipal}`}>
                  Doações cadastradas
                </h3>
                <p className={`mt-1 text-sm ${textoSecundario}`}>
                  Gerencie as solicitações recebidas pelo sistema.
                </p>
              </div>

              <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                {doacoesFiltradas.length}{' '}
                {doacoesFiltradas.length === 1
                  ? 'resultado'
                  : 'resultados'}
              </span>
            </div>

            {doacoesFiltradas.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div
                  className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${fundoSecundario}`}
                >
                  🔎
                </div>

                <h4 className={`text-lg font-bold ${textoPrincipal}`}>
                  Nenhuma doação encontrada
                </h4>

                <p className={`mx-auto mt-2 max-w-sm text-sm leading-6 ${textoSecundario}`}>
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
                    className="mt-5 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-[#07110b] transition hover:bg-emerald-300"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead
                    className={
                      modoClaro ? 'bg-slate-100' : 'bg-white/[0.025]'
                    }
                  >
                    <tr>
                      {[
                        'Equipamento',
                        'Categoria',
                        'Quantidade',
                        'Status',
                        'Data',
                        'Ações',
                      ].map((coluna) => (
                        <th
                          key={coluna}
                          className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${textoDiscreto}`}
                        >
                          {coluna}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {doacoesFiltradas.map((doacao) => (
                      <tr
                        key={doacao.id}
                        className={`border-t transition ${
                          modoClaro
                            ? 'border-slate-200 hover:bg-slate-50'
                            : 'border-white/5 hover:bg-white/[0.025]'
                        }`}
                      >
                        <td className="px-6 py-5">
                          <p className={`font-semibold ${textoPrincipal}`}>
                            {doacao.equipamento || 'Equipamento não informado'}
                          </p>
                          <p className={`mt-1 text-xs ${textoDiscreto}`}>
                            ID: {doacao.id ?? '—'}
                          </p>
                        </td>

                        <td className={`px-6 py-5 text-sm ${textoSecundario}`}>
                          {doacao.categoria || '—'}
                        </td>

                        <td className={`px-6 py-5 text-sm ${textoSecundario}`}>
                          {doacao.quantidade ?? '—'}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${
                              statusEstilo[doacao.status] ||
                              (modoClaro
                                ? 'border-slate-200 bg-slate-100 text-slate-600'
                                : 'border-slate-500/20 bg-slate-500/10 text-slate-300')
                            }`}
                          >
                            {doacao.status || 'Sem status'}
                          </span>
                        </td>

                        <td className={`px-6 py-5 text-sm ${textoSecundario}`}>
                          {doacao.data || '—'}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              to={`/admin/doacoes/${doacao.id}`}
                              className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                                modoClaro
                                  ? 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700'
                                  : 'border-white/10 bg-white/5 text-slate-200 hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-300'
                              }`}
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
                                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                                    modoClaro
                                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white'
                                      : 'bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400 hover:text-[#0b110e]'
                                  }`}
                                >
                                  ✓ Aprovar
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    atualizarStatus(doacao.id, 'Rejeitada')
                                  }
                                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                                    modoClaro
                                      ? 'bg-red-50 text-red-700 hover:bg-red-500 hover:text-white'
                                      : 'bg-red-400/10 text-red-300 hover:bg-red-400 hover:text-white'
                                  }`}
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

          <p className={`mt-6 pb-4 text-center text-xs ${textoDiscreto}`}>
            E-Ciclo · Painel de gerenciamento de doações
          </p>
        </main>
      </div>
    </div>
  )
}

export default Doacoes