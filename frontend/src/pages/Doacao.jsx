import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import { apiFetch } from '../services/api'

// ============================================================
// 1. CONFIGURAÇÕES E DADOS INICIAIS
// ============================================================
const ESTADO_INICIAL = {
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

const CATEGORIAS = [
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

const CONDICOES = [
  { valor: 'Funcionando', rotulo: 'Funcionando normalmente' },
  { valor: 'Com defeito', rotulo: 'Com defeito' },
  { valor: 'Incompleto', rotulo: 'Incompleto / faltando peças' },
  { valor: 'Não testado', rotulo: 'Não testado' },
]

// ============================================================
// 2. FUNÇÕES AUXILIARES DE FORMATAÇÃO E VALIDAÇÃO
// ============================================================
function somenteDigitos(valor) {
  return valor.replace(/\D/g, '')
}

function formatarCPF(valor) {
  return somenteDigitos(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function cpfValido(valor) {
  const cpf = somenteDigitos(valor)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  for (let tamanho = 9; tamanho <= 10; tamanho += 1) {
    const soma = [...cpf.slice(0, tamanho)].reduce(
      (total, digito, indice) => total + Number(digito) * (tamanho + 1 - indice),
      0
    )
    const resto = (soma * 10) % 11
    const verificador = resto === 10 ? 0 : resto
    if (verificador !== Number(cpf[tamanho])) return false
  }

  return true
}

function formatarTelefone(valor) {
  const numeros = somenteDigitos(valor).slice(0, 11)
  if (numeros.length <= 10) {
    return numeros
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return numeros
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

function formatarCEP(valor) {
  return somenteDigitos(valor).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')
}

function validarFormulario(dados) {
  if (dados.nomeDoador.trim().length < 3) return 'Informe o nome completo do doador.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email.trim())) {
    return 'Informe um e-mail válido.'
  }
  if (![10, 11].includes(somenteDigitos(dados.telefone).length)) {
    return 'Informe um telefone com DDD válido.'
  }
  if (!cpfValido(dados.cpf)) return 'Informe um CPF válido.'
  if (dados.equipamento.trim().length < 3) return 'Informe o nome do equipamento.'
  if (!CATEGORIAS.includes(dados.categoria)) return 'Selecione uma categoria válida.'
  if (!CONDICOES.some((item) => item.valor === dados.condicao)) {
    return 'Selecione a condição do equipamento.'
  }
  if (somenteDigitos(dados.cep).length !== 8) return 'Informe um CEP com 8 dígitos.'
  if (!dados.logradouro.trim() || !dados.numero.trim() || !dados.bairro.trim()) {
    return 'Preencha o endereço, o número e o bairro.'
  }
  if (!dados.cidade.trim() || !/^[a-zA-Z]{2}$/.test(dados.estado.trim())) {
    return 'Informe a cidade e a sigla do estado (UF).'
  }
  return null
}

// ============================================================
// 3. COMPONENTES REUTILIZÁVEIS DO FORMULÁRIO
// ============================================================
function TituloSecao({ numero, titulo, descricao }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 font-bold text-emerald-400">
        {numero}
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-100">{titulo}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-400">{descricao}</p>
      </div>
    </div>
  )
}

const CLASSE_CAMPO =
  'w-full rounded-xl border border-white/10 bg-[#0b110e] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'

function Campo({ label, name, value, onChange, placeholder = '', type = 'text', required = false, maxLength, children }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-300">
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
          className={CLASSE_CAMPO}
        />
      )}
    </div>
  )
}

// ============================================================
// 4. PÁGINA PRINCIPAL
// ============================================================
export default function Doacao() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(ESTADO_INICIAL)
  const [loading, setLoading] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [erro, setErro] = useState('')
  const consultaCepRef = useRef(0)

  // 4.1. Atualização dos campos e aplicação das máscaras
  function handleChange(event) {
    const { name, value } = event.target
    let valor = value

    if (name === 'cpf') valor = formatarCPF(value)
    if (name === 'telefone') valor = formatarTelefone(value)
    if (name === 'cep') {
      valor = formatarCEP(value)
      consultaCepRef.current += 1 // Invalida respostas de consultas anteriores.
      setBuscandoCep(false)
    }
    if (name === 'estado') valor = value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()

    setFormData((anterior) => ({ ...anterior, [name]: valor }))
  }

  // 4.2. Consulta de endereço pelo ViaCEP
  async function buscarCep() {
    const cep = somenteDigitos(formData.cep)
    if (cep.length !== 8) {
      setErro('Digite um CEP válido com 8 números.')
      return
    }

    const consultaAtual = ++consultaCepRef.current
    setErro('')
    setBuscandoCep(true)

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      if (!resposta.ok) throw new Error('Não foi possível consultar o CEP.')

      const dados = await resposta.json()
      if (consultaAtual !== consultaCepRef.current) return
      if (dados.erro) throw new Error('CEP não encontrado. Confira os números digitados.')

      setFormData((anterior) => ({
        ...anterior,
        logradouro: dados.logradouro || '',
        bairro: dados.bairro || '',
        cidade: dados.localidade || '',
        estado: dados.uf || '',
      }))
    } catch (error) {
      if (consultaAtual === consultaCepRef.current) {
        setErro(error.message || 'Não foi possível consultar o CEP.')
      }
    } finally {
      if (consultaAtual === consultaCepRef.current) setBuscandoCep(false)
    }
  }

  // 4.3. Cadastro: primeiro o doador, depois o equipamento
  async function handleSubmit(event) {
    event.preventDefault()
    if (loading || buscandoCep) return

    const mensagemValidacao = validarFormulario(formData)
    if (mensagemValidacao) {
      setErro(mensagemValidacao)
      return
    }

    setErro('')
    setLoading(true)

    try {
      // A API atual não possui POST /doacoes. O cadastro exige duas operações.
      const respostaDoador = await apiFetch('/doadores', {
        method: 'POST',
        body: JSON.stringify({
          nome: formData.nomeDoador.trim(),
          email: formData.email.trim().toLowerCase(),
          whatsapp: formData.telefone,
          bairro: formData.bairro.trim(),
        }),
      })

      const doadorId = respostaDoador?.dados?.id
      if (!doadorId) throw new Error('O servidor não retornou o ID do doador.')

      // Nome e condição entram na descrição porque o banco ainda não tem colunas próprias.
      const descricaoCompleta = [
        formData.equipamento.trim(),
        formData.descricao.trim(),
        `Condição: ${formData.condicao}`,
      ].filter(Boolean).join(' - ')

      const respostaEquipamento = await apiFetch('/equipamentos', {
        method: 'POST',
        body: JSON.stringify({
          doadorId,
          categoria: formData.categoria,
          descricao: descricaoCompleta,
          status: 'PENDENTE',
        }),
      })

      const equipamento = respostaEquipamento?.dados
      if (!equipamento?.id) {
        throw new Error('O servidor não confirmou o cadastro do equipamento.')
      }

      navigate('/confirmacao', {
        state: {
          doacao: {
            id: equipamento.id,
            equipamento: formData.equipamento.trim(),
            nomeDoador: formData.nomeDoador.trim(),
            categoria: equipamento.categoria,
            status: equipamento.status,
            codigoAcompanhamento: equipamento.codigoAcompanhamento,
          },
        },
      })
    } catch (error) {
      setErro(error.message || 'Não foi possível cadastrar a doação.')
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // 5. RENDERIZAÇÃO DA PÁGINA
  // ============================================================
  return (
    <div className="min-h-screen bg-[#0b110e] text-slate-100">
      <Navbar />

      {/* 5.1. Apresentação da página */}
      <header className="relative overflow-hidden border-b border-white/5 px-4 py-12 sm:py-16">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <Link to="/" className="text-sm font-medium text-slate-400 transition hover:text-emerald-400">
            ← Voltar ao início
          </Link>
          <div className="mt-7 max-w-3xl">
            <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              ♻ Faça parte da mudança
            </span>
            <h1 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Seu eletrônico antigo pode ter um novo destino.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
              Cadastre seu equipamento e colabore com o descarte responsável de resíduos eletrônicos.
            </p>
          </div>
        </div>
      </header>

      <main className="px-4 py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="rounded-3xl border border-white/[0.08] bg-[#111b16] p-5 shadow-2xl sm:p-8">
            <div className="mb-8 border-b border-white/[0.08] pb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">E-Ciclo • Nova doação</span>
              <h2 className="mt-3 text-2xl font-extrabold text-white">Cadastro de doação</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Preencha os campos abaixo. Os campos com <span className="text-red-400">*</span> são obrigatórios.
              </p>
            </div>

            {erro && (
              <div role="alert" className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-9">
              {/* 5.2. Identificação do doador */}
              <section>
                <TituloSecao numero="1" titulo="Seus dados" descricao="Precisamos dessas informações para entrar em contato." />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Campo label="Nome completo" name="nomeDoador" value={formData.nomeDoador} onChange={handleChange} required placeholder="Digite seu nome completo" />
                  </div>
                  <Campo label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="seuemail@exemplo.com" />
                  <Campo label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} required maxLength={15} placeholder="(92) 99999-9999" />
                  <div className="sm:col-span-2">
                    <Campo label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} required maxLength={14} placeholder="000.000.000-00" />
                  </div>
                </div>
              </section>

              <div className="border-t border-white/[0.08]" />

              {/* 5.3. Informações do equipamento */}
              <section>
                <TituloSecao numero="2" titulo="Equipamento" descricao="Informe qual eletrônico deseja doar e sua condição." />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Campo label="Nome do equipamento" name="equipamento" value={formData.equipamento} onChange={handleChange} required placeholder="Ex.: monitor, teclado, placa de vídeo..." />
                  </div>
                  <Campo label="Categoria" name="categoria" required>
                    <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required className={CLASSE_CAMPO}>
                      <option value="">Selecione uma categoria</option>
                      {CATEGORIAS.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
                    </select>
                  </Campo>
                  <Campo label="Condição do equipamento" name="condicao" required>
                    <select id="condicao" name="condicao" value={formData.condicao} onChange={handleChange} required className={CLASSE_CAMPO}>
                      <option value="">Selecione a condição</option>
                      {CONDICOES.map(({ valor, rotulo }) => <option key={valor} value={valor}>{rotulo}</option>)}
                    </select>
                  </Campo>
                  <div className="sm:col-span-2">
                    <Campo label="Descrição adicional" name="descricao">
                      <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} rows={4} placeholder="Marca, modelo, estado de conservação e acessórios..." className={`${CLASSE_CAMPO} resize-y`} />
                    </Campo>
                  </div>
                </div>
              </section>

              <div className="border-t border-white/[0.08]" />

              {/* 5.4. Endereço e busca de CEP */}
              <section>
                <TituloSecao numero="3" titulo="Endereço" descricao="Informe o endereço relacionado à sua doação." />
                <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <Campo label="CEP" name="cep" value={formData.cep} onChange={handleChange} required maxLength={9} placeholder="00000-000" />
                  <button type="button" onClick={buscarCep} disabled={buscandoCep || loading} className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-400 transition hover:bg-emerald-400/20 disabled:opacity-60">
                    {buscandoCep ? 'Consultando...' : 'Buscar CEP'}
                  </button>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Campo label="Logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} required placeholder="Rua, avenida..." />
                  </div>
                  <Campo label="Número" name="numero" value={formData.numero} onChange={handleChange} required placeholder="Número ou S/N" />
                  <Campo label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} required placeholder="Seu bairro" />
                  <Campo label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} required placeholder="Sua cidade" />
                  <Campo label="Estado (UF)" name="estado" value={formData.estado} onChange={handleChange} required maxLength={2} placeholder="Ex.: AM" />
                </div>
              </section>

              {/* 5.5. Aviso e ações */}
              <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4 text-sm leading-6 text-emerald-200">
                <strong className="text-emerald-400">Importante:</strong> este cadastro registra sua intenção de doar. Nesta versão, o banco armazena apenas nome, e-mail, telefone, bairro e os dados básicos do equipamento. CPF e endereço completo não são armazenados.
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:justify-between">
                <Link to="/" className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3 text-sm font-bold text-slate-300 hover:border-white/20">Cancelar</Link>
                <button type="submit" disabled={loading || buscandoCep} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-sm font-bold text-[#07110b] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? 'Enviando doação...' : 'Enviar cadastro'}
                  {!loading && <span aria-hidden="true">→</span>}
                </button>
              </div>
            </form>
          </div>

          {/* 5.6. Conteúdo informativo lateral */}
          <aside className="space-y-5 lg:sticky lg:top-6">
            <div className="rounded-3xl border border-emerald-400/10 bg-[#111b16] p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-2xl">♻</div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Impacto positivo</span>
              <h2 className="mt-3 text-xl font-bold text-white">Sua atitude faz diferença</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">Equipamentos eletrônicos podem conter materiais que precisam de destinação adequada. O cadastro ajuda a incentivar o reaproveitamento e o descarte responsável.</p>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <p>✓ Menos desperdício de materiais</p>
                <p>✓ Reutilização de peças e componentes</p>
                <p>✓ Descarte ambientalmente responsável</p>
              </div>
            </div>
            <div className="rounded-3xl border border-white/[0.08] bg-[#111b16] p-6">
              <h3 className="font-bold text-slate-100">Tem alguma dúvida?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Você pode voltar à página inicial para conhecer melhor o E-Ciclo.</p>
              <Link to="/" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300">Conhecer o projeto →</Link>
            </div>
          </aside>
        </div>
      </main>

      {/* 5.7. Rodapé */}
      <footer className="border-t border-white/[0.08] px-4 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} E-Ciclo. Todos os direitos reservados.
      </footer>
    </div>
  )
}
