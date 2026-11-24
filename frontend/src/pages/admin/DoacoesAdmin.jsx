import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import StatusBadge from '../../components/admin/StatusBadge'
import { useDoacoesAdmin } from '../../hooks/useDoacoesAdmin'
import { formatarData, obterNomeEquipamento, STATUS_OPCOES } from '../../services/adminDoacoes'

// ============================================================
// GERENCIAMENTO DE DOAÇÕES
// 1. Lista equipamentos que existem no Prisma.
// 2. Filtra por nome, descrição, categoria, doador e status.
// 3. Atualiza status por PUT /equipamentos/:id (nunca localStorage).
// 4. Direciona para detalhes do equipamento.
// ============================================================
export default function DoacoesAdmin() {
  const { doacoes, carregando, erro, atualizandoId, recarregar, alterarStatus } = useDoacoesAdmin()
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState('TODOS')

  const filtradas = useMemo(() => {
    const termo = busca.toLocaleLowerCase('pt-BR').trim()
    return doacoes.filter((item) => {
      if (status !== 'TODOS' && item.status !== status) return false
      const texto = [item.id, item.descricao, item.categoria, item.doador?.nome, item.doador?.email]
        .join(' ').toLocaleLowerCase('pt-BR')
      return texto.includes(termo)
    })
  }, [busca, status, doacoes])

  return (
    <AdminLayout titulo="Gerenciamento de doações" descricao="Consulte os equipamentos cadastrados, veja o doador associado e atualize o andamento do registro.">
      {({ claro, painel, secundario }) => (
        <>
          {/* 1. Indicadores e atualização */}
          <section className="ec-admin-stats mb-6 grid gap-4 sm:grid-cols-3">
            <div className={`rounded-2xl border p-5 ${painel}`}>
              <p className={`text-sm ${secundario}`}>Total de equipamentos</p>
              <p className="mt-2 text-3xl font-black text-emerald-500">{doacoes.length}</p>
            </div>
            <div className={`rounded-2xl border p-5 ${painel}`}>
              <p className={`text-sm ${secundario}`}>Pendentes</p>
              <p className="mt-2 text-3xl font-black">{doacoes.filter((x) => x.status === 'PENDENTE').length}</p>
            </div>
            <div className={`rounded-2xl border p-5 ${painel}`}>
              <p className={`text-sm ${secundario}`}>Concluídos</p>
              <p className="mt-2 text-3xl font-black">{doacoes.filter((x) => x.status === 'CONCLUIDO').length}</p>
            </div>
          </section>

          {/* 2. Erros visíveis: não mostrar tela vazia como se fosse sucesso */}
          {erro && <div role="alert" className="mb-6 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-500">{erro} Se a sessão expirou, faça login novamente.</div>}

          {/* 3. Filtros de pesquisa */}
          <section className={`rounded-2xl border p-5 sm:p-7 ${painel}`}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold">Equipamentos registrados</h2>
                <p className={`mt-1 text-sm ${secundario}`}>{filtradas.length} de {doacoes.length} registro(s) exibido(s)</p>
              </div>
              <button type="button" onClick={recarregar} disabled={carregando}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-[#07120b] hover:bg-emerald-400 disabled:opacity-50">
                {carregando ? 'Atualizando...' : '↻ Atualizar'}
              </button>
            </div>
            <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_240px]">
              <div>
                <label htmlFor="busca-doacoes" className={`mb-2 block text-sm font-semibold ${secundario}`}>Buscar</label>
                <input id="busca-doacoes" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Nome, e-mail, categoria ou equipamento..."
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-emerald-400 ${claro ? 'border-slate-300 bg-slate-50' : 'border-white/10 bg-[#0b110e]'}`} />
              </div>
              <div>
                <label htmlFor="status-doacoes" className={`mb-2 block text-sm font-semibold ${secundario}`}>Status</label>
                <select id="status-doacoes" value={status} onChange={(e) => setStatus(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-sm ${claro ? 'border-slate-300 bg-slate-50' : 'border-white/10 bg-[#0b110e]'}`}>
                  <option value="TODOS">Todos os status</option>
                  {STATUS_OPCOES.map(({ valor, nome }) => <option key={valor} value={valor}>{nome}</option>)}
                </select>
              </div>
            </div>

            {/* 4. Tabela de dados reais. Sem 'quantidade' ou 'cidade' fictícias. */}
            {carregando ? (
              <p role="status" className={`py-12 text-center ${secundario}`}>Buscando equipamentos no SQLite...</p>
            ) : filtradas.length === 0 ? (
              <div className="py-12 text-center">
                <p className={`text-sm ${secundario}`}>Nenhum equipamento encontrado.</p>
                {(busca || status !== 'TODOS') && <button type="button" className="mt-3 text-sm font-bold text-emerald-500" onClick={() => {setBusca(''); setStatus('TODOS')}}>Limpar filtros</button>}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className={secundario}>
                    <tr><th className="px-3 py-3">Equipamento</th><th className="px-3 py-3">Doador</th><th className="px-3 py-3">Criado em</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Ações</th></tr>
                  </thead>
                  <tbody>
                    {filtradas.map((item) => (
                      <tr key={item.id} className={`border-t ${claro ? 'border-slate-200 hover:bg-slate-50' : 'border-white/10 hover:bg-white/[0.03]'}`}>
                        <td className="px-3 py-4">
                          <p className="font-bold">{obterNomeEquipamento(item.descricao)}</p>
                          <p className={`text-xs ${secundario}`}>{item.categoria}</p>
                          <p className={`mt-1 break-all text-[11px] ${secundario}`}>ID: {item.id}</p>
                        </td>
                        <td className="px-3 py-4">
                          <p className="font-semibold">{item.doador?.nome || 'Não localizado'}</p>
                          <p className={`text-xs ${secundario}`}>{item.doador?.email || 'Sem e-mail'}</p>
                        </td>
                        <td className={`px-3 py-4 ${secundario}`}>{formatarData(item.criadoEm)}</td>
                        <td className="px-3 py-4"><StatusBadge status={item.status} claro={claro} /></td>
                        <td className="px-3 py-4">
                          <div className="flex flex-col items-start gap-2">
                            <select aria-label={`Alterar status de ${obterNomeEquipamento(item.descricao)}`} value={item.status || 'PENDENTE'} disabled={atualizandoId === item.id}
                              onChange={(e) => alterarStatus(item.id, e.target.value)}
                              className={`rounded-lg border px-2 py-2 text-xs ${claro ? 'border-slate-300 bg-white' : 'border-white/10 bg-[#0b110e]'}`}>
                              {STATUS_OPCOES.map(({ valor, nome }) => <option value={valor} key={valor}>{nome}</option>)}
                            </select>
                            <Link to={`/admin/doacoes/${item.id}`} className="text-xs font-bold text-emerald-500 hover:underline">Ver detalhes</Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </AdminLayout>
  )
}
