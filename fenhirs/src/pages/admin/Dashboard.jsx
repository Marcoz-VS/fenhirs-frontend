import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ products: 0, pendReq: 0, pendSch: 0, totalReq: 0, totalSch: 0 })

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/requests'), api.get('/schedules')])
      .then(([p, r, s]) => {
        setStats({
          products: p.data.length,
          pendReq:  r.data.filter(x => x.status === 'PENDING').length,
          pendSch:  s.data.filter(x => x.status === 'PENDING').length,
          totalReq: r.data.length,
          totalSch: s.data.length,
        })
      })
  }, [])

  const cards = [
    { label: 'Produtos Cadastrados',   val: stats.products, to: '/admin/produtos',      color: 'text-amber-500' },
    // Corrigido: links agora apontam para /admin/ em vez de /operador/
    { label: 'Solicitações Pendentes', val: stats.pendReq,  to: '/admin/solicitacoes',  color: stats.pendReq > 0 ? 'text-yellow-400' : 'text-white' },
    { label: 'Agendamentos Pendentes', val: stats.pendSch,  to: '/admin/agendamentos',  color: stats.pendSch > 0 ? 'text-yellow-400' : 'text-white' },
    { label: 'Total Solicitações',     val: stats.totalReq, to: '/admin/solicitacoes',  color: 'text-white' },
    { label: 'Total Agendamentos',     val: stats.totalSch, to: '/admin/agendamentos',  color: 'text-white' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Painel Administrativo</h1>
      <p className="text-gray-400 mb-8">Bem-vindo, {user?.name}. Visão geral do sistema.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-gray-900 border border-gray-800 hover:border-amber-500 rounded-xl p-6 transition-colors">
            <p className="text-gray-400 text-sm">{c.label}</p>
            <p className={`text-4xl font-bold mt-1 ${c.color}`}>{c.val}</p>
            <Link to={c.to} className="text-amber-500 hover:text-amber-400 text-sm mt-3 block">Gerenciar →</Link>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Acesso Rápido</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/produtos"
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-5 py-2 rounded text-sm transition-colors">
            🔫 Gerenciar Produtos
          </Link>
          <Link to="/admin/solicitacoes"
            className="bg-gray-800 hover:bg-gray-700 text-gray-100 px-5 py-2 rounded text-sm transition-colors">
            📋 Ver Solicitações
          </Link>
          <Link to="/admin/agendamentos"
            className="bg-gray-800 hover:bg-gray-700 text-gray-100 px-5 py-2 rounded text-sm transition-colors">
            📅 Ver Agendamentos
          </Link>
        </div>
      </div>
    </div>
  )
}