import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function MinhasDoacoes() {
  const [doacoes, setDoacoes] = useState([])

  useEffect(() => {
    const doacoesSalvas = JSON.parse(
      localStorage.getItem('doacoes') || '[]'
    )

    setDoacoes(doacoesSalvas)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Cabeçalho */}
      <header className="bg-green-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              E-Ciclo
            </h1>

            <p className="text-green-100 text-sm">
              Minhas Doações
            </p>
          </div>

          <Link
            to="/"
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Voltar ao início
          </Link>

        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Minhas Doações
          </h2>

          <p className="text-gray-600 mt-2">
            Acompanhe as doações cadastradas na plataforma.
          </p>
        </div>

        {doacoes.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

            <div className="text-5xl mb-4">
              📦
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Você ainda não possui doações
            </h3>

            <p className="text-gray-500 mb-6">
              Quando você cadastrar uma doação, ela aparecerá aqui.
            </p>

            <Link
              to="/doacao"
              className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Fazer uma doação
            </Link>

          </div>

        ) : (

          <div className="space-y-5">

            {doacoes.map((doacao) => (

              <div
                key={doacao.id}
                className="bg-white rounded-2xl shadow-sm p-6"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  {/* Informações */}
                  <div>

                    <h3 className="text-xl font-bold text-gray-800">
                      {doacao.equipamento}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      Categoria: {doacao.categoria}
                    </p>

                    <p className="text-gray-500">
                      Quantidade: {doacao.quantidade}
                    </p>

                    {doacao.data && (
                      <p className="text-gray-500">
                        Data: {doacao.data}
                      </p>
                    )}

                  </div>

                  {/* Status e detalhes */}
                  <div className="flex flex-col items-start md:items-end gap-3">

                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                        doacao.status === 'Aprovada'
                          ? 'bg-green-100 text-green-700'
                          : doacao.status === 'Rejeitada'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {doacao.status}
                    </span>

                    <Link
                      to={`/minhas-doacoes/${doacao.id}`}
                      className="bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition"
                    >
                      Ver detalhes
                    </Link>

                  </div>

                </div>

                {/* Observação */}
                {doacao.observacao && (
                  <div className="mt-5 bg-gray-50 rounded-lg p-4">

                    <p className="text-sm text-gray-500 mb-1">
                      Observação
                    </p>

                    <p className="text-gray-700">
                      {doacao.observacao}
                    </p>

                  </div>
                )}

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  )
}

export default MinhasDoacoes