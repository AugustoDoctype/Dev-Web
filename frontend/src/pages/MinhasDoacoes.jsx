
import { useState } from 'react'
import Navbar from '../components/public/Navbar'
import { apiFetch } from '../services/api'

export default function MinhasDoacoes() {
  const [cpf, setCpf] = useState('')
  const [doacoes, setDoacoes] = useState([])
  const [loading, setLoading] = useState(false)
  const [buscou, setBuscou] = useState(false)
  const [erro, setErro] = useState('')

  const aplicarMascaraCPF = (valor) => {
    return valor
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  const handleCpfChange = (e) => {
    setCpf(aplicarMascaraCPF(e.target.value))
  }

  const handleBuscar = async (e) => {
    e.preventDefault()

    const cpfLimpo = cpf.replace(/\D/g, '')

    if (cpfLimpo.length !== 11) {
      setErro('Informe um CPF com 11 dígitos.')
      setBuscou(false)
      setDoacoes([])
      return
    }

    setLoading(true)
    setErro('')
    setBuscou(true)
    setDoacoes([])

    try {
      const dados = await apiFetch(`/doacoes/usuario/${cpfLimpo}`)
      setDoacoes(Array.isArray(dados) ? dados : [])
    } catch (err) {
      setErro(err.message || 'Não foi possível consultar suas doações.')
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
    <div className="min-h-screen bg-[#0b110e] font-sans text-slate-100">
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

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Acompanhe o andamento das suas doações de eletrônicos.
              Informe o CPF utilizado no cadastro para consultar os
              registros e verificar o status de cada equipamento.
            </p>
          </div>

          {/* Formulário de consulta */}
          <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111b16] shadow-2xl shadow-black/10">
            <div className="border-b border-white/[0.07] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-2xl">
                  🔎
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-white sm:text-xl">
                    Consultar minhas doações
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Utilize o CPF informado no momento do cadastro.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleBuscar}
                className="mt-6 flex flex-col gap-3 sm:flex-row"
              >
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="cpf"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    CPF do doador
                  </label>

                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    required
                    maxLength={14}
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCpfChange}
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
                🔒 O CPF é utilizado para localizar as doações
                vinculadas ao cadastro.
              </p>
            </div>

            {/* Mensagem de erro */}
            {erro && (
              <div
                role="alert"
                className="mx-6 mt-6 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-4 text-sm leading-6 text-red-300 sm:mx-8"
              >
                <p className="font-bold">Não foi possível concluir a consulta</p>
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
                      Consulta concluída
                    </p>

                    <h2 className="mt-1 text-2xl font-extrabold text-white">
                      Suas doações
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {doacoes.length === 1
                        ? 'Encontramos 1 registro vinculado ao CPF.'
                        : `Encontramos ${doacoes.length} registros vinculados ao CPF.`}
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
                    <p className="text-xs font-semibold text-slate-400">
                      Pendentes
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-amber-300">
                      {contarStatus('PENDENTE')}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <p className="text-xs font-semibold text-slate-400">
                      Em análise
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-blue-300">
                      {contarStatus('EM_ANALISE')}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <p className="text-xs font-semibold text-slate-400">
                      Aguardando coleta
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-purple-300">
                      {contarStatus('AGUARDANDO_COLETA')}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <p className="text-xs font-semibold text-slate-400">
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

                              <p className="mt-3 text-xs text-slate-500">
                                Cadastrado em:{' '}
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleDateString(
                                      'pt-BR',
                                    )
                                  : 'Data não informada'}
                              </p>
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
                  Não encontramos doações vinculadas ao CPF informado.
                  Confira os dados e tente novamente.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setCpf('')
                    setBuscou(false)
                    setErro('')
                    setDoacoes([])
                  }}
                  className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-emerald-400/30 hover:text-emerald-300"
                >
                  Tentar outro CPF
                </button>
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
                      Informe seu CPF e clique em Consultar. Se houver
                      registros associados, você verá os equipamentos e
                      o status de cada doação nesta página.
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

            <a
              href="/doar"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-extrabold text-[#07120b] transition hover:bg-emerald-400"
            >
              Fazer uma doação
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
