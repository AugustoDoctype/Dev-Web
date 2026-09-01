import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

export default function DetalhesMinhaDoacao() {
  const { id } = useParams()
  const [doacao, setDoacao] = useState(null)

  useEffect(() => {
    const doacoes = JSON.parse(localStorage.getItem('mock_doacoes') || '[]')
    const itemEncontrado = doacoes.find((item) => item.id === id)
    setDoacao(itemEncontrado)
  }, [id])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        {!doacao ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
            <h2 className="text-lg font-bold text-slate-800">Doação não encontrada</h2>
            <p className="mt-2 text-sm text-slate-500">
              O código informado não corresponde a nenhum registro local.
            </p>
            <Link
              to="/minhas-doacoes"
              className="mt-6 inline-block text-emerald-600 font-semibold text-sm hover:underline"
            >
              ← Voltar para Minhas Doações
            </Link>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400">CÓDIGO DA DOAÇÃO</span>
                <h1 className="text-2xl font-black text-slate-900 font-mono">{doacao.id}</h1>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 font-semibold text-xs rounded-full border border-amber-200">
                {doacao.status}
              </span>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <strong className="block text-slate-900">Equipamento:</strong>
                <span>{doacao.equipamento}</span>
              </div>
              <div>
                <strong className="block text-slate-900">Doador:</strong>
                <span>{doacao.nomeDoador}</span>
              </div>
              <div>
                <strong className="block text-slate-900">Endereço de Coleta:</strong>
                <span>
                  {doacao.rua}, {doacao.numero} - {doacao.bairro} ({doacao.cidade}/{doacao.estado})
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
              <Link
                to="/minhas-doacoes"
                className="text-emerald-600 font-semibold text-xs hover:underline"
              >
                ← Voltar
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}