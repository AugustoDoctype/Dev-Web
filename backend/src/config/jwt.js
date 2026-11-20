// Configuração única de autenticação. Nunca manter segredos no repositório.
import 'dotenv/config'

export const JWT_ISSUER = 'eciclo-api'
export const JWT_AUDIENCE = 'eciclo-admin'

export const JWT_SECRET = process.env.JWT_SECRET?.trim()

if (!JWT_SECRET || Buffer.byteLength(JWT_SECRET, 'utf8') < 32 || JWT_SECRET === 'CHAVE_SUPER_SECRETA_DO_PROJETO' || JWT_SECRET.startsWith('SUBSTITUA_POR_')) {
  throw new Error(
    'JWT_SECRET ausente ou fraco. Configure uma chave aleatória com pelo menos 32 bytes em backend/.env.'
  )
}
