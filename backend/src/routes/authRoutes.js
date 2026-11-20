import { Router } from 'express'
import { ZodError } from 'zod'
import prisma from '../lib/prisma.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { adminCadastroSchema, adminLoginSchema } from '../schemas/adminSchema.js'
import { verificarToken } from '../middlewares/auth.js'
import { limiteLogin, limiteCadastroAdmin } from '../middlewares/limitarRequisicoes.js'
import { JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE } from '../config/jwt.js'

const router = Router()

// ==============================================
// POST /admins — só um admin autenticado cria outro
// Para criar o primeiro admin, usar o script criarAdmin.js.
// ==============================================
router.post('/admins', verificarToken, limiteCadastroAdmin, async (req, res) => {
  try {
    const dados = adminCadastroSchema.parse(req.body)
    const nome = dados.nome.trim()
    const email = dados.email.trim().toLowerCase()

    const existente = await prisma.admin.findUnique({ where: { email } })
    if (existente) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' })
    }

    const senhaHash = await bcrypt.hash(dados.senha, 12)
    const admin = await prisma.admin.create({
      data: { nome, email, senhaHash },
      select: { id: true, nome: true, email: true },
    })

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Administrador criado com sucesso!',
      dados: admin,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        erro: 'Dados de entrada inválidos.',
        detalhes: error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      })
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' })
    }

    console.error('Erro no cadastro administrativo:', error)
    return res.status(500).json({ erro: 'Não foi possível cadastrar o administrador.' })
  }
})

// ==============================================
// POST /login — autenticação administrativa real
// ==============================================
router.post('/login', limiteLogin, async (req, res) => {
  res.set('Cache-Control', 'no-store')

  try {
    const dados = adminLoginSchema.parse(req.body)
    const email = dados.email.trim().toLowerCase()

    const admin = await prisma.admin.findUnique({ where: { email } })
    const senhaValida = admin
      ? await bcrypt.compare(dados.senha, admin.senhaHash)
      : false

    if (!senhaValida) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' })
    }

    const token = jwt.sign(
      { id: admin.id, nome: admin.nome },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        expiresIn: '8h',
      }
    )

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso!',
      token,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        erro: 'Dados de entrada inválidos.',
        detalhes: error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      })
    }

    console.error('Erro no login administrativo:', error)
    return res.status(500).json({ erro: 'Não foi possível realizar o login.' })
  }
})

export default router
