import { Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

function ComoFunciona() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Cabeçalho */}
      <section className="bg-green-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Como funciona o E-Ciclo?
          </h1>

          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Veja como é simples contribuir para o descarte correto
            de equipamentos eletroeletrônicos.
          </p>
        </div>
      </section>

      {/* Etapas */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-5 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              1
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Cadastre seu equipamento
            </h2>

            <p className="text-gray-600">
              Informe qual equipamento eletrônico você deseja
              encaminhar para a coleta.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-5 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              2
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Encontre um ponto de coleta
            </h2>

            <p className="text-gray-600">
              Consulte os pontos disponíveis e escolha o local
              mais adequado para encaminhar seu equipamento.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-5 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              3
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Faça o descarte
            </h2>

            <p className="text-gray-600">
              Leve o equipamento até o ponto indicado e contribua
              para um descarte mais responsável.
            </p>
          </div>

        </div>

        {/* Tipos de equipamentos */}
        <section className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              O que pode ser encaminhado?
            </h2>

            <p className="text-gray-600">
              O E-Ciclo é voltado para equipamentos
              eletroeletrônicos.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <div className="text-3xl mb-3">💻</div>
              <p className="font-semibold text-gray-700">
                Computadores
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <div className="text-3xl mb-3">🖥️</div>
              <p className="font-semibold text-gray-700">
                Monitores
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <div className="text-3xl mb-3">⌨️</div>
              <p className="font-semibold text-gray-700">
                Periféricos
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <div className="text-3xl mb-3">🎮</div>
              <p className="font-semibold text-gray-700">
                Videogames
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <div className="text-3xl mb-3">📺</div>
              <p className="font-semibold text-gray-700">
                Televisores
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <div className="text-3xl mb-3">📱</div>
              <p className="font-semibold text-gray-700">
                Celulares
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <div className="text-3xl mb-3">🖨️</div>
              <p className="font-semibold text-gray-700">
                Impressoras
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <div className="text-3xl mb-3">🔌</div>
              <p className="font-semibold text-gray-700">
                Cabos e fontes
              </p>
            </div>
          </div>
        </section>

        {/* Botão */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pronto para contribuir?
          </h2>

          <Link
            to="/doacao"
            className="inline-block bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
          >
            Fazer uma doação
          </Link>
        </div>
      </main>
    </div>
  )
}

export default ComoFunciona