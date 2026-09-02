import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

// Rota para CADASTRAR um novo doador
router.post('/', async (req, res) => {
  try {
    // 1. Extrai todos os campos, incluindo o email
    const { nome, email, whatsapp, bairro } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ erro: "Nome e e-mail são obrigatórios." });
    }

    // 2. Trava de segurança: verifica se o e-mail já existe
    const doadorExistente = await prisma.doador.findUnique({
      where: { email }
    });

    if (doadorExistente) {
      return res.status(200).json({
        sucesso: true,
        mensagem: "Doador já cadastrado. Retornando dados existentes.",
        dados: doadorExistente
      });
    }

    // 3. Salva no banco passando todos os campos
    const novoDoador = await prisma.doador.create({
      data: { 
        nome, 
        email, 
        whatsapp, 
        bairro 
      }
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: "Doador cadastrado com sucesso!",
      dados: novoDoador
    });

  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao cadastrar.", detalhes: erro.message });
  }
});

// ==========================================
// ROTA PROTEGIDA: LISTAR DOADORES
// ==========================================
router.get('/', verificarToken, async (req, res) => {
  try {
    const doadores = await prisma.doador.findMany({
      // O 'include' faz a mágica de trazer os dados da tabela relacionada
      include: {
        equipamentos: true 
      }
    });

    return res.status(200).json({
      sucesso: true,
      total: doadores.length,
      dados: doadores
    });

  } catch (erro) {
    return res.status(500).json({ 
      erro: "Erro ao buscar a lista de doadores.", 
      detalhes: erro.message 
    });
  }
});

export default router;