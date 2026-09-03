import express from 'express';
import cors from 'cors';
import { setupSwagger } from './swagger.js';
import prisma from './lib/prisma.js'; 
import dashboardRoutes from './routes/dashboardRoutes.js';

// Importação das rotas modularizadas
import doadorRoutes from './routes/doadorRoutes.js';
import equipamentoRoutes from './routes/equipamentoRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors());

setupSwagger(app);

app.use(express.json());
// Libera a pasta 'uploads' para ser acessada publicamente pelo navegador
app.use('/uploads', express.static('uploads'));

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

// Tudo que começar com /dashboard vai para dashboardRoutes
app.use('/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT} 🚀`);
});
