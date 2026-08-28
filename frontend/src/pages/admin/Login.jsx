import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    setErro('')

    // Login provisório para teste
    const emailCorreto = 'admin@eciclo.com'
    const senhaCorreta = '123456'

    if (email === emailCorreto && senha === senhaCorreta) {
      localStorage.setItem('adminLogado', 'true')

      navigate('/admin/dashboard')
    } else {
      setErro('E-mail ou senha incorretos.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Logo / título */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-green-700">
            E-Ciclo
          </h1>

          <p className="text-gray-600 mt-2">
            Acesso administrativo
          </p>

        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Entrar
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* E-mail */}
            <div>

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                E-mail
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@eciclo.com"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

            </div>

            {/* Senha */}
            <div>

              <label
                htmlFor="senha"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Senha
              </label>

              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="Digite sua senha"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

            </div>

            {/* Erro */}
            {erro && (
              <div className="bg-red-100 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {erro}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Entrar
            </button>

          </form>

          {/* Voltar */}
          <div className="text-center mt-6">

            <Link
              to="/"
              className="text-green-700 font-semibold hover:underline"
            >
              Voltar para o site
            </Link>

          </div>

        </div>

        {/* Dados de teste */}
        <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-4 text-sm">

          <p className="font-semibold text-green-800 mb-1">
            Dados para teste
          </p>

          <p className="text-green-700">
            E-mail: admin@eciclo.com
          </p>

          <p className="text-green-700">
            Senha: 123456
          </p>

        </div>

      </div>

    </div>
  )
}

export default Login