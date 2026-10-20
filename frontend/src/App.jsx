import { useEffect, useState } from 'react'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  const [tema, setTema] = useState(() => {
    return localStorage.getItem('eciclo-tema') || 'escuro'
  })

  useEffect(() => {
    const atualizarTema = (evento) => {
      const temaAtual =
        evento?.detail ||
        localStorage.getItem('eciclo-tema') ||
        'escuro'

      setTema(temaAtual)
    }

    // Sincroniza o tema quando ele é alterado em outra página.
    window.addEventListener('eciclo-tema-alterado', atualizarTema)

    // Confere o tema salvo ao iniciar o aplicativo.
    atualizarTema()

    return () => {
      window.removeEventListener(
        'eciclo-tema-alterado',
        atualizarTema
      )
    }
  }, [])

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: tema === 'claro' ? '#f9fafb' : '#0b110e',
        color: tema === 'claro' ? '#111827' : '#f9fafb',
      }}
    >
      <AppRoutes />
    </div>
  )
}