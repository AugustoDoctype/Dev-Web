import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { limiteAcompanhamento } from '../middlewares/limitarRequisicoes.js'

const router = Router()

// ==============================================
// GET /acompanhamento/:codigo
// Consulta pública limitada ao status e à categoria.
// ==============================================
router.get('/:codigo', limiteAcompanhamento, async (req, res) => {
  res.set('Cache-Control', 'no-store')
  res.set('Referrer-Policy', 'no-referrer')

  const codigo = String(req.params.codigo || '').trim().toUpperCase()

  // Resposta indistinguível para códigos malformados e inexistentes.
  if (!/^[0-9A-F]{32}$/.test(codigo)) {
    return res.status(404).json({ erro: 'Código de acompanhamento não encontrado.' })
  }

  try {
    const equipamento = await prisma.equipamento.findUnique({
      where: { codigoAcompanhamento: codigo },
      select: {
        categoria: true,
        status: true,
        criadoEm: true,
        atualizadoEm: true,
      },
    })

    if (!equipamento) {
      return res.status(404).json({ erro: 'Código de acompanhamento não encontrado.' })
    }

    return res.status(200).json({ sucesso: true, dados: equipamento })
  } catch (error) {
    console.error('Erro ao consultar acompanhamento:', error)
    return res.status(500).json({ erro: 'Não foi possível consultar o acompanhamento.' })
  }
})

export default router
