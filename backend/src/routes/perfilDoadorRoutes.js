import { Router } from 'express'
import { z, ZodError } from 'zod'
import { randomBytes } from 'node:crypto'
import prisma from '../lib/prisma.js'
import { verificarDoador } from '../middlewares/authDoador.js'
import { atualizarPerfilDoadorSchema } from '../schemas/doadorContaSchema.js'
import {
  criarEnderecoDoadorSchema,
  atualizarEnderecoDoadorSchema,
} from '../schemas/enderecoDoadorSchema.js'

const router = Router()
router.use(verificarDoador)
router.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

function erroRequisicao(error, res, contexto) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      erro: 'Dados inválidos.',
      detalhes: error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
    })
  }
  console.error(contexto, error)
  return res.status(500).json({ erro: 'Não foi possível concluir a solicitação.' })
}

const selecaoEndereco = {
  id: true, cep: true, logradouro: true, numero: true, bairro: true,
  cidade: true, estado: true, preferencial: true, criadoEm: true, atualizadoEm: true,
}

// GET /doadores/me — dados próprios, nunca credenciais.
router.get('/', async (req, res) => {
  try {
    const doador = await prisma.doador.findUnique({
      where: { id: req.doadorLogado.id },
      select: {
        id: true, nome: true, email: true, whatsapp: true, bairro: true, criadoEm: true,
        enderecos: { orderBy: { criadoEm: 'desc' }, select: selecaoEndereco },
      },
    })
    if (!doador) return res.status(404).json({ erro: 'Perfil não encontrado.' })
    return res.status(200).json({ sucesso: true, dados: doador })
  } catch (error) {
    return erroRequisicao(error, res, 'Erro ao consultar perfil:')
  }
})

// PUT /doadores/me — contato. Alteração de e-mail exigirá confirmação separada.
router.put('/', async (req, res) => {
  try {
    const dados = atualizarPerfilDoadorSchema.parse(req.body)
    const resultado = await prisma.doador.updateMany({
      where: { id: req.doadorLogado.id }, data: dados,
    })
    if (!resultado.count) return res.status(404).json({ erro: 'Perfil não encontrado.' })
    const doador = await prisma.doador.findUnique({
      where: { id: req.doadorLogado.id },
      select: { id: true, nome: true, email: true, whatsapp: true, bairro: true },
    })
    return res.status(200).json({ sucesso: true, dados: doador })
  } catch (error) {
    return erroRequisicao(error, res, 'Erro ao atualizar perfil:')
  }
})

// POST /doadores/me/equipamentos — cadastro associado somente ao titular do JWT.
// O cliente NÃO escolhe doadorId, status nem codigoAcompanhamento.
const novoEquipamentoSchema = z.object({
  categoria: z.string().trim().min(3).max(120),
  descricao: z.string().trim().min(5).max(2000),
  enderecoId: z.string().uuid(),
}).strict()

router.post('/equipamentos', async (req, res) => {
  try {
    const dados = novoEquipamentoSchema.parse(req.body)
    const doadorId = req.doadorLogado.id

    const doador = await prisma.doador.findUnique({
      where: { id: doadorId }, select: { id: true },
    })
    if (!doador) return res.status(404).json({ erro: 'Conta de doador não encontrada.' })

    // Não confia no endereço enviado pelo navegador: busca-o no banco e exige titularidade.
    const endereco = await prisma.enderecoDoador.findFirst({
      where: { id: dados.enderecoId, doadorId },
      select: {
        cep: true, logradouro: true, numero: true, bairro: true,
        cidade: true, estado: true,
      },
    })
    if (!endereco) return res.status(404).json({ erro: 'Endereço de coleta não encontrado na sua conta.' })

    const duplicado = await prisma.equipamento.findFirst({
      where: { doadorId, categoria: dados.categoria, descricao: dados.descricao },
      select: { id: true },
    })
    if (duplicado) {
      return res.status(409).json({ erro: 'Este equipamento já foi cadastrado para a sua conta.' })
    }

    const equipamento = await prisma.equipamento.create({
      data: {
        doadorId,
        categoria: dados.categoria,
        descricao: dados.descricao,
        status: 'PENDENTE',
        codigoAcompanhamento: randomBytes(16).toString('hex').toUpperCase(),
        // Snapshot: uma edição futura no perfil não altera o local desta doação.
        enderecoColetaCep: endereco.cep,
        enderecoColetaLogradouro: endereco.logradouro,
        enderecoColetaNumero: endereco.numero,
        enderecoColetaBairro: endereco.bairro,
        enderecoColetaCidade: endereco.cidade,
        enderecoColetaEstado: endereco.estado,
      },
      select: {
        id: true, categoria: true, descricao: true,
        status: true, codigoAcompanhamento: true,
        criadoEm: true, atualizadoEm: true,
        enderecoColetaCep: true, enderecoColetaLogradouro: true,
        enderecoColetaNumero: true, enderecoColetaBairro: true,
        enderecoColetaCidade: true, enderecoColetaEstado: true,
      },
    })
    return res.status(201).json({ sucesso: true, dados: equipamento })
  } catch (error) {
    return erroRequisicao(error, res, 'Erro ao criar equipamento autenticado:')
  }
})

// GET /doadores/me/equipamentos — histórico real pertencente ao titular.
router.get('/equipamentos', async (req, res) => {
  try {
    const equipamentos = await prisma.equipamento.findMany({
      where: { doadorId: req.doadorLogado.id },
      select: {
        id: true, categoria: true, descricao: true, status: true,
        codigoAcompanhamento: true, criadoEm: true, atualizadoEm: true,
        enderecoColetaCep: true, enderecoColetaLogradouro: true,
        enderecoColetaNumero: true, enderecoColetaBairro: true,
        enderecoColetaCidade: true, enderecoColetaEstado: true,
      },
      orderBy: { criadoEm: 'desc' },
    })
    return res.status(200).json({ sucesso: true, total: equipamentos.length, dados: equipamentos })
  } catch (error) {
    return erroRequisicao(error, res, 'Erro ao listar equipamentos do doador:')
  }
})

// GET /doadores/me/enderecos
router.get('/enderecos', async (req, res) => {
  try {
    const enderecos = await prisma.enderecoDoador.findMany({
      where: { doadorId: req.doadorLogado.id },
      orderBy: { criadoEm: 'desc' },
      select: selecaoEndereco,
    })
    return res.status(200).json({ sucesso: true, dados: enderecos })
  } catch (error) {
    return erroRequisicao(error, res, 'Erro ao consultar endereços:')
  }
})

// POST /doadores/me/enderecos — o primeiro endereço vira preferencial.
router.post('/enderecos', async (req, res) => {
  try {
    const dados = criarEnderecoDoadorSchema.parse(req.body)
    const endereco = await prisma.$transaction(async (tx) => {
      const atual = await tx.enderecoDoador.findFirst({
        where: { doadorId: req.doadorLogado.id, preferencial: true },
        select: { id: true },
      })
      const preferencial = dados.preferencial === true || !atual
      if (preferencial) {
        await tx.enderecoDoador.updateMany({
          where: { doadorId: req.doadorLogado.id },
          data: { preferencial: false },
        })
      }
      return tx.enderecoDoador.create({
        data: { ...dados, doadorId: req.doadorLogado.id, preferencial },
        select: selecaoEndereco,
      })
    })
    return res.status(201).json({ sucesso: true, dados: endereco })
  } catch (error) {
    return erroRequisicao(error, res, 'Erro ao cadastrar endereço:')
  }
})

// PUT /doadores/me/enderecos/:id — só altera endereços pertencentes ao titular.
router.put('/enderecos/:id', async (req, res) => {
  try {
    const dados = atualizarEnderecoDoadorSchema.parse(req.body)
    const where = { id: req.params.id, doadorId: req.doadorLogado.id }
    const endereco = await prisma.enderecoDoador.findFirst({ where, select: { id: true, preferencial: true } })
    if (!endereco) return res.status(404).json({ erro: 'Endereço não encontrado.' })
    if (dados.preferencial === false && endereco.preferencial) {
      return res.status(400).json({
        erro: 'Para mudar o endereço preferencial, selecione outro endereço.',
      })
    }
    const atualizado = await prisma.$transaction(async (tx) => {
      if (dados.preferencial === true) {
        await tx.enderecoDoador.updateMany({
          where: { doadorId: req.doadorLogado.id }, data: { preferencial: false },
        })
      }
      return tx.enderecoDoador.update({
        where: { id: endereco.id }, data: dados, select: selecaoEndereco,
      })
    })
    return res.status(200).json({ sucesso: true, dados: atualizado })
  } catch (error) {
    return erroRequisicao(error, res, 'Erro ao atualizar endereço:')
  }
})

export default router
