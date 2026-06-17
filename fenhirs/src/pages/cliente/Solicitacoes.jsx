import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const SC = {
  PENDING:  'bg-yellow-900 text-yellow-300',
  APPROVED: 'bg-green-900 text-green-300',
  REJECTED: 'bg-red-900 text-red-300',
}
const SL = { PENDING: 'Pendente', APPROVED: 'Aprovado', REJECTED: 'Rejeitado' }

export default function ClienteSolicitacoes() {
  const [items, setItems] = useState([])
  const [loading, setLoad] = useState(true)

  useEffect(() => {
    api.get('/requests/my').then(({ data }) => setItems(data)).finally(() => setLoad(false))
  }, [])

  if (loading) return <p className="text-amber-500">Carregando...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Minhas Solicitações</h1>
      <p className="text-gray-400 mb-8">Acompanhe o status dos seus pedidos de interesse</p>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-xl">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-gray-400 mb-2">Nenhuma solicitação ainda.</p>
          <Link to="/produtos" className="text-amber-500 hover:underline text-sm">Acesse o catálogo →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Corrigido: .title em vez de .name */}
                  <p className="text-white font-semibold">{item.Product?.title || '—'}</p>
                  {item.observation && (
                    <p className="text-gray-400 text-sm mt-1">"{item.observation}"</p>
                  )}
                  {item.operatorMessage && (
                    <p className="text-sm mt-2 bg-gray-800 rounded px-3 py-2 text-gray-300">
                      <span className="text-gray-500 text-xs block mb-0.5">Resposta do operador:</span>
                      {item.operatorMessage}
                    </p>
                  )}
                  <p className="text-gray-600 text-xs mt-2">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className={`shrink-0 text-xs px-3 py-1 rounded-full font-medium ${SC[item.status]}`}>
                  {SL[item.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}