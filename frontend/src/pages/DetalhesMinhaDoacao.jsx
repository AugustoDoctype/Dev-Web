import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import { apiFetch } from '../services/api'

// ============================================================
// 1. STATUS E FORMATAÇÃO DE DATAS
// ============================================================
const nomesStatus = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em análise',
  AGUARDANDO_COLETA: 'Aguardando coleta',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}

function formatarData(valor, comHora = false) {
  if (!valor) return 'Não informada'

  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return 'Não informada'

  return comHora
    ? data.toLocaleString('pt-BR')
    : data.toLocaleDateString('pt-BR')
}

// ============================================================
// 2. PÁGINA DE DETALHES
// ============================================================
export default function DetalhesMinhaDoacao() {
  // O parâmetro :id da rota contém o código de acompanhamento.
  const { id } = useParams()
  const codigo = String(id || '').trim().toUpperCase()

  const [doacao, setDoacao] = useState(null)
  const [minhaDoacao, setMinhaDoacao] = useState(false)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarDoacao() {
      setLoading(true)
      setErro('')
      setDoacao(null)
      setMinhaDoacao(false)

      if (!/^[0-9A-F]{32}$/.test(codigo)) {
        if (ativo) {
          setErro('Código de acompanhamento inválido.')
          setLoading(false)
        }
        return
      }

      try {
        // ====================================================
        // 2.1. Se houver login, procura o equipamento na
        //      lista privada do próprio doador.
        // ====================================================
        if (localStorage.getItem('doadorToken')) {
          try {
            const respostaPrivada = await apiFetch(
              '/doadores/me/equipamentos',
              { auth: 'doador' }
            )

            const equipamentoProprio = Array.isArray(respostaPrivada?.dados)
              ? respostaPrivada.dados.find(
                  (item) => item.codigoAcompanhamento?.toUpperCase() === codigo
                )
              : null

            if (equipamentoProprio) {
              if (ativo) {
                setDoacao(equipamentoProprio)
                setMinhaDoacao(true)
              }
              return
            }
          } catch {
            // Sessão expirada ou API privada indisponível:
            // ainda é possível realizar a consulta pública.
          }
        }

        // ====================================================
        // 2.2. Consulta pública para visitantes ou códigos
        //      que não pertencem à conta autenticada.
        // ====================================================
        const respostaPublica = await apiFetch(
          `/acompanhamento/${encodeURIComponent(codigo)}`,
          { auth: 'none' }
        )

        if (!respostaPublica?.dados) {
          throw new Error('Não foi possível obter os dados da doação.')
        }

        if (ativo) {
          setDoacao(respostaPublica.dados)
          setMinhaDoacao(false)
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
  }, [codigo])

  // ============================================================
  // 3. INTERFACE (mantém o visual original)
  // ============================================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold">
            Acompanhamento da doação
          </h1>

          {loading && (
            <p className="mt-6 text-slate-600" role="status">
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
              {/* Dados extras somente para o dono autenticado. */}
              {minhaDoacao && doacao.descricao && (
                <div>
                  <p className="text-sm text-slate-500">Equipamento e descrição</p>
                  <p className="font-bold">{doacao.descricao}</p>
                </div>
              )}

              {minhaDoacao && doacao.enderecoColetaLogradouro && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Endereço escolhido para esta doação</p>
                  <p className="mt-1 font-bold">
                    {doacao.enderecoColetaLogradouro}, {doacao.enderecoColetaNumero}
                  </p>
                  <p className="text-sm text-slate-700">
                    {doacao.enderecoColetaBairro} — {doacao.enderecoColetaCidade}/{doacao.enderecoColetaEstado}
                  </p>
                  <p className="text-sm text-slate-600">CEP: {doacao.enderecoColetaCep}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Endereço registrado no momento da doação. Alterações no perfil não afetam este registro.
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-500">Categoria</p>
                <p className="font-bold">{doacao.categoria}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Status atual</p>
                <p className="font-bold text-emerald-700">
                  {nomesStatus[doacao.status] || doacao.status || 'Indisponível'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Data do cadastro</p>
                <p>{formatarData(doacao.criadoEm)}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Última atualização</p>
                <p>{formatarData(doacao.atualizadoEm, true)}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Código de acompanhamento</p>
                <p className="break-all font-mono text-sm font-semibold">
                  {codigo}
                </p>
              </div>
            </div>
          )}

          <Link
            to="/minhas-doacoes"
            className="mt-8 inline-block font-semibold text-emerald-700 hover:underline"
          >
            ← {minhaDoacao ? 'Voltar para minhas doações' : 'Voltar para consulta'}
          </Link>
        </div>
      </main>
    </div>
  )
}
