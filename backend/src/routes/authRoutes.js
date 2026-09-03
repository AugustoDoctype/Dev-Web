import { z } from 'zod';
import { adminCadastroSchema, adminLoginSchema } from '../schemas/adminSchema.js';
import { Router } from 'express';
import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
/**
 * @swagger
 * /admins:
 *   post:
 *     summary: Cadastra um novo administrador
 *     tags: [Administradores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso.
 *       400:
 *         description: Email já cadastrado ou dados inválidos.
 */
// ==========================================
// ROTA PARA CADASTRAR UM ADMINISTRADOR
// ==========================================
router.post('/admins', async (req, res) => {
  try {
    const dadosValidados = adminCadastroSchema.parse(req.body);
    const { nome, email, senha } = dadosValidados;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
    }

    const adminExistente = await prisma.admin.findUnique({ where: { email } });
    if (adminExistente) {
      return res.status(400).json({ erro: "Este email já está cadastrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoAdmin = await prisma.admin.create({
      data: { nome, email, senhaHash }
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: "Administrador criado com sucesso!",
      dados: { id: novoAdmin.id, nome: novoAdmin.nome, email: novoAdmin.email } 
    });
  } catch (erro) {
    // 1. Intercepta os erros de validação do Zod na rota de CADASTRO
    if (erro.name === 'ZodError') {
      return res.status(400).json({ 
        erro: "Dados de entrada inválidos.", 
        detalhes: erro.issues.map(issue => `${issue.path[0]}: ${issue.message}`)
      });
    }

    // 2. Outros erros
    return res.status(500).json({ 
      erro: "Erro ao cadastrar administrador.", 
      detalhes: erro.message 
    });
  }
});
/**
 * @swagger
 * /admins/login:
 *   post:
 *     summary: Autentica o administrador e gera o token de acesso
 *     tags: [Administradores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido. Retorna o token JWT.
 *       401:
 *         description: Credenciais inválidas.
 */
// ==========================================
// ROTA DE LOGIN (AUTENTICAÇÃO)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const dadosValidados = adminLoginSchema.parse(req.body);
    const { email, senha } = dadosValidados;

    const admin = await prisma.admin.findUnique({ where: { email } });
    
    if (!admin) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }

    const senhaValida = await bcrypt.compare(senha, admin.senhaHash);
    
    if (!senhaValida) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: admin.id, nome: admin.nome }, 
      "CHAVE_SUPER_SECRETA_DO_PROJETO", 
      { expiresIn: '1d' } 
    );

    return res.status(200).json({
      sucesso: true,
      mensagem: "Login realizado com sucesso!",
      token: token
    });
  } catch (erro) {
    // 1. Intercepta os erros de validação do Zod na rota de CADASTRO
    if (erro.name === 'ZodError') {
      return res.status(400).json({ 
        erro: "Dados de entrada inválidos.", 
        detalhes: erro.issues.map(issue => `${issue.path[0]}: ${issue.message}`)
      });
    }

    // 2. Outros erros
    return res.status(500).json({ 
      erro: "Erro ao cadastrar administrador.", 
      detalhes: erro.message 
    });
  }
});

export default router;