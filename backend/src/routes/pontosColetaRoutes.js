import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { verificarToken } from '../middlewares/auth.js'

const router = Router()

function apresentar(ponto) {
  let materiais = []
  try {
    const parsed = JSON.parse(ponto.materiais)
    if (Array.isArray(parsed)) materiais = parsed
  } catch {
    materiais = ponto.materiais.split(',').map((item) => item.trim()).filter(Boolean)
  }
  return { ...ponto, materiais }
}

function validar(body) {
  const nome = typeof body?.nome === 'string' ? body.nome.trim() : ''
  const endereco = typeof body?.endereco === 'string' ? body.endereco.trim() : ''
  const horario = typeof body?.horario === 'string' ? body.horario.trim() : ''
  const categoria = typeof body?.categoria === 'string' && body.categoria.trim()
    ? body.categoria.trim() : 'Eletrônicos em geral'
  const materiais = Array.isArray(body?.materiais)
    ? [...new Set(body.materiais.filter((m) => typeof m === 'string').map((m) => m.trim()).filter(Boolean))]
    : []
  const latitude = body?.latitude === '' || body?.latitude == null ? NaN : Number(body.latitude)
  const longitude = body?.longitude === '' || body?.longitude == null ? NaN : Number(body.longitude)
  const status = body?.status === 'Inativo' ? 'Inativo' : 'Ativo'

  if (!nome || !endereco || nome.length > 160 || endereco.length > 300) {
    return { erro: 'Informe nome e endereço válidos.' }
  }
  if (horario.length > 160 || categoria.length > 100 || materiais.length === 0 ||
      materiais.length > 30 || materiais.some((m) => m.length > 100)) {
    return { erro: 'Informe materiais aceitos, categoria e horário válidos.' }
  }
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
      !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return { erro: 'Latitude e longitude válidas são obrigatórias.' }
  }
  return { dados: { nome, endereco, horario, categoria, materiais: JSON.stringify(materiais), latitude, longitude, status } }
}

router.get('/pontos-coleta', async (_req, res) => {
  try {
    const pontos = await prisma.pontoColeta.findMany({
      where: { status: 'Ativo' }, orderBy: { nome: 'asc' },
    })
    return res.json(pontos.map(apresentar))
  } catch (error) {
    console.error('Erro ao listar pontos públicos:', error)
    return res.status(500).json({ erro: 'Não foi possível consultar os pontos de coleta.' })
  }
})

// Busca de endereço apenas por ação explícita do administrador.
// O Nominatim público não permite autocomplete e exige limite global de 1 req/s.
// Para este deployment com uma instância, serializamos as consultas no processo Node.
// Em implantação com múltiplas instâncias, use um limitador compartilhado ou outro provedor.
const CACHE_TTL = 24 * 60 * 60 * 1000
const cacheGeocodificacao = new Map()
let proximaConsultaEm = 0
let filaGeocodificacao = Promise.resolve()

async function consultarNominatim(endereco) {
  const executar = async () => {
    const espera = Math.max(0, proximaConsultaEm - Date.now())
    if (espera > 0) await new Promise((resolve) => setTimeout(resolve, espera))
    proximaConsultaEm = Date.now() + 1200
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', endereco)
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('limit', '5')
    url.searchParams.set('countrycodes', 'br')
    const resposta = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'pt-BR,pt;q=0.9',
        'User-Agent': process.env.NOMINATIM_USER_AGENT || 'E-Ciclo/1.0 (https://github.com/AugustoDoctype/Dev-Web)',
      },
      signal: AbortSignal.timeout(10000),
    })
    if (!resposta.ok) throw new Error(`Nominatim: HTTP ${resposta.status}`)
    const dados = await resposta.json()
    if (!Array.isArray(dados)) throw new Error('Resposta de geocodificação inesperada')
    return dados.slice(0, 5).filter((item) =>
      Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lon))
    ).map((item) => ({
      endereco: String(item.display_name || '').slice(0, 300),
      latitude: Number(item.lat),
      longitude: Number(item.lon),
    }))
  }
  const tarefa = filaGeocodificacao.then(executar, executar)
  filaGeocodificacao = tarefa.then(() => undefined, () => undefined)
  return tarefa
}

router.get('/admin/geocodificar', verificarToken, async (req, res) => {
  const endereco = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  if (endereco.length < 3 || endereco.length > 160 || /[\x00-\x1f]/.test(endereco)) {
    return res.status(400).json({ erro: 'Informe um endereço entre 3 e 160 caracteres.' })
  }
  res.set('Cache-Control', 'private, no-store')
  const chave = endereco.toLocaleLowerCase('pt-BR')
  const salvo = cacheGeocodificacao.get(chave)
  if (salvo && salvo.expiraEm > Date.now()) return res.json(salvo.dados)
  try {
    const dados = await consultarNominatim(endereco)
    if (cacheGeocodificacao.size >= 150) {
      cacheGeocodificacao.delete(cacheGeocodificacao.keys().next().value)
    }
    cacheGeocodificacao.set(chave, { dados, expiraEm: Date.now() + CACHE_TTL })
    return res.json(dados)
  } catch (error) {
    console.error('Erro ao geocodificar endereço:', error.message)
    return res.status(502).json({ erro: 'A pesquisa de endereços está indisponível. Selecione o local manualmente no mapa.' })
  }
})

router.use('/admin/pontos-coleta', verificarToken)

router.get('/admin/pontos-coleta', async (_req, res) => {
  try {
    const pontos = await prisma.pontoColeta.findMany({ orderBy: { criadoEm: 'desc' } })
    return res.json(pontos.map(apresentar))
  } catch (error) {
    console.error('Erro ao listar pontos administrativos:', error)
    return res.status(500).json({ erro: 'Não foi possível consultar os pontos de coleta.' })
  }
})

router.post('/admin/pontos-coleta', async (req, res) => {
  const { dados, erro } = validar(req.body)
  if (erro) return res.status(400).json({ erro })
  try {
    const ponto = await prisma.pontoColeta.create({ data: dados })
    return res.status(201).json(apresentar(ponto))
  } catch (error) {
    console.error('Erro ao cadastrar ponto:', error)
    return res.status(500).json({ erro: 'Não foi possível cadastrar o ponto de coleta.' })
  }
})

router.put('/admin/pontos-coleta/:id', async (req, res) => {
  const { dados, erro } = validar(req.body)
  if (erro) return res.status(400).json({ erro })
  try {
    const ponto = await prisma.pontoColeta.update({ where: { id: req.params.id }, data: dados })
    return res.json(apresentar(ponto))
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ erro: 'Ponto não encontrado.' })
    console.error('Erro ao atualizar ponto:', error)
    return res.status(500).json({ erro: 'Não foi possível atualizar o ponto de coleta.' })
  }
})

router.delete('/admin/pontos-coleta/:id', async (req, res) => {
  try {
    await prisma.pontoColeta.delete({ where: { id: req.params.id } })
    return res.status(204).end()
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ erro: 'Ponto não encontrado.' })
    console.error('Erro ao excluir ponto:', error)
    return res.status(500).json({ erro: 'Não foi possível excluir o ponto de coleta.' })
  }
})

export default router
