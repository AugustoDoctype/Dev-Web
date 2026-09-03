import { z } from 'zod';

export const criarEquipamentoSchema = z.object({
  doadorId: z.string().min(1, "O ID do doador não pode estar vazio."),
  categoria: z.string().min(3, "A categoria deve ter pelo menos 3 caracteres."),
  descricao: z.string().min(5, "A descrição deve ser mais detalhada (mínimo 5 caracteres)."),
  status: z.string().optional() // Opcional, pois você já define "PENDENTE" por padrão no Prisma
});