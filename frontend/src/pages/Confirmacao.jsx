import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import IconeEciclo from '../components/public/IconeEciclo'
import { useTemaEciclo } from '../hooks/useTemaEciclo'
import '../styles/doacoes-apresentacao.css'

// Confirma somente registros enviados pelo fluxo real de criação de equipamento.
// A tela não gera códigos e não grava dados no backend.
export default function Confirmacao() {
  const location = useLocation()
  const doacao = location.state?.doacao
  const tema = useTemaEciclo()
  const [mensagemCopia, setMensagemCopia] = useState('')

  const codigo = typeof doacao?.codigoAcompanhamento === 'string'
    ? doacao.codigoAcompanhamento.trim().toUpperCase()
    : ''
  const confirmada = /^[0-9A-F]{32}$/.test(codigo)
  const doadorLogado = Boolean(localStorage.getItem('doadorToken'))

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(codigo)
      setMensagemCopia('Código copiado!')
    } catch {
      setMensagemCopia('Selecione o código acima para copiá-lo manualmente.')
    }
  }

  return (
    <div className="eciclo-processo" data-tema={tema}>
      <Navbar />

      <main className="ep-wrap ep-main">
        <nav className="ep-breadcrumb" aria-label="Localização no site">
          <Link to="/">Início</Link>
          <span className="ep-breadcrumb-separator" aria-hidden="true">/</span>
          <Link to="/doar">Doação</Link>
          <span className="ep-breadcrumb-separator" aria-hidden="true">/</span>
          <span aria-current="page">Confirmação</span>
        </nav>

        <div className="ep-brandline" style={{ marginTop: '2.2rem' }}>
          <img
            src="/branding/simbolo-eciclo-transparente.png"
            alt=""
            width="52"
            height="30"
          />
          <span>E-Ciclo • Sua jornada sustentável</span>
        </div>

        {confirmada ? (
          <article className="ep-card ep-frame ep-fade">
            <div className="ep-panel-pad">
              <div className="ep-hero">
                <div className="ep-hero-symbol">
                  <IconeEciclo nome="check-circle" tamanho={42} />
                </div>
                <div className="ep-hero-body">
                  <span className="ep-eyebrow">Cadastro realizado</span>
                  <h1 className="ep-headline">Sua doação foi cadastrada!</h1>
                  <p>
                    Recebemos os dados do equipamento. Agora você pode acompanhar
                    as atualizações usando o código exclusivo abaixo.
                  </p>
                  <div style={{ marginTop: '1.1rem' }}>
                    <span className="ep-badge">
                      <IconeEciclo nome="circle-dot" tamanho={16} />
                      Registro recebido
                    </span>
                  </div>
                </div>
              </div>

              <div className="ep-summary-grid" style={{ marginTop: '2rem' }}>
                <div className="ep-panel ep-panel-pad ep-summary-main">
                  <h2 className="ep-heading-sm">Resumo do equipamento</h2>
                  <div className="ep-metric">
                    <div className="ep-metric-icon"><IconeEciclo nome="package" tamanho={21} /></div>
                    <div>
                      <p className="ep-metric-label">Equipamento</p>
                      <p className="ep-metric-value ep-break">
                        {doacao.equipamento || doacao.categoria || 'Equipamento eletrônico'}
                      </p>
                    </div>
                  </div>
                  {doacao.categoria && (
                    <div className="ep-metric">
                      <div className="ep-metric-icon"><IconeEciclo nome="file-text" tamanho={20} /></div>
                      <div>
                        <p className="ep-metric-label">Categoria</p>
                        <p className="ep-metric-value ep-break">{doacao.categoria}</p>
                      </div>
                    </div>
                  )}
                  <div className="ep-metric">
                    <div className="ep-metric-icon"><IconeEciclo nome="clock" tamanho={20} /></div>
                    <div>
                      <p className="ep-metric-label">Andamento inicial</p>
                      <p className="ep-metric-value">Pendente de análise</p>
                    </div>
                  </div>
                </div>

                <div className="ep-code-card">
                  <h2 className="ep-code-label">
                    <IconeEciclo nome="shield" tamanho={18} />
                    Código de acompanhamento
                  </h2>
                  <p className="ep-code" style={{ marginTop: '1.05rem' }}>{codigo}</p>
                  <button
                    type="button"
                    className="ep-btn ep-btn-secondary"
                    onClick={copiarCodigo}
                    style={{ marginTop: '1rem', width: '100%' }}
                  >
                    <IconeEciclo nome={mensagemCopia === 'Código copiado!' ? 'check' : 'copy'} tamanho={18} />
                    Copiar código
                  </button>
                  {mensagemCopia && (
                    <p className="ep-copy-feedback" role="status" aria-live="polite">
                      {mensagemCopia}
                    </p>
                  )}
                  <p className="ep-code-note">
                    Guarde o código para consultar a situação da doação,
                    mesmo sem iniciar sessão. Não o compartilhe publicamente.
                  </p>
                </div>
              </div>
            </div>

            <div className="ep-divider ep-panel-pad">
              <div className="ep-actions">
                <Link to={`/minhas-doacoes/${encodeURIComponent(codigo)}`} className="ep-btn ep-btn-primary">
                  <IconeEciclo nome="search" tamanho={18} />
                  Acompanhar doação
                  <IconeEciclo nome="arrow-right" tamanho={17} />
                </Link>
                <Link to="/doar" className="ep-btn ep-btn-secondary">
                  <IconeEciclo nome="package" tamanho={18} />
                  Cadastrar outro equipamento
                </Link>
                <Link to="/minhas-doacoes" className="ep-btn ep-btn-quiet">
                  {doadorLogado ? 'Ver minhas doações' : 'Consultar por código'}
                </Link>
              </div>
              <div className="ep-note ep-callout">
                <IconeEciclo nome="leaf" tamanho={19} />
                <p>
                  O cadastro registra sua intenção de doar. A entrega e eventuais
                  solicitações de retirada seguem a modalidade informada no formulário.
                </p>
              </div>
            </div>
          </article>
        ) : (
          <section className="ep-card ep-frame ep-empty ep-fade">
            <div className="ep-empty-icon"><IconeEciclo nome="file-text" tamanho={33} /></div>
            <span className="ep-eyebrow">Confirmação não disponível</span>
            <h1 className="ep-headline" style={{ marginTop: '0.7rem' }}>Nenhum registro recente nesta página</h1>
            <p>
              Esta página não recebeu a confirmação de um cadastro realizado agora.
              Isso não significa que uma doação anterior foi perdida.
              Você pode consultar pelo código ou acessar seu histórico.
            </p>
            <div className="ep-actions" style={{ justifyContent: 'center' }}>
              <Link to="/minhas-doacoes" className="ep-btn ep-btn-primary">
                <IconeEciclo nome="search" tamanho={18} />
                {doadorLogado ? 'Ver minhas doações' : 'Consultar doação'}
              </Link>
              <Link to="/doar" className="ep-btn ep-btn-secondary">
                Fazer uma doação
              </Link>
            </div>
          </section>
        )}
      </main>
      <footer className="ep-footer">
        <div className="ep-wrap">© {new Date().getFullYear()} E-Ciclo • Tecnologia com propósito sustentável</div>
      </footer>
    </div>
  )
}
