import { Link, useParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import StatusBadge from '../../components/admin/StatusBadge'
import { useDoacoesAdmin } from '../../hooks/useDoacoesAdmin'
import { formatarData, obterNomeEquipamento, STATUS_OPCOES } from '../../services/adminDoacoes'

// ============================================================
// DETALHES DA DOAÇÃO
// A API atual não oferece GET /equipamentos/:id.
// Por isso consultamos a lista autorizada e buscamos o ID da URL.
// O status é gravado no SQLite por PUT /equipamentos/:id.
// ============================================================
export default function DetalhesDoacao() {
  const { id } = useParams()
  const { doacoes, carregando, erro, atualizandoId, recarregar, alterarStatus } = useDoacoesAdmin()
  const equipamento = doacoes.find((item) => String(item.id) === String(id))

  return (
    <AdminLayout titulo="Detalhes da doação" descricao="Consulte os dados realmente registrados e atualize a situação do equipamento.">
      {({ claro, painel, secundario }) => (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link to="/admin/doacoes" className="text-sm font-bold text-emerald-500 hover:underline">← Voltar às doações</Link>
            <button type="button" onClick={recarregar} disabled={carregando} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-[#07120b] disabled:opacity-50">↻ Atualizar</button>
          </div>

          {/* 1. Estado de carregamento / falha */}
          {erro && <div role="alert" className="mb-6 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-500">{erro}</div>}
          {carregando ? (
            <p role="status" className={`rounded-2xl border p-8 ${painel}`}>Carregando detalhes...</p>
          ) : !equipamento ? (
            <section className={`rounded-2xl border p-8 text-center ${painel}`}>
              <h2 className="text-xl font-extrabold">Equipamento não encontrado</h2>
              <p className={`mt-3 text-sm ${secundario}`}>Esse identificador não consta na lista retornada pela API.</p>
              <Link className="mt-5 inline-block text-sm font-bold text-emerald-500" to="/admin/doacoes">Voltar para a lista</Link>
            </section>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
              {/* 2. Dados armazenados no Prisma */}
              <section className={`min-w-0 rounded-2xl border p-6 sm:p-8 ${painel}`}>
                <h2 className="text-xl font-extrabold">{obterNomeEquipamento(equipamento.descricao)}</h2>
                <p className={`mt-2 break-all text-xs ${secundario}`}>Código: {equipamento.id}</p>
                <div className="mt-4"><StatusBadge status={equipamento.status} claro={claro} /></div>
                <dl className={`mt-8 grid gap-6 text-sm sm:grid-cols-2 ${secundario}`}>
                  <div><dt className="font-bold text-emerald-500">Categoria</dt><dd className="mt-1">{equipamento.categoria}</dd></div>
                  <div><dt className="font-bold text-emerald-500">Forma de entrega</dt>
                    <dd className="mt-1">{equipamento.modalidadeEntrega === 'PONTO_COLETA' ? 'Entrega em ponto de coleta' : equipamento.modalidadeEntrega === 'COLETA_DOMICILIAR' ? 'Retirada solicitada' : 'Não informada (registro antigo)'}</dd>
                  </div>
                  {equipamento.modalidadeEntrega === 'COLETA_DOMICILIAR' && equipamento.enderecoColetaLogradouro && (
                    <div className="sm:col-span-2">
                      <dt className="font-bold text-emerald-500">Endereço solicitado para retirada</dt>
                      <dd className="mt-1">
                        {equipamento.enderecoColetaLogradouro}, {equipamento.enderecoColetaNumero} — {equipamento.enderecoColetaBairro}, {equipamento.enderecoColetaCidade}/{equipamento.enderecoColetaEstado} — CEP {equipamento.enderecoColetaCep}
                      </dd>
                      <p className="mt-2 text-xs">A solicitação não garante agendamento de coleta.</p>
                    </div>
                  )}
                  <div><dt className="font-bold text-emerald-500">Cadastrado em</dt><dd className="mt-1">{formatarData(equipamento.criadoEm)}</dd></div>
                  <div><dt className="font-bold text-emerald-500">Atualizado em</dt><dd className="mt-1">{formatarData(equipamento.atualizadoEm)}</dd></div>
                  <div><dt className="font-bold text-emerald-500">Destino final</dt><dd className="mt-1">{equipamento.destinoFinal || 'Ainda não definido'}</dd></div>
                  <div className="sm:col-span-2"><dt className="font-bold text-emerald-500">Descrição completa</dt><dd className="mt-1 whitespace-pre-wrap break-words">{equipamento.descricao}</dd></div>
                  <div className="sm:col-span-2"><dt className="font-bold text-emerald-500">Foto</dt><dd className="mt-1">{equipamento.fotoUrl ? 'Arquivo enviado (URL registrada no banco)' : 'Não enviada'}</dd></div>
                </dl>
              </section>

              {/* 3. Doador e alteração de status */}
              <aside className="space-y-6">
                <section className={`rounded-2xl border p-6 ${painel}`}>
                  <h2 className="text-lg font-extrabold">Dados do doador</h2>
                  <dl className={`mt-4 space-y-4 text-sm ${secundario}`}>
                    <div><dt className="font-bold text-emerald-500">Nome</dt><dd className="mt-1">{equipamento.doador?.nome || 'Não localizado'}</dd></div>
                    <div><dt className="font-bold text-emerald-500">E-mail</dt><dd className="mt-1 break-all">{equipamento.doador?.email || 'Não informado'}</dd></div>
                    <div><dt className="font-bold text-emerald-500">WhatsApp</dt><dd className="mt-1">{equipamento.doador?.whatsapp || 'Não informado'}</dd></div>
                    <div><dt className="font-bold text-emerald-500">Bairro</dt><dd className="mt-1">{equipamento.doador?.bairro || 'Não informado'}</dd></div>
                  </dl>
                </section>
                <section className={`rounded-2xl border p-6 ${painel}`}>
                  <h2 className="text-lg font-extrabold">Atualizar andamento</h2>
                  <p className={`mt-2 text-xs leading-5 ${secundario}`}>A alteração é gravada no banco. O acompanhamento público ainda necessita de integração adicional.</p>
                  <label htmlFor="status-detalhe" className={`mt-5 block text-sm font-semibold ${secundario}`}>Novo status</label>
                  <select id="status-detalhe" value={equipamento.status || 'PENDENTE'} disabled={atualizandoId === equipamento.id}
                    onChange={(e) => alterarStatus(equipamento.id, e.target.value)}
                    className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm ${claro ? 'border-slate-300 bg-white' : 'border-white/10 bg-[#0b110e]'}`}>
                    {STATUS_OPCOES.map(({ valor, nome }) => <option value={valor} key={valor}>{nome}</option>)}
                  </select>
                  <p className={`mt-3 text-xs ${secundario}`}>{atualizandoId === equipamento.id ? 'Salvando alteração...' : 'Selecione uma opção para salvar.'}</p>
                </section>
              </aside>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  )
}
