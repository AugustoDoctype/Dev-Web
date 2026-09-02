import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { verificarToken } from '../middlewares/auth.js';

const router = Router();

// ==========================================
// ROTA PROTEGIDA: RESUMO DO DASHBOARD
// ==========================================
router.get('/', verificarToken, async (req, res) => {
  try {
    // Conta os dados diretamente no banco para máxima performance
    const totalDoadores = await prisma.doador.count();
    
    const totalEquipamentos = await prisma.equipamento.count();
    
    const equipamentosPendentes = await prisma.equipamento.count({
      where: { status: 'PENDENTE' }
    });
    
    const equipamentosConsertados = await prisma.equipamento.count({
      where: { status: 'CONSERTADO' }
    });

    return res.status(200).json({
      sucesso: true,
      dados: {
        doadores: totalDoadores,
        equipamentos: {
          total: totalEquipamentos,
          pendentes: equipamentosPendentes,
          consertados: equipamentosConsertados
        }
      }
    });

  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao carregar dados do dashboard.", detalhes: erro.message });
  }
});

export default router;