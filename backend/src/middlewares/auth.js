import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE } from '../config/jwt.js'

// Autoriza apenas JWTs emitidos pela API administrativa do E-Ciclo.
export function verificarToken(req, res, next) {
  const authorization = req.get('Authorization') || ''
  const partes = /^Bearer\s+(\S+)$/i.exec(authorization)

  if (!partes) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' })
  }

  try {
    const payload = jwt.verify(partes[1], JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })

    if (!payload || typeof payload !== 'object' || typeof payload.id !== 'string') {
      return res.status(403).json({ erro: 'Token inválido ou expirado.' })
    }

    req.adminLogado = { id: payload.id, nome: payload.nome }
    next()
  } catch {
    return res.status(403).json({ erro: 'Token inválido ou expirado.' })
  }
}
