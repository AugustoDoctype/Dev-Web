import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const adminLogado = localStorage.getItem('adminLogado')

  if (adminLogado !== 'true') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute