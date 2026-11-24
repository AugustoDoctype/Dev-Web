/* Ícones vetoriais do painel E-Ciclo — sem bibliotecas extras. */
const caminhos = {
  '▦': <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  '♻': <><path d="M5 8.5h11.5a4 4 0 0 1 4 4V17"/><path d="m15 4 4 4-4 4"/><path d="M19 15.5H7.5a4 4 0 0 1-4-4V7"/><path d="m9 20-4-4 4-4"/></>,
  '⌖': <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
}

export default function AdminIcone({ tipo }) {
  return (
    <span className="ea-nav-icon" aria-hidden="true">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {caminhos[tipo] || caminhos['▦']}
      </svg>
    </span>
  )
}
