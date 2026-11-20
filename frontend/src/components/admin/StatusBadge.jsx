import { ESTILO_STATUS, nomeStatus } from '../../services/adminDoacoes'

const CLARO = {
  PENDENTE: 'border-amber-300 bg-amber-50 text-amber-800',
  EM_ANALISE: 'border-sky-300 bg-sky-50 text-sky-800',
  AGUARDANDO_COLETA: 'border-violet-300 bg-violet-50 text-violet-800',
  CONCLUIDO: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  CANCELADO: 'border-rose-300 bg-rose-50 text-rose-800',
}

export default function StatusBadge({ status, claro = false }) {
  const classe = claro
    ? (CLARO[status] || 'border-slate-300 bg-slate-100 text-slate-700')
    : (ESTILO_STATUS[status] || 'border-slate-400/20 bg-slate-400/10 text-slate-300')

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${classe}`}>
      {nomeStatus(status)}
    </span>
  )
}
