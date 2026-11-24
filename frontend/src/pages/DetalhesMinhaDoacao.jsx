import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import IconeEciclo from '../components/public/IconeEciclo'
import { useTemaEciclo } from '../hooks/useTemaEciclo'
import '../styles/doacoes-apresentacao.css'
import { apiFetch } from '../services/api'

// ============================================================
// 1. STATUS E FORMATAÇÃO DE DATAS
// ============================================================
const mensagensStatus = {
  PENDENTE: 'O equipamento foi registrado e aguarda avaliação da equipe.',
  EM_ANALISE: 'A equipe está avaliando o registro do equipamento.',
  AGUARDANDO_COLETA: 'O registro está marcado como aguardando coleta ou recebimento.',
  CONCLUIDO: 'Este registro foi marcado como concluído pela equipe.',
  CANCELADO: 'Este registro foi cancelado.',
}

const nomesStatus = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em análise',
  AGUARDANDO_COLETA: 'Aguardando coleta',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}

function formatarData(valor, comHora = false) {
  if (!valor) return 'Não informada'

  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return 'Não informada'

  return comHora
    ? data.toLocaleString('pt-BR')
    : data.toLocaleDateString('pt-BR')
}

// ============================================================
// 2. PÁGINA DE DETALHES
// ============================================================
export default function DetalhesMinhaDoacao() {
  // O parâmetro :id da rota contém o código de acompanhamento.
  const { id } = useParams()
  const codigo = String(id || '').trim().toUpperCase()

  const [doacao, setDoacao] = useState(null)
  const [minhaDoacao, setMinhaDoacao] = useState(false)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [mensagemCopia, setMensagemCopia] = useState('')
  const tema = useTemaEciclo()

  useEffect(() => {
    let ativo = true

    async function carregarDoacao() {
      setLoading(true)
      setErro('')
      setDoacao(null)
      setMinhaDoacao(false)

      if (!/^[0-9A-F]{32}$/.test(codigo)) {
        if (ativo) {
          setErro('Código de acompanhamento inválido.')
          setLoading(false)
        }
        return
      }

      try {
        // ====================================================
        // 2.1. Se houver login, procura o equipamento na
        //      lista privada do próprio doador.
        // ====================================================
        if (localStorage.getItem('doadorToken')) {
          try {
            const respostaPrivada = await apiFetch(
              '/doadores/me/equipamentos',
              { auth: 'doador' }
            )

            const equipamentoProprio = Array.isArray(respostaPrivada?.dados)
              ? respostaPrivada.dados.find(
                  (item) => item.codigoAcompanhamento?.toUpperCase() === codigo
                )
              : null

            if (equipamentoProprio) {
              if (ativo) {
                setDoacao(equipamentoProprio)
                setMinhaDoacao(true)
              }
              return
            }
          } catch {
            // Sessão expirada ou API privada indisponível:
            // ainda é possível realizar a consulta pública.
          }
        }

        // ====================================================
        // 2.2. Consulta pública para visitantes ou códigos
        //      que não pertencem à conta autenticada.
        // ====================================================
        const respostaPublica = await apiFetch(
          `/acompanhamento/${encodeURIComponent(codigo)}`,
          { auth: 'none' }
        )

        if (!respostaPublica?.dados) {
          throw new Error('Não foi possível obter os dados da doação.')
        }

        if (ativo) {
          setDoacao(respostaPublica.dados)
          setMinhaDoacao(false)
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message || 'Doação não encontrada.')
          setDoacao(null)
        }
      } finally {
        if (ativo) setLoading(false)
      }
    }

    carregarDoacao()

    return () => {
      ativo = false
    }
  }, [codigo])

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(codigo)
      setMensagemCopia('Código copiado!')
    } catch {
      setMensagemCopia('Selecione o código acima para copiá-lo manualmente.')
    }
  }

  // Os dados públicos da consulta por código nunca incluem endereço ou descrição
  // do equipamento. Informações adicionais aparecem só para o titular autenticado.
  return (
    <div className="eciclo-processo" data-tema={tema}>
      <Navbar />

      <main className="ep-wrap ep-main">
        <nav className="ep-breadcrumb" aria-label="Localização no site">
          <Link to="/">Início</Link>
          <span className="ep-breadcrumb-separator" aria-hidden="true">/</span>
          <Link to="/minhas-doacoes">Minhas doações</Link>
          <span className="ep-breadcrumb-separator" aria-hidden="true">/</span>
          <span aria-current="page">Acompanhamento</span>
        </nav>

        <div className="ep-brandline" style={{ marginTop: '2.2rem' }}>
          <img
            src="/branding/simbolo-eciclo-transparente.png"
            width="52"
            height="30"
            alt=""
          />
          <span>E-Ciclo • Acompanhamento</span>
        </div>

        <header style={{ marginTop: '1.25rem' }}>
          <p className="ep-eyebrow">Sua jornada sustentável</p>
          <h1 className="ep-headline">Acompanhe sua doação</h1>
          <p className="ep-intro">
            Confira a situação registrada pela equipe e consulte as informações
            do equipamento usando seu código de acompanhamento.
          </p>
        </header>

        {loading && (
          <section className="ep-card ep-frame ep-panel-pad" role="status" aria-live="polite">
            <div className="ep-skeleton" style={{ width: '52%', height: '24px' }} />
            <div className="ep-skeleton" style={{ width: '80%', height: '16px', marginTop: '1rem' }} />
            <div className="ep-skeleton" style={{ width: '65%', height: '16px', marginTop: '0.7rem' }} />
            <p className="ep-muted" style={{ marginTop: '1.4rem' }}>Consultando o registro no E-Ciclo...</p>
          </section>
        )}

        {!loading && erro && (
          <section className="ep-card ep-frame ep-empty ep-fade">
            <div className="ep-empty-icon"><IconeEciclo nome="alert" tamanho={34} /></div>
            <span className="ep-eyebrow">Não foi possível consultar</span>
            <h2 style={{ marginTop: '0.65rem' }}>Acompanhamento indisponível</h2>
            <p role="alert">{erro}</p>
            <div className="ep-actions" style={{ justifyContent: 'center' }}>
              <Link to="/minhas-doacoes" className="ep-btn ep-btn-primary">
                <IconeEciclo nome="search" tamanho={18} />
                Consultar outro código
              </Link>
              <Link to="/" className="ep-btn ep-btn-secondary">Voltar ao início</Link>
            </div>
          </section>
        )}

        {!loading && doacao && (
          <article className="ep-card ep-frame ep-fade">
            <div className="ep-panel-pad">
              <div className="ep-detail-head">
                <div>
                  <p className="ep-eyebrow">Registro de doação</p>
                  <h2 className="ep-detail-title" style={{ marginTop: '0.6rem' }}>
                    {minhaDoacao && doacao.descricao
                      ? doacao.descricao.split(' - ')[0]
                      : doacao.categoria || 'Equipamento eletrônico'}
                  </h2>
                  <p className="ep-muted" style={{ marginTop: '0.4rem', fontSize: '0.88rem' }}>
                    {minhaDoacao ? 'Informações disponíveis na sua conta' : 'Consulta pública por código'}
                  </p>
                </div>
                <span className="ep-badge" data-status={doacao.status || ''}>
                  <IconeEciclo nome={doacao.status === 'CONCLUIDO' ? 'check-circle' : doacao.status === 'CANCELADO' ? 'alert' : 'circle-dot'} tamanho={16} />
                  {nomesStatus[doacao.status] || doacao.status || 'Sem status'}
                </span>
              </div>

              <section className="ep-status-card" style={{ marginTop: '1.65rem' }}>
                <div>
                  <p className="ep-eyebrow">Situação atual</p>
                  <h3>{nomesStatus[doacao.status] || doacao.status || 'Sem status'}</h3>
                  <p>{mensagensStatus[doacao.status] || 'Consulte as atualizações informadas pela equipe.'}</p>
                </div>
                <div className="ep-status-symbol"><IconeEciclo nome={doacao.status === 'CONCLUIDO' ? 'check-circle' : 'clock'} tamanho={30} /></div>
              </section>

              <div className="ep-info-grid" style={{ marginTop: '1.2rem' }}>
                <div className="ep-info-tile">
                  <div className="ep-info-head"><IconeEciclo nome="package" tamanho={18} />Categoria</div>
                  <p>{doacao.categoria || 'Não informada'}</p>
                </div>
                <div className="ep-info-tile">
                  <div className="ep-info-head"><IconeEciclo nome="calendar" tamanho={18} />Data do cadastro</div>
                  <p>{formatarData(doacao.criadoEm)}</p>
                </div>
                <div className="ep-info-tile">
                  <div className="ep-info-head"><IconeEciclo nome="clock" tamanho={18} />Última atualização</div>
                  <p>{formatarData(doacao.atualizadoEm, true)}</p>
                </div>
                {minhaDoacao && doacao.modalidadeEntrega && doacao.modalidadeEntrega !== 'NAO_INFORMADA' ? (
                  <div className="ep-info-tile">
                    <div className="ep-info-head">
                      <IconeEciclo nome={doacao.modalidadeEntrega === 'PONTO_COLETA' ? 'map-pin' : 'truck'} tamanho={18} />
                      Modalidade de entrega
                    </div>
                    <p>
                      {doacao.modalidadeEntrega === 'PONTO_COLETA'
                        ? 'Entrega em ponto de coleta'
                        : doacao.modalidadeEntrega === 'COLETA_DOMICILIAR'
                          ? 'Retirada solicitada'
                          : 'Não informada'}
                    </p>
                  </div>
                ) : (
                  <div className="ep-info-tile">
                    <div className="ep-info-head"><IconeEciclo nome="shield" tamanho={18} />Consulta segura</div>
                    <p>{minhaDoacao ? 'Dados vinculados à sua conta' : 'Dados públicos do acompanhamento'}</p>
                  </div>
                )}
              </div>

              {minhaDoacao && doacao.descricao && (
                <section className="ep-panel" style={{ marginTop: '1.2rem', padding: '1.3rem' }}>
                  <h3 className="ep-heading-sm">Descrição do equipamento</h3>
                  <p className="ep-value ep-break" style={{ marginTop: '0.45rem', fontWeight: 500 }}>
                    {doacao.descricao}
                  </p>
                </section>
              )}

              {minhaDoacao && doacao.modalidadeEntrega === 'COLETA_DOMICILIAR' && (
                <div className="ep-note ep-callout" data-tone="attention">
                  <IconeEciclo nome="clock" tamanho={20} />
                  <p>A retirada foi solicitada, mas depende de confirmação da equipe. Este registro não é um agendamento automático.</p>
                </div>
              )}

              {minhaDoacao && doacao.modalidadeEntrega === 'PONTO_COLETA' && (
                <div className="ep-note ep-callout">
                  <IconeEciclo nome="map-pin" tamanho={20} />
                  <p>
                    Você optou por entregar o equipamento pessoalmente.{' '}
                    <Link to="/pontos-de-coleta" style={{ color: 'var(--ep-verde)', fontWeight: 750, textDecoration: 'underline' }}>
                      Veja os pontos de coleta
                    </Link>.
                  </p>
                </div>
              )}
            </div>

            <div className="ep-divider ep-panel-pad">
              <div className="ep-code-card">
                <h3 className="ep-code-label"><IconeEciclo nome="shield" tamanho={18} />Código de acompanhamento</h3>
                <p className="ep-code" style={{ marginTop: '0.65rem' }}>{codigo}</p>
                <div className="ep-actions" style={{ marginTop: '0.85rem' }}>
                  <button className="ep-btn ep-btn-secondary" type="button" onClick={copiarCodigo}>
                    <IconeEciclo nome={mensagemCopia === 'Código copiado!' ? 'check' : 'copy'} tamanho={18} />
                    Copiar código
                  </button>
                </div>
                {mensagemCopia && <p className="ep-copy-feedback" role="status" aria-live="polite">{mensagemCopia}</p>}
              </div>

              <div className="ep-actions" style={{ marginTop: '1.35rem' }}>
                <Link to="/minhas-doacoes" className="ep-btn ep-btn-primary">
                  <IconeEciclo nome="arrow-left" tamanho={18} />
                  {minhaDoacao ? 'Voltar às minhas doações' : 'Consultar outra doação'}
                </Link>
                <Link to="/doar" className="ep-btn ep-btn-secondary">
                  <IconeEciclo nome="leaf" tamanho={18} />
                  Fazer outra doação
                </Link>
              </div>
            </div>
          </article>
        )}
      </main>
      <footer className="ep-footer">
        <div className="ep-wrap">© {new Date().getFullYear()} E-Ciclo • Tecnologia com propósito sustentável</div>
      </footer>
    </div>
  )
}
