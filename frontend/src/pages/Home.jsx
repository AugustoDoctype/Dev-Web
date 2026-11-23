import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import '../tema.css'

const materiais = [
  { icone: 'celular', nome: 'Celulares e tablets', detalhe: 'Dispositivos móveis' },
  { icone: 'notebook', nome: 'Computadores e notebooks', detalhe: 'Equipamentos de informática' },
  { icone: 'fone', nome: 'Periféricos e acessórios', detalhe: 'Acessórios eletrônicos' },
  { icone: 'cabo', nome: 'Cabos e componentes', detalhe: 'Peças e conexões' },
]

const recursos = [
  {
    numero: '01',
    icone: 'ciclo',
    titulo: 'Descarte consciente',
    descricao: 'Descubra como encaminhar celulares, computadores e componentes eletrônicos para a destinação adequada.',
    destino: '/como-funciona',
    acao: 'Entenda o processo',
  },
  {
    numero: '02',
    icone: 'caixa',
    titulo: 'Acompanhe suas doações',
    descricao: 'Consulte suas doações e acompanhe o andamento de cada registro diretamente pela plataforma.',
    destino: '/minhas-doacoes',
    acao: 'Minhas doações',
  },
  {
    numero: '03',
    icone: 'mapa',
    titulo: 'Encontre pontos de coleta',
    descricao: 'Explore o mapa interativo e consulte os pontos de coleta demonstrativos disponíveis no sistema.',
    destino: '/pontos-de-coleta',
    acao: 'Explorar o mapa',
  },
]

function Icone({ nome, tamanho = 24 }) {
  const caminhos = {
    seta: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    folha: <><path d="M20 4c-9.5-.5-15.5 2.5-15.5 10a6 6 0 0 0 6 6C18 20 20.5 13.5 20 4Z"/><path d="M6 18c3-5 6-7 11-10"/></>,
    celular: <><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/></>,
    notebook: <><rect x="5" y="4" width="14" height="12" rx="1.5"/><path d="m2 20 3-4h14l3 4H2Z"/></>,
    fone: <><path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="2.5" y="13" width="4" height="7" rx="2"/><rect x="17.5" y="13" width="4" height="7" rx="2"/></>,
    cabo: <><path d="M8 7V4m4 3V4M7 7h6v3a3 3 0 0 1-3 3v3"/><path d="M10 16a3 3 0 0 0 3 3h1"/><rect x="14" y="17" width="6" height="4" rx="1"/></>,
    ciclo: <><path d="M4 11a8 8 0 0 1 13.9-5.4L20 8"/><path d="M20 3v5h-5"/><path d="M20 13a8 8 0 0 1-13.9 5.4L4 16"/><path d="M4 21v-5h5"/></>,
    caixa: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/></>,
    mapa: <><path d="M3 6 9 3l6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15m6-12v15"/></>,
    check: <><path d="m4.5 12.5 5 5 10-11"/></>,
  }

  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {caminhos[nome] ?? caminhos.ciclo}
    </svg>
  )
}

function temaInicial() {
  return localStorage.getItem('eciclo-tema') === 'claro' ? 'claro' : 'escuro'
}

export default function Home() {
  const [tema, setTema] = useState(temaInicial)

  useEffect(() => {
    const atualizarTema = (evento) => {
      setTema(evento?.detail === 'claro' || (evento?.detail == null && temaInicial() === 'claro') ? 'claro' : 'escuro')
    }
    const atualizarStorage = (evento) => {
      if (evento.key === null || evento.key === 'eciclo-tema') setTema(temaInicial())
    }
    window.addEventListener('eciclo-tema-alterado', atualizarTema)
    window.addEventListener('storage', atualizarStorage)
    return () => {
      window.removeEventListener('eciclo-tema-alterado', atualizarTema)
      window.removeEventListener('storage', atualizarStorage)
    }
  }, [])

  return (
    <div className={`ec-home ${tema === 'claro' ? 'tema-claro' : 'tema-escuro'}`}>
      <Navbar />

      <main>
        <section className="ec-hero" aria-labelledby="ec-home-titulo">
          <div className="ec-hero__noise" aria-hidden="true" />
          <div className="ec-shell ec-hero__layout">
            <div className="ec-hero__content ec-rise-in">
              <span className="ec-eyebrow"><Icone nome="folha" tamanho={17} /> Tecnologia e consciência ambiental</span>
              <h1 id="ec-home-titulo" className="ec-hero__title">
                Seu eletrônico não precisa ter <span>ponto final.</span>
              </h1>
              <p className="ec-hero__description">
                Transforme a forma como você lida com eletrônicos sem uso.
                Registre doações, acompanhe cada etapa e descubra possibilidades
                de descarte consciente em um só lugar.
              </p>
              <div className="ec-hero__actions">
                <Link to="/doar" className="ec-btn ec-btn--primary">
                  Quero fazer uma doação <Icone nome="seta" tamanho={19} />
                </Link>
                <Link to="/pontos-de-coleta" className="ec-btn ec-btn--secondary">
                  Explorar pontos de coleta
                </Link>
              </div>
              <div className="ec-hero__footnote" aria-label="Benefícios da plataforma">
                <span><Icone nome="check" tamanho={17} /> Registro de doações</span>
                <span><Icone nome="check" tamanho={17} /> Acompanhamento online</span>
              </div>
            </div>

            <div className="ec-showcase ec-rise-in ec-rise-in--delay" aria-label="Apresentação da marca E-Ciclo">
              <div className="ec-showcase__grid" aria-hidden="true" />
              <svg className="ec-showcase__tracks" viewBox="0 0 540 520" aria-hidden="true" fill="none">
                <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".44">
                  <path d="M0 112h90l42 42h72"/><path d="M0 156h74l26 26h74"/>
                  <path d="M540 365h-83l-40-40h-63"/><path d="M540 410h-112l-24-24h-68"/>
                  <path d="M82 520v-74l51-51h62"/><path d="M463 0v60l-51 51h-63"/>
                </g>
                <g fill="currentColor"><circle cx="204" cy="154" r="4"/><circle cx="174" cy="182" r="4"/>
                  <circle cx="354" cy="325" r="4"/><circle cx="336" cy="386" r="4"/>
                  <circle cx="195" cy="395" r="4"/><circle cx="349" cy="111" r="4"/></g>
              </svg>
              <div className="ec-showcase__halo" aria-hidden="true" />
              <div className="ec-showcase__mark">
                <img src="/branding/simbolo-eciclo-transparente.png" alt="Símbolo Circuito Infinito do E-Ciclo" />
              </div>
              <div className="ec-showcase__caption">
                <div className="ec-showcase__caption-icon"><Icone nome="ciclo" tamanho={22} /></div>
                <div><strong>Um novo ciclo começa aqui</strong><span>Tecnologia com propósito</span></div>
                <span className="ec-showcase__indicator" aria-hidden="true" />
              </div>
              <div className="ec-showcase__tag"><span className="ec-showcase__dot" /> E-CICLO / REUTILIZAR</div>
            </div>
          </div>
        </section>

        <section className="ec-section ec-section--materials" aria-labelledby="ec-materiais-titulo">
          <div className="ec-shell">
            <div className="ec-section__heading ec-section__heading--split">
              <div>
                <p className="ec-kicker">Equipamentos eletrônicos</p>
                <h2 id="ec-materiais-titulo">O que pode ganhar um novo destino?</h2>
                <p>Conheça categorias comuns de eletrônicos que merecem atenção na hora de descartar.</p>
              </div>
              <Link to="/como-funciona" className="ec-text-link">Como funciona <Icone nome="seta" tamanho={18} /></Link>
            </div>
            <div className="ec-materials">
              {materiais.map((material, indice) => (
                <article className="ec-material-card ec-card" key={material.nome}>
                  <span className="ec-material-card__number">0{indice + 1} / 04</span>
                  <span className="ec-icon-box"><Icone nome={material.icone} tamanho={28} /></span>
                  <h3>{material.nome}</h3>
                  <p>{material.detalhe}</p>
                  <span className="ec-material-card__line" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ec-section ec-section--resources" aria-labelledby="ec-recursos-titulo">
          <div className="ec-shell">
            <div className="ec-section__heading ec-section__heading--center">
              <p className="ec-kicker">Uma plataforma, várias possibilidades</p>
              <h2 id="ec-recursos-titulo">Tudo para começar um <span>novo ciclo.</span></h2>
              <p>Do registro à consulta, o E-Ciclo reúne ferramentas que tornam o processo mais acessível.</p>
            </div>
            <div className="ec-features">
              {recursos.map((recurso) => (
                <article className="ec-feature ec-card" key={recurso.numero}>
                  <div className="ec-feature__top"><span className="ec-icon-box"><Icone nome={recurso.icone} tamanho={27} /></span><span>{recurso.numero}</span></div>
                  <h3>{recurso.titulo}</h3>
                  <p>{recurso.descricao}</p>
                  <Link to={recurso.destino} className="ec-feature__link">{recurso.acao} <Icone nome="seta" tamanho={17}/></Link>
                </article>
              ))}
            </div>
            <p className="ec-section__note">Os pontos exibidos no mapa são demonstrativos e não representam, necessariamente, serviços de coleta ativos.</p>
          </div>
        </section>

        <section className="ec-section ec-section--closing" aria-labelledby="ec-chamada-titulo">
          <div className="ec-shell">
            <div className="ec-closing">
              <span className="ec-closing__mark"><Icone nome="folha" tamanho={28}/></span>
              <p className="ec-kicker">Faça parte desse ciclo</p>
              <h2 id="ec-chamada-titulo">Um futuro mais sustentável começa com escolhas simples.</h2>
              <p>Conheça a iniciativa, registre seus equipamentos e participe de uma nova forma de pensar o descarte eletrônico.</p>
              <div className="ec-closing__actions">
                <Link to="/doar" className="ec-btn ec-btn--primary">Começar agora <Icone nome="seta" tamanho={19} /></Link>
                <Link to="/como-funciona" className="ec-btn ec-btn--secondary">Conhecer o projeto</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="ec-footer">
        <div className="ec-shell ec-footer__layout">
          <Link to="/" className="ec-footer__brand"><img src="/branding/simbolo-eciclo-transparente.png" alt=""/> E-<span>Ciclo</span></Link>
          <p>Tecnologia e sustentabilidade em um novo ciclo.</p>
          <Link to="/como-funciona" className="ec-text-link">Conheça o projeto <Icone nome="seta" tamanho={17} /></Link>
        </div>
      </footer>
    </div>
  )
}
