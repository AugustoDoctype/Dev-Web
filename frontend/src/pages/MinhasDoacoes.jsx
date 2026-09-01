import { useState } from 'react'
import Navbar from '../components/public/Navbar'
import { apiFetch } from '../services/api'

export default function MinhasDoacoes() {
  const [cpf, setCpf] = useState('')
  const [doacoes, setDoacoes] = useState([])
  const [loading, setLoading] = useState(false)
  const [buscou, setBuscou] = useState(false)
  const [erro, setErro] = useState('')

  const aplicarMascaraCPF = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14)
  }

  const handleCpfChange = (e) => {
    setCpf(aplicarMascaraCPF(e.target.value))
  }

  const handleBuscar = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErro('')
    setBuscou(true)

    try {
      const cpfLimpo = cpf.replace(/\D/g, '')
      const dados = await apiFetch(`/doacoes/usuario/${cpfLimpo}`)
      setDoacoes(dados)
    } catch (err) {
      setErro(err.message || 'Nenhuma doação encontrada para este CPF.')
      setDoacoes([])
    } finally {
      setLoading(false)
    }
  }

  const renderStatusTag = (status) => {
    const mapa = {
      PENDENTE: { label: 'Pendente', class: 'bg-amber-100 text-amber-800' },
      EM_ANALISE: { label: 'Em Análise', class: 'bg-blue-100 text-blue-800' },
      AGUARDANDO_COLETA: { label: 'Aguardando Coleta', class: 'bg-purple-100 text-purple-800' },
      CONCLUIDO: { label: 'Concluído', class: 'bg-emerald-100 text-emerald-800' },
      CANCELADO: { label: 'Cancelado', class: 'bg-red-100 text-red-800' }
    }
    const config = mapa[status] || { label: status, class: 'bg-slate-100 text-slate-800' }
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config.class}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Acompanhar Minhas Doações
          </h1>
          <p className="mt-2 text-slate-600 text-sm">
            Digite o CPF utilizado no momento do cadastro para verificar o status de coleta e descarte dos equipamentos.
          </p>

          <form onSubmit={handleBuscar} className="mt-6 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow transition disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Consultar'}
            </button>
          </form>

          {erro && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {erro}
            </div>
          )}

          {/* Resultado da busca */}
          {buscou && !loading && doacoes.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Doações Encontradas ({doacoes.length})</h2>
              <div className="grid grid-cols-1 gap-4">
                {doacoes.map((item) => (
                  <div key={item.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{item.equipamento}</h3>
                        <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">{item.categoria}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Cadastrado em: {new Date(item.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {renderStatusTag(item.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {buscou && !loading && doacoes.length === 0 && !erro && (
            <p className="mt-8 text-center text-slate-500 py-6">
              Nenhuma doação vinculada a este CPF foi encontrada.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}