import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

import PublicLayout   from '../layouts/PublicLayout'
import ClientLayout   from '../layouts/ClientLayout'
import OperatorLayout from '../layouts/OperatorLayout'
import AdminLayout    from '../layouts/AdminLayout'

import Home          from '../pages/Home'
import Products      from '../pages/Products'
import ProductDetail from '../pages/ProductDetail'
import Login         from '../pages/Login'
import Register      from '../pages/Register'

import ClientDashboard    from '../pages/cliente/Dashboard'
import ClientSolicitacoes from '../pages/cliente/Solicitacoes'
import ClientAgendamentos from '../pages/cliente/Agendamentos'

import OperadorDashboard    from '../pages/operador/Dashboard'
import OperadorSolicitacoes from '../pages/operador/Solicitacoes'
import OperadorAgendamentos from '../pages/operador/Agendamentos'

import AdminDashboard from '../pages/admin/Dashboard'
import AdminProdutos  from '../pages/admin/Produtos'

function RequireAuth({ roles }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-amber-500 text-lg">
      Carregando...
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return <Outlet />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/"             element={<Home />} />
          <Route path="/produtos"     element={<Products />} />
          <Route path="/produtos/:id" element={<ProductDetail />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
        </Route>

        {/* Cliente */}
        <Route element={<RequireAuth roles={['CLIENT', 'ADMIN']} />}>
          <Route element={<ClientLayout />}>
            <Route path="/cliente/dashboard"    element={<ClientDashboard />} />
            <Route path="/cliente/solicitacoes" element={<ClientSolicitacoes />} />
            <Route path="/cliente/agendamentos" element={<ClientAgendamentos />} />
          </Route>
        </Route>

        {/* Operador */}
        <Route element={<RequireAuth roles={['OPERATOR', 'ADMIN']} />}>
          <Route element={<OperatorLayout />}>
            <Route path="/operador/dashboard"    element={<OperadorDashboard />} />
            <Route path="/operador/solicitacoes" element={<OperadorSolicitacoes />} />
            <Route path="/operador/agendamentos" element={<OperadorAgendamentos />} />
          </Route>
        </Route>

        {/* Admin — solicitações e agendamentos agora ficam sob /admin/ */}
        <Route element={<RequireAuth roles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard"    element={<AdminDashboard />} />
            <Route path="/admin/produtos"     element={<AdminProdutos />} />
            <Route path="/admin/solicitacoes" element={<OperadorSolicitacoes />} />
            <Route path="/admin/agendamentos" element={<OperadorAgendamentos />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}