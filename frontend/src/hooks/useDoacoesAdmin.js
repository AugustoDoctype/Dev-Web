import { useEffect, useState } from 'react'
import { atualizarStatusEquipamento, listarDoacoesAdmin } from '../services/adminDoacoes'

// ============================================================
// HOOK COMPARTILHADO PELAS TELAS ADMINISTRATIVAS
// - Busca dados no SQLite por meio da API.
// - Controla loading, erros, atualização e recarregamento.
// - Não usa localStorage como banco de dados.
// ============================================================
export function useDoacoesAdmin() {
  const [doacoes, setDoacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [atualizandoId, setAtualizandoId] = useState(null)
  const [revisao, setRevisao] = useState(0)

  useEffect(() => {
    let ativo = true

    listarDoacoesAdmin()
      .then((registros) => {
        if (ativo) setDoacoes(registros)
      })
      .catch((falha) => {
        if (ativo) setErro(falha.message || 'Falha ao consultar equipamentos.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => { ativo = false }
  }, [revisao])

  function recarregar() {
    setErro('')
    setCarregando(true)
    setRevisao((atual) => atual + 1)
  }

  async function alterarStatus(id, status) {
    setErro('')
    setAtualizandoId(id)

    try {
      const atualizado = await atualizarStatusEquipamento(id, status)
      setDoacoes((anteriores) => anteriores.map((registro) =>
        registro.id === id
          ? { ...registro, ...atualizado, doador: registro.doador }
          : registro
      ))
      return true
    } catch (falha) {
      setErro(falha.message || 'Não foi possível alterar o status.')
      return false
    } finally {
      setAtualizandoId(null)
    }
  }

  return { doacoes, carregando, erro, atualizandoId, recarregar, alterarStatus }
}
