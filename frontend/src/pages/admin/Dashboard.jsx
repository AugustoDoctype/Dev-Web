import { Link } from 'react-router-dom'

function Dashboard() {
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
            to="/"
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Voltar ao site
          </Link>
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

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl mb-4">
              📦
            </div>

            <p className="text-gray-500 text-sm">
              Total de doações
            </p>

            <h3 className="text-3xl font-bold text-gray-800 mt-1">
              0
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl mb-4">
              ⏳
            </div>

            <p className="text-gray-500 text-sm">
              Pendentes
            </p>

            <h3 className="text-3xl font-bold text-gray-800 mt-1">
              0
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl mb-4">
              ✅
            </div>

            <p className="text-gray-500 text-sm">
              Aprovadas
            </p>

            <h3 className="text-3xl font-bold text-gray-800 mt-1">
              0
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl mb-4">
              📍
            </div>

            <p className="text-gray-500 text-sm">
              Pontos de coleta
            </p>

            <h3 className="text-3xl font-bold text-gray-800 mt-1">
              0
            </h3>
          </div>

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
                Visualize e acompanhe as doações cadastradas
                pelos usuários.
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
                Em breve você poderá gerenciar os pontos de
                coleta cadastrados na plataforma.
              </p>
            </div>

          </div>

        </section>

      </main>
    </div>
  )
}

export default Dashboard