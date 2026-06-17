import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PublicLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const dashLink = () => {
    if (!user) return '/login'
    if (user.role === 'ADMIN')     return '/admin/dashboard'
    if (user.role === 'OPERATOR')  return '/operador/dashboard'
    return '/cliente/dashboard'
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-amber-500 text-2xl">⚔</span>
            <span className="font-bold text-white">Fenhir's</span>
            <span className="text-amber-500 text-sm font-light hidden sm:block">Armas & Munições</span>
          </Link>

          <div className="flex items-center gap-5">
            <Link to="/produtos" className="text-gray-300 hover:text-amber-500 transition-colors text-sm">
              Catálogo
            </Link>
            {user ? (
              <>
                <Link to={dashLink()} className="text-gray-300 hover:text-amber-500 text-sm transition-colors">
                  Minha Conta
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded text-gray-300 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-amber-500 text-sm transition-colors">Entrar</Link>
                <Link to="/register" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm px-4 py-1.5 rounded transition-colors">
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p className="text-gray-400 font-semibold mb-1">⚔ Fenhir's Armas & Munições</p>
        <p>Portal institucional de armamentos e agendamentos</p>
        <p className="text-xs mt-2">© {new Date().getFullYear()} Todos os direitos reservados</p>
      </footer>
    </div>
  )
}