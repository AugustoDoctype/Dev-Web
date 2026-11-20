import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import StatusBadge from '../../components/admin/StatusBadge'
import { useDoacoesAdmin } from '../../hooks/useDoacoesAdmin'
import { formatarData, nomeStatus, obterNomeEquipamento, STATUS_OPCOES } from '../../services/adminDoacoes'

// ============================================================
// DASHBOARD ADMINISTRATIVO — VISÃO GERAL
// 1. Carrega equipamentos e doadores do SQLite via API.
// 2. Calcula indicadores a partir dos dados reais.
// 3. Permite filtrar, recarregar e alterar o status de cada item.
// ============================================================
export default function DashboardAdmin() {
  const { doacoes, carregando, erro, atualizandoId, recarregar, alterarStatus } = useDoacoesAdmin()
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('TODOS')

  const totais = useMemo(() => {
    const porStatus = Object.fromEntries(STATUS_OPCOES.map(({ valor }) => [valor, 0]))
    for (const item of doacoes) {
      if (Object.hasOwn(porStatus, item.status)) porStatus[item.status] += 1
    }
    return { total: doacoes.length, porStatus }
  }, [doacoes])

  const visiveis = useMemo(() => {
    const termo = busca.toLocaleLowerCase('pt-BR').trim()
    return doacoes.filter((item) => {
      if (filtroStatus !== 'TODOS' && item.status !== filtroStatus) return false
      const texto = [item.id, item.descricao, item.categoria, item.doador?.nome, item.doador?.email]
        .join(' ').toLocaleLowerCase('pt-BR')
      return texto.includes(termo)
    })
  }, [doacoes, busca, filtroStatus])

  return (
    <AdminLayout
      titulo="Visão geral"
      descricao="Indicadores e registros reais da API do E-Ciclo, atualizados a partir do SQLite."
    >
      {({ claro, painel, secundario }) => (
        <>
          {/* 1. Situação da conexão com a API */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className={`text-sm ${secundario}`}>
              {carregando ? 'Consultando banco de dados...' : `${totais.total} equipamento(s) registrado(s)`}
            </p>
            <button type="button" onClick={recarregar} disabled={carregando}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-[#07120b] transition hover:bg-emerald-400 disabled:opacity-50">
              {carregando ? 'Atualizando...' : '↻ Atualizar dados'}
            </button>
          </div>
          {erro && <p role="alert" className="mb-6 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-500">{erro} Confira se a sessão é válida e o backend está ligado.</p>}

          {/* 2. Indicadores calculados com os dados reais */}
          <section aria-label="Indicadores de equipamentos" className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className={`rounded-2xl border p-5 ${painel}`}>
              <p className={`text-sm ${secundario}`}>Total de equipamentos</p>
              <p className="mt-3 text-4xl font-black text-emerald-500">{totais.total}</p>
              <p className={`mt-2 text-xs ${secundario}`}>Registros persistidos no SQLite</p>
            </div>
            {STATUS_OPCOES.map(({ valor, nome }) => (
              <div className={`rounded-2xl border p-5 ${painel}`} key={valor}>
                <p className={`text-sm ${secundario}`}>{nome}</p>
                <p className="mt-3 text-4xl font-black">{totais.porStatus[valor]}</p>
                <p className={`mt-2 text-xs ${secundario}`}>{totais.total ? Math.round(totais.porStatus[valor] / totais.total * 100) : 0}% do total</p>
              </div>
            ))}
          </section>

          {/* 3. Busca e filtro */}
          <section className={`rounded-2xl border p-5 ${painel}`}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">Registros recentes</h2>
                <p className={`mt-1 text-sm ${secundario}`}>Busque por equipamento, categoria ou doador.</p>
              </div>
              <Link to="/admin/doacoes" className="text-sm font-bold text-emerald-500 hover:underline">Ver todas as doações</Link>
            </div>
            <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_230px]">
              <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar registros..."
                aria-label="Pesquisar registros"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-emerald-400 ${claro ? 'border-slate-300 bg-slate-50 text-slate-900' : 'border-white/10 bg-[#0b110e] text-white'}`} />
              <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} aria-label="Filtrar status"
                className={`rounded-xl border px-4 py-3 text-sm ${claro ? 'border-slate-300 bg-slate-50' : 'border-white/10 bg-[#0b110e]'}`}>
                <option value="TODOS">Todos os status</option>
                {STATUS_OPCOES.map(({ valor, nome }) => <option value={valor} key={valor}>{nome}</option>)}
              </select>
            </div>
            {carregando ? (
              <p role="status" className={`py-10 text-center ${secundario}`}>Carregando equipamentos...</p>
            ) : visiveis.length === 0 ? (
              <p className={`py-10 text-center ${secundario}`}>Nenhum equipamento encontrado. Verifique os filtros ou cadastre uma doação.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className={secundario}>
                    <tr><th className="px-3 py-3">Equipamento</th><th className="px-3 py-3">Doador</th><th className="px-3 py-3">Data</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Ações</th></tr>
                  </thead>
                  <tbody>
                    {visiveis.slice(0, 10).map((item) => (
                      <tr key={item.id} className={`border-t ${claro ? 'border-slate-200' : 'border-white/10'}`}>
                        <td className="px-3 py-4"><p className="font-semibold">{obterNomeEquipamento(item.descricao)}</p><p className={`text-xs ${secundario}`}>{item.categoria}</p></td>
                        <td className="px-3 py-4">{item.doador?.nome || 'Não localizado'}</td>
                        <td className={`px-3 py-4 ${secundario}`}>{formatarData(item.criadoEm)}</td>
                        <td className="px-3 py-4"><StatusBadge status={item.status} claro={claro} /></td>
                        <td className="px-3 py-4">
                          <div className="flex flex-col gap-2">
                            <select aria-label={`Atualizar status de ${obterNomeEquipamento(item.descricao)}`} value={item.status || 'PENDENTE'} disabled={atualizandoId === item.id}
                              onChange={(e) => alterarStatus(item.id, e.target.value)}
                              className={`max-w-44 rounded-lg border px-2 py-2 text-xs ${claro ? 'border-slate-300 bg-white' : 'border-white/10 bg-[#0b110e]'}`}>
                              {STATUS_OPCOES.map(({ valor }) => <option value={valor} key={valor}>{nomeStatus(valor)}</option>)}
                            </select>
                            <Link to={`/admin/doacoes/${item.id}`} className="text-xs font-bold text-emerald-500 hover:underline">Detalhes</Link>
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
