import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/public/Navbar' // Corrigido para subir 2 níveis
import { apiFetch } from '../../services/api'

export default function LoginAdmin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      let data
      try {
        data = await apiFetch('/admin/login', {
          method: 'POST',
          body: JSON.stringify({ email, senha })
        })
      } catch (err) {
        // Simulação de login local (aceita admin/admin)
        if (email === 'admin@eciclo.com' && senha === 'admin123') {
          data = { token: 'mock-token-admin-123' }
        } else {
          throw new Error('E-mail ou senha inválidos. (Dica: admin@eciclo.com / admin123)')
        }
      }

      localStorage.setItem('adminToken', data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-slate-200">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">E-Ciclo Admin</h1>
            <p className="mt-1 text-sm text-slate-500">Painel de Gerenciamento de Doações</p>
          </div>

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
                placeholder="admin@eciclo.com"
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
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Entrando...' : 'Acessar Painel'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}