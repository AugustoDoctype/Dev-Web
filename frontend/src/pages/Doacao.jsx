import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import { apiFetch } from '../services/api'

export default function Doacao() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const [formData, setFormData] = useState({
    nomeDoador: '',
    email: '',
    telefone: '',
    cpf: '',
    equipamento: '',
    categoria: 'Computadores',
    condicao: 'USADO_BOM',
    descricao: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: ''
  })

  // Funções de Máscara de Entrada
  const aplicarMascaraCPF = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14)
  }

  const aplicarMascaraTelefone = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15)
  }

  const aplicarMascaraCEP = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let valorFormatado = value

    if (name === 'cpf') valorFormatado = aplicarMascaraCPF(value)
    if (name === 'telefone') valorFormatado = aplicarMascaraTelefone(value)
    if (name === 'cep') valorFormatado = aplicarMascaraCEP(value)

    setFormData((prev) => ({ ...prev, [name]: valorFormatado }))

    // Busca automática por CEP quando preenchido completamente
    if (name === 'cep' && value.replace(/\D/g, '').length === 8) {
      buscarEnderecoPorCEP(value.replace(/\D/g, ''))
    }
  }

  // Integração com a API do ViaCEP
  const buscarEnderecoPorCEP = async (cepLimpo) => {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await res.json()

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        }))
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err)
    }
  }

  // Envio do Formulário para o Backend
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      // Envia os dados para a rota POST /doacoes do backend
      const resposta = await apiFetch('/doacoes', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      // Redireciona para a tela de confirmação enviando o ID e os dados recebidos
      navigate('/confirmacao', { state: { doacao: resposta } })
    } catch (err) {
      setErro(err.message || 'Falha ao cadastrar doação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Cadastrar Doação de Eletrônico
          </h1>
          <p className="mt-2 text-slate-600 text-sm">
            Preencha os campos abaixo com os seus dados e as informações do equipamento a ser doado.
          </p>

          {erro && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Seção: Dados Pessoais */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Seus Dados</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nome Completo *</label>
                  <input
                    type="text"
                    name="nomeDoador"
                    required
                    value={formData.nomeDoador}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">E-mail *</label>
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
                  <label className="block text-sm font-medium text-slate-700">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    name="telefone"
                    required
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">CPF *</label>
                  <input
                    type="text"
                    name="cpf"
                    required
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Seção: Equipamento */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Informações do Equipamento</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Nome/Modelo do Aparelho *</label>
                  <input
                    type="text"
                    name="equipamento"
                    required
                    placeholder="Ex: Notebook Dell Inspiron i5"
                    value={formData.equipamento}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Categoria *</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                  >
                    <option value="Computadores">Computadores / Laptops</option>
                    <option value="Celulares">Celulares / Tablets</option>
                    <option value="Perifericos">Periféricos (Teclado, Mouse, etc)</option>
                    <option value="Eletrodomesticos">Pequenos Eletrodomésticos</option>
                    <option value="Outros">Outros Eletrônicos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Condição do Item *</label>
                <select
                  name="condicao"
                  value={formData.condicao}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                >
                  <option value="USADO_BOM">Usado - Funcionando perfeitamente</option>
                  <option value="USADO_DEFEITO">Usado - Com pequenos defeitos</option>
                  <option value="SUCATA">Sucata / Para reciclagem de peças</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Descrição Detalhada</label>
                <textarea
                  name="descricao"
                  rows={3}
                  placeholder="Informe detalhes como tempo de uso, acessórios inclusos ou defeitos existentes..."
                  value={formData.descricao}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Seção: Endereço para Coleta */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Endereço de Coleta</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">CEP *</label>
                  <input
                    type="text"
                    name="cep"
                    required
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Rua / Logradouro *</label>
                  <input
                    type="text"
                    name="logradouro"
                    required
                    value={formData.logradouro}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Número *</label>
                  <input
                    type="text"
                    name="numero"
                    required
                    value={formData.numero}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Bairro *</label>
                  <input
                    type="text"
                    name="bairro"
                    required
                    value={formData.bairro}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Cidade/UF *</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.cidade ? `${formData.cidade} / ${formData.estado}` : ''}
                    className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-sm text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow transition disabled:opacity-50 text-center"
            >
              {loading ? 'Enviando Cadastro...' : 'Concluir Doação'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}