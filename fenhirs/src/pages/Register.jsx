import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]   = useState({ name: '', email: '', password: '', rg: '', cac: '' })
  const [loading, setL]   = useState(false)
  const [error, setError] = useState(null)

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    setL(true); setError(null)
    try {
      await register({ ...form, cac: form.cac || null })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Verifique os dados.')
    } finally {
      setL(false)
    }
  }

  const field = (label, name, type = 'text', placeholder = '', required = true) => (
    <div>
      <label className="block text-gray-400 text-sm mb-1">
        {label} {!required && <span className="text-gray-600">(opcional)</span>}
      </label>
      <input type={type} name={name} value={form[name]} onChange={onChange}
        required={required} placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded px-4 py-2.5 focus:outline-none focus:border-amber-500" />
    </div>
  )

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚔</div>
          <h1 className="text-2xl font-bold text-white">Criar Conta</h1>
          <p className="text-gray-400 text-sm mt-1">Preencha seus dados de identificação</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          {error && <div className="mb-4 p-3 bg-red-900 text-red-300 rounded text-sm">{error}</div>}
          <form onSubmit={onSubmit} className="space-y-4">
            {field('Nome Completo', 'name', 'text', 'Seu nome completo')}
            {field('Email', 'email', 'email', 'seu@email.com')}
            {field('Senha', 'password', 'password', 'Mínimo 6 caracteres')}
            {field('RG', 'rg', 'text', 'Número do RG')}
            {field('Registro CAC', 'cac', 'text', 'Número do CAC (se possuir)', false)}
            <button type="submit" disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-3 rounded transition-colors">
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-amber-500 hover:text-amber-400">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}