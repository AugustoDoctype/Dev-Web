import express from 'express';
import prisma from './lib/prisma.js'; // Em ES Modules, é obrigatório incluir a extensão .js em caminhos locais

const app = express();

app.use(express.json());
//Rota para CONSULTAR equipamentos
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

// Rota para CADASTRAR um novo doador
app.post('/doadores', async (req, res) => {
  try {
    // 1. Extrai estritamente os campos que existem no schema
    const { nome, whatsapp, bairro } = req.body;

    // 2. Validação simples
    if (!nome) {
      return res.status(400).json({ erro: "O nome do doador é obrigatório." });
    }

    // 3. Salva no banco de dados
    const novoDoador = await prisma.doador.create({
      data: {
        nome,
        whatsapp,
        bairro
      }
    });

    // 4. Retorna sucesso e os dados
    return res.status(201).json({
      sucesso: true,
      mensagem: "Doador cadastrado com sucesso!",
      dados: novoDoador
    });

  } catch (erro) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao cadastrar doador.",
      detalhes: erro.message
    });
  }
});

// Rota para CADASTRAR um novo equipamento
app.post('/equipamentos', async (req, res) => {
  try {
    // 1. Extrai os dados do corpo da requisição
    const { doadorId, categoria, descricao, fotoUrl, status } = req.body;

    // 2. Validação: O banco exige que o equipamento pertença a um doador
    if (!doadorId) {
      return res.status(400).json({ erro: "O ID do doador é obrigatório para registrar o equipamento." });
    }

    // 3. Salva no banco de dados vinculando ao Doador
    const novoEquipamento = await prisma.equipamento.create({
      data: {
        doadorId,
        categoria,
        descricao,
        fotoUrl,
        status: status || "PENDENTE" // Se não enviarem status, assume como PENDENTE
      }
    });

    // 4. Retorna sucesso
    return res.status(201).json({
      sucesso: true,
      mensagem: "Equipamento cadastrado com sucesso!",
      dados: novoEquipamento
    });

  } catch (erro) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao cadastrar equipamento.",
      detalhes: erro.message
    });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});