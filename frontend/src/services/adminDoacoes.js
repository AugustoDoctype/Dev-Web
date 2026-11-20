import { apiFetch } from './api'

// ============================================================
// 1. CONTRATO COM O BACKEND
// A fonte oficial dos registros é o Prisma/SQLite, nunca localStorage.
// Os endpoints abaixo já existem no backend do E-Ciclo.
// ============================================================
export const STATUS_OPCOES = [
  { valor: 'PENDENTE', nome: 'Pendente' },
  { valor: 'EM_ANALISE', nome: 'Em análise' },
  { valor: 'AGUARDANDO_COLETA', nome: 'Aguardando coleta' },
  { valor: 'CONCLUIDO', nome: 'Concluído' },
  { valor: 'CANCELADO', nome: 'Cancelado' },
]

export const ESTILO_STATUS = {
  PENDENTE: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  EM_ANALISE: 'border-sky-400/25 bg-sky-400/10 text-sky-300',
  AGUARDANDO_COLETA: 'border-violet-400/25 bg-violet-400/10 text-violet-300',
  CONCLUIDO: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  CANCELADO: 'border-rose-400/25 bg-rose-400/10 text-rose-300',
}

export function nomeStatus(status) {
  return STATUS_OPCOES.find((item) => item.valor === status)?.nome || status || 'Sem status'
}

export function formatarData(data) {
  if (!data) return 'Não informada'
  const date = new Date(data)
  if (Number.isNaN(date.getTime())) return 'Não informada'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short', timeStyle: 'short',
  }).format(date)
}

// Hoje o banco armazena o nome e a condição dentro da descrição.
// Esta é uma interpretação visual; não substitui campos próprios no schema.
export function obterNomeEquipamento(descricao) {
  if (!descricao) return 'Equipamento sem descrição'
  return descricao.split(' - ')[0]?.trim() || descricao
}

// ============================================================
// 2. CONSULTA DOS REGISTROS
// GET /equipamentos -> lista de equipamentos (exige JWT)
// GET /doadores    -> lista com doador/equipamentos (exige JWT)
// Associamos as duas respostas por doadorId.
// ============================================================
export async function listarDoacoesAdmin() {
  const [respostaEquipamentos, respostaDoadores] = await Promise.all([
    apiFetch('/equipamentos'),
    apiFetch('/doadores'),
  ])

  if (!Array.isArray(respostaEquipamentos?.dados)) {
    throw new Error('A API não retornou uma lista válida de equipamentos.')
  }
  if (!Array.isArray(respostaDoadores?.dados)) {
    throw new Error('A API não retornou uma lista válida de doadores.')
  }

  const doadoresPorId = new Map(
    respostaDoadores.dados.map((doador) => [String(doador.id), doador])
  )

  return respostaEquipamentos.dados
    .map((equipamento) => ({
      ...equipamento,
      doador: doadoresPorId.get(String(equipamento.doadorId)) || null,
    }))
    .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))
}

// ============================================================
// 3. ALTERAÇÃO DE STATUS
// PUT /equipamentos/:id -> alteração persistida no SQLite.
// O frontend oferece somente os cinco status definidos na interface.
// ============================================================
export async function atualizarStatusEquipamento(id, status) {
  if (!STATUS_OPCOES.some((item) => item.valor === status)) {
    throw new Error('Status de equipamento inválido.')
  }

  const resposta = await apiFetch(`/equipamentos/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })

  if (!resposta?.dados?.id) {
    throw new Error('A API não confirmou a atualização do equipamento.')
  }
  return resposta.dados
}
