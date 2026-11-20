import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

// ============================================================
// 1. CONFIRMAÇÃO DA DOAÇÃO
// ============================================================
export default function Confirmacao() {
  const location = useLocation()
  const doacao = location.state?.doacao

  // O código é necessário para mostrar uma confirmação real.
  const codigo = typeof doacao?.codigoAcompanhamento === 'string'
    ? doacao.codigoAcompanhamento.trim().toUpperCase()
    : ''
  const doacaoConfirmada = /^[0-9A-F]{32}$/.test(codigo)

  // A sessão serve apenas para definir os atalhos da interface.
  // A autorização de acesso continua sendo validada pelo backend.
  const doadorLogado = Boolean(localStorage.getItem('doadorToken'))
  const [mensagemCopia, setMensagemCopia] = useState('')

  // ============================================================
  // 2. COPIAR CÓDIGO DE ACOMPANHAMENTO
  // ============================================================
  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(codigo)
      setMensagemCopia('Código copiado!')
    } catch {
      setMensagemCopia('Não foi possível copiar. Selecione o código acima.')
    }
  }

  // ============================================================
  // 3. INTERFACE
  // ============================================================
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          {doacaoConfirmada ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-600">
                ✓
              </div>

              <h1 className="mt-6 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Doação cadastrada com sucesso!
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Recebemos o cadastro do seu equipamento. Você pode acompanhar
                seu andamento a qualquer momento.
              </p>

              {(doacao.equipamento || doacao.categoria) && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Equipamento cadastrado
                  </p>

                  {doacao.equipamento && (
                    <p className="mt-1 font-bold text-slate-900">
                      {doacao.equipamento}
                    </p>
                  )}

                  {doacao.categoria && (
                    <p className="mt-1 text-sm text-slate-600">
                      Categoria: {doacao.categoria}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-800">
                  Seu código de acompanhamento
                </p>

                <p className="mt-2 break-all font-mono text-base font-bold text-slate-900">
                  {codigo}
                </p>

                <button
                  type="button"
                  onClick={copiarCodigo}
                  className="mt-3 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                >
                  Copiar código
                </button>

                {mensagemCopia && (
                  <p role="status" aria-live="polite" className="mt-2 text-xs text-emerald-800">
                    {mensagemCopia}
                  </p>
                )}

                <p className="mt-3 text-xs leading-5 text-slate-600">
                  Guarde esse código para consultar a doação mesmo sem entrar
                  na sua conta. Evite compartilhá-lo publicamente.
                </p>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to={`/minhas-doacoes/${encodeURIComponent(codigo)}`}
                  className="rounded-lg bg-emerald-600 px-5 py-3 text-center font-semibold text-white shadow transition hover:bg-emerald-700"
                >
                  Acompanhar esta doação
                </Link>

                <Link
                  to="/doar"
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cadastrar outro equipamento
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
                <Link
                  to="/minhas-doacoes"
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  {doadorLogado ? 'Ver minhas doações' : 'Consultar por código'}
                </Link>

                <Link to="/" className="font-semibold text-slate-600 hover:underline">
                  Voltar ao início
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-500">
                !
              </div>

              <h1 className="mt-6 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Nenhuma confirmação disponível
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Esta página não recebeu os dados de uma doação recém-cadastrada.
                Isso não significa que um cadastro anterior tenha sido perdido.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/minhas-doacoes"
                  className="rounded-lg bg-emerald-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
                >
                  {doadorLogado ? 'Ver minhas doações' : 'Consultar uma doação'}
                </Link>

                <Link
                  to="/doar"
                  className="rounded-lg border border-slate-300 px-5 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Fazer uma doação
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
