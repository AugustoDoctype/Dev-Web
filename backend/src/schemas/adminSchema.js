import { z } from 'zod'

export const adminCadastroSchema = z.object({
  nome: z.string().trim().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.email('Formato de e-mail inválido.'),
  senha: z.string().min(12, 'A senha deve ter pelo menos 12 caracteres.'),
})

export const adminLoginSchema = z.object({
  email: z.email('Formato de e-mail inválido.'),
  senha: z.string().min(1, 'A senha é obrigatória.'),
})
