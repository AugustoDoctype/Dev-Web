import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../tema.css'

const STORAGE_KEY = 'mock_pontos_coleta'

const PONTOS_INICIAIS = [
  {
    id: 1,
    nome: 'Ecoponto Centro',
    endereco: 'Centro, Manaus - AM',
    horario: 'Segunda a sexta, 8h às 17h',
    materiais: ['Plástico', 'Papel', 'Metal'],
    status: 'Ativo',
  },
  {
    id: 2,
    nome: 'Ponto de Coleta Adrianópolis',
    endereco: 'Adrianópolis, Manaus - AM',
    horario: 'Segunda a sábado, 8h às 18h',
    materiais: ['Plástico', 'Vidro', 'Papel'],
    status: 'Ativo',
  },
  {
    id: 3,
    nome: 'Ecoponto Zona Leste',
    endereco: 'Zona Leste, Manaus - AM',
    horario: 'Segunda a sexta, 9h às 16h',
    materiais: ['Metal', 'Eletrônicos', 'Plástico'],
    status: 'Inativo',
  },
]

const FORM_VAZIO = {
  nome: '',
  endereco: '',
  horario: '',
  materiais: [],
  status: 'Ativo',
}

const MATERIAIS_DISPONIVEIS = [
  'Plástico',
  'Papel',
  'Papelão',
  'Vidro',
  'Metal',
  'Eletrônicos',
  'Óleo de cozinha',
  'Pilhas e baterias',
]

function normalizarMateriais(materiais) {
  if (Array.isArray(materiais)) {
    return materiais.filter(
      (material) => typeof material === 'string',
    )
  }

  if (typeof materiais === 'string') {
    return materiais
      .split(',')
      .map((material) => material.trim())
      .filter(Boolean)
  }

  return []
}

function normalizarPonto(ponto, indice = 0) {
  const dados =
    ponto && typeof ponto === 'object' && !Array.isArray(ponto)
      ? ponto
      : {}

  return {
    ...dados,
    id: dados.id ?? Date.now() + indice,
    nome: typeof dados.nome === 'string' ? dados.nome : '',
    endereco:
      typeof dados.endereco === 'string' ? dados.endereco : '',
    horario:
      typeof dados.horario === 'string' ? dados.horario : '',
    materiais: normalizarMateriais(dados.materiais),
    status: dados.status === 'Inativo' ? 'Inativo' : 'Ativo',
  }
}

function carregarPontos() {
  try {
    const salvos = localStorage.getItem(STORAGE_KEY)

    if (!salvos) {
      return PONTOS_INICIAIS.map(normalizarPonto)
    }

    const dados = JSON.parse(salvos)

    if (!Array.isArray(dados)) {
      return PONTOS_INICIAIS.map(normalizarPonto)
    }

    return dados.map((ponto, indice) =>
      normalizarPonto(ponto, indice),
    )
  } catch (erro) {
    console.error(
      'Não foi possível carregar os pontos de coleta:',
      erro,
    )

    return PONTOS_INICIAIS.map(normalizarPonto)
  }
}

export default function PontosDeColetaAdmin() {
  const navigate = useNavigate()

  const [tema, setTema] = useState(() =>
    localStorage.getItem('eciclo-tema') === 'claro'
      ? 'claro'
      : 'escuro',
  )

  const [pontos, setPontos] = useState(carregarPontos)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [modalAberto, setModalAberto] = useState(false)
  const [pontoEditando, setPontoEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erro, setErro] = useState('')

  const modoClaro = tema === 'claro'

  useEffect(() => {
    function atualizarTema(evento) {
      const novoTema =
        evento?.detail ||
        (localStorage.getItem('eciclo-tema') === 'claro'
          ? 'claro'
          : 'escuro')

      setTema(novoTema)
    }

    atualizarTema()

    window.addEventListener(
      'eciclo-tema-alterado',
      atualizarTema,
    )

    return () => {
      window.removeEventListener(
        'eciclo-tema-alterado',
        atualizarTema,
      )
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pontos))
    } catch (erro) {
      console.error(
        'Não foi possível salvar os pontos de coleta:',
        erro,
      )
    }
  }, [pontos])

  useEffect(() => {
    function fecharComEscape(evento) {
      if (evento.key === 'Escape' && modalAberto) {
        fecharModal()
      }
    }

    window.addEventListener('keydown', fecharComEscape)

    return () => {
      window.removeEventListener('keydown', fecharComEscape)
    }
  }, [modalAberto])

  function alternarTema() {
    const novoTema = modoClaro ? 'escuro' : 'claro'

    localStorage.setItem('eciclo-tema', novoTema)

    document.documentElement.classList.toggle(
      'dark',
      novoTema === 'escuro',
    )

    document.documentElement.style.colorScheme =
      novoTema === 'escuro' ? 'dark' : 'light'

    setTema(novoTema)

    window.dispatchEvent(
      new CustomEvent('eciclo-tema-alterado', {
        detail: novoTema,
      }),
    )
  }

  function sair() {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  const pontosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    return pontos.filter((ponto) => {
      const materiais = normalizarMateriais(ponto.materiais)

      const correspondeBusca =
        !termo ||
        ponto.nome.toLowerCase().includes(termo) ||
        ponto.endereco.toLowerCase().includes(termo) ||
        materiais.some((material) =>
          material.toLowerCase().includes(termo),
        )

      const correspondeStatus =
        filtroStatus === 'Todos' ||
        ponto.status === filtroStatus

      return correspondeBusca && correspondeStatus
    })
  }, [pontos, busca, filtroStatus])

  const totalAtivos = pontos.filter(
    (ponto) => ponto.status === 'Ativo',
  ).length

  const totalInativos = pontos.filter(
    (ponto) => ponto.status === 'Inativo',
  ).length

  function abrirNovoPonto() {
    setPontoEditando(null)
    setForm({ ...FORM_VAZIO, materiais: [] })
    setErro('')
    setModalAberto(true)
  }

  function abrirEdicao(ponto) {
    setPontoEditando(ponto)

    setForm({
      nome: ponto.nome,
      endereco: ponto.endereco,
      horario: ponto.horario,
      materiais: normalizarMateriais(ponto.materiais),
      status: ponto.status,
    })

    setErro('')
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setPontoEditando(null)
    setForm({ ...FORM_VAZIO, materiais: [] })
    setErro('')
  }

  function atualizarCampo(campo, valor) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }))
  }

  function alternarMaterial(material) {
    setForm((anterior) => {
      const selecionados = normalizarMateriais(
        anterior.materiais,
      )

      const atualizados = selecionados.includes(material)
        ? selecionados.filter((item) => item !== material)
        : [...selecionados, material]

      return {
        ...anterior,
        materiais: atualizados,
      }
    })
  }

  function salvarPonto(evento) {
    evento.preventDefault()

    if (!form.nome.trim() || !form.endereco.trim()) {
      setErro('Preencha o nome e o endereço do ponto de coleta.')
      return
    }

    const materiais = normalizarMateriais(form.materiais)

    if (materiais.length === 0) {
      setErro('Selecione pelo menos um material aceito.')
      return
    }

    const dadosPonto = {
      ...form,
      nome: form.nome.trim(),
      endereco: form.endereco.trim(),
      horario: form.horario.trim(),
      materiais,
    }

    if (pontoEditando) {
      setPontos((anteriores) =>
        anteriores.map((ponto) =>
          String(ponto.id) === String(pontoEditando.id)
            ? { ...ponto, ...dadosPonto }
            : ponto,
        ),
      )
    } else {
      setPontos((anteriores) => [
        ...anteriores,
        {
          id: Date.now(),
          ...dadosPonto,
        },
      ])
    }

    fecharModal()
  }

  function excluirPonto(id) {
    const confirmar = window.confirm(
      'Tem certeza de que deseja excluir este ponto de coleta?',
    )

    if (!confirmar) return

    setPontos((anteriores) =>
      anteriores.filter(
        (ponto) => String(ponto.id) !== String(id),
      ),
    )
  }

  function alternarStatus(id) {
    setPontos((anteriores) =>
      anteriores.map((ponto) =>
        String(ponto.id) === String(id)
          ? {
              ...ponto,
              status:
                ponto.status === 'Ativo' ? 'Inativo' : 'Ativo',
            }
          : ponto,
      ),
    )
  }

  function restaurarPontosIniciais() {
    const confirmar = window.confirm(
      'Deseja restaurar os pontos de coleta iniciais? Os dados cadastrados serão substituídos.',
    )

    if (!confirmar) return

    setPontos(PONTOS_INICIAIS.map(normalizarPonto))
    setBusca('')
    setFiltroStatus('Todos')
  }

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

  const botaoPrimario =
    'inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-[#07110b] transition hover:bg-emerald-300'

  const botaoSecundario =
    `inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${borda} ${textoPrincipal} ${
      modoClaro ? 'hover:bg-slate-100' : 'hover:bg-white/5'
    }`

  const statusEstilo = {
    Ativo: modoClaro
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',

    Inativo: modoClaro
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : 'border-amber-400/20 bg-amber-400/10 text-amber-300',
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${fundoPagina}`}
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
            borda
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
            <Link to="/admin/dashboard" className={menuLink(false)}>
              <span className="text-lg">▦</span>
              Visão geral
            </Link>

            <Link to="/admin/doacoes" className={menuLink(false)}>
              <span className="text-lg">♻</span>
              Doações
            </Link>

            <Link
              to="/admin/pontos-de-coleta"
              className={menuLink(true)}
            >
              <span className="text-lg">⌖</span>
              Pontos de coleta
              <span className="ml-auto rounded-lg bg-emerald-400/15 px-2 py-1 text-xs text-emerald-500">
                {pontos.length}
              </span>
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
              Cada ponto de coleta ajuda a dar o destino correto aos resíduos.
            </p>
          </div>
        </div>

        <div className={`border-t p-4 ${borda}`}>
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
                Gerenciamento de pontos de coleta
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={alternarTema}
                aria-label={
                  modoClaro ? 'Ativar tema escuro' : 'Ativar tema claro'
                }
                title={
                  modoClaro ? 'Ativar tema escuro' : 'Ativar tema claro'
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

          {/* Navegação para dispositivos móveis */}

          <nav
            className={`flex gap-2 overflow-x-auto border-t px-5 py-3 lg:hidden ${borda}`}
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
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
                modoClaro
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              ♻ Doações
            </Link>

            <Link
              to="/admin/pontos-de-coleta"
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold ${
                modoClaro
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-emerald-400/10 text-emerald-300'
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
          {/* Título e ação principal */}

          <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-500">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                ADMINISTRAÇÃO / PONTOS DE COLETA
              </div>

              <h1
                className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${textoPrincipal}`}
              >
                Pontos de coleta
              </h1>

              <p
                className={`mt-3 max-w-2xl text-sm leading-6 sm:text-base ${textoSecundario}`}
              >
                Cadastre, edite e acompanhe os locais de coleta e os materiais
                que cada ponto recebe.
              </p>
            </div>

            <button
              type="button"
              onClick={abrirNovoPonto}
              className={`${botaoPrimario} self-start xl:self-auto`}
            >
              <span className="text-lg">+</span>
              Novo ponto de coleta
            </button>
          </div>

          {/* Indicadores */}

          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              {
                titulo: 'Total de pontos',
                valor: pontos.length,
                icone: '⌖',
                detalhe: 'Locais cadastrados no sistema',
                cor: 'emerald',
              },
              {
                titulo: 'Pontos ativos',
                valor: totalAtivos,
                icone: '✓',
                detalhe: 'Recebendo materiais',
                cor: 'emerald',
              },
              {
                titulo: 'Pontos inativos',
                valor: totalInativos,
                icone: '!',
                detalhe: 'Temporariamente indisponíveis',
                cor: 'amber',
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

          {/* Busca e gerenciamento */}

          <section className={`mb-6 rounded-2xl border p-5 sm:p-6 ${fundoPainel}`}>
            <div className="mb-5">
              <h2 className={`text-lg font-bold ${textoPrincipal}`}>
                Buscar e filtrar
              </h2>
              <p className={`mt-1 text-sm ${textoSecundario}`}>
                Encontre pontos pelo nome, endereço, material ou status.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-[1fr_240px]">
              <div>
                <label
                  htmlFor="busca-pontos"
                  className={`mb-2 block text-sm font-semibold ${textoSecundario}`}
                >
                  Nome, endereço ou material
                </label>

                <div className="relative">
                  <span className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${textoDiscreto}`}>
                    ⌕
                  </span>

                  <input
                    id="busca-pontos"
                    type="search"
                    value={busca}
                    onChange={(evento) => setBusca(evento.target.value)}
                    placeholder="Ex.: Centro, plástico, eletrônicos..."
                    className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15 ${fundoCampo}`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="filtro-status-pontos"
                  className={`mb-2 block text-sm font-semibold ${textoSecundario}`}
                >
                  Status do ponto
                </label>

                <select
                  id="filtro-status-pontos"
                  value={filtroStatus}
                  onChange={(evento) => setFiltroStatus(evento.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15 ${fundoCampo}`}
                >
                  <option value="Todos">Todos os status</option>
                  <option value="Ativo">Ativos</option>
                  <option value="Inativo">Inativos</option>
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

          {/* Lista de pontos */}

          <section className={`overflow-hidden rounded-2xl border ${fundoPainel}`}>
            <div
              className={`flex flex-col gap-3 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${borda}`}
            >
              <div>
                <h2 className={`text-lg font-bold ${textoPrincipal}`}>
                  Locais cadastrados
                </h2>
                <p className={`mt-1 text-sm ${textoSecundario}`}>
                  Gerencie os pontos disponíveis para a coleta.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  {pontosFiltrados.length}{' '}
                  {pontosFiltrados.length === 1 ? 'resultado' : 'resultados'}
                </span>

                <button
                  type="button"
                  onClick={restaurarPontosIniciais}
                  className={botaoSecundario}
                >
                  Restaurar exemplos
                </button>
              </div>
            </div>

            {pontosFiltrados.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${fundoSecundario}`}>
                  🔎
                </div>

                <h3 className={`text-lg font-bold ${textoPrincipal}`}>
                  Nenhum ponto encontrado
                </h3>

                <p className={`mx-auto mt-2 max-w-sm text-sm leading-6 ${textoSecundario}`}>
                  Não encontramos pontos com esses critérios. Tente alterar a
                  busca ou selecionar outro status.
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
              <div className="space-y-0">
                {pontosFiltrados.map((ponto) => {
                  const materiais = normalizarMateriais(ponto.materiais)

                  return (
                    <article
                      key={ponto.id}
                      className={`border-t p-5 transition first:border-t-0 sm:p-6 ${
                        modoClaro
                          ? 'border-slate-200 hover:bg-slate-50'
                          : 'border-white/5 hover:bg-white/[0.025]'
                      }`}
                    >
                      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl text-emerald-500">
                            ♻
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className={`font-bold ${textoPrincipal}`}>
                                {ponto.nome || 'Ponto sem nome'}
                              </h3>

                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                                  statusEstilo[ponto.status]
                                }`}
                              >
                                {ponto.status}
                              </span>
                            </div>

                            <p className={`mt-2 break-words text-sm ${textoSecundario}`}>
                              <span className="mr-2">⌖</span>
                              {ponto.endereco || 'Endereço não informado'}
                            </p>

                            <p className={`mt-1 text-sm ${textoSecundario}`}>
                              <span className="mr-2">◷</span>
                              {ponto.horario || 'Horário não informado'}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {materiais.length > 0 ? (
                                materiais.map((material, indice) => (
                                  <span
                                    key={`${material}-${indice}`}
                                    className={`rounded-lg border px-2.5 py-1 text-xs ${borda} ${textoSecundario}`}
                                  >
                                    {material}
                                  </span>
                                ))
                              ) : (
                                <span className={`text-xs ${textoDiscreto}`}>
                                  Nenhum material informado
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2 xl:justify-end">
                          <button
                            type="button"
                            onClick={() => alternarStatus(ponto.id)}
                            className={botaoSecundario}
                          >
                            {ponto.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                          </button>

                          <button
                            type="button"
                            onClick={() => abrirEdicao(ponto)}
                            className={botaoSecundario}
                          >
                            ✎ Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => excluirPonto(ponto.id)}
                            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                              modoClaro
                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                : 'border-red-400/20 text-red-300 hover:bg-red-400/10'
                            }`}
                          >
                            × Excluir
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>

          <p className={`mt-6 pb-4 text-center text-xs ${textoDiscreto}`}>
            E-Ciclo · Painel de gerenciamento de pontos de coleta
          </p>
        </main>
      </div>

      {/* Modal de cadastro e edição */}

      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) fecharModal()
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-ponto"
            className={`my-auto w-full max-w-2xl rounded-2xl border p-5 shadow-2xl sm:p-7 ${fundoPainel}`}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="titulo-modal-ponto"
                  className={`text-xl font-bold ${textoPrincipal}`}
                >
                  {pontoEditando
                    ? 'Editar ponto de coleta'
                    : 'Novo ponto de coleta'}
                </h2>

                <p className={`mt-1 text-sm ${textoSecundario}`}>
                  Informe os dados do local e os materiais aceitos.
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                aria-label="Fechar formulário"
                className={`rounded-lg px-3 py-1 text-xl ${textoSecundario} ${
                  modoClaro ? 'hover:bg-slate-100' : 'hover:bg-white/5'
                }`}
              >
                ×
              </button>
            </div>

            <form onSubmit={salvarPonto} className="space-y-5">
              <div>
                <label
                  htmlFor="nome-ponto"
                  className={`mb-2 block text-sm font-semibold ${textoSecundario}`}
                >
                  Nome do ponto *
                </label>

                <input
                  id="nome-ponto"
                  value={form.nome}
                  onChange={(evento) =>
                    atualizarCampo('nome', evento.target.value)
                  }
                  placeholder="Ex.: Ecoponto Centro"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15 ${fundoCampo}`}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="endereco-ponto"
                  className={`mb-2 block text-sm font-semibold ${textoSecundario}`}
                >
                  Endereço *
                </label>

                <input
                  id="endereco-ponto"
                  value={form.endereco}
                  onChange={(evento) =>
                    atualizarCampo('endereco', evento.target.value)
                  }
                  placeholder="Rua, bairro, cidade..."
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15 ${fundoCampo}`}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="horario-ponto"
                  className={`mb-2 block text-sm font-semibold ${textoSecundario}`}
                >
                  Horário de funcionamento
                </label>

                <input
                  id="horario-ponto"
                  value={form.horario}
                  onChange={(evento) =>
                    atualizarCampo('horario', evento.target.value)
                  }
                  placeholder="Ex.: Segunda a sexta, 8h às 17h"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15 ${fundoCampo}`}
                />
              </div>

              <fieldset>
                <legend className={`mb-3 text-sm font-semibold ${textoSecundario}`}>
                  Materiais aceitos *
                </legend>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {MATERIAIS_DISPONIVEIS.map((material) => (
                    <label
                      key={material}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${borda} ${
                        modoClaro
                          ? 'hover:bg-slate-50'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={normalizarMateriais(
                          form.materiais,
                        ).includes(material)}
                        onChange={() => alternarMaterial(material)}
                        className="h-4 w-4 accent-emerald-500"
                      />

                      <span className={textoPrincipal}>{material}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="status-ponto"
                  className={`mb-2 block text-sm font-semibold ${textoSecundario}`}
                >
                  Status
                </label>

                <select
                  id="status-ponto"
                  value={form.status}
                  onChange={(evento) =>
                    atualizarCampo('status', evento.target.value)
                  }
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-emerald-400 ${fundoCampo}`}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              {erro && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500"
                >
                  {erro}
                </p>
              )}

              <div className={`flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end ${borda}`}>
                <button
                  type="button"
                  onClick={fecharModal}
                  className={botaoSecundario}
                >
                  Cancelar
                </button>

                <button type="submit" className={botaoPrimario}>
                  {pontoEditando
                    ? 'Salvar alterações'
                    : 'Cadastrar ponto'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
