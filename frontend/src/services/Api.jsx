const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('adminToken')

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Ocorreu um erro na requisição.')
  }

  return response.json()
}