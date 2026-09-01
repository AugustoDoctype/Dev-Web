import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

export default function Cadastro() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  })
  const [erro, setErro] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    // Salva o usuário simulado no navegador
    const usuarios = JSON.parse(localStorage.getItem('mock_usuarios') || '[]')
    const usuarioExiste = usuarios.some((u) => u.email === formData.email)

    if (usuarioExiste) {
      setErro('Este e-mail já está cadastrado.')
      return
    }

    const novoUsuario = {
      id: Date.now(),
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      tipo: 'USER'
    }

    usuarios.push(novoUsuario)
    localStorage.setItem('mock_usuarios', JSON.stringify(usuarios))

    // Autentica automaticamente após o cadastro
    localStorage.setItem('userToken', 'mock-token-user')
    localStorage.setItem('userPerfil', JSON.stringify({ nome: novoUsuario.nome, email: novoUsuario.email }))

    navigate('/minhas-doacoes')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-2xl font-extrabold text-slate-900 text-center">Criar Conta no E-Ciclo</h1>
          <p className="mt-1 text-sm text-slate-500 text-center">Cadastre-se para acompanhar suas doações</p>

          {erro && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
              <input
                type="text"
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">E-mail</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Senha</label>
              <input
                type="password"
                name="senha"
                required
                value={formData.senha}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Confirmar Senha</label>
              <input
                type="password"
                name="confirmarSenha"
                required
                value={formData.confirmarSenha}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow transition text-sm"
            >
              Cadastrar
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Já possui uma conta?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
              Fazer Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}