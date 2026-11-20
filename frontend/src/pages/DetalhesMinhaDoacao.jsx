import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import { apiFetch } from '../services/api'

// ==========================================
// STATUS DO EQUIPAMENTO
// ==========================================

const nomesStatus = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em análise',
  AGUARDANDO_COLETA: 'Aguardando coleta',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}

// ==========================================
// PÁGINA DE DETALHES
// ==========================================

export default function DetalhesMinhaDoacao() {
  const { id } = useParams()

  const [doacao, setDoacao] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  // Busca o equipamento sempre que o código mudar.
  useEffect(() => {
    let ativo = true

    async function carregarDoacao() {
      try {
        const resposta = await apiFetch(
          `/acompanhamento/${encodeURIComponent(id)}`
        )

        if (ativo) {
          setDoacao(resposta.dados)
          setErro('')
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message || 'Doação não encontrada.')
          setDoacao(null)
        }
      } finally {
        if (ativo) setLoading(false)
      }
    }

    carregarDoacao()

    return () => {
      ativo = false
    }
  }, [id])

  // ==========================================
  // INTERFACE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold">
            Acompanhamento da doação
          </h1>

          {loading && (
            <p className="mt-6 text-slate-600">
              Consultando equipamento...
            </p>
          )}

          {!loading && erro && (
            <p role="alert" className="mt-6 text-red-600">
              {erro}
            </p>
          )}

          {!loading && doacao && (
            <div className="mt-8 space-y-5">
              <div>
                <p className="text-sm text-slate-500">
                  Categoria
                </p>
                <p className="font-bold">
                  {doacao.categoria}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Status atual
                </p>
                <p className="font-bold text-emerald-700">
                  {nomesStatus[doacao.status] || doacao.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Data do cadastro
                </p>
                <p>
                  {new Date(doacao.criadoEm).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Última atualização
                </p>
                <p>
                  {new Date(doacao.atualizadoEm).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          )}

          <Link
            to="/minhas-doacoes"
            className="mt-8 inline-block font-semibold text-emerald-700 hover:underline"
          >
            ← Voltar para consulta
          </Link>
        </div>
      </main>
    </div>
  )
}
