// Mesmo segredo e emissor do projeto, mas um público (audience) diferente do admin.
// Assim, um token de doador não pode acessar endpoints administrativos.
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_ISSUER } from './jwt.js'

export const JWT_DOADOR_AUDIENCE = 'eciclo-doador'

export function criarTokenDoador(doador) {
  return jwt.sign(
    { id: doador.id, tipo: 'DOADOR' },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      issuer: JWT_ISSUER,
      audience: JWT_DOADOR_AUDIENCE,
      expiresIn: '8h',
    }
  )
}
