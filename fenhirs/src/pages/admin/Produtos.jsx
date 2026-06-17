import { useState, useEffect } from 'react'
import api from '../../services/api'

const CATS    = ['ARMA', 'MUNICAO', 'CURSO']
const CAT_ICON = { ARMA: '🔫', MUNICAO: '🔴', ACESSORIO: '🔧' }

// Corrigido: campo "title" em vez de "name" + adicionado imageUrl
const INIT = { title: '', description: '', category: 'ARMA', imageUrl: '' }

export default function AdminProdutos() {
  const [products, setProducts] = useState([])
  const [loading, setLoad]      = useState(true)
  const [modal, setModal]       = useState(null) // null | 'create' | produto
  const [form, setForm]         = useState(INIT)
  const [saving, setSaving]     = useState(false)
  const [confirm, setConfirm]   = useState(null) // id para excluir
  const [previewErr, setPreviewErr] = useState(false)

  const load = () => api.get('/products').then(({ data }) => setProducts(data)).finally(() => setLoad(false))
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(INIT); setPreviewErr(false); setModal('create') }
  const openEdit   = (p)  => {
    setForm({ title: p.title || '', description: p.description || '', category: p.category, imageUrl: p.imageUrl || '' })
    setPreviewErr(false)
    setModal(p)
  }

  const onChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (e.target.name === 'imageUrl') setPreviewErr(false)
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal === 'create') {
        await api.post('/products', form)
      } else {
        await api.put(`/products/${modal.id}`, form)
      }
      setModal(null); load()
    } catch { alert('Erro ao salvar produto.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`)
      setConfirm(null); load()
    } catch { alert('Erro ao excluir produto.') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-white">Gerenciar Produtos</h1>
        <button onClick={openCreate}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded text-sm transition-colors">
          + Novo Produto
        </button>
      </div>
      <p className="text-gray-400 mb-8">Cadastre e gerencie o catálogo de produtos</p>

      {loading && <p className="text-amber-500">Carregando...</p>}

      {!loading && products.length === 0 && (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-xl">
          <p className="text-5xl mb-4">🔫</p>
          <p className="text-gray-400 mb-4">Nenhum produto cadastrado.</p>
          <button onClick={openCreate}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-2 rounded text-sm transition-colors">
            Criar primeiro produto
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {/* Thumbnail */}
            <div className="w-full h-36 bg-gray-800 flex items-center justify-center overflow-hidden">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.style.display = 'none' }} />
              ) : (
                <span className="text-4xl">{CAT_ICON[p.category] || '📦'}</span>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{p.category}</span>
              </div>
              {/* Corrigido: .title em vez de .name */}
              <h3 className="text-white font-semibold text-lg mb-1">{p.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-4">{p.description}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm py-1.5 rounded transition-colors">
                  ✏ Editar
                </button>
                <button onClick={() => setConfirm(p.id)}
                  className="flex-1 bg-red-900 hover:bg-red-800 text-red-300 text-sm py-1.5 rounded transition-colors">
                  🗑 Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Criar / Editar */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-4">
              {modal === 'create' ? '+ Novo Produto' : '✏ Editar Produto'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">

              {/* Título — corrigido de "name" para "title" */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Título</label>
                <input type="text" name="title" value={form.title} onChange={onChange} required
                  placeholder="Ex: Glock 17"
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded px-4 py-2.5 focus:outline-none focus:border-amber-500 text-sm" />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Categoria</label>
                <select name="category" value={form.category} onChange={onChange}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded px-4 py-2.5 focus:outline-none focus:border-amber-500 text-sm">
                  {CATS.map(c => (
                    <option key={c} value={c}>{c === 'MUNICAO' ? 'MUNIÇÃO' : c}</option>
                  ))}
                </select>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">Descrição</label>
                <textarea name="description" value={form.description} onChange={onChange} rows={3} required
                  placeholder="Descrição do produto..."
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded px-4 py-2.5 focus:outline-none focus:border-amber-500 text-sm resize-none" />
              </div>

              {/* URL da Imagem + Preview */}
              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  URL da Imagem <span className="text-gray-600">(opcional)</span>
                </label>
                <input type="url" name="imageUrl" value={form.imageUrl} onChange={onChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded px-4 py-2.5 focus:outline-none focus:border-amber-500 text-sm" />

                {/* Preview ao vivo */}
                {form.imageUrl && !previewErr && (
                  <div className="mt-2 h-36 w-full rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewErr(true)}
                    />
                  </div>
                )}
                {form.imageUrl && previewErr && (
                  <p className="mt-1 text-red-400 text-xs">Não foi possível carregar a imagem. Verifique a URL.</p>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-1">
                <button type="button" onClick={() => setModal(null)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold px-6 py-2 rounded text-sm transition-colors">
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmação de exclusão */}
      {confirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-red-800 rounded-xl p-6 w-full max-w-sm text-center">
            <p className="text-4xl mb-4">🗑</p>
            <h3 className="text-white font-bold text-lg mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-400 text-sm mb-6">
              Esta ação removerá o produto do catálogo. Deseja continuar?
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirm(null)}
                className="px-5 py-2 text-sm text-gray-400 hover:text-gray-300">
                Cancelar
              </button>
              <button onClick={() => handleDelete(confirm)}
                className="bg-red-700 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded text-sm transition-colors">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}