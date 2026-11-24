import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_ISSUER } from '../config/jwt.js'
import { JWT_DOADOR_AUDIENCE } from '../config/jwtDoador.js'

// Exclusivo para contas comuns de doadores. Não aceita JWT administrativo.
export function verificarDoador(req, res, next) {
  const authorization = req.get('Authorization') || ''
  const partes = /^Bearer\s+(\S+)$/i.exec(authorization)

  if (!partes) {
    return res.status(401).json({ erro: 'Acesso negado. Faça login como doador.' })
  }

  try {
    const payload = jwt.verify(partes[1], JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_DOADOR_AUDIENCE,
    })

    if (!payload || typeof payload !== 'object' ||
        typeof payload.id !== 'string' || payload.tipo !== 'DOADOR') {
      return res.status(403).json({ erro: 'Sessão de doador inválida ou expirada.' })
    }

    req.doadorLogado = { id: payload.id }
    next()
  } catch {
    return res.status(403).json({ erro: 'Sessão de doador inválida ou expirada.' })
  }
}
