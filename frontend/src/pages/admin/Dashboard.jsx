import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const [doacoes, setDoacoes] = useState([])

  useEffect(() => {
    const doacoesSalvas = JSON.parse(
      localStorage.getItem('doacoes') || '[]'
    )

    setDoacoes(doacoesSalvas)
  }, [])

  function sair() {
    localStorage.removeItem('adminLogado')
    navigate('/admin/login')
  }

  const totalDoacoes = doacoes.length

  const pendentes = doacoes.filter(
    (doacao) => doacao.status === 'Pendente'
  ).length

  const aprovadas = doacoes.filter(
    (doacao) => doacao.status === 'Aprovada'
  ).length

  const rejeitadas = doacoes.filter(
    (doacao) => doacao.status === 'Rejeitada'
  ).length

  const ultimasDoacoes = [...doacoes]
    .reverse()
    .slice(0, 5)

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

          <div className="flex items-center gap-3">

            <Link
              to="/"
              className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
            >
              Voltar ao site
            </Link>

            <button
              onClick={sair}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Sair
            </button>

          </div>

        </div>

      </header>

      {/* Conteúdo */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h2>

          <p className="text-gray-600 mt-2">
            Acompanhe as informações do E-Ciclo.
          </p>

        </div>

        {/* Cards */}

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total */}

          <div className="bg-white rounded-xl shadow-sm p-6">

            <div className="text-3xl mb-4">
              📦
            </div>

            <p className="text-gray-500 text-sm">
              Total de doações
            </p>

            <h3 className="text-3xl font-bold text-gray-800 mt-1">
              {totalDoacoes}
            </h3>

          </div>

          {/* Pendentes */}

          <div className="bg-white rounded-xl shadow-sm p-6">

            <div className="text-3xl mb-4">
              ⏳
            </div>

            <p className="text-gray-500 text-sm">
              Pendentes
            </p>

            <h3 className="text-3xl font-bold text-yellow-600 mt-1">
              {pendentes}
            </h3>

          </div>

          {/* Aprovadas */}

          <div className="bg-white rounded-xl shadow-sm p-6">

            <div className="text-3xl mb-4">
              ✅
            </div>

            <p className="text-gray-500 text-sm">
              Aprovadas
            </p>

            <h3 className="text-3xl font-bold text-green-600 mt-1">
              {aprovadas}
            </h3>

          </div>

          {/* Rejeitadas */}

          <div className="bg-white rounded-xl shadow-sm p-6">

            <div className="text-3xl mb-4">
              ❌
            </div>

            <p className="text-gray-500 text-sm">
              Rejeitadas
            </p>

            <h3 className="text-3xl font-bold text-red-600 mt-1">
              {rejeitadas}
            </h3>

          </div>

        </section>

        {/* Últimas doações */}

        <section className="mt-10">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                Últimas doações
              </h2>

              <p className="text-gray-600 mt-1">
                Acompanhe as doações cadastradas recentemente.
              </p>

            </div>

            <Link
              to="/admin/doacoes"
              className="text-green-700 font-semibold hover:underline"
            >
              Ver todas →
            </Link>

          </div>

          {ultimasDoacoes.length === 0 ? (

            <div className="bg-white rounded-xl shadow-sm p-8 text-center">

              <div className="text-4xl mb-3">
                📦
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                Nenhuma doação cadastrada
              </h3>

              <p className="text-gray-500 mt-1">
                As novas doações aparecerão aqui.
              </p>

            </div>

          ) : (

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

              <div className="divide-y divide-gray-100">

                {ultimasDoacoes.map((doacao) => (

                  <div
                    key={doacao.id}
                    className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >

                    {/* Informações */}

                    <div>

                      <h3 className="font-bold text-gray-800">
                        {doacao.equipamento}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {doacao.categoria} • Quantidade: {doacao.quantidade}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Data: {doacao.data}
                      </p>

                    </div>

                    {/* Status e botão */}

                    <div className="flex items-center gap-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
                        to={`/admin/doacoes/${doacao.id}`}
                        className="text-green-700 font-semibold hover:underline"
                      >
                        Ver detalhes
                      </Link>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </section>

        {/* Ações rápidas */}

        <section className="mt-10">

          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            Ações rápidas
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <Link
              to="/admin/doacoes"
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >

              <div className="text-3xl mb-4">
                📦
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Gerenciar doações
              </h3>

              <p className="text-gray-600">
                Visualize, analise e gerencie as doações
                cadastradas pelos usuários.
              </p>

            </Link>

            <div className="bg-white rounded-xl shadow-sm p-6">

              <div className="text-3xl mb-4">
                📍
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Pontos de coleta
              </h3>

              <p className="text-gray-600">
                Em breve você poderá gerenciar os pontos
                de coleta cadastrados na plataforma.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Dashboard