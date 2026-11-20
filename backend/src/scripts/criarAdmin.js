// Uso: printf '%s\n' "$SENHA" | node src/scripts/criarAdmin.js "Nome" "email@exemplo.com"
// A senha chega pela entrada-padrão, não por argumentos da linha de comando.
import 'dotenv/config'
import prisma from '../lib/prisma.js'
import bcrypt from 'bcryptjs'
import { adminCadastroSchema } from '../schemas/adminSchema.js'

async function executar() {
  const [nome, email] = process.argv.slice(2)
  let senha = ''
  for await (const bloco of process.stdin) senha += bloco.toString()
  senha = senha.replace(/\r?\n$/, '')

  const dados = adminCadastroSchema.parse({ nome, email, senha })
  const emailNormalizado = dados.email.trim().toLowerCase()

  const existente = await prisma.admin.findUnique({ where: { email: emailNormalizado } })
  if (existente) {
    throw new Error('Já existe um administrador com esse e-mail.')
  }

  const admin = await prisma.admin.create({
    data: {
      nome: dados.nome.trim(),
      email: emailNormalizado,
      senhaHash: await bcrypt.hash(dados.senha, 12),
    },
    select: { id: true, nome: true, email: true },
  })

  console.log(`Administrador criado: ${admin.nome} (${admin.email})`)
}

try {
  await executar()
} catch (error) {
  console.error(error.issues ? 'Dados inválidos: verifique nome, e-mail e tamanho da senha.' : error.message)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
