import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

// ==========================================
// ROTA PARA CADASTRAR EQUIPAMENTO
// ==========================================
router.post('/', async (req, res) => {
  try {
    const { doadorId, categoria, descricao, fotoUrl, status } = req.body;

    if (!doadorId) {
      return res.status(400).json({ erro: "O ID do doador é obrigatório para registrar o equipamento." });
    }

    // 1. Trava anti-duplicidade: Busca se já existe um item idêntico deste doador
    const equipamentoDuplicado = await prisma.equipamento.findFirst({
      where: {
        doadorId,
        categoria,
        descricao
      }
    });

    // 2. Se achar, barra o cadastro e avisa o front-end
    if (equipamentoDuplicado) {
      return res.status(400).json({ 
        erro: "Um equipamento com essa mesma categoria e descrição já foi cadastrado para este doador." 
      });
    }

    // 3. Se passou pela trava, salva normalmente
    const novoEquipamento = await prisma.equipamento.create({
      data: {
        doadorId,
        categoria,
        descricao,
        fotoUrl,
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
// ROTA PROTEGIDA: LISTAR EQUIPAMENTOS
// ==========================================
router.get('/', verificarToken, async (req, res) => {
  try {
    const equipamentos = await prisma.equipamento.findMany();
    
    return res.status(200).json({
      sucesso: true,
      adminQueAcessou: req.adminLogado.nome, 
      total: equipamentos.length,
      dados: equipamentos
    });
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao buscar equipamentos." });
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