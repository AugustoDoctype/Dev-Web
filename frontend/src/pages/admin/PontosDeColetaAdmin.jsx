import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'mock_pontos_coleta'

const PONTOS_INICIAIS = [
  {
    id: '1',
    nome: 'Ponto de Coleta - Centro',
    endereco: 'Centro, Manaus - AM',
    horario: 'Seg a Sex, 08h às 17h',
    materiais: 'Eletrônicos, pilhas e baterias',
    status: 'Ativo',
  },
  {
    id: '2',
    nome: 'Ponto de Coleta - Adrianópolis',
    endereco: 'Adrianópolis, Manaus - AM',
    horario: 'Seg a Sáb, 09h às 18h',
    materiais: 'Celulares e computadores',
    status: 'Ativo',
  },
  {
    id: '3',
    nome: 'Ponto de Coleta - Cidade Nova',
    endereco: 'Cidade Nova, Manaus - AM',
    horario: 'Seg a Sex, 08h às 16h',
    materiais: 'Eletrônicos em geral',
    status: 'Inativo',
  },
]

const FORM_VAZIO = {
  nome: '',
  endereco: '',
  horario: '',
  materiais: '',
  status: 'Ativo',
}

export default function PontosDeColetaAdmin() {
  const navigate = useNavigate()

  const [pontos, setPontos] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [formulario, setFormulario] = useState(FORM_VAZIO)
  const [editandoId, setEditandoId] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState('sucesso')

  useEffect(() => {
    try {
      const salvos = localStorage.getItem(STORAGE_KEY)

      if (salvos !== null) {
        setPontos(JSON.parse(salvos))
      } else {
        setPontos(PONTOS_INICIAIS)
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(PONTOS_INICIAIS),
        )
      }
    } catch {
      setPontos(PONTOS_INICIAIS)
      setMensagem('Não foi possível ler os dados salvos.')
      setTipoMensagem('erro')
    }
  }, [])

  function salvarPontos(novosPontos) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novosPontos))
      setPontos(novosPontos)
      setMensagem('Alterações salvas neste navegador.')
      setTipoMensagem('sucesso')
      return true
    } catch {
      setMensagem('Não foi possível salvar os dados no navegador.')
      setTipoMensagem('erro')
      return false
    }
  }

  function abrirNovoPonto() {
    setFormulario(FORM_VAZIO)
    setEditandoId(null)
    setMostrarFormulario(true)
    setMensagem('')
  }

  function abrirEdicao(ponto) {
    setFormulario({
      nome: ponto.nome || '',
      endereco: ponto.endereco || '',
      horario: ponto.horario || '',
      materiais: ponto.materiais || '',
      status: ponto.status || 'Ativo',
    })

    setEditandoId(ponto.id)
    setMostrarFormulario(true)
    setMensagem('')
  }

  function atualizarCampo(event) {
    const { name, value } = event.target

    setFormulario((atual) => ({
      ...atual,
      [name]: value,
    }))
  }

  function enviarFormulario(event) {
    event.preventDefault()

    const nome = formulario.nome.trim()
    const endereco = formulario.endereco.trim()
    const horario = formulario.horario.trim()
    const materiais = formulario.materiais.trim()

    if (!nome || !endereco || !horario || !materiais) {
      setMensagem('Preencha todos os campos antes de continuar.')
      setTipoMensagem('erro')
      return
    }

    const dados = {
      ...formulario,
      nome,
      endereco,
      horario,
      materiais,
    }

    let novosPontos

    if (editandoId) {
      novosPontos = pontos.map((ponto) =>
        ponto.id === editandoId
          ? { ...ponto, ...dados }
          : ponto,
      )
    } else {
      const novoPonto = {
        ...dados,
        id: `${Date.now()}`,
      }

      novosPontos = [...pontos, novoPonto]
    }

    if (salvarPontos(novosPontos)) {
      setFormulario(FORM_VAZIO)
      setEditandoId(null)
      setMostrarFormulario(false)
    }
  }

  function excluirPonto(id) {
    const confirmado = window.confirm(
      'Tem certeza de que deseja excluir este ponto de coleta?',
    )

    if (!confirmado) return

    salvarPontos(pontos.filter((ponto) => ponto.id !== id))
  }

  const pontosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim()

    return pontos.filter((ponto) => {
      const correspondeBusca = [
        ponto.nome,
        ponto.endereco,
        ponto.materiais,
      ].some((valor) =>
        String(valor || '').toLowerCase().includes(termo),
      )

      const correspondeStatus =
        filtroStatus === 'Todos' || ponto.status === filtroStatus

      return correspondeBusca && correspondeStatus
    })
  }, [pontos, busca, filtroStatus])

  const ativos = pontos.filter(
    (ponto) => ponto.status === 'Ativo',
  ).length

  const inativos = pontos.filter(
    (ponto) => ponto.status === 'Inativo',
  ).length

  function sair() {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  function fecharFormulario() {
    setMostrarFormulario(false)
    setFormulario(FORM_VAZIO)
    setEditandoId(null)
  }

  return (
    <div className="min-h-screen bg-[#0b110e] text-slate-100">
      {/* Menu lateral */}

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/5 bg-[#0e1712] p-6 md:flex">
        <button
          type="button"
          onClick={() => navigate('/admin/dashboard')}
          className="mb-10 text-left"
        >
          <span className="text-2xl font-extrabold tracking-tight text-white">
            <span className="text-emerald-400">E-</span>Ciclo
          </span>

          <span className="mt-1 block text-xs text-slate-500">
            Painel administrativo
          </span>
        </button>

        <p className="mb-3 px-4 text-xs font-bold uppercase tracking-widest text-slate-600">
          Menu principal
        </p>

        <nav className="space-y-2">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <span className="mr-3">▦</span>
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/doacoes')}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <span className="mr-3">♻</span>
            Doações
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/pontos-de-coleta')}
            className="w-full rounded-xl bg-emerald-400/10 px-4 py-3 text-left text-sm font-bold text-emerald-300 ring-1 ring-inset ring-emerald-400/10"
          >
            <span className="mr-3">⌖</span>
            Pontos de coleta
          </button>
        </nav>

        <div className="mt-auto border-t border-white/5 pt-5">
          <button
            type="button"
            onClick={sair}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-red-400/10 hover:text-red-300"
          >
            <span className="mr-3">↪</span>
            Sair do painel
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}

      <main className="mx-auto min-h-screen max-w-7xl px-5 py-7 sm:px-8 sm:py-9 md:ml-64 md:px-10">
        {/* Cabeçalho */}

        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Administração / Locais
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Pontos de coleta
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Cadastre, organize e acompanhe os locais de recebimento
              de resíduos eletrônicos.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirNovoPonto}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-extrabold text-[#0b110e] transition hover:bg-emerald-300"
          >
            <span className="text-lg">+</span>
            Novo ponto
          </button>
        </header>

        {/* Indicadores */}

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-[#111b16] p-5 transition hover:border-emerald-400/20 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Total de pontos
              </p>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-xl">
                ⌖
              </span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-white">
              {pontos.length}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Locais cadastrados no sistema
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#111b16] p-5 transition hover:border-emerald-400/20 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Pontos ativos
              </p>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-xl text-emerald-300">
                ✓
              </span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-emerald-300">
              {ativos}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Disponíveis no cadastro
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#111b16] p-5 transition hover:border-amber-400/20 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Pontos inativos
              </p>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-xl text-amber-300">
                ◷
              </span>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-amber-300">
              {inativos}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Indisponíveis no momento
            </p>
          </div>
        </section>

        {/* Formulário */}

        {mostrarFormulario && (
          <section className="mb-8 rounded-2xl border border-emerald-400/20 bg-[#111b16] p-5 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                  {editandoId ? 'Editar cadastro' : 'Novo cadastro'}
                </p>

                <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                  {editandoId
                    ? 'Editar ponto de coleta'
                    : 'Cadastrar ponto de coleta'}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Preencha as informações do local abaixo.
                </p>
              </div>

              <button
                type="button"
                onClick={fecharFormulario}
                aria-label="Fechar formulário"
                className="rounded-xl border border-white/10 px-3 py-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={enviarFormulario}
              className="grid gap-5 sm:grid-cols-2"
            >
              <label className="text-sm font-semibold text-slate-300">
                Nome do ponto
                <input
                  name="nome"
                  value={formulario.nome}
                  onChange={atualizarCampo}
                  placeholder="Ex.: Ponto de coleta Centro"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm font-normal text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                  required
                />
              </label>

              <label className="text-sm font-semibold text-slate-300">
                Endereço
                <input
                  name="endereco"
                  value={formulario.endereco}
                  onChange={atualizarCampo}
                  placeholder="Rua, número, bairro e cidade"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm font-normal text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                  required
                />
              </label>

              <label className="text-sm font-semibold text-slate-300">
                Horário de funcionamento
                <input
                  name="horario"
                  value={formulario.horario}
                  onChange={atualizarCampo}
                  placeholder="Ex.: Seg a Sex, 08h às 17h"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm font-normal text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                  required
                />
              </label>

              <label className="text-sm font-semibold text-slate-300">
                Materiais aceitos
                <input
                  name="materiais"
                  value={formulario.materiais}
                  onChange={atualizarCampo}
                  placeholder="Ex.: Celulares, computadores e pilhas"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm font-normal text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                  required
                />
              </label>

              <label className="text-sm font-semibold text-slate-300 sm:col-span-2">
                Status do ponto
                <select
                  name="status"
                  value={formulario.status}
                  onChange={atualizarCampo}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm font-normal text-white outline-none transition focus:border-emerald-400/50"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </label>

              <div className="flex flex-wrap gap-3 pt-1 sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-extrabold text-[#0b110e] transition hover:bg-emerald-300"
                >
                  {editandoId ? 'Salvar alterações' : 'Cadastrar ponto'}
                </button>

                <button
                  type="button"
                  onClick={fecharFormulario}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Mensagens */}

        {mensagem && (
          <div
            role="status"
            className={`mb-5 rounded-xl border p-4 text-sm font-medium ${
              tipoMensagem === 'erro'
                ? 'border-red-400/20 bg-red-400/10 text-red-300'
                : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
            }`}
          >
            {mensagem}
          </div>
        )}

        {/* Lista de pontos */}

        <section className="overflow-hidden rounded-2xl border border-white/5 bg-[#111b16]">
          <div className="flex flex-col gap-5 border-b border-white/5 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-white">
                Locais cadastrados
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Consulte e gerencie os pontos de recebimento.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar nome, endereço..."
                aria-label="Buscar ponto de coleta"
                className="min-w-0 rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 sm:w-64"
              />

              <select
                value={filtroStatus}
                onChange={(event) => setFiltroStatus(event.target.value)}
                aria-label="Filtrar por status"
                className="rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/50"
              >
                <option value="Todos">Todos os status</option>
                <option value="Ativo">Ativos</option>
                <option value="Inativo">Inativos</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-3 sm:px-6">
            <p className="text-xs text-slate-500">
              Exibindo{' '}
              <span className="font-bold text-slate-300">
                {pontosFiltrados.length}
              </span>{' '}
              de {pontos.length} ponto(s)
            </p>

            {(busca || filtroStatus !== 'Todos') && (
              <button
                type="button"
                onClick={() => {
                  setBusca('')
                  setFiltroStatus('Todos')
                }}
                className="text-xs font-bold text-emerald-400 transition hover:text-emerald-300"
              >
                Limpar filtros ×
              </button>
            )}
          </div>

          {pontosFiltrados.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-3xl">
                ⌖
              </div>

              <h3 className="text-lg font-bold text-white">
                Nenhum ponto encontrado
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Não encontramos locais com esses critérios. Altere os
                filtros ou cadastre um novo ponto de coleta.
              </p>

              <button
                type="button"
                onClick={abrirNovoPonto}
                className="mt-5 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-[#0b110e] transition hover:bg-emerald-300"
              >
                + Cadastrar ponto
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-white/[0.025]">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-6">
                      Ponto de coleta
                    </th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Horário
                    </th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Materiais aceitos
                    </th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {pontosFiltrados.map((ponto) => (
                    <tr
                      key={ponto.id}
                      className="transition hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-5 sm:px-6">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-300">
                            ⌖
                          </div>

                          <div>
                            <p className="font-bold text-slate-100">
                              {ponto.nome || 'Ponto sem nome'}
                            </p>

                            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                              {ponto.endereco || 'Endereço não informado'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-slate-400">
                        {ponto.horario || 'Não informado'}
                      </td>

                      <td className="max-w-xs px-5 py-5 leading-6 text-slate-400">
                        {ponto.materiais || 'Não informado'}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                            ponto.status === 'Ativo'
                              ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                              : 'border-amber-400/20 bg-amber-400/10 text-amber-300'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              ponto.status === 'Ativo'
                                ? 'bg-emerald-400'
                                : 'bg-amber-400'
                            }`}
                          />
                          {ponto.status || 'Sem status'}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => abrirEdicao(ponto)}
                            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => excluirPonto(ponto.id)}
                            className="rounded-lg border border-red-400/10 bg-red-400/5 px-3 py-2 text-xs font-bold text-red-300 transition hover:border-red-400/30 hover:bg-red-400/10"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="mt-6 flex flex-col gap-2 text-center text-xs text-slate-600 sm:flex-row sm:justify-between sm:text-left">
          <p>E-Ciclo · Painel administrativo</p>
          <p>Os dados desta demonstração são salvos neste navegador.</p>
        </footer>
      </main>
    </div>
  )
}