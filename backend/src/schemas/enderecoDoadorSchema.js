import { z } from 'zod'

const enderecoBase = z.object({
  cep: z.string().trim().regex(/^\d{5}-?\d{3}$/, 'CEP inválido.')
    .transform((valor) => valor.replace(/\D/g, '')),
  logradouro: z.string().trim().min(2).max(180),
  numero: z.string().trim().min(1).max(20),
  bairro: z.string().trim().min(2).max(120),
  cidade: z.string().trim().min(2).max(120),
  estado: z.string().trim().regex(/^[a-z]{2}$/i, 'Informe a UF com duas letras.')
    .transform((valor) => valor.toUpperCase()),
  preferencial: z.boolean().optional(),
}).strict()

export const criarEnderecoDoadorSchema = enderecoBase

export const atualizarEnderecoDoadorSchema = enderecoBase.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: 'Informe ao menos um campo para atualizar.' }
)
