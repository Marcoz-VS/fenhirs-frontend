import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [loading, setL]   = useState(false)
  const [error, setError] = useState(null)

  const onChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    // Limpar erro ao começar a digitar
    if (error) setError(null)
  }

  const getErrorMessage = (error) => {
    // Resposta do servidor
    if (error.response?.data?.error) {
      const err = error.response.data.error
      if (err.includes('Usuário inválido')) {
        return 'Email ou conta não encontrado.'
      }
      if (err.includes('Senha inválida')) {
        return 'Senha incorreta.'
      }
      return err
    }
    
    // Erro de rede
    if (error.message === 'Network Error') {
      return 'Erro de conexão. Verifique sua internet.'
    }
    
    return 'Erro ao entrar. Tente novamente.'
  }

  const onSubmit = async e => {
    e.preventDefault()
    setL(true)
    setError(null)
    
    try {
      const u = await login(form.email, form.password)
      if      (u.role === 'ADMIN')    navigate('/admin/dashboard')
      else if (u.role === 'OPERATOR') navigate('/operador/dashboard')
      else                            navigate('/cliente/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setL(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚔</div>
          <h1 className="text-2xl font-bold text-white">Entrar</h1>
          <p className="text-gray-400 text-sm mt-1">Acesse sua conta no portal</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-300 rounded text-sm border border-red-700">
              {error}
            </div>
          )}
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={onChange} 
                required
                placeholder="seu@email.com"
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded px-4 py-2.5 focus:outline-none focus:border-amber-500 transition-colors" 
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-1">Senha</label>
              <input 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={onChange} 
                required
                placeholder="••••••"
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded px-4 py-2.5 focus:outline-none focus:border-amber-500 transition-colors" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-3 rounded transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Não tem conta?{' '}
            <Link to="/register" className="text-amber-500 hover:text-amber-400">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  )
}