
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from 'react-leaflet'
import Navbar from '../components/public/Navbar'
import 'leaflet/dist/leaflet.css'

const STORAGE_KEY = 'mock_pontos_coleta'

const pontosDemonstracao = [
  {
    id: 'demo-1',
    nome: 'Coleta de Eletrônicos',
    endereco: 'Região central de Manaus',
    material: 'Celulares, tablets e carregadores',
    categoria: 'Celulares e acessórios',
    posicao: [-3.119, -60.0217],
    horario: 'Consultar disponibilidade',
  },
  {
    id: 'demo-2',
    nome: 'Coleta de Informática',
    endereco: 'Zona Centro-Sul de Manaus',
    material: 'Computadores, notebooks e periféricos',
    categoria: 'Informática',
    posicao: [-3.1015, -60.0135],
    horario: 'Consultar disponibilidade',
  },
  {
    id: 'demo-3',
    nome: 'Descarte de Componentes',
    endereco: 'Zona Sul de Manaus',
    material: 'Placas eletrônicas, cabos e fontes',
    categoria: 'Componentes',
    posicao: [-3.135, -60.008],
    horario: 'Consultar disponibilidade',
  },
]

const CATEGORIAS = [
  'Todas as categorias',
  'Celulares e acessórios',
  'Informática',
  'Componentes',
  'Pilhas e baterias',
  'Eletrônicos em geral',
  'Outros',
]

function normalizarPonto(ponto) {
  const latitude = Number(ponto.latitude)
  const longitude = Number(ponto.longitude)

  if (
    ponto.latitude === '' ||
    ponto.longitude === '' ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null
  }

  return {
    id: ponto.id,
    nome: ponto.nome || 'Ponto de coleta',
    endereco: ponto.endereco || 'Endereço não informado',
    material: ponto.materiais || 'Materiais não informados',
    categoria: ponto.categoria || 'Eletrônicos em geral',
    horario: ponto.horario || 'Consultar disponibilidade',
    posicao: [latitude, longitude],
  }
}

function CentralizarMapa({ ponto }) {
  const mapa = useMap()

  useEffect(() => {
    if (ponto) {
      mapa.flyTo(ponto.posicao, 15, {
        duration: 1.2,
      })
    }
  }, [ponto, mapa])

  return null
}

function Icone({ children, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
    >
      {children}
    </span>
  )
}

function CartaoInformativo({ ponto, selecionado, aoSelecionar }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        selecionado
          ? 'border-emerald-400/50 bg-emerald-400/[0.07] shadow-lg shadow-emerald-950/20'
          : 'border-white/[0.08] bg-[#101a19] hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-[#14201e]'
      }`}
    >
      <button
        type="button"
        onClick={() => aoSelecionar(ponto)}
        aria-pressed={selecionado}
        className="w-full p-5 text-left sm:p-6"
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-xl transition ${
              selecionado
                ? 'border-emerald-400/30 bg-emerald-400/15'
                : 'border-white/[0.06] bg-white/[0.04] group-hover:bg-emerald-400/10'
            }`}
          >
            ♻️
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold leading-6 text-white sm:text-lg">
                {ponto.nome}
              </h3>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Ativo
              </span>
            </div>

            <p className="mt-1.5 text-xs font-medium text-emerald-300/80">
              {ponto.categoria}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-start gap-3">
            <Icone className="mt-0.5 h-8 w-8 rounded-lg bg-white/[0.04] text-sm">
              📍
            </Icone>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Localização
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-300">
                {ponto.endereco}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Icone className="mt-0.5 h-8 w-8 rounded-lg bg-white/[0.04] text-sm">
              ♻️
            </Icone>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Materiais aceitos
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-300">
                {ponto.material}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Icone className="mt-0.5 h-8 w-8 rounded-lg bg-white/[0.04] text-sm">
              🕒
            </Icone>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Funcionamento
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-300">
                {ponto.horario}
              </p>
            </div>
          </div>
        </div>
      </button>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => aoSelecionar(ponto)}
          className={`inline-flex items-center gap-2 text-xs font-bold transition ${
            selecionado
              ? 'text-emerald-300'
              : 'text-slate-400 hover:text-emerald-300'
          }`}
        >
          <span>◎</span>
          {selecionado ? 'Selecionado no mapa' : 'Ver no mapa'}
        </button>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${ponto.posicao[0]},${ponto.posicao[1]}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2.5 text-xs font-bold text-emerald-300 transition hover:border-emerald-400/40 hover:bg-emerald-400/15"
        >
          Google Maps
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  )
}

export default function PontosDeColeta() {
  const [pontosSalvos, setPontosSalvos] = useState(null)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(
    'Todas as categorias'
  )
  const [busca, setBusca] = useState('')
  const [pontoSelecionado, setPontoSelecionado] = useState(null)

  useEffect(() => {
    function carregarPontos() {
      try {
        const dados = localStorage.getItem(STORAGE_KEY)

        if (dados === null) {
          setPontosSalvos(null)
          return
        }

        const lista = JSON.parse(dados)

        if (!Array.isArray(lista)) {
          setPontosSalvos(null)
          return
        }

        const pontosAtivos = lista
          .filter((ponto) => ponto.status === 'Ativo')
          .map(normalizarPonto)
          .filter(Boolean)

        setPontosSalvos(pontosAtivos)
      } catch (error) {
        console.error('Erro ao carregar pontos de coleta:', error)
        setPontosSalvos(null)
      }
    }

    carregarPontos()
    window.addEventListener('storage', carregarPontos)

    return () => {
      window.removeEventListener('storage', carregarPontos)
    }
  }, [])

  const pontos = pontosSalvos ?? pontosDemonstracao

  const pontosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    return pontos.filter((ponto) => {
      const correspondeCategoria =
        categoriaSelecionada === 'Todas as categorias' ||
        ponto.categoria === categoriaSelecionada

      const correspondeBusca =
        ponto.nome.toLowerCase().includes(termo) ||
        ponto.endereco.toLowerCase().includes(termo) ||
        ponto.material.toLowerCase().includes(termo) ||
        ponto.categoria.toLowerCase().includes(termo)

      return correspondeCategoria && correspondeBusca
    })
  }, [pontos, categoriaSelecionada, busca])

  useEffect(() => {
    if (
      pontoSelecionado &&
      !pontosFiltrados.some((ponto) => ponto.id === pontoSelecionado.id)
    ) {
      setPontoSelecionado(null)
    }
  }, [pontosFiltrados, pontoSelecionado])

  function selecionarPonto(ponto) {
    setPontoSelecionado(ponto)
  }

  const categoriasAtivas = new Set(
    pontos.map((ponto) => ponto.categoria)
  ).size

  const centroMapa = pontoSelecionado
    ? pontoSelecionado.posicao
    : [-3.119, -60.0217]

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080e0d] text-white">
      <Navbar />

      <main>
        {/* Hero - apresentação renovada */}
        <section className="relative isolate overflow-hidden border-b border-white/[0.07] bg-[#0b1311]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -right-24 -top-40 h-[420px] w-[420px] rounded-full bg-emerald-500/[0.12] blur-[120px]" />
            <div className="absolute -left-40 top-32 h-[360px] w-[360px] rounded-full bg-teal-500/[0.08] blur-[110px]" />
            <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:54px_54px]" />
          </div>

          <div className="mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:pb-20">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-slate-400 transition duration-300 hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] hover:text-emerald-300"
            >
              <span aria-hidden="true">←</span>
              Voltar para o início
            </Link>

            <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-300 sm:text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />
                  Descarte consciente · Futuro sustentável
                </div>

                <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl">
                  Seu eletrônico merece
                  <br className="hidden sm:block" /> um{' '}
                  <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    destino melhor.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                  Encontre pontos de coleta, consulte os materiais aceitos e
                  descubra onde descartar seus eletrônicos. Uma escolha
                  consciente hoje faz diferença no futuro.
                </p>

                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#explorar-pontos"
                    className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-extrabold text-[#07110d] shadow-lg shadow-emerald-950/30 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-emerald-400/10"
                  >
                    Encontrar ponto de coleta
                    <span className="transition-transform duration-300 group-hover:translate-y-0.5">
                      ↓
                    </span>
                  </a>

                  <div className="inline-flex items-center justify-center gap-2 px-2 py-2 text-xs font-medium text-slate-500 sm:justify-start">
                    <span className="text-base text-emerald-400">♻</span>
                    Dê um novo significado ao descarte.
                  </div>
                </div>

                <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/[0.07] pt-6 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    Consulte os materiais aceitos
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    Encontre os locais no mapa
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    Trace sua rota no Google Maps
                  </span>
                </div>
              </div>

              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-5 rounded-[2rem] bg-emerald-400/[0.06] blur-2xl"
                />

                <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-[#0e1915] p-5 shadow-2xl shadow-black/20 sm:p-6">
                  <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-emerald-400/[0.08]" />
                  <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full border border-emerald-400/[0.10]" />

                  <div className="relative flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-white">
                        Impacto começa com você
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Explore os pontos disponíveis
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.09] text-2xl">
                      ♻️
                    </div>
                  </div>

                  <div className="relative mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/75">
                        Pontos ativos
                      </p>
                      <p className="mt-3 text-3xl font-black tracking-tight text-emerald-300 sm:text-4xl">
                        {pontos.length.toString().padStart(2, '0')}
                      </p>
                      <p className="mt-2 text-[10px] leading-4 text-slate-400">
                        Locais disponíveis
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Categorias
                      </p>
                      <p className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                        {categoriasAtivas.toString().padStart(2, '0')}
                      </p>
                      <p className="mt-2 text-[10px] leading-4 text-slate-500">
                        Tipos cadastrados
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-4 rounded-2xl border border-white/[0.07] bg-black/10 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/[0.09] text-lg">
                        🌱
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">
                          Cada atitude conta
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                          O descarte correto contribui para reduzir os impactos
                          ambientais dos resíduos eletrônicos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative mt-4 flex items-center justify-center gap-2 text-[10px] font-medium text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Tecnologia e sustentabilidade em um só lugar
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conteúdo */}
        <section
          id="explorar-pontos"
          className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"
        >
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-emerald-400">
                Encontre seu destino
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                Pontos de coleta
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Escolha um local para consultar as informações e
                visualizar sua posição no mapa.
              </p>
            </div>

            <Link
              to="/admin/pontos-de-coleta"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs font-bold text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300"
            >
              <span>⚙️</span>
              Gerenciar pontos
              <span>↗</span>
            </Link>
          </div>

          {/* Pesquisa e filtros */}
          <div className="mb-6 rounded-2xl border border-white/[0.08] bg-[#0d1514] p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <label className="relative block">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500">
                  ⌕
                </span>
                <span className="sr-only">Pesquisar pontos de coleta</span>
                <input
                  type="search"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Buscar por nome, endereço ou material..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#080e0d] py-4 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                />
              </label>

              <label className="relative block">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                  ▤
                </span>
                <span className="sr-only">Filtrar por categoria</span>
                <select
                  value={categoriaSelecionada}
                  onChange={(event) =>
                    setCategoriaSelecionada(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#080e0d] py-4 pl-11 pr-10 text-sm text-slate-200 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                >
                  {CATEGORIAS.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                  ⌄
                </span>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
              <p className="text-xs text-slate-500">
                Encontrados{' '}
                <span className="font-bold text-white">
                  {pontosFiltrados.length}
                </span>{' '}
                {pontosFiltrados.length === 1 ? 'ponto' : 'pontos'} de coleta
              </p>

              {(busca ||
                categoriaSelecionada !== 'Todas as categorias') && (
                <button
                  type="button"
                  onClick={() => {
                    setBusca('')
                    setCategoriaSelecionada('Todas as categorias')
                  }}
                  className="text-xs font-bold text-emerald-300 transition hover:text-emerald-200"
                >
                  Limpar filtros ×
                </button>
              )}
            </div>
          </div>

          {/* Lista e mapa */}
          <div className="grid items-start gap-6 xl:grid-cols-[0.88fr_1.12fr]">
            <div className="min-w-0">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white">
                  Locais disponíveis
                </h3>
                <span className="rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-bold text-slate-400">
                  {pontosFiltrados.length} RESULTADOS
                </span>
              </div>

              {pontosFiltrados.length > 0 ? (
                <div className="space-y-4">
                  {pontosFiltrados.map((ponto) => (
                    <CartaoInformativo
                      key={ponto.id}
                      ponto={ponto}
                      selecionado={pontoSelecionado?.id === ponto.id}
                      aoSelecionar={selecionarPonto}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.015] px-6 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-3xl">
                    ⌕
                  </div>
                  <h3 className="mt-5 text-base font-bold text-white">
                    Nenhum ponto encontrado
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    Experimente outro termo ou selecione uma categoria
                    diferente.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setBusca('')
                      setCategoriaSelecionada('Todas as categorias')
                    }}
                    className="mt-5 rounded-xl bg-emerald-400 px-4 py-3 text-xs font-extrabold text-[#07110d] transition hover:bg-emerald-300"
                  >
                    Limpar pesquisa
                  </button>
                </div>
              )}
            </div>

            <div className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d1514] xl:sticky xl:top-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-lg">
                    🗺️
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Mapa interativo
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Manaus e região
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-[10px] font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {pontosFiltrados.length} locais
                </span>
              </div>

              <div className="relative h-[430px] sm:h-[520px] xl:h-[650px]">
                <MapContainer
                  key={pontosFiltrados.map((ponto) => ponto.id).join(',')}
                  center={centroMapa}
                  zoom={12}
                  scrollWheelZoom
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {pontosFiltrados.map((ponto) => (
                    <CircleMarker
                      key={ponto.id}
                      center={ponto.posicao}
                      radius={
                        pontoSelecionado?.id === ponto.id ? 11 : 8
                      }
                      pathOptions={{
                        color:
                          pontoSelecionado?.id === ponto.id
                            ? '#d1fae5'
                            : '#ffffff',
                        fillColor:
                          pontoSelecionado?.id === ponto.id
                            ? '#047857'
                            : '#10b981',
                        fillOpacity: 1,
                        weight: 3,
                      }}
                      eventHandlers={{
                        click: () => selecionarPonto(ponto),
                      }}
                    >
                      <Popup>
                        <div className="min-w-[180px] text-slate-900">
                          <strong>{ponto.nome}</strong>
                          <p className="mt-1 text-sm">{ponto.endereco}</p>
                          <p className="mt-1 text-sm">{ponto.material}</p>
                          <a
                            className="mt-2 inline-block text-sm font-semibold text-emerald-700"
                            href={`https://www.google.com/maps/search/?api=1&query=${ponto.posicao[0]},${ponto.posicao[1]}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Abrir no Google Maps ↗
                          </a>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}

                  <CentralizarMapa ponto={pontoSelecionado} />
                </MapContainer>

                {pontosFiltrados.length === 0 && (
                  <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#080e0d]/70 p-6 backdrop-blur-sm">
                    <div className="max-w-xs rounded-2xl border border-white/10 bg-[#101a19] p-6 text-center shadow-2xl">
                      <span className="text-3xl">📍</span>
                      <p className="mt-3 font-bold text-white">
                        Nenhum local para exibir
                      </p>
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        Ajuste a pesquisa ou os filtros para visualizar
                        os pontos.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-4 sm:px-6">
                <p className="text-[10px] leading-5 text-slate-500">
                  Mapa © OpenStreetMap
                </p>
                <span className="text-[10px] text-slate-500">
                  Selecione um marcador para ver detalhes
                </span>
              </div>
            </div>
          </div>

          {/* Aviso */}
          <div className="mt-8 flex items-start gap-4 rounded-2xl border border-amber-300/15 bg-amber-300/[0.035] p-5 sm:p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-300/[0.07] text-lg">
              ℹ️
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-200">
                Sobre os pontos exibidos
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-400">
                As localizações de demonstração servem para testar a
                interface. Antes de divulgar o sistema, confirme os
                endereços, as coordenadas, os horários e os materiais
                aceitos pelos estabelecimentos. O mapa não verifica
                se um local realmente recebe resíduos eletrônicos.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
