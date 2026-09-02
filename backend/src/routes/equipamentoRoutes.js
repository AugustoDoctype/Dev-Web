import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { verificarToken } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js'

const router = Router();

// ==========================================
// ROTA PARA CADASTRAR EQUIPAMENTO (COM FOTO)
// ==========================================
// Adicionamos o upload.single('foto') como interceptador
router.post('/', upload.single('foto'), async (req, res) => {
  try {
    const { doadorId, categoria, descricao, status } = req.body;

    if (!doadorId) {
      return res.status(400).json({ erro: "O ID do doador é obrigatório." });
    }

    // Se o arquivo veio na requisição, montamos o caminho dele. Se não, fica null.
    const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const equipamentoDuplicado = await prisma.equipamento.findFirst({
      where: { doadorId, categoria, descricao }
    });

    if (equipamentoDuplicado) {
      return res.status(400).json({ erro: "Equipamento já cadastrado." });
    }

    const novoEquipamento = await prisma.equipamento.create({
      data: {
        doadorId,
        categoria,
        descricao,
        fotoUrl, // Agora salva o caminho real da imagem!
        status: status || "PENDENTE"
      }
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: "Equipamento cadastrado com sucesso!",
      dados: novoEquipamento
    });
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao cadastrar equipamento.", detalhes: erro.message });
  }
});

// ==========================================
// ROTA PROTEGIDA: LISTAR EQUIPAMENTOS (COM FILTRO)
// ==========================================
router.get('/', verificarToken, async (req, res) => {
  try {
    // 1. Captura os filtros que vieram na URL (req.query em vez de req.body)
    const { status, categoria } = req.query;

    // 2. Monta um objeto de busca dinâmico
    const filtro = {};
    
    // Se o front-end enviou um status, adiciona ao filtro
    if (status) {
      filtro.status = status;
    }
    
    // Se enviou uma categoria, adiciona ao filtro
    if (categoria) {
      filtro.categoria = categoria;
    }

    // 3. Pede ao Prisma para buscar usando o filtro
    // (Se o objeto filtro estiver vazio, o Prisma traz tudo)
    const equipamentos = await prisma.equipamento.findMany({
      where: filtro
    });
    
    return res.status(200).json({
      sucesso: true,
      adminQueAcessou: req.adminLogado.nome, 
      total: equipamentos.length,
      dados: equipamentos
    });
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao buscar equipamentos.", detalhes: erro.message });
  }
});

// ==========================================
// ROTA PROTEGIDA: ATUALIZAR EQUIPAMENTO
// ==========================================
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params; 
    const { status, descricao, destinoFinal } = req.body;

    const equipamentoAtualizado = await prisma.equipamento.update({
      where: { id },
      data: { status, descricao, destinoFinal }
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Status atualizado com sucesso!",
      dados: equipamentoAtualizado
    });
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao atualizar equipamento.", detalhes: erro.message });
  }
});

// ==========================================
// ROTA PROTEGIDA: DELETAR EQUIPAMENTO
// ==========================================
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
 
    // 1. Verifica se o equipamento realmente existe antes de tentar deletar
    const equipamentoExiste = await prisma.equipamento.findUnique({
      where: { id }
    });

    if (!equipamentoExiste) {
      return res.status(404).json({ erro: "Equipamento não encontrado ou já excluído." });
    }

    // 2. Se existe, manda o Prisma deletar
    await prisma.equipamento.delete({
      where: { id }
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Equipamento excluído com sucesso!"
    });

  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao excluir equipamento.", detalhes: erro.message });
  }
});

export default router;