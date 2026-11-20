import { z } from 'zod'

const emailSchema = z.string().trim().toLowerCase().email('E-mail inválido.').max(254)
const nomeSchema = z.string().trim().min(3, 'Informe o nome completo.').max(120)
const whatsappSchema = z.string().trim().min(10).max(20)
const bairroSchema = z.string().trim().min(2).max(120)

export const cadastroContaDoadorSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  whatsapp: whatsappSchema,
  bairro: bairroSchema,
  senha: z.string().min(8, 'A senha deve ter ao menos 8 caracteres.').max(128),
}).strict()

export const loginContaDoadorSchema = z.object({
  email: emailSchema,
  senha: z.string().min(1),
}).strict()

// E-mail não pode ser alterado aqui: exige um fluxo de verificação dedicado.
export const atualizarPerfilDoadorSchema = z.object({
  nome: nomeSchema.optional(),
  whatsapp: whatsappSchema.optional(),
  bairro: bairroSchema.optional(),
}).strict().refine((obj) => Object.keys(obj).length > 0, {
  message: 'Informe ao menos um campo para atualizar.',
})
