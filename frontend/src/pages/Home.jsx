import { Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Lado Esquerdo: Textos e Chamada */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-full">
            Descarte Consciente & Sustentável
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Recicle seus eletrônicos sem sair de casa
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl">
            Sabe aquele celular antigo ou computador quebrado no armário? Nós conectamos você aos pontos de reciclagem corretos para a destinação sustentável dos seus resíduos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
            <Link
              to="/doar"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition text-center text-sm"
            >
              Fazer Doação Agora
            </Link>
            <Link
              to="/como-funciona"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-300 transition text-center text-sm"
            >
              Saiba Como Funciona
            </Link>
          </div>
        </div>

        {/* Lado Direito: Ilustração Temática de Lixo Eletrônico */}
        <div className="flex-1 w-full max-w-md flex justify-center">
          <div className="relative bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 shadow-sm w-full">
            <img
              src="https://static.vecteezy.com/system/resources/previews/073/346/496/non_2x/recycling-electronics-sustainability-illustration-vector.jpg"
              alt="Ilustração sobre reciclagem de lixo eletrônico"
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>
        </div>
      </main>

      {/* Destaques do Projeto */}
      <section className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Coleta Agendada</h3>
            <p className="text-sm text-slate-500">Cadastre seu endereço e nós organizamos a coleta do seu item.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Rastreamento Transparente</h3>
            <p className="text-sm text-slate-500">Acompanhe pelo CPF a situação do seu descarte do início ao fim.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Impacto Ambiental</h3>
            <p className="text-sm text-slate-500">Evite a contaminação do solo enviando materiais tóxicos para reciclagem.</p>
          </div>
        </div>
      </section>
    </div>
  )
}