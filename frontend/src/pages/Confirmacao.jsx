import { useLocation, Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

export default function Confirmacao() {
  const location = useLocation()
  const doacao = location.state?.doacao

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>

          <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Doação Cadastrada com Sucesso!
          </h1>
          <p className="mt-2 text-slate-600 text-sm">
            Obrigado por colaborar com o descarte consciente no E-Ciclo.
          </p>

          
          {doacao?.codigoAcompanhamento && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-800">
                Seu código de acompanhamento
              </p>

              <p className="mt-2 break-all font-mono text-base font-bold text-slate-900">
                {doacao.codigoAcompanhamento}
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Guarde este código. Ele será necessário para
                consultar o andamento da sua doação.
              </p>
            </div>
          )}


          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/minhas-doacoes"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow transition text-center"
            >
              Acompanhar Minhas Doações
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-300 transition text-center"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}