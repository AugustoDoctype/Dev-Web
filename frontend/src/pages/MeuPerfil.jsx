import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import { apiFetch } from '../services/api'

const enderecoInicial = {
  cep: '',
  logradouro: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  preferencial: false,
}

function somenteDigitos(valor) {
  return String(valor || '').replace(/\D/g, '')
}

function formatarCep(valor) {
  return somenteDigitos(valor).slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2')
}

export default function MeuPerfil() {
  const [autenticado, setAutenticado] = useState(
    () => Boolean(localStorage.getItem('doadorToken'))
  )
  const [tema, setTema] = useState(
    () => localStorage.getItem('eciclo-tema') || 'escuro'
  )

  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState('')
  const [perfil, setPerfil] = useState(null)
  const [dadosPessoais, setDadosPessoais] = useState({
    nome: '',
    whatsapp: '',
    bairro: '',
  })
  const [enderecos, setEnderecos] = useState([])

  const [salvandoPerfil, setSalvandoPerfil] = useState(false)
  const [mensagemPerfil, setMensagemPerfil] = useState('')
  const [erroPerfil, setErroPerfil] = useState('')

  const [formEnderecoAberto, setFormEnderecoAberto] = useState(false)
  const [idEnderecoEdicao, setIdEnderecoEdicao] = useState(null)
  const [dadosEndereco, setDadosEndereco] = useState({ ...enderecoInicial })
  const [salvandoEndereco, setSalvandoEndereco] = useState(false)
  const [salvandoPreferencialId, setSalvandoPreferencialId] = useState(null)
  const [mensagemEndereco, setMensagemEndereco] = useState('')
  const [erroEndereco, setErroEndereco] = useState('')

  const modoClaro = tema === 'claro'
  const paginaClass = modoClaro
    ? 'bg-slate-50 text-slate-900'
    : 'bg-[#0b110e] text-slate-100'
  const cardClass = modoClaro
    ? 'border-slate-200 bg-white'
    : 'border-emerald-400/10 bg-[#111b16]'
  const secundarioClass = modoClaro ? 'text-slate-600' : 'text-slate-400'
  const inputClass = modoClaro
    ? 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500'
    : 'border-white/15 bg-[#0b110e] text-slate-100 focus:border-emerald-400'
  const campoClass = `mt-1 w-full rounded-xl border px-3 py-2.5 outline-none transition focus:ring-2 focus:ring-emerald-500/20 ${inputClass}`
  const botaoPrincipal = 'rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-[#07120b] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50'
  const botaoSecundario = modoClaro
    ? 'rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100'
    : 'rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5'

  useEffect(() => {
    function sincronizarSessao() {
      setAutenticado(Boolean(localStorage.getItem('doadorToken')))
    }
    function sincronizarTema(evento) {
      setTema(evento.detail === 'claro' ? 'claro' : 'escuro')
    }

    window.addEventListener('eciclo-auth-alterado', sincronizarSessao)
    window.addEventListener('storage', sincronizarSessao)
    window.addEventListener('eciclo-tema-alterado', sincronizarTema)

    return () => {
      window.removeEventListener('eciclo-auth-alterado', sincronizarSessao)
      window.removeEventListener('storage', sincronizarSessao)
      window.removeEventListener('eciclo-tema-alterado', sincronizarTema)
    }
  }, [])

  // GET /doadores/me retorna os dados pessoais e os endereços do titular.
  useEffect(() => {
    if (!autenticado) return

    let ativo = true

    async function carregar() {
      setCarregando(true)
      setErroCarregamento('')

      try {
        const resposta = await apiFetch('/doadores/me', { auth: 'doador' })
        if (!ativo) return

        const dados = resposta?.dados
        if (!dados?.id) {
          throw new Error('O servidor não retornou os dados do perfil.')
        }

        setPerfil(dados)
        setDadosPessoais({
          nome: dados.nome || '',
          whatsapp: dados.whatsapp || '',
          bairro: dados.bairro || '',
        })
        setEnderecos(Array.isArray(dados.enderecos) ? dados.enderecos : [])
      } catch (error) {
        if (ativo) setErroCarregamento(error.message || 'Não foi possível carregar seu perfil.')
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    carregar()

    return () => {
      ativo = false
    }
  }, [autenticado])

  function atualizarCampoPessoal(evento) {
    const { name, value } = evento.target
    setDadosPessoais((anterior) => ({ ...anterior, [name]: value }))
    setMensagemPerfil('')
    setErroPerfil('')
  }

  async function salvarPerfil(evento) {
    evento.preventDefault()

    const dados = {
      nome: dadosPessoais.nome.trim(),
      whatsapp: dadosPessoais.whatsapp.trim(),
      bairro: dadosPessoais.bairro.trim(),
    }

    if (dados.nome.length < 3) {
      setErroPerfil('O nome deve conter pelo menos 3 caracteres.')
      return
    }
    if (dados.whatsapp.length < 10 || dados.whatsapp.length > 20) {
      setErroPerfil('Informe um WhatsApp válido com DDD.')
      return
    }
    if (dados.bairro.length < 2) {
      setErroPerfil('Informe seu bairro de referência.')
      return
    }

    setSalvandoPerfil(true)
    setMensagemPerfil('')
    setErroPerfil('')

    try {
      const resposta = await apiFetch('/doadores/me', {
        auth: 'doador',
        method: 'PUT',
        body: JSON.stringify(dados),
      })

      const atualizado = resposta?.dados
      if (!atualizado?.id) {
        throw new Error('O servidor não confirmou a atualização.')
      }

      setPerfil((anterior) => ({ ...anterior, ...atualizado }))
      setDadosPessoais({
        nome: atualizado.nome,
        whatsapp: atualizado.whatsapp,
        bairro: atualizado.bairro,
      })

      // Mantém o cache local usado pelo fluxo de login sincronizado.
      try {
        const armazenado = JSON.parse(localStorage.getItem('doadorPerfil') || '{}')
        localStorage.setItem('doadorPerfil', JSON.stringify({ ...armazenado, ...atualizado }))
      } catch {
        // Falha de armazenamento local não invalida o salvamento no backend.
      }

      setMensagemPerfil('Dados pessoais atualizados com sucesso.')
    } catch (error) {
      setErroPerfil(error.message || 'Não foi possível atualizar os dados.')
    } finally {
      setSalvandoPerfil(false)
    }
  }

  function novoEndereco() {
    setIdEnderecoEdicao(null)
    setDadosEndereco({
      ...enderecoInicial,
      preferencial: enderecos.length === 0,
    })
    setFormEnderecoAberto(true)
    setErroEndereco('')
    setMensagemEndereco('')
  }

  function editarEndereco(endereco) {
    setIdEnderecoEdicao(endereco.id)
    setDadosEndereco({
      cep: formatarCep(endereco.cep),
      logradouro: endereco.logradouro || '',
      numero: endereco.numero || '',
      bairro: endereco.bairro || '',
      cidade: endereco.cidade || '',
      estado: endereco.estado || '',
      preferencial: Boolean(endereco.preferencial),
    })
    setFormEnderecoAberto(true)
    setErroEndereco('')
    setMensagemEndereco('')
  }

  function atualizarCampoEndereco(evento) {
    const { name, value, type, checked } = evento.target
    setDadosEndereco((anterior) => ({
      ...anterior,
      [name]: type === 'checkbox'
        ? checked
        : name === 'cep' ? formatarCep(value)
          : name === 'estado' ? value.slice(0, 2).toUpperCase()
            : value,
    }))
    setErroEndereco('')
  }

  async function salvarEndereco(evento) {
    evento.preventDefault()

    const dados = {
      cep: somenteDigitos(dadosEndereco.cep),
      logradouro: dadosEndereco.logradouro.trim(),
      numero: dadosEndereco.numero.trim(),
      bairro: dadosEndereco.bairro.trim(),
      cidade: dadosEndereco.cidade.trim(),
      estado: dadosEndereco.estado.trim().toUpperCase(),
      preferencial: dadosEndereco.preferencial,
    }

    if (dados.cep.length !== 8) {
      setErroEndereco('O CEP precisa ter 8 dígitos.')
      return
    }
    if (dados.logradouro.length < 2 || !dados.numero || dados.bairro.length < 2 ||
        dados.cidade.length < 2 || !/^[A-Z]{2}$/.test(dados.estado)) {
      setErroEndereco('Preencha corretamente rua, número, bairro, cidade e UF.')
      return
    }

    setSalvandoEndereco(true)
    setErroEndereco('')
    setMensagemEndereco('')

    try {
      const url = idEnderecoEdicao
        ? `/doadores/me/enderecos/${encodeURIComponent(idEnderecoEdicao)}`
        : '/doadores/me/enderecos'

      const resposta = await apiFetch(url, {
        auth: 'doador',
        method: idEnderecoEdicao ? 'PUT' : 'POST',
        body: JSON.stringify(dados),
      })

      if (!resposta?.dados?.id) {
        throw new Error('O servidor não confirmou o endereço.')
      }

      // O salvamento já foi confirmado; falhas ao recarregar a lista não o invalidam.
      let listaAtualizada = null
      try {
        const lista = await apiFetch('/doadores/me/enderecos', { auth: 'doador' })
        if (Array.isArray(lista?.dados)) listaAtualizada = lista.dados
      } catch {
        // Mantém os dados da resposta de salvamento como alternativa.
      }

      if (listaAtualizada) {
        setEnderecos(listaAtualizada)
      } else {
        setEnderecos((anteriores) => {
          const semAtual = anteriores.filter((item) => item.id !== resposta.dados.id)
          return [resposta.dados, ...semAtual].map((item) => ({
            ...item,
            preferencial: item.id === resposta.dados.id
              ? resposta.dados.preferencial
              : (resposta.dados.preferencial ? false : item.preferencial),
          }))
        })
      }

      setFormEnderecoAberto(false)
      setIdEnderecoEdicao(null)
      setMensagemEndereco('Endereço salvo com sucesso.')
    } catch (error) {
      setErroEndereco(error.message || 'Não foi possível salvar o endereço.')
    } finally {
      setSalvandoEndereco(false)
    }
  }

  async function definirPreferencial(id) {
    setSalvandoPreferencialId(id)
    setErroEndereco('')
    setMensagemEndereco('')

    try {
      await apiFetch(`/doadores/me/enderecos/${encodeURIComponent(id)}`, {
        auth: 'doador',
        method: 'PUT',
        body: JSON.stringify({ preferencial: true }),
      })

      setEnderecos((anteriores) => anteriores.map((item) => ({
        ...item,
        preferencial: item.id === id,
      })))
      setMensagemEndereco('Endereço preferencial atualizado.')
    } catch (error) {
      setErroEndereco(error.message || 'Não foi possível alterar o endereço preferencial.')
    } finally {
      setSalvandoPreferencialId(null)
    }
  }

  return (
    <div className={`min-h-screen font-sans ${paginaClass}`}>
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <Link to="/minhas-doacoes" className="text-sm font-semibold text-emerald-500 hover:underline">
            ← Voltar às minhas doações
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold">Meu perfil</h1>
          <p className={`mt-2 text-sm ${secundarioClass}`}>
            Gerencie seus dados pessoais e os endereços usados nas próximas doações.
          </p>
        </div>

        {!autenticado ? (
          <section className={`rounded-2xl border p-6 sm:p-8 ${cardClass}`}>
            <h2 className="text-xl font-bold">Entre na sua conta</h2>
            <p className={`mt-2 text-sm ${secundarioClass}`}>
              O perfil é exclusivo para doadores autenticados.
            </p>
            <Link to="/login" className={`mt-5 inline-block ${botaoPrincipal}`}>
              Entrar
            </Link>
          </section>
        ) : carregando ? (
          <p role="status" className={secundarioClass}>Carregando seu perfil...</p>
        ) : erroCarregamento ? (
          <section className={`rounded-2xl border p-6 ${cardClass}`}>
            <p role="alert" className="text-red-400">{erroCarregamento}</p>
            <p className={`mt-3 text-sm ${secundarioClass}`}>
              Se a sessão expirou, faça login novamente.
            </p>
            <Link to="/login" className="mt-4 inline-block font-semibold text-emerald-500 hover:underline">
              Ir para login
            </Link>
          </section>
        ) : (
          <div className="space-y-8">
            {/* DADOS PESSOAIS */}
            <section className={`rounded-2xl border p-6 sm:p-8 ${cardClass}`}>
              <h2 className="text-xl font-extrabold">Dados pessoais</h2>
              <p className={`mt-1 text-sm ${secundarioClass}`}>
                Seu e-mail é exibido apenas para consulta. A alteração de e-mail exigirá
                um processo de verificação separado.
              </p>

              <form onSubmit={salvarPerfil} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium">
                    Nome completo
                    <input
                      name="nome"
                      autoComplete="name"
                      required
                      minLength={3}
                      maxLength={120}
                      value={dadosPessoais.nome}
                      onChange={atualizarCampoPessoal}
                      className={campoClass}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    WhatsApp com DDD
                    <input
                      name="whatsapp"
                      type="tel"
                      autoComplete="tel"
                      required
                      minLength={10}
                      maxLength={20}
                      value={dadosPessoais.whatsapp}
                      onChange={atualizarCampoPessoal}
                      className={campoClass}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    E-mail
                    <input
                      type="email"
                      value={perfil?.email || ''}
                      readOnly
                      aria-readonly="true"
                      className={`${campoClass} opacity-75`}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Bairro de referência
                    <input
                      name="bairro"
                      required
                      minLength={2}
                      maxLength={120}
                      value={dadosPessoais.bairro}
                      onChange={atualizarCampoPessoal}
                      className={campoClass}
                    />
                  </label>
                </div>

                {erroPerfil && <p role="alert" className="text-sm text-red-400">{erroPerfil}</p>}
                {mensagemPerfil && <p role="status" className="text-sm text-emerald-500">{mensagemPerfil}</p>}

                <button type="submit" disabled={salvandoPerfil} className={botaoPrincipal}>
                  {salvandoPerfil ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </form>
            </section>

            {/* ENDEREÇOS */}
            <section className={`rounded-2xl border p-6 sm:p-8 ${cardClass}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold">Meus endereços</h2>
                  <p className={`mt-1 text-sm ${secundarioClass}`}>
                    O endereço preferencial será sugerido nas próximas doações.
                  </p>
                </div>
                {!formEnderecoAberto && (
                  <button type="button" onClick={novoEndereco} className={botaoPrincipal}>
                    + Novo endereço
                  </button>
                )}
              </div>

              {mensagemEndereco && (
                <p role="status" className="mt-4 text-sm text-emerald-500">{mensagemEndereco}</p>
              )}
              {erroEndereco && (
                <p role="alert" className="mt-4 text-sm text-red-400">{erroEndereco}</p>
              )}

              {enderecos.length === 0 && !formEnderecoAberto && (
                <p className={`mt-6 text-sm ${secundarioClass}`}>
                  Nenhum endereço cadastrado ainda.
                </p>
              )}

              <div className="mt-6 space-y-3">
                {enderecos.map((endereco) => (
                  <article
                    key={endereco.id}
                    className={`rounded-xl border p-4 ${modoClaro ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-[#0b110e]'}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold">
                          {endereco.logradouro}, {endereco.numero}
                        </p>
                        <p className={`mt-1 text-sm ${secundarioClass}`}>
                          {endereco.bairro} — {endereco.cidade}/{endereco.estado}
                        </p>
                        <p className={`mt-1 text-sm ${secundarioClass}`}>
                          CEP: {formatarCep(endereco.cep)}
                        </p>
                        {endereco.preferencial && (
                          <span className="mt-3 inline-block rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-bold text-emerald-500">
                            Preferencial
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={salvandoEndereco || Boolean(salvandoPreferencialId)}
                          onClick={() => editarEndereco(endereco)}
                          className={botaoSecundario}
                        >
                          Editar
                        </button>
                        {!endereco.preferencial && (
                          <button
                            type="button"
                            disabled={salvandoEndereco || Boolean(salvandoPreferencialId)}
                            onClick={() => definirPreferencial(endereco.id)}
                            className={botaoSecundario}
                          >
                            {salvandoPreferencialId === endereco.id
                              ? 'Alterando...'
                              : 'Tornar preferencial'}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {formEnderecoAberto && (
                <form
                  onSubmit={salvarEndereco}
                  className={`mt-6 rounded-xl border p-5 ${modoClaro ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-[#0b110e]'}`}
                >
                  <h3 className="text-lg font-bold">
                    {idEnderecoEdicao ? 'Editar endereço' : 'Cadastrar endereço'}
                  </h3>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium">
                      CEP
                      <input
                        name="cep"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        placeholder="00000-000"
                        required
                        value={dadosEndereco.cep}
                        onChange={atualizarCampoEndereco}
                        className={campoClass}
                      />
                    </label>

                    <label className="block text-sm font-medium">
                      Número
                      <input
                        name="numero"
                        autoComplete="address-line2"
                        required
                        maxLength={20}
                        value={dadosEndereco.numero}
                        onChange={atualizarCampoEndereco}
                        className={campoClass}
                      />
                    </label>

                    <label className="block text-sm font-medium sm:col-span-2">
                      Rua / Logradouro
                      <input
                        name="logradouro"
                        autoComplete="address-line1"
                        required
                        minLength={2}
                        maxLength={180}
                        value={dadosEndereco.logradouro}
                        onChange={atualizarCampoEndereco}
                        className={campoClass}
                      />
                    </label>

                    <label className="block text-sm font-medium">
                      Bairro
                      <input
                        name="bairro"
                        required
                        minLength={2}
                        maxLength={120}
                        value={dadosEndereco.bairro}
                        onChange={atualizarCampoEndereco}
                        className={campoClass}
                      />
                    </label>

                    <label className="block text-sm font-medium">
                      Cidade
                      <input
                        name="cidade"
                        autoComplete="address-level2"
                        required
                        minLength={2}
                        maxLength={120}
                        value={dadosEndereco.cidade}
                        onChange={atualizarCampoEndereco}
                        className={campoClass}
                      />
                    </label>

                    <label className="block text-sm font-medium">
                      UF
                      <input
                        name="estado"
                        autoComplete="address-level1"
                        placeholder="AM"
                        required
                        minLength={2}
                        maxLength={2}
                        value={dadosEndereco.estado}
                        onChange={atualizarCampoEndereco}
                        className={campoClass}
                      />
                    </label>
                  </div>

                  <label className="mt-5 flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      name="preferencial"
                      checked={dadosEndereco.preferencial}
                      onChange={atualizarCampoEndereco}
                      disabled={Boolean(
                        idEnderecoEdicao &&
                        enderecos.some((item) =>
                          item.id === idEnderecoEdicao && item.preferencial
                        )
                      )}
                      className="h-4 w-4 accent-emerald-500"
                    />
                    Usar como endereço preferencial
                  </label>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button type="submit" disabled={salvandoEndereco} className={botaoPrincipal}>
                      {salvandoEndereco ? 'Salvando...' : 'Salvar endereço'}
                    </button>
                    <button
                      type="button"
                      disabled={salvandoEndereco}
                      onClick={() => {
                        setFormEnderecoAberto(false)
                        setErroEndereco('')
                      }}
                      className={botaoSecundario}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
