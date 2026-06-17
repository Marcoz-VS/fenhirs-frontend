import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const CAT = {
  ARMA:      { label: 'Arma',      icon: '🔫', color: 'bg-red-900 text-red-300' },
  MUNICAO:   { label: 'Munição',   icon: '🔴', color: 'bg-yellow-900 text-yellow-300' },
  CURSO:     { label: 'Curso',     icon: '📚', color: 'bg-blue-900 text-blue-300' },
}

// Componente separado para poder usar estado de erro de imagem por card
function ProductCard({ p }) {
  const [imgErr, setImgErr] = useState(false)
  const info = CAT[p.category] || { icon: '📦', label: p.category, color: 'bg-gray-700 text-gray-300' }

  return (
    <Link
      to={`/produtos/${p.id}`}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-amber-500 transition-colors group"
    >
      {/* Imagem ou placeholder */}
      <div className="w-full h-44 bg-gray-800 flex items-center justify-center overflow-hidden">
        {p.imageUrl && !imgErr ? (
          <img
            src={p.imageUrl}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="text-5xl">{info.icon}</span>
        )}
      </div>

      <div className="p-5">
        <span className={`text-xs px-2 py-0.5 rounded ${info.color}`}>{info.label}</span>
        <h3 className="text-white font-semibold text-lg mt-2 mb-1 group-hover:text-amber-500 transition-colors">
          {p.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2">{p.description}</p>
        <p className="text-amber-500 text-sm mt-3 font-medium">Ver detalhes →</p>
      </div>
    </Link>
  )
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [search, setSearch]     = useState('')
  const [cat, setCat]           = useState('ALL')

  useEffect(() => {
    api.get('/products')
      .then(({ data }) => setProducts(data))
      .catch(() => setError('Erro ao carregar produtos.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p =>
    (p.title || '').toLowerCase().includes(search.toLowerCase()) &&
    (cat === 'ALL' || p.category === cat)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-1">Catálogo</h1>
      <p className="text-gray-400 mb-8">Explore nossos produtos disponíveis</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Buscar produto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-700 text-gray-100 rounded px-4 py-2 focus:outline-none focus:border-amber-500"
        />
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'ARMA', 'MUNICAO', 'CURSO'].map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${cat === c ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
              {c === 'ALL' ? 'Todos' : CAT[c]?.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-center py-20 text-amber-500">Carregando produtos...</p>}
      {error   && <p className="text-center py-20 text-red-400">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-center py-20 text-gray-500">Nenhum produto encontrado.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  )
}