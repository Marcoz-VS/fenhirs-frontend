import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Todas as rotas agora são /admin/*
const navItems = [
  { to: '/admin/dashboard',    label: '🏠 Dashboard' },
  { to: '/admin/produtos',     label: '🔫 Produtos' },
  { to: '/admin/solicitacoes', label: '📋 Solicitações' },
  { to: '/admin/agendamentos', label: '📅 Agendamentos' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="min-h-screen bg-gray-950 flex text-gray-100">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-amber-500 text-xl">⚔</span>
            <span className="font-bold text-white">Fenhir's</span>
          </Link>
          <p className="text-gray-500 text-xs mt-1">Painel Administrativo</p>
        </div>

        <div className="p-4 border-b border-gray-800">
          <p className="text-gray-200 text-sm font-semibold truncate">{user?.name}</p>
          <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded bg-amber-900 text-amber-300">Admin</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm transition-colors ${
                isActive ? 'bg-amber-500 text-black font-semibold' : 'text-gray-300 hover:bg-gray-800'
              }`
            }>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm transition-colors">
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}