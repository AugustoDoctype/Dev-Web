import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

function DoacaoDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()

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

  function atualizarStatus(novoStatus) {
    const doacoesSalvas = JSON.parse(
      localStorage.getItem('doacoes') || '[]'
    )

    const doacoesAtualizadas = doacoesSalvas.map((item) =>
      String(item.id) === String(id)
        ? { ...item, status: novoStatus }
        : item
    )

    localStorage.setItem(
      'doacoes',
      JSON.stringify(doacoesAtualizadas)
    )

    const doacaoAtualizada = doacoesAtualizadas.find(
      (item) => String(item.id) === String(id)
    )

    setDoacao(doacaoAtualizada)
  }

  if (!doacao) {
    return (
      <div className="min-h-screen bg-gray-100">

        <header className="bg-green-700 text-white">

          <div className="max-w-7xl mx-auto px-6 py-5">

            <h1 className="text-2xl font-bold">
              E-Ciclo
            </h1>

            <p className="text-green-100 text-sm">
              Painel Administrativo
            </p>

          </div>

        </header>

        <main className="max-w-3xl mx-auto px-6 py-16">

          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

            <div className="text-5xl mb-4">
              🔍
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Doação não encontrada
            </h2>

            <p className="text-gray-600 mb-6">
              Não foi possível encontrar a doação solicitada.
            </p>

            <Link
              to="/admin/doacoes"
              className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Voltar para doações
            </Link>

          </div>

        </main>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Cabeçalho */}

      <header className="bg-green-700 text-white">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold">
              E-Ciclo
            </h1>

            <p className="text-green-100 text-sm">
              Painel Administrativo
            </p>

          </div>

          <Link
            to="/admin/doacoes"
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Voltar para doações
          </Link>

        </div>

      </header>

      {/* Conteúdo */}

      <main className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-800">
            Detalhes da doação
          </h2>

          <p className="text-gray-600 mt-2">
            Visualize e analise todas as informações do equipamento.
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Cabeçalho das informações */}

          <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <h3 className="text-xl font-bold text-gray-800">
                Informações da doação
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                ID da doação: {doacao.id}
              </p>

            </div>

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

          {/* Informações */}

          <div className="p-6">

            <div className="grid md:grid-cols-2 gap-6">

              {/* Equipamento */}

              <div className="bg-gray-50 rounded-xl p-5">

                <p className="text-sm text-gray-500 mb-1">
                  Equipamento
                </p>

                <p className="text-lg font-semibold text-gray-800">
                  {doacao.equipamento}
                </p>

              </div>

              {/* Categoria */}

              <div className="bg-gray-50 rounded-xl p-5">

                <p className="text-sm text-gray-500 mb-1">
                  Categoria
                </p>

                <p className="text-lg font-semibold text-gray-800">
                  {doacao.categoria}
                </p>

              </div>

              {/* Quantidade */}

              <div className="bg-gray-50 rounded-xl p-5">

                <p className="text-sm text-gray-500 mb-1">
                  Quantidade
                </p>

                <p className="text-lg font-semibold text-gray-800">
                  {doacao.quantidade}
                </p>

              </div>

              {/* Data */}

              <div className="bg-gray-50 rounded-xl p-5">

                <p className="text-sm text-gray-500 mb-1">
                  Data da doação
                </p>

                <p className="text-lg font-semibold text-gray-800">
                  {doacao.data}
                </p>

              </div>

            </div>

            {/* Observação */}

            <div className="mt-6">

              <p className="text-sm text-gray-500 mb-2">
                Estado ou observação
              </p>

              <div className="bg-gray-50 rounded-xl p-5">

                <p className="text-gray-700">
                  {doacao.observacao ||
                    'Nenhuma observação informada.'}
                </p>

              </div>

            </div>

          </div>

          {/* Ações */}

          <div className="border-t bg-gray-50 p-6">

            <h3 className="font-bold text-gray-800 mb-4">
              Ações administrativas
            </h3>

            {doacao.status === 'Pendente' ? (

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={() => atualizarStatus('Aprovada')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  ✅ Aprovar doação
                </button>

                <button
                  onClick={() => atualizarStatus('Rejeitada')}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  ❌ Rejeitar doação
                </button>

              </div>

            ) : (

              <div>

                <p className="text-gray-600 mb-4">
                  Esta doação já foi analisada.
                </p>

                <button
                  onClick={() => atualizarStatus('Pendente')}
                  className="px-6 py-3 border border-yellow-500 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-50 transition"
                >
                  ↩️ Voltar para pendente
                </button>

              </div>

            )}

          </div>

        </div>

        {/* Voltar */}

        <div className="mt-6">

          <button
            onClick={() => navigate('/admin/doacoes')}
            className="text-green-700 font-semibold hover:underline"
          >
            ← Voltar para a lista de doações
          </button>

        </div>

      </main>

    </div>
  )
}

export default DoacaoDetalhes