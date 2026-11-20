// Limite simples por IP, apropriado para uma instância de desenvolvimento.
// Para produção com múltiplas instâncias, usar um armazenamento compartilhado.
export function limitarRequisicoes({ janelaMs, maximo, mensagem }) {
  const acessos = new Map()
  let requisicoes = 0

  return function limitar(req, res, next) {
    const agora = Date.now()

    // Evita acumular registros antigos indefinidamente.
    if (++requisicoes % 100 === 0) {
      for (const [chave, registro] of acessos) {
        if (registro.expiraEm <= agora) acessos.delete(chave)
      }
    }

    // Sem trust proxy configurado, req.ip vem da conexão TCP com a API.
    const chave = req.ip || req.socket.remoteAddress || 'sem-ip'
    let registro = acessos.get(chave)

    if (!registro || registro.expiraEm <= agora) {
      registro = { contador: 0, expiraEm: agora + janelaMs }
      acessos.set(chave, registro)
    }

    res.set('Cache-Control', 'no-store')

    if (registro.contador >= maximo) {
      const segundos = Math.max(1, Math.ceil((registro.expiraEm - agora) / 1000))
      res.set('Retry-After', String(segundos))
      return res.status(429).json({ erro: mensagem || 'Muitas requisições. Tente novamente mais tarde.' })
    }

    registro.contador += 1
    next()
  }
}

export const limiteLogin = limitarRequisicoes({
  janelaMs: 15 * 60 * 1000,
  maximo: 10,
  mensagem: 'Muitas tentativas de login. Tente novamente mais tarde.',
})

export const limiteCadastroAdmin = limitarRequisicoes({
  janelaMs: 15 * 60 * 1000,
  maximo: 5,
  mensagem: 'Limite de cadastros administrativos excedido.',
})

export const limiteAcompanhamento = limitarRequisicoes({
  janelaMs: 15 * 60 * 1000,
  maximo: 60,
  mensagem: 'Muitas consultas de acompanhamento. Tente novamente mais tarde.',
})
