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

          {doacao && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2 text-sm text-slate-700">
              <p><strong>Item:</strong> {doacao.equipamento}</p>
              <p><strong>Doador:</strong> {doacao.nomeDoador}</p>
              <p><strong>Status Inicial:</strong> <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-medium text-xs">Pendente</span></p>
              {doacao.id && (
                <p><strong>Código da Doação:</strong> <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-900 font-bold">{doacao.id}</span></p>
              )}
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