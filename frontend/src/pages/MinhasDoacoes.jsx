import { useEffect, useState } from 'react'
import Navbar from '../components/public/Navbar'
import { apiFetch } from '../services/api'
import { Link } from 'react-router-dom'

export default function MinhasDoacoes() {
  const [codigo, setCodigo] = useState('')
  const [doacoes, setDoacoes] = useState([])
  const [loading, setLoading] = useState(false)
  const [buscou, setBuscou] = useState(false)
  const [erro, setErro] = useState('')
  const [doadorLogado, setDoadorLogado] = useState(
  () => Boolean(localStorage.getItem('doadorToken'))
)

  // Lê o tema selecionado na Navbar.
  const [tema, setTema] = useState(() =>
    localStorage.getItem('eciclo-tema') === 'claro' ? 'claro' : 'escuro'
  )

  const modoClaro = tema === 'claro'

  // Atualiza a página imediatamente quando o tema muda na Navbar.
  useEffect(() => {
    function atualizarTema(evento) {
      setTema(evento.detail === 'claro' ? 'claro' : 'escuro')
    }

    window.addEventListener('eciclo-tema-alterado', atualizarTema)

    return () => {
      window.removeEventListener('eciclo-tema-alterado', atualizarTema)
    }
  }, [])


  // ============================================================
  // SINCRONIZAÇÃO DA AUTENTICAÇÃO
  // ============================================================
  useEffect(() => {
    function atualizarAutenticacao() {
      setDoadorLogado(
        Boolean(localStorage.getItem('doadorToken'))
      )
    }

    window.addEventListener(
      'eciclo-auth-alterado',
      atualizarAutenticacao
    )
    window.addEventListener('storage', atualizarAutenticacao)

    return () => {
      window.removeEventListener(
        'eciclo-auth-alterado',
        atualizarAutenticacao
      )
      window.removeEventListener('storage', atualizarAutenticacao)
    }
  }, [])

  // ============================================================
  // HISTÓRICO AUTOMÁTICO DO DOADOR
  // ============================================================
  useEffect(() => {
    if (!doadorLogado) return

    let ativo = true

    async function carregarHistorico() {
      setLoading(true)
      setErro('')
      setBuscou(false)

      try {
        const resposta = await apiFetch(
          '/doadores/me/equipamentos',
          { auth: 'doador' }
        )

        if (!ativo) return

        if (!Array.isArray(resposta?.dados)) {
          throw new Error('Resposta inválida do servidor.')
        }

        const equipamentos = resposta.dados.map((item) => ({
          id: item.id,
          codigoAcompanhamento: item.codigoAcompanhamento,
          equipamento:
            item.descricao?.split(' - ')[0] ||
            item.categoria ||
            'Equipamento eletrônico',
          categoria: item.categoria,
          status: item.status,
          createdAt: item.criadoEm,
        }))

        setDoacoes(equipamentos)
        setBuscou(true)
      } catch (error) {
        if (ativo) {
          setErro(
            error.message ||
            'Não foi possível carregar suas doações.'
          )
          setDoacoes([])
        }
      } finally {
        if (ativo) setLoading(false)
      }
    }

    carregarHistorico()

    return () => {
      ativo = false
    }
  }, [doadorLogado])



async function handleBuscar(event) {
  event.preventDefault()

  const codigoNormalizado = codigo.trim().toUpperCase()

  if (!/^[0-9A-F]{32}$/.test(codigoNormalizado)) {
    setErro('Informe um código de acompanhamento válido.')
    setBuscou(false)
    setDoacoes([])
    return
  }

  setLoading(true)
  setErro('')
  setBuscou(true)
  setDoacoes([])

  try {
    const resposta = await apiFetch(
  `/acompanhamento/${encodeURIComponent(codigoNormalizado)}`,
  { auth: 'none' }
)
    if (!resposta?.dados) {
      throw new Error('Não foi possível obter a doação.')
    }

    const equipamento = resposta.dados

    // Adaptamos a resposta ao formato já usado pelo layout.
    setDoacoes([
      {
        id: codigoNormalizado,
        equipamento: 'Equipamento eletrônico',
        categoria: equipamento.categoria,
        status: equipamento.status,
        createdAt: equipamento.criadoEm,
        codigoAcompanhamento: codigoNormalizado,
      },
    ])
  } catch (error) {
    setErro(
      error.message || 'Não foi possível consultar a doação.'
    )
    setDoacoes([])
  } finally {
    setLoading(false)
  }
}


  const renderStatusTag = (status) => {
    const mapa = {
      PENDENTE: {
        label: 'Pendente',
        className: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
        icone: '◷',
      },
      EM_ANALISE: {
        label: 'Em análise',
        className: 'border-blue-400/20 bg-blue-400/10 text-blue-300',
        icone: '⌕',
      },
      AGUARDANDO_COLETA: {
        label: 'Aguardando coleta',
        className: 'border-purple-400/20 bg-purple-400/10 text-purple-300',
        icone: '⌖',
      },
      CONCLUIDO: {
        label: 'Concluído',
        className: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
        icone: '✓',
      },
      CANCELADO: {
        label: 'Cancelado',
        className: 'border-red-400/20 bg-red-400/10 text-red-300',
        icone: '×',
      },
    }

    const config = mapa[status] || {
      label: status || 'Status indisponível',
      className: 'border-white/10 bg-white/5 text-slate-300',
      icone: '•',
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${config.className}`}
      >
        <span aria-hidden="true">{config.icone}</span>
        {config.label}
      </span>
    )
  }

  const contarStatus = (status) => {
    return doacoes.filter((item) => item.status === status).length
  }

  return (
    <div
      className={`ec-polish ec-polish--minhas minhas-doacoes-page min-h-screen font-sans transition-colors duration-300 ${
        modoClaro ? 'tema-claro' : 'tema-escuro'
      }`}
    >
      <style>{`
        .minhas-doacoes-page {
          background-color: #0b110e;
          color: #f1f5f9;
        }

        /* Fundo geral e superfícies */
        .minhas-doacoes-page.tema-claro {
          background-color: #f8fafc;
          color: #0f172a;
        }

        .minhas-doacoes-page.tema-claro [class~="bg-[#0b110e]"],
        .minhas-doacoes-page.tema-claro [class~="bg-[#111b16]"],
        .minhas-doacoes-page.tema-claro [class~="bg-[#0d1510]"],
        .minhas-doacoes-page.tema-claro [class~="bg-[#101b14]"] {
          background-color: #ffffff !important;
        }

        .minhas-doacoes-page.tema-claro [class~="bg-white/[0.025]"],
        .minhas-doacoes-page.tema-claro [class~="bg-white/[0.02]"],
        .minhas-doacoes-page.tema-claro [class~="bg-white/[0.03]"],
        .minhas-doacoes-page.tema-claro [class~="bg-white/[0.04]"],
        .minhas-doacoes-page.tema-claro [class~="bg-white/5"] {
          background-color: #f1f5f9 !important;
        }

        /* Textos principais */
        .minhas-doacoes-page.tema-claro [class~="text-white"],
        .minhas-doacoes-page.tema-claro [class~="text-slate-100"],
        .minhas-doacoes-page.tema-claro [class~="text-slate-200"] {
          color: #0f172a !important;
        }

        .minhas-doacoes-page.tema-claro [class~="text-slate-300"] {
          color: #334155 !important;
        }

        .minhas-doacoes-page.tema-claro [class~="text-slate-400"] {
          color: #475569 !important;
        }

        .minhas-doacoes-page.tema-claro [class~="text-slate-500"] {
          color: #64748b !important;
        }

        .minhas-doacoes-page.tema-claro [class~="text-slate-600"] {
          color: #64748b !important;
        }

        /* Campos de formulário */
        .minhas-doacoes-page.tema-claro input {
          color: #0f172a !important;
          background-color: #ffffff !important;
          border-color: #cbd5e1 !important;
        }

        .minhas-doacoes-page.tema-claro input::placeholder {
          color: #94a3b8 !important;
        }

        /* Bordas dos cartões e separadores */
        .minhas-doacoes-page.tema-claro [class~="border-white/[0.08]"],
        .minhas-doacoes-page.tema-claro [class~="border-white/[0.07]"],
        .minhas-doacoes-page.tema-claro [class~="border-white/[0.06]"],
        .minhas-doacoes-page.tema-claro [class~="border-white/[0.12]"],
        .minhas-doacoes-page.tema-claro [class~="border-white/10"] {
          border-color: #e2e8f0 !important;
        }

        /* Botões neutros */
        .minhas-doacoes-page.tema-claro [class~="hover:bg-[#101b14]"]:hover {
          background-color: #f1f5f9 !important;
        }

        .minhas-doacoes-page.tema-claro [class~="hover:border-emerald-400/20"]:hover {
          border-color: #6ee7b7 !important;
        }

        /* Mantém o texto escuro dos botões verdes */
        .minhas-doacoes-page.tema-claro [class~="text-[#07120b]"] {
          color: #07120b !important;
        }

        /* Acessibilidade por teclado */
        .minhas-doacoes-page :is(button, a, input):focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 3px;
        }
      `}</style>

      <Navbar />

      <main className="relative min-h-[calc(100vh-80px)] overflow-hidden px-5 py-10 sm:px-8 sm:py-14">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-emerald-500/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-96 h-80 w-80 rounded-full bg-teal-500/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          {/* Cabeçalho */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <span aria-hidden="true">♻️</span>
              Área do doador
            </span>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Minhas <span className="text-emerald-400">doações.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {doadorLogado
                ? 'Confira suas doações registradas, acompanhe o status de cada equipamento e acesse os detalhes de cada registro.'
                : 'Digite o código gerado após registrar uma doação para consultar seu andamento, mesmo sem entrar na conta.'}
            </p>
          </div>

          {/* Formulário de consulta */}
          <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111b16] shadow-2xl shadow-black/10">
            {!doadorLogado && (
            <div className="border-b border-white/[0.07] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-2xl">
                  🔎
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-white sm:text-xl">
                    Consultar uma doação
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Utilize o código gerado ao concluir o registro da doação.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleBuscar}
                className="mt-6 flex flex-col gap-3 sm:flex-row"
              >
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="codigo"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Código de Acompanhamento
                  </label>

                  <input
                    id="codigo"
                    name="codigo"
                    type="text"
                    maxLength={32}
                    placeholder="Digite seu código de acompanhamento"
                    value={codigo}
                    onChange={(event) =>
                      setCodigo(event.target.value.toUpperCase())
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                  />
                </div>

                <div className="sm:self-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-extrabold text-[#07120b] transition duration-300 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#07120b]/30 border-t-[#07120b]" />
                        Consultando...
                      </>
                    ) : (
                      <>
                        Consultar
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                🔒 O código permite consultar as informações públicas de acompanhamento.
                Guarde-o em local seguro.
              </p>
            </div>
            )}

            {/* Mensagem de erro */}
            {erro && (
              <div
                role="alert"
                className="mx-6 mt-6 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-4 text-sm leading-6 text-red-300 sm:mx-8"
              >
                <p className="font-bold">
                  Não foi possível concluir a consulta
                </p>
                <p className="mt-1">{erro}</p>
              </div>
            )}

            {/* Carregamento */}
            {loading && (
              <div className="px-6 py-12 text-center sm:px-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10">
                  <span className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />
                </div>

                <h3 className="mt-5 font-bold text-white">
                  Buscando suas doações
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Estamos consultando os registros cadastrados.
                </p>
              </div>
            )}

            {/* Resultado da consulta */}
            {buscou && !loading && !erro && doacoes.length > 0 && (
              <div className="p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">
                      {doadorLogado ? 'Histórico atualizado' : 'Consulta concluída'}
                    </p>

                    <h2 className="mt-1 text-2xl font-extrabold text-white">
                      Suas doações
                    </h2>

                   <p className="mt-1 text-sm text-slate-400">
                 {doadorLogado
                  ? `Você possui ${doacoes.length} ${
                    doacoes.length === 1 ? 'doação cadastrada' : 'doações cadastradas'
                    }.`
                   : 'Resultado da consulta pelo código de acompanhamento.'}
                    </p>
                  </div>

                  <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-300">
                    <span aria-hidden="true">♻️</span>
                    {doacoes.length}{' '}
                    {doacoes.length === 1 ? 'doação' : 'doações'}
                  </span>
                </div>

                {/* Resumo por status */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-amber-300" />
                      Pendentes
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-amber-300">
                      {contarStatus('PENDENTE')}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-blue-300" />
                      Em análise
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-blue-300">
                      {contarStatus('EM_ANALISE')}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-purple-300" />
                      Aguardando coleta
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-purple-300">
                      {contarStatus('AGUARDANDO_COLETA')}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-300" />
                      Concluídas
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-emerald-300">
                      {contarStatus('CONCLUIDO')}
                    </p>
                  </div>
                </div>

                {/* Lista */}
                <div className="mt-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Histórico de registros
                  </h3>

                  <div className="mt-4 space-y-3">
                    {doacoes.map((item) => (

                      <article
                        key={item.id}
                        className="rounded-2xl border border-white/[0.08] bg-[#0d1510] p-5 transition duration-300 hover:border-emerald-400/20 hover:bg-[#101b14]"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.07] text-2xl">
                              💻
                            </div>

                            <div className="min-w-0">
                              <h4 className="break-words font-extrabold text-white">
                                {item.equipamento || 'Equipamento não informado'}
                              </h4>

                              <span className="mt-2 inline-flex rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-slate-300">
                                {item.categoria || 'Categoria não informada'}
                              </span>

                              <p className="mt-3 text-xs font-medium text-slate-400">
                                Cadastrado em:{' '}
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleDateString(
                                      'pt-BR',
                                    )
                                  : 'Data não informada'}
                              </p>
                            {item.codigoAcompanhamento ? (
                              <Link
                                to={`/minhas-doacoes/${item.codigoAcompanhamento}`}
                                className="mt-3 inline-block text-sm font-semibold text-emerald-400 hover:underline"
                              >
                                Ver detalhes →
                              </Link>
                            ) : (
                              <p className="mt-3 text-xs text-slate-500">
                                Código de acompanhamento indisponível
                              </p>
                            )}
                            </div>
                          </div>

                          <div className="flex shrink-0 sm:justify-end">
                            {renderStatusTag(item.status)}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Nenhum resultado */}
            {buscou && !loading && !erro && doacoes.length === 0 && (
              <div className="px-6 py-12 text-center sm:px-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-3xl">
                  📭
                </div>

                <h3 className="mt-5 text-lg font-extrabold text-white">
                  Nenhuma doação encontrada
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                {doadorLogado
                ? 'Você ainda não cadastrou nenhuma doação. Cadastre seu primeiro equipamento para começar.'
                : 'Não encontramos doações vinculadas ao código de acompanhamento informado. Confira os dados e tente novamente.'}
                </p>


                {!doadorLogado && (
                <button
                type="button"
                onClick={() => {
                  setCodigo('')
                  setBuscou(false)
                  setErro('')
                  setDoacoes([])
                }}
                className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-emerald-400/30 hover:text-emerald-300"
              >
                Tentar outro código
              </button>
)}

              </div>
            )}

            {/* Estado inicial */}
            {!buscou && !loading && (
              <div className="border-t border-white/[0.06] px-6 py-8 sm:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-xl">
                    💡
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-200">
                      Como funciona?
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Digite o código gerado após registrar a doação e clique em Consultar.
                      Você verá o status e os dados públicos de acompanhamento.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Ação secundária */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:flex-row">
            <div>
              <p className="font-bold text-white">
                Quer registrar uma nova doação?
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Ajude a dar um destino mais responsável aos eletrônicos.
              </p>
            </div>

            <Link
              to="/doar"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-extrabold text-[#07120b] transition hover:bg-emerald-400"
            >
              Fazer uma doação
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
