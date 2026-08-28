import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/public/Navbar'

function Doacao() {
  const navigate = useNavigate()

  const [formulario, setFormulario] = useState({
    categoria: '',
    equipamento: '',
    quantidade: '',
    observacao: '',
  })

  function handleChange(event) {
    const { id, value } = event.target

    setFormulario({
      ...formulario,
      [id]: value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const quantidade = Number(formulario.quantidade)

    if (quantidade < 1) {
      alert('A quantidade deve ser pelo menos 1.')
      return
    }

    const doacao = {
      id: Date.now(),
      categoria: formulario.categoria,
      equipamento: formulario.equipamento,
      quantidade: quantidade,
      observacao: formulario.observacao,
      status: 'Pendente',
      data: new Date().toLocaleDateString('pt-BR'),
    }

    const doacoesSalvas = JSON.parse(
      localStorage.getItem('doacoes') || '[]'
    )

    doacoesSalvas.push(doacao)

    localStorage.setItem(
      'doacoes',
      JSON.stringify(doacoesSalvas)
    )

    console.log('Doação salva:', doacao)

    navigate('/confirmacao')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">

        <div className="bg-white rounded-2xl shadow-md p-8">

          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Faça sua doação
          </h1>

          <p className="text-gray-600 mb-8">
            Doe equipamentos eletroeletrônicos que você não utiliza
            mais e contribua para o descarte correto.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Categoria */}
            <div>

              <label
                htmlFor="categoria"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Categoria do equipamento
              </label>

              <select
                id="categoria"
                value={formulario.categoria}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              >

                <option value="">
                  Selecione uma categoria
                </option>

                <option value="Computadores e notebooks">
                  Computadores e notebooks
                </option>

                <option value="Peças de computador">
                  Peças de computador
                </option>

                <option value="Periféricos">
                  Periféricos
                </option>

                <option value="Videogames e consoles">
                  Videogames e consoles
                </option>

                <option value="TVs e monitores">
                  TVs e monitores
                </option>

                <option value="Celulares e tablets">
                  Celulares e tablets
                </option>

                <option value="Impressoras">
                  Impressoras
                </option>

                <option value="Cabos, fontes e carregadores">
                  Cabos, fontes e carregadores
                </option>

                <option value="Outros equipamentos eletrônicos">
                  Outros equipamentos eletrônicos
                </option>

              </select>

            </div>

            {/* Equipamento */}
            <div>

              <label
                htmlFor="equipamento"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Nome do equipamento
              </label>

              <input
                type="text"
                id="equipamento"
                value={formulario.equipamento}
                onChange={handleChange}
                required
                placeholder="Ex: Placa de vídeo RTX 4060"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

            </div>

            {/* Quantidade */}
            <div>

              <label
                htmlFor="quantidade"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Quantidade
              </label>

              <input
                type="number"
                id="quantidade"
                value={formulario.quantidade}
                onChange={handleChange}
                min="1"
                step="1"
                required
                placeholder="Digite a quantidade"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

            </div>

            {/* Observação */}
            <div>

              <label
                htmlFor="observacao"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Estado ou observação
              </label>

              <textarea
                id="observacao"
                value={formulario.observacao}
                onChange={handleChange}
                rows="4"
                placeholder="Ex: Equipamento usado, mas funcionando normalmente."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

            </div>

            {/* Botões */}
            <div className="flex gap-4">

              <Link
                to="/"
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Voltar
              </Link>

              <button
                type="submit"
                className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition"
              >
                Confirmar doação
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  )
}

export default Doacao