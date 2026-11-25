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
