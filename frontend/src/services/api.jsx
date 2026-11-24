const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3001'
).replace(/\/$/, '')

// ====================================================
// REQUISIÇÕES À API
// ====================================================
export async function apiFetch(endpoint, options = {}) {
  // Mantemos "admin" como padrão para preservar
  // as chamadas existentes do painel administrativo.
  const {
    auth = 'admin',
    headers: headersPersonalizados = {},
    ...fetchOptions
  } = options

  // Cada tipo de usuário possui seu próprio token.
  let token = null

  if (auth === 'admin') {
    token = localStorage.getItem('adminToken')
  } else if (auth === 'doador') {
    token = localStorage.getItem('doadorToken')
  }

  const headers = {
    ...(fetchOptions.body != null &&
    !(fetchOptions.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
    ...headersPersonalizados,
  }

  let resposta

  try {
    resposta = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    })
  } catch (erro) {
    throw new Error(
      'Não foi possível conectar à API. Confira se o backend está ligado.',
      { cause: erro }
    )
  }

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    const mensagem =
      dados?.erro ||
      dados?.message ||
      dados?.mensagem ||
      `Erro HTTP ${resposta.status}`

    const detalhes = Array.isArray(dados?.detalhes)
      ? dados.detalhes.join('; ')
      : typeof dados?.detalhes === 'string'
        ? dados.detalhes
        : ''

    throw new Error(
      detalhes ? `${mensagem} ${detalhes}` : mensagem
    )
  }

  return dados
}
