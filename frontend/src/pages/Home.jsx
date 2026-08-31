import { Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import heroImage from '../assets/hero.png'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              Descarte consciente de <span className="text-emerald-600">eletrônicos</span>.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              Dê um destino correto aos seus aparelhos antigos. Nós conectamos quem quer doar com a reciclagem e reutilização responsável.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/doar"
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition text-center"
              >
                Quero Doar
              </Link>
              <Link
                to="/como-funciona"
                className="px-8 py-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-300 transition text-center"
              >
                Como Funciona
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md md:max-w-none flex justify-center">
            <img
              src={heroImage}
              alt="Ilustração do E-Ciclo sobre reciclagem de eletrônicos"
              className="w-full h-auto max-h-[400px] object-contain drop-shadow-lg"
            />
          </div>
        </section>

        {/* Informações adicionais */}
        <section className="bg-white py-16 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900">Por que escolher o E-Ciclo?</h2>
              <p className="mt-4 text-slate-600">
                O lixo eletrônico é um dos maiores desafios ambientais modernos. Com a nossa plataforma, você garante que seus aparelhos tenham o destino certo de forma simples e transparente.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mx-auto text-xl font-bold">1</div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">Cadastre o Item</h3>
                <p className="mt-2 text-slate-600 text-sm">
                  Preencha os dados do equipamento eletrônico que deseja doar ou descartar.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mx-auto text-xl font-bold">2</div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">Análise do Descarte</h3>
                <p className="mt-2 text-slate-600 text-sm">
                  Nossa equipe avalia o estado do aparelho e encaminha para reutilização ou reciclagem.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mx-auto text-xl font-bold">3</div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">Acompanhamento</h3>
                <p className="mt-2 text-slate-600 text-sm">
                  Acompanhe em tempo real o status da sua doação pela aba "Minhas Doações".
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}