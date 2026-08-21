import express from 'express';
import prisma from './lib/prisma.js'; // Em ES Modules, é obrigatório incluir a extensão .js em caminhos locais

const app = express();

app.use(express.json());

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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});