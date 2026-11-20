// Endereço base da API Express. O Compose define VITE_API_URL.
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')

/**
 * Faz uma requisição à API e apresenta mensagens úteis em caso de erro.
 * Aceita JSON e FormData; para FormData, o navegador define o Content-Type.
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('adminToken')
  const headers = {
    ...(!(options.body instanceof FormData) && options.body != null
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  let resposta
  try {
    resposta = await fetch(`${API_URL}${endpoint}`, { ...options, headers })
  } catch (erro) {
    throw new Error('Não foi possível conectar à API. Confira se o backend está ligado.', {
      cause: erro,
    })
  }

  const dados = await resposta.json().catch(() => null)
  if (!resposta.ok) {
    const mensagem = dados?.erro || dados?.message || dados?.mensagem || `Erro HTTP ${resposta.status}`
    const detalhes = Array.isArray(dados?.detalhes)
      ? dados.detalhes.join('; ')
      : typeof dados?.detalhes === 'string' ? dados.detalhes : ''
    throw new Error(detalhes ? `${mensagem} ${detalhes}` : mensagem)
  }
  return dados
}
