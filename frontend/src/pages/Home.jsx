import { Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Seção principal */}
      <main>
        <section className="bg-green-700 text-white">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="max-w-3xl">
              <p className="text-green-200 font-semibold mb-3">
                DESCARTE CONSCIENTE
              </p>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Dê um novo destino aos seus eletrônicos.
              </h1>

              <p className="text-lg md:text-xl text-green-100 mb-8">
                O E-Ciclo conecta pessoas a soluções para o descarte
                correto de equipamentos eletroeletrônicos.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/doacao"
                  className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
                >
                  Fazer uma doação
                </Link>

                <Link
                  to="/como-funciona"
                  className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
                >
                  Como funciona
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre o E-Ciclo */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              O que é o E-Ciclo?
            </h2>

            <p className="text-gray-600 text-lg">
              Uma plataforma criada para facilitar o descarte
              responsável de equipamentos eletrônicos e elétricos,
              conectando pessoas aos pontos de coleta.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-4xl mb-4">💻</div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Equipamentos
              </h3>

              <p className="text-gray-600">
                Computadores, notebooks, peças, periféricos e
                outros equipamentos eletrônicos.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-4xl mb-4">🎮</div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Eletrônicos
              </h3>

              <p className="text-gray-600">
                Videogames, televisores, monitores, celulares e
                diversos aparelhos eletrônicos.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-4xl mb-4">♻️</div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Descarte correto
              </h3>

              <p className="text-gray-600">
                Ajude a reduzir o descarte inadequado e contribua
                para um destino mais responsável.
              </p>
            </div>
          </div>
        </section>

        {/* Chamada para ação */}
        <section className="bg-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Tem um eletrônico que não usa mais?
            </h2>

            <p className="text-gray-600 mb-8">
              Cadastre seu equipamento e encontre uma forma
              adequada de encaminhá-lo para a coleta.
            </p>

            <Link
              to="/doacao"
              className="inline-block bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Quero fazer uma doação
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home