import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setErro('')

    // 1. Verificação de Perfil Administrador
    if (email === 'admin@eciclo.com' && senha === 'admin123') {
      localStorage.setItem('adminToken', 'mock-token-admin-123')
      localStorage.setItem('userPerfil', JSON.stringify({ nome: 'Administrador', tipo: 'ADMIN' }))
      navigate('/admin/dashboard')
      return
    }

    // 2. Verificação de Usuário Comum no LocalStorage
    const usuarios = JSON.parse(localStorage.getItem('mock_usuarios') || '[]')
    const usuarioEncontrado = usuarios.find((u) => u.email === email && u.senha === senha)

    if (usuarioEncontrado) {
      localStorage.setItem('userToken', 'mock-token-user')
      localStorage.setItem(
        'userPerfil',
        JSON.stringify({ nome: usuarioEncontrado.nome, email: usuarioEncontrado.email, tipo: 'USER' })
      )
      navigate('/minhas-doacoes')
      return
    }

    setErro('E-mail ou senha incorretos.')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-2xl font-extrabold text-slate-900 text-center">Entrar no E-Ciclo</h1>
          <p className="mt-1 text-sm text-slate-500 text-center">Acesse com sua conta de Doador ou Admin</p>

          {erro && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {erro}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">E-mail</label>
              <input
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Senha</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow transition text-sm"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-700">Dicas de Acesso Rápido:</p>
            <p>• <strong>Admin:</strong> admin@eciclo.com / admin123</p>
            <p>• <strong>Doador:</strong> Crie uma conta no link abaixo ou faça o cadastro.</p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Ainda não tem conta?{' '}
            <Link to="/cadastro" className="text-emerald-600 font-semibold hover:underline">
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}