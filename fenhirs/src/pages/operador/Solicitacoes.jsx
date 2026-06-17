import { useState, useEffect } from 'react'
import api from '../../services/api'

const SC = {
  PENDING:  'bg-yellow-900 text-yellow-300',
  APPROVED: 'bg-green-900 text-green-300',
  REJECTED: 'bg-red-900 text-red-300',
}
const SL = { PENDING: 'Pendente', APPROVED: 'Aprovado', REJECTED: 'Rejeitado' }

export default function OperadorSolicitacoes() {
  const [items, setItems]   = useState([])
  const [loading, setLoad]  = useState(true)
  const [filter, setFilter] = useState('PENDING')
  const [modal, setModal]   = useState(null)
  const [opMsg, setOpMsg]   = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => api.get('/requests').then(({ data }) => setItems(data)).finally(() => setLoad(false))
  useEffect(() => { load() }, [])

  const filtered = filter === 'ALL' ? items : items.filter(i => i.status === filter)

  const updateStatus = async (id, status) => {
    setSaving(true)
    try {
      await api.patch(`/requests/${id}/status`, { status, operatorMessage: opMsg })
      setModal(null); setOpMsg(''); load()
    } catch { alert('Erro ao atualizar.') }
    finally { setSaving(false) }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Gerenciar Solicitações</h1>
      <p className="text-gray-400 mb-6">Analise e responda os pedidos dos clientes</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${filter === f ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {f === 'ALL' ? 'Todas' : SL[f]}
            {f !== 'ALL' && (
              <span className="ml-2 opacity-70">({items.filter(i => i.status === f).length})</span>
            )}
          </button>
        ))}
      </div>

      {loading && <p className="text-amber-500">Carregando...</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-center py-16 text-gray-500">Nenhuma solicitação encontrada.</p>
      )}

      <div className="space-y-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

              {/* Thumbnail do produto + info */}
              <div className="flex gap-4 flex-1">
                {/* Imagem do produto (se disponível) */}
                {item.Product?.imageUrl && (
                  <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-800">
                    <img
                      src={item.Product.imageUrl}
                      alt={item.Product.title || ''}
                      className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SC[item.status]}`}>
                      {SL[item.status]}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {/* Corrigido: .title em vez de .name */}
                  <p className="text-white font-semibold">{item.Product?.title || '—'}</p>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Cliente: <span className="text-gray-300">{item.User?.name || '—'}</span>
                    {item.User?.email && (
                      <span className="text-gray-500"> · {item.User.email}</span>
                    )}
                  </p>
                  {item.observation && (
                    <p className="text-gray-400 text-sm mt-1 italic">"{item.observation}"</p>
                  )}
                  {item.operatorMessage && (
                    <p className="text-sm mt-2 bg-gray-800 rounded px-3 py-2 text-gray-300">
                      <span className="text-gray-500 text-xs">Resposta anterior: </span>
                      {item.operatorMessage}
                    </p>
                  )}
                </div>
              </div>

              {item.status === 'PENDING' && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setModal({ id: item.id, action: 'APPROVED' })}
                    className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-1.5 rounded transition-colors">
                    ✓ Aprovar
                  </button>
                  <button onClick={() => setModal({ id: item.id, action: 'REJECTED' })}
                    className="bg-red-800 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded transition-colors">
                    ✕ Rejeitar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-2">
              {modal.action === 'APPROVED' ? '✓ Aprovar' : '✕ Rejeitar'} Solicitação
            </h3>
            <p className="text-gray-400 text-sm mb-4">Mensagem para o cliente (opcional):</p>
            <textarea
              value={opMsg} onChange={e => setOpMsg(e.target.value)} rows={3}
              placeholder="Ex: Entre em contato pelo telefone..."
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 resize-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setModal(null); setOpMsg('') }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors">
                Cancelar
              </button>
              <button onClick={() => updateStatus(modal.id, modal.action)} disabled={saving}
                className={`px-6 py-2 text-sm font-semibold rounded disabled:opacity-50 transition-colors ${
                  modal.action === 'APPROVED' ? 'bg-green-700 hover:bg-green-600' : 'bg-red-800 hover:bg-red-700'
                } text-white`}>
                {saving ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}