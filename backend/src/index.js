import express from 'express';
import prisma from './lib/prisma.js'; // Em ES Modules, é obrigatório incluir a extensão .js em caminhos locais
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

// ==========================================
// MIDDLEWARE DE SEGURANÇA (VERIFICADOR DE TOKEN)
// ==========================================
const verificarToken = (req, res, next) => {
  // 1. Inspeciona os cabeçalhos da requisição em busca do "Authorization"
  const authHeader = req.headers['authorization'];
  
  // O padrão do mercado é enviar o token assim: "Bearer abc123token..."
  // Então nós separamos a palavra "Bearer" do token em si
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ erro: "Acesso negado. Nenhum token foi fornecido." });
  }

  try {
    // 2. Tenta descriptografar e validar o token com a MESMA chave do Login
    const decodificado = jwt.verify(token, "CHAVE_SUPER_SECRETA_DO_PROJETO");
    
    // 3. Se for válido, salva os dados do admin logado dentro da requisição
    req.adminLogado = decodificado;
    
    // 4. Libera a catraca!
    next(); 
  } catch (erro) {
    return res.status(403).json({ erro: "Token inválido, adulterado ou expirado." });
  }
};

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

// ==========================================
// ROTA PARA CADASTRAR UM ADMINISTRADOR
// ==========================================
app.post('/admins', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
    }

    // 1. Verifica se o email já está em uso
    const adminExistente = await prisma.admin.findUnique({ where: { email } });
    if (adminExistente) {
      return res.status(400).json({ erro: "Este email já está cadastrado." });
    }

    // 2. Criptografa a senha em texto puro (o '10' é o nível de segurança do salto)
    const senhaHash = await bcrypt.hash(senha, 10);

    // 3. Salva no banco (substituindo a 'senha' pela 'senhaHash')
    const novoAdmin = await prisma.admin.create({
      data: {
        nome,
        email,
        senhaHash
      }
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: "Administrador criado com sucesso!",
      // Retornamos os dados sem a senhaHash por segurança
      dados: { id: novoAdmin.id, nome: novoAdmin.nome, email: novoAdmin.email } 
    });

  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao cadastrar administrador.", detalhes: erro.message });
  }
});

// ==========================================
// ROTA DE LOGIN (AUTENTICAÇÃO)
// ==========================================
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Busca o admin pelo email
    const admin = await prisma.admin.findUnique({ where: { email } });
    
    // Se não achar o email, retorna erro genérico por segurança
    if (!admin) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }

    // 2. Compara a senha digitada com o Hash salvo no banco
    const senhaValida = await bcrypt.compare(senha, admin.senhaHash);
    
    if (!senhaValida) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }

    // 3. Se a senha bater, gera o Token JWT
    // Em produção, a chave "SEGREDO_AQUI" deve ficar em um arquivo .env
    const token = jwt.sign(
      { id: admin.id, nome: admin.nome }, 
      "CHAVE_SUPER_SECRETA_DO_PROJETO", 
      { expiresIn: '1d' } // O token expira em 1 dia
    );

    // 4. Retorna o token para o front-end
    return res.status(200).json({
      sucesso: true,
      mensagem: "Login realizado com sucesso!",
      token: token
    });

  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao fazer login.", detalhes: erro.message });
  }
});

// ==========================================
// ROTA PROTEGIDA: LISTAR EQUIPAMENTOS
// ==========================================
// Note que passamos o 'verificarToken' antes do (req, res)
app.get('/equipamentos', verificarToken, async (req, res) => {
  try {
    const equipamentos = await prisma.equipamento.findMany();
    
    return res.status(200).json({
      sucesso: true,
      // Apenas para provar que sabemos quem acessou:
      adminQueAcessou: req.adminLogado.nome, 
      total: equipamentos.length,
      dados: equipamentos
    });
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao buscar equipamentos." });
  }
});

// ==========================================
// ROTA PROTEGIDA: LISTAR DOADORES
// ==========================================
app.get('/doadores', verificarToken, async (req, res) => {
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

// ==========================================
// ROTA PROTEGIDA: ATUALIZAR EQUIPAMENTO
// ==========================================
app.put('/equipamentos/:id', verificarToken, async (req, res) => {
  try {
    // Extrai o ID direto da URL
    const { id } = req.params; 
    
    // Extrai os dados que o admin quer alterar
    const { status, descricao, destinoFinal } = req.body;

    // Pede ao Prisma para encontrar o equipamento pelo ID e atualizar os campos
    const equipamentoAtualizado = await prisma.equipamento.update({
      where: { id },
      data: {
        status,
        descricao,
        destinoFinal
      }
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Status do equipamento atualizado com sucesso!",
      dados: equipamentoAtualizado
    });

  } catch (erro) {
    // Se o Prisma não achar o ID, ele cai no catch
    return res.status(500).json({ 
      erro: "Erro ao atualizar equipamento. Verifique se o ID está correto.", 
      detalhes: erro.message 
    });
  }
});

// ==========================================
// ROTA PROTEGIDA: DELETAR EQUIPAMENTO
// ==========================================
app.delete('/equipamentos/:id', verificarToken, async (req, res) => {
  try {
    // 1. Pega o ID que vem na URL
    const { id } = req.params;
 
    // 2. Manda o Prisma deletar o registro correspondente
    await prisma.equipamento.delete({
      where: { id }
    });

    // 3. Retorna sucesso (sem dados, pois o item não existe mais)
    return res.status(200).json({
      sucesso: true,
      mensagem: "Equipamento excluído com sucesso!"
    });

  } catch (erro) {
    return res.status(500).json({ 
      erro: "Erro ao excluir equipamento. Verifique se o ID existe.", 
      detalhes: erro.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});