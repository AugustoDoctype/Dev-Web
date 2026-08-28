import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function DetalhesMinhaDoacao() {
  const { id } = useParams()

  const [doacao, setDoacao] = useState(null)

  useEffect(() => {
    const doacoesSalvas = JSON.parse(
      localStorage.getItem('doacoes') || '[]'
    )

    const doacaoEncontrada = doacoesSalvas.find(
      (item) => String(item.id) === String(id)
    )

    setDoacao(doacaoEncontrada)
  }, [id])

  if (!doacao) {
    return (
      <div className="min-h-screen bg-gray-50">

        <header className="bg-green-700 text-white">
          <div className="max-w-6xl mx-auto px-6 py-5">

            <Link
              to="/"
              className="text-2xl font-bold"
            >
              E-Ciclo
            </Link>

          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-16">

          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

            <div className="text-5xl mb-4">
              📦
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Doação não encontrada
            </h2>

            <p className="text-gray-500 mb-6">
              Não foi possível encontrar essa doação.
            </p>

            <Link
              to="/minhas-doacoes"
              className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Voltar para minhas doações
            </Link>

          </div>

        </main>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Cabeçalho */}
      <header className="bg-green-700 text-white">

        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>

            <Link
              to="/"
              className="text-2xl font-bold"
            >
              E-Ciclo
            </Link>

            <p className="text-green-100 text-sm">
              Detalhes da Doação
            </p>

          </div>

          <Link
            to="/minhas-doacoes"
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Voltar
          </Link>

        </div>

      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Detalhes da Doação
          </h1>

          <p className="text-gray-600 mt-2">
            Confira todas as informações cadastradas.
          </p>

        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold text-gray-800">
              Status da doação
            </h2>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                doacao.status === 'Aprovada'
                  ? 'bg-green-100 text-green-700'
                  : doacao.status === 'Rejeitada'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {doacao.status}
            </span>

          </div>

        </div>

        {/* Informações */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Informações do equipamento
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Equipamento
              </p>

              <p className="text-lg font-semibold text-gray-800">
                {doacao.equipamento}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Categoria
              </p>

              <p className="text-lg font-semibold text-gray-800">
                {doacao.categoria}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Quantidade
              </p>

              <p className="text-lg font-semibold text-gray-800">
                {doacao.quantidade}
              </p>
            </div>

            {doacao.data && (
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Data
                </p>

                <p className="text-lg font-semibold text-gray-800">
                  {doacao.data}
                </p>
              </div>
            )}

          </div>

          {doacao.observacao && (
            <div className="mt-8">

              <p className="text-sm text-gray-500 mb-2">
                Observação
              </p>

              <div className="bg-gray-50 rounded-lg p-4">

                <p className="text-gray-700">
                  {doacao.observacao}
                </p>

              </div>

            </div>
          )}

        </div>

        {/* Voltar */}
        <div className="mt-6">

          <Link
            to="/minhas-doacoes"
            className="text-green-700 font-semibold hover:underline"
          >
            ← Voltar para minhas doações
          </Link>

        </div>

      </main>

    </div>
  )
}

export default DetalhesMinhaDoacao