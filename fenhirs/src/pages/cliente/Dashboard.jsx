import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const SC = { PENDING: 'text-yellow-400', APPROVED: 'text-green-400', REJECTED: 'text-red-400' }
const SL = { PENDING: 'Pendente', APPROVED: 'Aprovado', REJECTED: 'Rejeitado' }

export default function ClientDashboard() {
  const { user } = useAuth()
  const [stats, setStats]   = useState({ req: 0, sch: 0 })
  const [recent, setRecent] = useState([])

  useEffect(() => {
    Promise.all([api.get('/requests/my'), api.get('/schedules/my')]).then(([r, s]) => {
      setStats({ req: r.data.length, sch: s.data.length })
      setRecent(r.data.slice(0, 3))
    })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Olá, {user?.name?.split(' ')[0]}! 👋</h1>
      <p className="text-gray-400 mb-8">Bem-vindo à sua área de cliente</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { label: 'Minhas Solicitações', val: stats.req, to: '/cliente/solicitacoes' },
          { label: 'Meus Agendamentos',   val: stats.sch, to: '/cliente/agendamentos' },
        ].map(c => (
          <div key={c.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">{c.label}</p>
            <p className="text-4xl font-bold text-white mt-1">{c.val}</p>
            <Link to={c.to} className="text-amber-500 hover:text-amber-400 text-sm mt-3 block">Ver todos →</Link>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/produtos" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-5 py-2 rounded text-sm transition-colors">
            🔫 Ver Catálogo
          </Link>
          <Link to="/cliente/agendamentos" className="bg-gray-800 hover:bg-gray-700 text-gray-100 px-5 py-2 rounded text-sm transition-colors">
            📅 Agendar Estande
          </Link>
        </div>
      </div>

      {recent.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Solicitações Recentes</h2>
          <div className="space-y-3">
            {recent.map(r => (
              <div key={r.id} className="flex items-center justify-between border-b border-gray-800 last:border-0 pb-3 last:pb-0">
                <div>
                  {/* Corrigido: .title em vez de .name */}
                  <p className="text-gray-200 text-sm font-medium">{r.Product?.title || '—'}</p>
                  <p className="text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className={`text-sm font-medium ${SC[r.status]}`}>{SL[r.status]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}