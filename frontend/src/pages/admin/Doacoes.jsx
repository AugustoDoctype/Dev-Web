import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Doacoes() {
  const [doacoes, setDoacoes] = useState([])
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    carregarDoacoes()
  }, [])

  function carregarDoacoes() {
    const doacoesSalvas = JSON.parse(
      localStorage.getItem('doacoes') || '[]'
    )

    setDoacoes(doacoesSalvas)
  }

  function atualizarStatus(id, novoStatus) {
    const doacoesAtualizadas = doacoes.map((doacao) =>
      doacao.id === id
        ? { ...doacao, status: novoStatus }
        : doacao
    )

    localStorage.setItem(
      'doacoes',
      JSON.stringify(doacoesAtualizadas)
    )

    setDoacoes(doacoesAtualizadas)
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

  const doacoesFiltradas = doacoes.filter((doacao) => {
    const correspondeStatus =
      filtroStatus === 'Todos' ||
      doacao.status === filtroStatus

    const correspondeBusca =
      doacao.equipamento
        .toLowerCase()
        .includes(busca.toLowerCase())

    return correspondeStatus && correspondeBusca
  })

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
            to="/admin/dashboard"
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Voltar ao Dashboard
          </Link>

        </div>

      </header>

      {/* Conteúdo */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-800">
            Doações
          </h2>

          <p className="text-gray-600 mt-2">
            Visualize e gerencie as doações cadastradas.
          </p>

        </div>

        {/* Cards */}

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-xl shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Total de doações
            </p>

            <h3 className="text-3xl font-bold text-gray-800 mt-2">
              {totalDoacoes}
            </h3>

          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Pendentes
            </p>

            <h3 className="text-3xl font-bold text-yellow-600 mt-2">
              {pendentes}
            </h3>

          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Aprovadas
            </p>

            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {aprovadas}
            </h3>

          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Rejeitadas
            </p>

            <h3 className="text-3xl font-bold text-red-600 mt-2">
              {rejeitadas}
            </h3>

          </div>

        </section>

        {/* Filtros */}

        <section className="bg-white rounded-xl shadow-sm p-6 mb-6">

          <div className="grid md:grid-cols-2 gap-4">

            {/* Busca */}

            <div>

              <label
                htmlFor="busca"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Buscar equipamento
              </label>

              <input
                id="busca"
                type="text"
                value={busca}
                onChange={(event) =>
                  setBusca(event.target.value)
                }
                placeholder="Ex: placa de vídeo"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

            </div>

            {/* Status */}

            <div>

              <label
                htmlFor="status"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Filtrar por status
              </label>

              <select
                id="status"
                value={filtroStatus}
                onChange={(event) =>
                  setFiltroStatus(event.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              >

                <option value="Todos">
                  Todos
                </option>

                <option value="Pendente">
                  Pendentes
                </option>

                <option value="Aprovada">
                  Aprovadas
                </option>

                <option value="Rejeitada">
                  Rejeitadas
                </option>

              </select>

            </div>

          </div>

        </section>

        {/* Lista */}

        <section className="bg-white rounded-xl shadow-sm overflow-hidden">

          <div className="p-6 border-b">

            <h3 className="text-xl font-bold text-gray-800">
              Doações cadastradas
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {doacoesFiltradas.length} doação(ões) encontrada(s)
            </p>

          </div>

          {doacoesFiltradas.length === 0 ? (

            <div className="p-10 text-center">

              <div className="text-5xl mb-4">
                🔍
              </div>

              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Nenhuma doação encontrada
              </h3>

              <p className="text-gray-500">
                Tente alterar a busca ou o filtro de status.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Equipamento
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Categoria
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Quantidade
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Data
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Ações
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {doacoesFiltradas.map((doacao) => (

                    <tr
                      key={doacao.id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {doacao.equipamento}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {doacao.categoria}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {doacao.quantidade}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            doacao.status === 'Aprovada'
                              ? 'bg-green-100 text-green-700'
                              : doacao.status === 'Rejeitada'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {doacao.status}
                        </span>

                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {doacao.data}
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex flex-wrap gap-2">

                          <Link
                            to={`/admin/doacoes/${doacao.id}`}
                            className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                          >
                            Ver detalhes
                          </Link>

                          {doacao.status === 'Pendente' && (

                            <>

                              <button
                                onClick={() =>
                                  atualizarStatus(
                                    doacao.id,
                                    'Aprovada'
                                  )
                                }
                                className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                              >
                                Aprovar
                              </button>

                              <button
                                onClick={() =>
                                  atualizarStatus(
                                    doacao.id,
                                    'Rejeitada'
                                  )
                                }
                                className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                              >
                                Rejeitar
                              </button>

                            </>

                          )}

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  )
}

export default Doacoes