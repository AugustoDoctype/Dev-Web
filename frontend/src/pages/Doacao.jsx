import { useEffect, useRef, useState } from 'react'
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

function validarFormulario(dados, { precisaEndereco }) {
  if (dados.equipamento.trim().length < 3) return 'Informe o nome do equipamento.'
  if (!CATEGORIAS.includes(dados.categoria)) return 'Selecione uma categoria válida.'
  if (!CONDICOES.some((item) => item.valor === dados.condicao)) {
    return 'Selecione a condição do equipamento.'
  }
  if (!precisaEndereco) return null
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

  // 4.0. Conta autenticada e endereço de referência do perfil.
  const [temSessao] = useState(() => Boolean(localStorage.getItem('doadorToken')))
  const [perfil, setPerfil] = useState(null)
  const [erroPerfil, setErroPerfil] = useState('')
  const [carregandoPerfil, setCarregandoPerfil] = useState(temSessao)
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null)
  const [editarEndereco, setEditarEndereco] = useState(false)
  const [modalidadeEntrega, setModalidadeEntrega] = useState('PONTO_COLETA')

  useEffect(() => {
    if (!temSessao) return
    let ativo = true

    async function carregarPerfil() {
      try {
        const resposta = await apiFetch('/doadores/me', { auth: 'doador' })
        if (!ativo) return
        const dados = resposta?.dados
        if (!dados?.id) throw new Error('Perfil de doador não encontrado.')

        const endereco = dados.enderecos?.find((item) => item.preferencial)
          || dados.enderecos?.[0] || null
        setPerfil(dados)
        setEnderecoSelecionado(endereco)
        setFormData((anterior) => ({
          ...anterior,
          nomeDoador: dados.nome || '',
          email: dados.email || '',
          telefone: formatarTelefone(dados.whatsapp || ''),
          ...(endereco ? {
            cep: formatarCEP(endereco.cep),
            logradouro: endereco.logradouro,
            numero: endereco.numero,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
          } : {}),
        }))
        setEditarEndereco(!endereco)
      } catch (error) {
        if (ativo) setErroPerfil(error.message || 'Não foi possível carregar o seu perfil.')
      } finally {
        if (ativo) setCarregandoPerfil(false)
      }
    }
    carregarPerfil()
    return () => { ativo = false }
  }, [temSessao])

  const precisaEndereco = modalidadeEntrega === 'COLETA_DOMICILIAR'
    && (!enderecoSelecionado || editarEndereco)

  function restaurarEndereco() {
    if (!enderecoSelecionado) return
    setFormData((anterior) => ({
      ...anterior,
      cep: formatarCEP(enderecoSelecionado.cep),
      logradouro: enderecoSelecionado.logradouro,
      numero: enderecoSelecionado.numero,
      bairro: enderecoSelecionado.bairro,
      cidade: enderecoSelecionado.cidade,
      estado: enderecoSelecionado.estado,
    }))
    setEditarEndereco(false)
    setErro('')
  }

  // Seleciona outro endereço existente sem mudar a preferência do perfil.
  function selecionarEnderecoCadastrado(event) {
    const endereco = perfil?.enderecos?.find((item) => item.id === event.target.value)
    if (!endereco) return
    setEnderecoSelecionado(endereco)
    setFormData((anterior) => ({
      ...anterior,
      cep: formatarCEP(endereco.cep),
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
    }))
    setEditarEndereco(false)
    setErro('')
  }

  function enderecoMudou() {
    if (!enderecoSelecionado) return true
    return somenteDigitos(formData.cep) !== somenteDigitos(enderecoSelecionado.cep)
      || ['logradouro', 'numero', 'bairro', 'cidade', 'estado'].some(
        (campo) => formData[campo].trim() !== String(enderecoSelecionado[campo] || '').trim()
      )
  }

  // 4.1. Atualização dos campos e aplicação das máscaras
  function handleChange(event) {
    const { name, value } = event.target
    let valor = value

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

  // 4.3. Cadastro: a sessão identifica o doador, nunca o ID enviado pelo navegador.
  async function handleSubmit(event) {
    event.preventDefault()
    if (!temSessao) {
      setErro('Entre na sua conta para cadastrar um equipamento.')
      return
    }
    if (loading || buscandoCep || carregandoPerfil || !perfil) return

    const mensagemValidacao = validarFormulario(formData, { precisaEndereco })
    if (mensagemValidacao) {
      setErro(mensagemValidacao)
      return
    }

    setErro('')
    setLoading(true)
    try {
      // Nome e condição entram na descrição: a tabela ainda não tem colunas próprias.
      const descricaoCompleta = [
        formData.equipamento.trim(),
        formData.descricao.trim(),
        `Condição: ${formData.condicao}`,
      ].filter(Boolean).join(' - ')
      // Criação autenticada: o JWT identifica o titular; não enviamos doadorId.
      let enderecoId
      if (modalidadeEntrega === 'COLETA_DOMICILIAR') {
        enderecoId = enderecoSelecionado?.id || null
        if (precisaEndereco && enderecoMudou()) {
          const respostaEndereco = await apiFetch('/doadores/me/enderecos', {
            auth: 'doador', method: 'POST',
            body: JSON.stringify({
              cep: somenteDigitos(formData.cep),
              logradouro: formData.logradouro.trim(),
              numero: formData.numero.trim(),
              bairro: formData.bairro.trim(),
              cidade: formData.cidade.trim(),
              estado: formData.estado.trim().toUpperCase(),
              preferencial: true,
            }),
          })
          if (!respostaEndereco?.dados?.id) {
            throw new Error('O servidor não confirmou o endereço.')
          }
          enderecoId = respostaEndereco.dados.id
          setEnderecoSelecionado(respostaEndereco.dados)
          setEditarEndereco(false)
        }
        if (!enderecoId) throw new Error('Selecione um endereço para solicitar retirada.')
      }

      const respostaEquipamento = await apiFetch('/doadores/me/equipamentos', {
        auth: 'doador', method: 'POST',
        body: JSON.stringify({
          categoria: formData.categoria,
          descricao: descricaoCompleta,
          modalidadeEntrega,
          ...(modalidadeEntrega === 'COLETA_DOMICILIAR' ? { enderecoId } : {}),
        }),
      })

      const equipamento = respostaEquipamento?.dados
      if (!equipamento?.id || !equipamento?.codigoAcompanhamento) {
        throw new Error('O servidor não confirmou o código de acompanhamento.')
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
    <div className="ec-polish ec-polish--doacao min-h-screen bg-[#0b110e] text-slate-100">
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

            {(erroPerfil || erro) && (
              <div role="alert" className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {erroPerfil || erro}
                {erroPerfil && <p className="mt-2"><Link className="underline" to="/login">Entrar novamente</Link></p>}
              </div>
            )}
            {carregandoPerfil && (
              <p className="mb-6 text-sm text-slate-300">Carregando seus dados cadastrados...</p>
            )}

            {!temSessao ? (
              <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6">
                <h3 className="text-xl font-bold text-emerald-400">Entre para cadastrar uma doação</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Para proteger seus dados e acompanhar seu histórico, é necessário entrar
                  ou criar uma conta. A consulta por código continua pública.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to="/login" className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-[#07110b]">Entrar</Link>
                  <Link to="/cadastro" className="rounded-xl border border-emerald-400/30 px-5 py-3 text-sm font-bold text-emerald-400">Criar conta</Link>
                </div>
              </section>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-9">
              {/* 5.2. Dados pessoais: resumo para conta autenticada */}
              <section>
                <TituloSecao numero="1" titulo="Seus dados" descricao="Informações para entrar em contato." />
                {perfil ? (
                  <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-5 text-sm text-slate-200">
                    <p className="font-bold text-emerald-400">Dados carregados da sua conta</p>
                    <p className="mt-2">{perfil.nome}</p>
                    <p>{perfil.email}</p>
                    <p>{formatarTelefone(perfil.whatsapp)}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Aguardando identificação do doador...</p>
                )}
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

              {/* 5.4. Modalidade de entrega */}
              <section>
                <TituloSecao numero="3" titulo="Forma de entrega" descricao="Escolha como pretende encaminhar seu eletrônico." />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className={`cursor-pointer rounded-xl border p-4 text-sm ${modalidadeEntrega === 'PONTO_COLETA' ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/15 hover:border-emerald-400/30'}`}>
                    <input type="radio" name="modalidadeEntrega" checked={modalidadeEntrega === 'PONTO_COLETA'}
                      onChange={() => { setModalidadeEntrega('PONTO_COLETA'); setErro('') }} className="mr-2 accent-emerald-500" />
                    <strong>Levar a um ponto de coleta</strong>
                    <p className="mt-2 text-slate-400">Você leva o equipamento a um ponto disponível. Não exige endereço residencial.</p>
                  </label>
                  <label className={`cursor-pointer rounded-xl border p-4 text-sm ${modalidadeEntrega === 'COLETA_DOMICILIAR' ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/15 hover:border-emerald-400/30'}`}>
                    <input type="radio" name="modalidadeEntrega" checked={modalidadeEntrega === 'COLETA_DOMICILIAR'}
                      onChange={() => { setModalidadeEntrega('COLETA_DOMICILIAR'); setErro('') }} className="mr-2 accent-emerald-500" />
                    <strong>Solicitar retirada no endereço</strong>
                    <p className="mt-2 text-slate-400">Sujeita à disponibilidade; isto não agenda nem confirma a coleta.</p>
                  </label>
                </div>
                {modalidadeEntrega === 'PONTO_COLETA' && (
                  <Link to="/pontos-de-coleta" className="mt-4 inline-block text-sm font-bold text-emerald-400 hover:underline">
                    Consultar os pontos de coleta →
                  </Link>
                )}
              </section>

              {/* 5.5. Endereço apenas para retirada */}
              {modalidadeEntrega === 'COLETA_DOMICILIAR' && (
              <section>
                <TituloSecao numero="4" titulo="Endereço para retirada" descricao="Selecione o local para solicitar retirada." />
                {temSessao && (perfil?.enderecos?.length || 0) > 1 && (
                  <div className="mb-5">
                    <label htmlFor="enderecoCadastrado" className="mb-2 block text-sm font-semibold text-slate-300">
                      Selecionar endereço cadastrado
                    </label>
                    <select
                      id="enderecoCadastrado"
                      value={enderecoSelecionado?.id || ''}
                      onChange={selecionarEnderecoCadastrado}
                      className={CLASSE_CAMPO}
                      disabled={loading}
                    >
                      <option value="" disabled>Selecione um endereço</option>
                      {perfil.enderecos.map((endereco) => (
                        <option key={endereco.id} value={endereco.id}>
                          {endereco.logradouro}, {endereco.numero} — {endereco.bairro} ({endereco.cidade}/{endereco.estado})
                          {endereco.preferencial ? ' • Preferencial' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {temSessao && enderecoSelecionado && !editarEndereco ? (
                  <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-5 text-sm text-slate-200">
                    <p className="font-bold text-emerald-400">Endereço salvo</p>
                    <p className="mt-2">{enderecoSelecionado.logradouro}, {enderecoSelecionado.numero}</p>
                    <p>{enderecoSelecionado.bairro} — {enderecoSelecionado.cidade}/{enderecoSelecionado.estado}</p>
                    <p>CEP: {formatarCEP(enderecoSelecionado.cep)}</p>
                    <button type="button" onClick={() => setEditarEndereco(true)}
                      className="mt-4 rounded-lg border border-emerald-400/30 px-4 py-2 font-semibold text-emerald-400 hover:bg-emerald-500/10">
                      Usar outro endereço
                    </button>
                  </div>
                ) : (
                  <>
                    {temSessao && (
                      <p className="mb-4 text-sm text-slate-400">{enderecoSelecionado
                        ? 'Ao alterar os dados, um novo endereço preferencial será salvo no seu perfil.'
                        : 'Este será seu primeiro endereço salvo no perfil.'}</p>
                    )}
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
                    {temSessao && enderecoSelecionado && (
                      <button type="button" onClick={restaurarEndereco} className="mt-4 text-sm font-semibold text-emerald-400 hover:underline">
                        Cancelar alteração e usar endereço salvo
                      </button>
                    )}
                  </>
                )}
              </section>
              )}

              {/* 5.6. Aviso e ações */}
              <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4 text-sm leading-6 text-emerald-200">
                <strong className="text-emerald-400">Importante:</strong> este cadastro registra sua intenção de doar. Na entrega em ponto de coleta, não é necessário endereço. A retirada domiciliar é apenas uma solicitação e depende de confirmação da equipe.
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:justify-between">
                <Link to="/" className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3 text-sm font-bold text-slate-300 hover:border-white/20">Cancelar</Link>
                <button type="submit" disabled={loading || buscandoCep || carregandoPerfil || (temSessao && !perfil)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-sm font-bold text-[#07110b] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? 'Enviando doação...' : 'Enviar cadastro'}
                  {!loading && <span aria-hidden="true">→</span>}
                </button>
              </div>
            </form>
            )}
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
