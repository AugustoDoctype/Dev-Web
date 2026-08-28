import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

function Confirmacao() {
  const [doacao, setDoacao] = useState(null)

  useEffect(() => {
    const doacoesSalvas = JSON.parse(
      localStorage.getItem('doacoes') || '[]'
    )

    if (doacoesSalvas.length > 0) {
      const ultimaDoacao =
        doacoesSalvas[doacoesSalvas.length - 1]

      setDoacao(ultimaDoacao)
    }
  }, [])

  function classeStatus(status) {
    if (status === 'Aprovada') {
      return 'bg-green-100 text-green-700'
    }

    if (status === 'Rejeitada') {
      return 'bg-red-100 text-red-700'
    }

    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-20">

        <div className="bg-white rounded-2xl shadow-md p-10">

          {/* Ícone */}

          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">

            <span className="text-4xl text-green-700">
              ✓
            </span>

          </div>

          {/* Título */}

          <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-4">
            Doação realizada com sucesso!
          </h1>

          <p className="text-gray-600 text-lg text-center max-w-xl mx-auto mb-8">
            Obrigado por contribuir com o E-Ciclo. Sua iniciativa
            ajuda a dar um destino mais responsável aos equipamentos
            eletroeletrônicos.
          </p>

          {/* Informações */}

          {doacao && (

            <div className="bg-gray-50 rounded-xl p-6 mb-8">

              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Resumo da doação
              </h2>

              <div className="space-y-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Equipamento
                  </p>

                  <p className="font-semibold text-gray-800">
                    {doacao.equipamento}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Categoria
                  </p>

                  <p className="font-semibold text-gray-800">
                    {doacao.categoria}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Quantidade
                  </p>

                  <p className="font-semibold text-gray-800">
                    {doacao.quantidade}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Data
                  </p>

                  <p className="font-semibold text-gray-800">
                    {doacao.data}
                  </p>
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Status
                  </p>

                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${classeStatus(
                      doacao.status
                    )}`}
                  >
                    {doacao.status}
                  </span>

                </div>

              </div>

            </div>

          )}

          {/* Aviso */}

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-8">

            <p className="text-yellow-800 text-sm">
              ⏳ Sua doação será analisada pela equipe do E-Ciclo.
              Você poderá acompanhar o status em Minhas Doações.
            </p>

          </div>

          {/* Botões */}

          <div className="flex flex-wrap justify-center gap-4">

            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Voltar para o início
            </Link>

            <Link
              to="/minhas-doacoes"
              className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Minhas Doações
            </Link>

            <Link
              to="/doacao"
              className="px-6 py-3 border border-green-700 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition"
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