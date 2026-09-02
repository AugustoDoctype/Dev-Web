import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Separa a palavra "Bearer" do token em si
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: "Acesso negado. Nenhum token foi fornecido." });
  }

  try {
    const decodificado = jwt.verify(token, "CHAVE_SUPER_SECRETA_DO_PROJETO");
    req.adminLogado = decodificado;
    
    // next() é o comando do Express que libera a catraca para a rota continuar
    next(); 
  } catch (erro) {
    return res.status(403).json({ erro: "Token inválido, adulterado ou expirado." });
  }
};