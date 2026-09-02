import express from 'express';
import prisma from './lib/prisma.js'; 

// Importação das rotas modularizadas
import doadorRoutes from './routes/doadorRoutes.js';
import equipamentoRoutes from './routes/equipamentoRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(express.json());

// ==========================================
// ROTA DE TESTE (Consulta Inicial)
// ==========================================
app.get('/', async (req, res) => {
  try {
    const equipamentos = await prisma.equipamento.findMany();
    return res.json({
      sucesso: true,
      mensagem: "API rodando e conectada ao banco com sucesso! 🚀",
      totalEquipamentos: equipamentos.length,
      dados: equipamentos
    });
  } catch (erro) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao conectar no banco de dados",
      erro: erro.message
    });
  }
});

// ==========================================
// CONFIGURAÇÃO DOS MÓDULOS DE ROTAS
// ==========================================
// Tudo que vier da autenticação (/admins e /login) vai para authRoutes
app.use('/', authRoutes); 

// Tudo que começar com /doadores vai para doadorRoutes
app.use('/doadores', doadorRoutes); 

// Tudo que começar com /equipamentos vai para equipamentoRoutes
app.use('/equipamentos', equipamentoRoutes); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT} 🚀`);
});