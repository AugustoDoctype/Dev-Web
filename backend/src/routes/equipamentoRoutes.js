import { z } from 'zod';
import { criarEquipamentoSchema } from '../schemas/equipamentoSchema.js';
import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { verificarToken } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import fs from 'fs';
const router = Router();
/**
 * @swagger
 * /equipamentos:
 *   post:
 *     summary: Cadastra um novo equipamento com foto
 *     tags: [Equipamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               doadorId:
 *                 type: string
 *                 description: ID do doador no banco de dados
 *               categoria:
 *                 type: string
 *               descricao:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Imagem do equipamento (JPG/PNG)
 *     responses:
 *       201:
 *         description: Equipamento cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos ou equipamento duplicado.
 */
// ==========================================
// ROTA PARA CADASTRAR EQUIPAMENTO (COM FOTO)
// ==========================================
// Adicionamos o upload.single('foto') como interceptador
router.post('/', upload.single('foto'), async (req, res) => {
  try {
    // 1. O Zod analisa o req.body. Se estiver errado, ele "quebra" o código aqui e pula direto pro catch
    const dadosValidados = criarEquipamentoSchema.parse(req.body);

    // 2. Extraím os dados já validados de forma segura
    const { doadorId, categoria, descricao, status } = dadosValidados;

    const equipamentoDuplicado = await prisma.equipamento.findFirst({
      where: { doadorId, categoria, descricao }
    });

    if (equipamentoDuplicado) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ erro: "Um equipamento com essa mesma categoria e descrição já foi cadastrado para este doador." });
    }

    const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;

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
    // Se der erro, apaga a foto órfã que o multer salvou
    if (req.file) fs.unlinkSync(req.file.path); 

    // 3. A MÁGICA DO ZOD: Intercepta o erro específico de validação
    if (erro instanceof z.ZodError) {
      return res.status(400).json({ 
        erro: "Dados de entrada inválidos.", 
        detalhes: erro.issues.map(issue => `${issue.path[0]}: ${issue.message}`)
      });
    }

    return res.status(500).json({ erro: "Erro interno no servidor.", detalhes: erro.message });
  }
});
/**
 * @swagger
 * /equipamentos:
 *   get:
 *     summary: Lista todos os equipamentos
 *     tags: [Equipamentos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtra os equipamentos pelo status (ex PENDENTE, CONSERTADO)
 *     responses:
 *       200:
 *         description: Lista de equipamentos retornada com sucesso.
 */
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
/**
 * @swagger
 * /equipamentos/{id}:
 *   put:
 *     summary: Atualiza o status de um equipamento na bancada
 *     tags: [Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do equipamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: CONSERTADO
 *     responses:
 *       200:
 *         description: Status do equipamento atualizado com sucesso.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Equipamento não encontrado.
 */
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
/**
 * @swagger
 * /equipamentos/{id}:
 *   delete:
 *     summary: Remove um equipamento do sistema
 *     tags: [Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do equipamento
 *     responses:
 *       200:
 *         description: Equipamento removido com sucesso.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Equipamento não encontrado.
 */
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