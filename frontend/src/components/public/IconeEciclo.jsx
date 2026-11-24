// Ícones vetoriais locais para evitar dependências e manter o estilo consistente.
// Componentes decorativos: textos e botões sempre possuem rótulos acessíveis próprios.
const desenhos = {
  check: (
    <>
      <path d="M20 6 9 17l-5-5" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16.5 8.5" />
    </>
  ),
  'arrow-left': <path d="m12 19-7-7 7-7M5 12h14" />,
  'arrow-right': <path d="M5 12h14m-7-7 7 7-7 7" />,
  copy: (
    <>
      <rect width="13" height="13" x="8" y="8" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
    </>
  ),
  package: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="M3 7v10l9 5 9-5V7M12 12v10" />
    </>
  ),
  calendar: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M8 2v4m8-4v4M3 10h18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  truck: (
    <>
      <path d="M10 17H3V5h12v12h-1M15 9h4l3 4v4h-2" />
      <circle cx="12" cy="17" r="2" />
      <circle cx="18" cy="17" r="2" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6m0 4h.01" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 7v5h-5M4 17v-5h5" />
      <path d="M5.5 9A7.5 7.5 0 0 1 19 7m-.5 8A7.5 7.5 0 0 1 5 17" />
    </>
  ),
  'file-text': (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
      <path d="M14 2v6h6M8 13h8M8 17h7" />
    </>
  ),
  'circle-dot': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4c-9 0-16 3-16 11a5 5 0 0 0 5 5C17 20 20 13 20 4Z" />
      <path d="M4 21c4-6 8-8 12-11" />
    </>
  ),
}

export default function IconeEciclo({ nome, tamanho = 22, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {desenhos[nome] || desenhos['circle-dot']}
    </svg>
  )
}
