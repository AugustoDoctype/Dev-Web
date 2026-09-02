import { Router } from 'express';
import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// ==========================================
// ROTA PARA CADASTRAR UM ADMINISTRADOR
// ==========================================
router.post('/admins', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

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
    return res.status(500).json({ erro: "Erro ao cadastrar administrador.", detalhes: erro.message });
  }
});

// ==========================================
// ROTA DE LOGIN (AUTENTICAÇÃO)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

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
    return res.status(500).json({ erro: "Erro ao fazer login.", detalhes: erro.message });
  }
});

export default router;