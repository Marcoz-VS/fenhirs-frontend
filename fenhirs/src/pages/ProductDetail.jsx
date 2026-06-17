import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const CAT_ICON = { ARMA: '🔫', MUNICAO: '🔴', ACESSORIO: '🔧' }

export default function ProductDetail() {
  const { id }    = useParams()
  const { user }  = useAuth()
  const navigate  = useNavigate()

  const [product, setProduct]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [imgErr, setImgErr]     = useState(false)
  const [observation, setObs]   = useState('')
  const [submitting, setSubmit] = useState(false)
  const [msg, setMsg]           = useState(null)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/produtos'))
      .finally(() => setLoading(false))
  }, [id])

  const handleRequest = async () => {
    if (!user) return navigate('/login')
    setSubmit(true)
    try {
      await api.post('/requests', { productId: id, observation })
      setMsg({ ok: true, text: 'Solicitação enviada! Nossa equipe entrará em contato.' })
    } catch {
      setMsg({ ok: false, text: 'Erro ao enviar solicitação. Tente novamente.' })
    } finally {
      setSubmit(false)
    }
  }

  if (loading)  return <p className="text-center py-20 text-amber-500">Carregando...</p>
  if (!product) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-amber-500 text-sm mb-6 transition-colors">
        ← Voltar
      </button>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Imagem ou ícone */}
          <div className="shrink-0 w-full md:w-64 h-52 rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center">
            {product.imageUrl && !imgErr ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={() => setImgErr(true)}
              />
            ) : (
              <span className="text-7xl">{CAT_ICON[product.category] || '📦'}</span>
            )}
          </div>

          <div className="flex-1">
            <span className="text-xs bg-amber-900 text-amber-300 px-2 py-0.5 rounded">{product.category}</span>
            <h1 className="text-3xl font-bold text-white mt-3 mb-3">{product.title}</h1>
            <p className="text-gray-300 leading-relaxed mb-8">{product.description}</p>

            {msg && (
              <div className={`mb-4 p-3 rounded text-sm ${msg.ok ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                {msg.text}
              </div>
            )}

            {!msg && (
              <div className="space-y-3">
                <textarea
                  value={observation}
                  onChange={e => setObs(e.target.value)}
                  placeholder="Observação (opcional) — ex: calibre preferido, finalidade..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded px-4 py-3 resize-none focus:outline-none focus:border-amber-500 text-sm"
                />
                <button
                  onClick={handleRequest}
                  disabled={submitting}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold px-8 py-3 rounded transition-colors"
                >
                  {submitting ? 'Enviando...' : user ? '✉ Demonstrar Interesse' : '→ Entre para solicitar'}
                </button>
                {!user && (
                  <p className="text-gray-500 text-xs">
                    <Link to="/login" className="text-amber-500 hover:underline">Faça login</Link>{' '}
                    para demonstrar interesse neste produto.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}