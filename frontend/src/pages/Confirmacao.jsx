import { Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

function Confirmacao() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">
          
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">✓</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
            Doação realizada com sucesso!
          </h1>

          <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
            Obrigado por contribuir com o E-Ciclo. Sua iniciativa
            ajuda a dar um destino mais responsável aos equipamentos
            eletroeletrônicos.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Voltar para o início
            </Link>

            <Link
              to="/doacao"
              className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Fazer outra doação
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Confirmacao