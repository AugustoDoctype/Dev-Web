
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import { apiFetch } from '../services/api'

const estadoInicial = {
  nomeDoador: '',
  email: '',
  telefone: '',
  cpf: '',
  equipamento: '',
  categoria: '',
  condicao: '',
  descricao: '',
  cep: '',
  logradouro: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
}

const categorias = [
  'Computadores e notebooks',
  'Peças de computador',
  'Monitores e telas',
  'Periféricos',
  'Videogames e acessórios',
  'Televisores',
  'Celulares e tablets',
  'Cabos e carregadores',
  'Equipamentos de áudio',
  'Outros eletroeletrônicos',
]

function TituloSecao({ numero, titulo, descricao }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 font-bold text-emerald-400">
        {numero}
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-100">{titulo}</h2>
        {descricao && (
          <p className="mt-1 text-sm leading-6 text-slate-400">
            {descricao}
          </p>
        )}
      </div>
    </div>
  )
}

function Campo({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
  maxLength,
  children,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-300"
      >
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>

      {children || (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className="w-full rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
      )}
    </div>
  )
}

export default function Doacao() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [erro, setErro] = useState('')
  const [formData, setFormData] = useState(estadoInicial)

  function handleChange(event) {
    const { name, value } = event.target

    let valorFormatado = value

    if (name === 'cpf') {
      valorFormatado = value
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }

    if (name === 'telefone') {
      const numeros = value.replace(/\D/g, '').slice(0, 11)

      if (numeros.length <= 10) {
        valorFormatado = numeros
          .replace(/^(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2')
      } else {
        valorFormatado = numeros
          .replace(/^(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
      }
    }

    if (name === 'cep') {
      valorFormatado = value
        .replace(/\D/g, '')
        .slice(0, 8)
        .replace(/(\d{5})(\d)/, '$1-$2')
    }

    setFormData((anterior) => ({
      ...anterior,
      [name]: valorFormatado,
    }))
  }

  async function buscarCep() {
    const cepNumerico = formData.cep.replace(/\D/g, '')

    if (cepNumerico.length !== 8) {
      setErro('Digite um CEP válido com 8 números.')
      return
    }

    setErro('')
    setBuscandoCep(true)

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepNumerico}/json/`
      )

      if (!resposta.ok) {
        throw new Error('Não foi possível consultar o CEP.')
      }

      const dados = await resposta.json()

      if (dados.erro) {
        throw new Error('CEP não encontrado. Confira os números digitados.')
      }

      setFormData((anterior) => ({
        ...anterior,
        logradouro: dados.logradouro || '',
        bairro: dados.bairro || '',
        cidade: dados.localidade || '',
        estado: dados.uf || '',
      }))
    } catch (error) {
      setErro(error.message || 'Não foi possível consultar o CEP.')
    } finally {
      setBuscandoCep(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setLoading(true)

    try {
      const resposta = await apiFetch('/doacoes', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      navigate('/confirmacao', {
        state: { doacao: resposta },
      })
    } catch (error) {
      setErro(
        error.message ||
          'Não foi possível enviar sua doação. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b110e] text-slate-100">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-white/5 bg-[#0b110e] px-4 py-12 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-6xl">
            <Link
              to="/"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-400"
            >
              <span aria-hidden="true">←</span>
              Voltar para o início
            </Link>

            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                <span aria-hidden="true">♻</span>
                Faça parte da mudança
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                Seu eletrônico antigo pode ter um novo destino.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Cadastre seu equipamento eletroeletrônico e ajude a promover
                o descarte responsável, a reutilização de peças e a redução
                do lixo eletrônico.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-slate-300">
                  ♻ Descarte responsável
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-slate-300">
                  ✓ Cadastro simples
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:py-14">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="rounded-3xl border border-white/[0.08] bg-[#111b16] p-5 shadow-2xl shadow-black/10 sm:p-8">
              <div className="mb-8 border-b border-white/[0.08] pb-6">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                  E-Ciclo • Nova doação
                </span>

                <h2 className="mt-3 text-2xl font-extrabold text-white">
                  Cadastro de doação
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Preencha as informações abaixo para registrar seu
                  equipamento.
                  <span className="mt-1 block">
                    Os campos com <span className="text-red-400">*</span> são
                    obrigatórios.
                  </span>
                </p>
              </div>

              {erro && (
                <div
                  role="alert"
                  className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300"
                >
                  {erro}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-9">
                <section>
                  <TituloSecao
                    numero="1"
                    titulo="Seus dados"
                    descricao="Precisamos dessas informações para entrar em contato."
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Campo
                        label="Nome completo"
                        name="nomeDoador"
                        value={formData.nomeDoador}
                        onChange={handleChange}
                        placeholder="Digite seu nome completo"
                        required
                      />
                    </div>

                    <Campo
                      label="E-mail"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seuemail@exemplo.com"
                      required
                    />

                    <Campo
                      label="Telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(92) 99999-9999"
                      required
                      maxLength={15}
                    />

                    <div className="sm:col-span-2">
                      <Campo
                        label="CPF"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        required
                        maxLength={14}
                      />
                    </div>
                  </div>
                </section>

                <div className="border-t border-white/[0.08]" />

                <section>
                  <TituloSecao
                    numero="2"
                    titulo="Equipamento"
                    descricao="Informe qual eletrônico deseja doar e sua condição."
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Campo
                        label="Nome do equipamento"
                        name="equipamento"
                        value={formData.equipamento}
                        onChange={handleChange}
                        placeholder="Ex.: monitor Samsung, teclado, placa de vídeo..."
                        required
                      />
                    </div>

                    <Campo
                      label="Categoria"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      required
                    >
                      <select
                        id="categoria"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((categoria) => (
                          <option key={categoria} value={categoria}>
                            {categoria}
                          </option>
                        ))}
                      </select>
                    </Campo>

                    <Campo
                      label="Condição do equipamento"
                      name="condicao"
                      value={formData.condicao}
                      onChange={handleChange}
                      required
                    >
                      <select
                        id="condicao"
                        name="condicao"
                        value={formData.condicao}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      >
                        <option value="">Selecione a condição</option>
                        <option value="Funcionando">
                          Funcionando normalmente
                        </option>
                        <option value="Com defeito">Com defeito</option>
                        <option value="Incompleto">
                          Incompleto / faltando peças
                        </option>
                        <option value="Não testado">Não testado</option>
                      </select>
                    </Campo>

                    <div className="sm:col-span-2">
                      <Campo
                        label="Descrição adicional"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                      >
                        <textarea
                          id="descricao"
                          name="descricao"
                          value={formData.descricao}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Descreva o estado do equipamento, marca, modelo ou peças que acompanham a doação..."
                          className="w-full resize-y rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </Campo>
                    </div>
                  </div>
                </section>

                <div className="border-t border-white/[0.08]" />

                <section>
                  <TituloSecao
                    numero="3"
                    titulo="Endereço"
                    descricao="Informe o endereço relacionado à sua doação."
                  />

                  <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                    <Campo
                      label="CEP"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      placeholder="00000-000"
                      required
                      maxLength={9}
                    />

                    <button
                      type="button"
                      onClick={buscarCep}
                      disabled={buscandoCep}
                      className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-400 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {buscandoCep ? 'Consultando...' : 'Buscar CEP'}
                    </button>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Campo
                        label="Logradouro"
                        name="logradouro"
                        value={formData.logradouro}
                        onChange={handleChange}
                        placeholder="Rua, avenida..."
                        required
                      />
                    </div>

                    <Campo
                      label="Número"
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      placeholder="Número ou S/N"
                      required
                    />

                    <Campo
                      label="Bairro"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                      placeholder="Seu bairro"
                      required
                    />

                    <Campo
                      label="Cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      placeholder="Sua cidade"
                      required
                    />

                    <Campo
                      label="Estado (UF)"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      placeholder="Ex.: AM"
                      required
                      maxLength={2}
                    />
                  </div>
                </section>

                <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4">
                  <p className="text-sm leading-6 text-emerald-200">
                    <strong className="text-emerald-400">Importante:</strong>{' '}
                    revise os dados antes de enviar. O cadastro registra sua
                    intenção de doar; as próximas etapas dependem do
                    funcionamento da API e do processo de coleta do projeto.
                  </p>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:justify-between">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.04]"
                  >
                    Cancelar
                  </Link>

                  <button
                    type="submit"
                    disabled={loading || buscandoCep}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-sm font-bold text-[#07110b] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Enviando doação...' : 'Enviar cadastro'}
                    {!loading && <span aria-hidden="true">→</span>}
                  </button>
                </div>
              </form>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-6">
              <div className="overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#111b16] p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-2xl text-emerald-400">
                  ♻
                </div>

                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Impacto positivo
                </span>

                <h2 className="mt-3 text-xl font-extrabold text-white">
                  Sua atitude faz diferença
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Equipamentos eletrônicos podem conter materiais que precisam
                  de destinação adequada. A doação ajuda a incentivar o
                  reaproveitamento e o descarte responsável.
                </p>

                <div className="mt-6 space-y-5">
                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                      ✓
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">
                        Menos desperdício
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Peças e equipamentos podem ganhar uma nova utilidade.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                      ✓
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">
                        Descarte consciente
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Ajude a reduzir o descarte inadequado de eletrônicos.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                      ✓
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">
                        Comunidade melhor
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Pequenas atitudes podem gerar um impacto positivo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-[#111b16] p-6">
                <h3 className="font-bold text-slate-100">
                  Tem alguma dúvida?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Você pode voltar à página inicial para conhecer melhor o
                  projeto E-Ciclo.
                </p>

                <Link
                  to="/"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-400 transition hover:text-emerald-300"
                >
                  Conhecer o projeto
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.08] bg-[#0b110e] px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} E-Ciclo. Todos os direitos reservados.
          </p>
          <p>Um destino melhor para seus eletrônicos.</p>
        </div>
      </footer>
    </div>
  )
}
