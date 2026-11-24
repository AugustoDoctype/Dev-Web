import { useEffect, useState } from 'react'

function lerTema() {
  return localStorage.getItem('eciclo-tema') === 'claro' ? 'claro' : 'escuro'
}

// Reutiliza o evento emitido pela Navbar, inclusive sem recarregar a página.
export function useTemaEciclo() {
  const [tema, setTema] = useState(lerTema)

  useEffect(() => {
    function aoMudarTema(evento) {
      setTema(evento.detail === 'claro' ? 'claro' : 'escuro')
    }

    function aoMudarStorage(evento) {
      if (evento.key === 'eciclo-tema' || evento.key === null) {
        setTema(lerTema())
      }
    }

    window.addEventListener('eciclo-tema-alterado', aoMudarTema)
    window.addEventListener('storage', aoMudarStorage)

    return () => {
      window.removeEventListener('eciclo-tema-alterado', aoMudarTema)
      window.removeEventListener('storage', aoMudarStorage)
    }
  }, [])

  return tema
}
