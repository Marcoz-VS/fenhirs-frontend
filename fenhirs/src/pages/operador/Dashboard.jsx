import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

export default function OperadorDashboard() {
  const { user } = useAuth()
  const [counts, setCounts] = useState({ pendReq: 0, pendSch: 0, totalReq: 0, totalSch: 0 })

  useEffect(() => {
    Promise.all([api.get('/requests'), api.get('/schedules')]).then(([r, s]) => {
      setCounts({
        pendReq:  r.data.filter(x => x.status === 'PENDING').length,
        pendSch:  s.data.filter(x => x.status === 'PENDING').length,
        totalReq: r.data.length,
        totalSch: s.data.length,
      })
    })
  }, [])

  const cards = [
    { label: 'Solicitações Pendentes', val: counts.pendReq,  to: '/operador/solicitacoes', alert: counts.pendReq > 0 },
    { label: 'Agendamentos Pendentes', val: counts.pendSch,  to: '/operador/agendamentos', alert: counts.pendSch > 0 },
    { label: 'Total de Solicitações',  val: counts.totalReq, to: '/operador/solicitacoes', alert: false },
    { label: 'Total de Agendamentos',  val: counts.totalSch, to: '/operador/agendamentos', alert: false },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard do Operador</h1>
      <p className="text-gray-400 mb-8">Bem-vindo, {user?.name?.split(' ')[0]}. Gerencie solicitações e agendamentos.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(c => (
          <div key={c.label} className={`bg-gray-900 border rounded-xl p-6 ${c.alert ? 'border-amber-500' : 'border-gray-800'}`}>
            <p className="text-gray-400 text-sm">{c.label}</p>
            <p className={`text-4xl font-bold mt-1 ${c.alert ? 'text-amber-500' : 'text-white'}`}>{c.val}</p>
            <Link to={c.to} className="text-amber-500 hover:text-amber-400 text-sm mt-3 block">Gerenciar →</Link>
          </div>
        ))}
      </div>

      {(counts.pendReq > 0 || counts.pendSch > 0) && (
        <div className="bg-amber-900 border border-amber-700 rounded-xl p-4 text-amber-200 text-sm">
          ⚠ Você tem itens pendentes de análise. Acesse as seções de solicitações e agendamentos.
        </div>
      )}
    </div>
  )
}