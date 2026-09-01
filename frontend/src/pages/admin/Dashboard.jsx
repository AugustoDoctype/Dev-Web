import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DashboardAdmin() {
  const navigate = useNavigate()
  const [doacoes, setDoacoes] = useState([])

  useEffect(() => {
    carregarDoacoes()
  }, [])

  const carregarDoacoes = () => {
    const dados = JSON.parse(localStorage.getItem('mock_doacoes') || '[]')
    setDoacoes(dados)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  const handleAlterarStatus = (id, novoStatus) => {
    const doacoesAtualizadas = doacoes.map((item) =>
      item.id === id ? { ...item, status: novoStatus } : item
    )
    setDoacoes(doacoesAtualizadas)
    localStorage.setItem('mock_doacoes', JSON.stringify(doacoesAtualizadas))
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Header Admin */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">E-Ciclo | Painel Administrativo</h1>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:text-red-800 transition"
        >
          Sair do Painel
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Gerenciamento de Doações ({doacoes.length})
          </h2>
        </div>

        {doacoes.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
            Nenhuma doação cadastrada no momento.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Código</th>
                  <th className="px-6 py-3">Equipamento</th>
                  <th className="px-6 py-3">Doador</th>
                  <th className="px-6 py-3">Telefone</th>
                  <th className="px-6 py-3">Cidade / UF</th>
                  <th className="px-6 py-3">Status Atual</th>
                  <th className="px-6 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doacoes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{item.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.equipamento}</td>
                    <td className="px-6 py-4">{item.nomeDoador}</td>
                    <td className="px-6 py-4">{item.telefone}</td>
                    <td className="px-6 py-4">{item.cidade ? `${item.cidade}/${item.estado}` : '-'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleAlterarStatus(item.id, e.target.value)}
                        className="px-2 py-1 text-xs rounded border border-slate-300 bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="PENDENTE">Pendente</option>
                        <option value="EM_ANALISE">Em Análise</option>
                        <option value="AGUARDANDO_COLETA">Aguardando Coleta</option>
                        <option value="CONCLUIDO">Concluído</option>
                        <option value="CANCELADO">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/doacoes/${item.id}`)}
                        className="text-xs text-emerald-600 font-semibold hover:underline"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}