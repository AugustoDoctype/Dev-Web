import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json()); // Permite o Express entender JSON no corpo da requisição

// Rota de teste (Healthcheck)
app.get('/', (req, res) => {
  return res.json({
    sucesso: true,
    mensagem: "API do Reconecta rodando com sucesso! 🚀"
  });
});

// Rota mockada de categorias para o Front já ir testando
app.get('/categorias', (req, res) => {
  const categorias = [
    "Monitor", 
    "Placa-mãe", 
    "Notebook", 
    "Computador completo", 
    "Periférico", 
    "Outros"
  ];
  return res.json({ sucesso: true, dados: categorias });
});

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando na porta http://localhost:${PORT}`);
});