import { Router } from 'express'
import { ZodError } from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma.js'
import { cadastroContaDoadorSchema, loginContaDoadorSchema } from '../schemas/doadorContaSchema.js'
import { criarTokenDoador } from '../config/jwtDoador.js'
import { limitarRequisicoes } from '../middlewares/limitarRequisicoes.js'

const router = Router()

const limiteCadastro = limitarRequisicoes({
  janelaMs: 15 * 60 * 1000,
  maximo: 5,
  mensagem: 'Muitos cadastros. Tente novamente mais tarde.',
})
const limiteLogin = limitarRequisicoes({
  janelaMs: 15 * 60 * 1000,
  maximo: 10,
  mensagem: 'Muitas tentativas de login. Tente novamente mais tarde.',
})

router.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

// POST /doador-auth/cadastro
// O registro existente só pode receber uma conta após verificação de titularidade.
// Não vinculamos automaticamente pelo e-mail: evitaria tomada de contas antigas.
router.post('/cadastro', limiteCadastro, async (req, res) => {
  try {
    const dados = cadastroContaDoadorSchema.parse(req.body)
    const existente = await prisma.doador.findUnique({
      where: { email: dados.email },
      select: { id: true },
    })

    if (existente) {
      return res.status(409).json({
        erro: 'Este e-mail já está associado a um cadastro. A vinculação de uma conta antiga requer verificação de titularidade.',
      })
    }

    const senhaHash = await bcrypt.hash(dados.senha, 12)
    // Criação aninhada: Doador e ContaDoador são gravados juntos ou não são gravados.
    const doador = await prisma.doador.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        whatsapp: dados.whatsapp,
        bairro: dados.bairro,
        conta: { create: { senhaHash } },
      },
      select: { id: true, nome: true, email: true, whatsapp: true, bairro: true },
    })

    return res.status(201).json({
      sucesso: true,
      dados: doador,
      token: criarTokenDoador(doador),
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        erro: 'Dados de cadastro inválidos.',
        detalhes: error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      })
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' })
    }
    console.error('Erro no cadastro do doador:', error)
    return res.status(500).json({ erro: 'Não foi possível cadastrar a conta.' })
  }
})

// POST /doador-auth/login
router.post('/login', limiteLogin, async (req, res) => {
  try {
    const dados = loginContaDoadorSchema.parse(req.body)
    const doador = await prisma.doador.findUnique({
      where: { email: dados.email },
      include: { conta: true },
    })
    const senhaValida = doador?.conta
      ? await bcrypt.compare(dados.senha, doador.conta.senhaHash)
      : false

    if (!senhaValida) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' })
    }

    return res.status(200).json({
      sucesso: true,
      dados: {
        id: doador.id,
        nome: doador.nome,
        email: doador.email,
        whatsapp: doador.whatsapp,
        bairro: doador.bairro,
      },
      token: criarTokenDoador(doador),
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ erro: 'Dados de login inválidos.' })
    }
    console.error('Erro no login do doador:', error)
    return res.status(500).json({ erro: 'Não foi possível realizar o login.' })
  }
})

export default router
