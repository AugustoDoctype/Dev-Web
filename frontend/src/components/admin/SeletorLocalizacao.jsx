import { useEffect, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { apiFetch } from '../../services/api'

// Centro apenas para visualização inicial; nunca é salvo como coordenada do ponto.
const CENTRO_INICIAL = [-3.119, -60.0217] // Manaus

const iconeMarcador = L.divIcon({
  className: 'eciclo-localizacao-pin',
  html: '<span style="display:block;width:24px;height:24px;border:4px solid white;border-radius:50%;background:#059669;box-shadow:0 2px 8px rgba(0,0,0,.55)"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

function numeroValido(valor, limite) {
  if (valor == null || String(valor).trim() === '') return null
  const numero = Number(valor)
  return Number.isFinite(numero) && Math.abs(numero) <= limite ? numero : null
}

function ControleMapa({ foco }) {
  const mapa = useMap()

  useEffect(() => {
    // O mapa nasce dentro de um modal, que pode alterar as dimensões no primeiro frame.
    const handle = requestAnimationFrame(() => mapa.invalidateSize())
    return () => cancelAnimationFrame(handle)
  }, [mapa])

  useEffect(() => {
    if (foco) mapa.flyTo(foco, Math.max(16, mapa.getZoom()), { duration: 0.7 })
  }, [foco, mapa])

  return null
}

function SelecionarNoMapa({ onSelecionar }) {
  useMapEvents({
    click(evento) {
      onSelecionar(evento.latlng.lat, evento.latlng.lng)
    },
  })
  return null
}

export default function SeletorLocalizacao({ endereco = '', latitude, longitude, onSelecionar }) {
  const [textoBusca, setTextoBusca] = useState(endereco)
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [erroBusca, setErroBusca] = useState('')
  const [foco, setFoco] = useState(null)

  const lat = numeroValido(latitude, 90)
  const lng = numeroValido(longitude, 180)
  const posicao = lat !== null && lng !== null ? [lat, lng] : null
  const [centroInicial] = useState(() => posicao || CENTRO_INICIAL) // posição inicial do formulário

  function selecionarCoordenadas(novaLat, novaLng, enderecoEncontrado = '') {
    const latitudeFinal = Number(novaLat)
    const longitudeFinal = Number(novaLng)
    if (!Number.isFinite(latitudeFinal) || Math.abs(latitudeFinal) > 90 ||
        !Number.isFinite(longitudeFinal) || Math.abs(longitudeFinal) > 180) return
    onSelecionar({
      latitude: latitudeFinal.toFixed(6),
      longitude: longitudeFinal.toFixed(6),
      endereco: enderecoEncontrado,
    })
    setFoco([latitudeFinal, longitudeFinal])
  }

  async function buscarEndereco() {
    if (buscando) return
    const consulta = (textoBusca.trim() || endereco.trim())
    if (consulta.length < 3) {
      setErroBusca('Digite pelo menos 3 caracteres do endereço para pesquisar.')
      return
    }
    setBuscando(true)
    setResultados([])
    setErroBusca('')
    try {
      // A pesquisa só ocorre ao clicar em Buscar ou pressionar Enter; sem autocomplete.
      const lista = await apiFetch(`/admin/geocodificar?q=${encodeURIComponent(consulta)}`)
      if (!Array.isArray(lista) || lista.length === 0) {
        setErroBusca('Nenhum endereço encontrado. Refine a pesquisa ou marque o local no mapa.')
      } else {
        setResultados(lista)
      }
    } catch (error) {
      setErroBusca(error.message || 'Não foi possível buscar esse endereço.')
    } finally {
      setBuscando(false)
    }
  }

  return (
    <section className="space-y-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] p-3 sm:p-4" aria-label="Escolha da localização no mapa">
      <div>
        <h3 className="text-sm font-bold">Selecionar localização no mapa</h3>
        <p className="mt-1 text-xs opacity-75">
          Pesquise o endereço, clique no mapa ou arraste o marcador até a entrada exata do local.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={textoBusca}
          onChange={(e) => setTextoBusca(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault() // Evita submeter o cadastro ao pesquisar.
              buscarEndereco()
            }
          }}
          placeholder="Rua, número, bairro, Manaus, AM"
          aria-label="Endereço para pesquisar no mapa"
          className="min-w-0 flex-1 rounded-xl border border-slate-400/30 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
        />
        <button
          type="button"
          onClick={buscarEndereco}
          disabled={buscando}
          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
        >
          {buscando ? 'Buscando...' : 'Buscar endereço'}
        </button>
      </div>

      {erroBusca && <p role="alert" className="text-xs text-amber-500">{erroBusca}</p>}
      {resultados.length > 0 && (
        <div className="space-y-1" aria-label="Resultados de endereços encontrados">
          <p className="text-xs font-semibold opacity-80">Escolha o resultado que corresponde ao local:</p>
          {resultados.map((item, indice) => (
            <button
              type="button"
              key={`${item.latitude}-${item.longitude}-${indice}`}
              className="block w-full rounded-lg border border-slate-400/20 px-3 py-2 text-left text-xs hover:border-emerald-500 focus-visible:outline-2 focus-visible:outline-emerald-500"
              onClick={() => {
                selecionarCoordenadas(item.latitude, item.longitude, item.endereco)
                setTextoBusca(item.endereco)
                setResultados([])
              }}
            >
              {item.endereco}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-400/20" style={{ height: 310 }}>
        <MapContainer
          center={centroInicial}
          zoom={posicao ? 16 : 12}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ControleMapa foco={foco} />
          <SelecionarNoMapa onSelecionar={(novaLat, novaLng) => selecionarCoordenadas(novaLat, novaLng)} />
          {posicao && (
            <Marker
              position={posicao}
              draggable
              icon={iconeMarcador}
              eventHandlers={{
                dragend(evento) {
                  const ponto = evento.target.getLatLng()
                  selecionarCoordenadas(ponto.lat, ponto.lng)
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs opacity-80" role="status">
          {posicao
            ? `Marcador selecionado: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
            : 'Nenhum local selecionado. Clique no mapa para marcar o ponto.'}
        </p>
        {posicao && (
          <button
            type="button"
            className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-500 hover:bg-emerald-500/10"
            onClick={() => setFoco([lat, lng])}
          >
            Centralizar marcador
          </button>
        )}
      </div>
      <p className="text-[11px] opacity-70">
        Pesquisa: © OpenStreetMap / Nominatim. Confira a posição no mapa antes de salvar.
        A busca é manual e pode não localizar todos os estabelecimentos.
      </p>
    </section>
  )
}
