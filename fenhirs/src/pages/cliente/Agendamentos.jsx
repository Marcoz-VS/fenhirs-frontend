import { useState, useEffect } from 'react'
import api from '../../services/api'

const SC = {
  PENDING:  'bg-yellow-900 text-yellow-300',
  APPROVED: 'bg-green-900 text-green-300',
  REJECTED: 'bg-red-900 text-red-300',
}
const SL = { PENDING: 'Pendente', APPROVED: 'Confirmado', REJECTED: 'Recusado' }

const INIT = { scheduleDate: '', scheduleHour: '', booth: '1', observation: '' }

export default function ClienteAgendamentos() {
  const [items, setItems]       = useState([])
  const [loading, setLoad]      = useState(true)
  const [showForm, setForm]     = useState(false)
  const [form, setF]            = useState(INIT)
  const [submitting, setSub]    = useState(false)
  const [msg, setMsg]           = useState(null)

  const load = () => api.get('/schedules/my').then(({ data }) => setItems(data)).finally(() => setLoad(false))
  useEffect(() => { load() }, [])

  const onChange = e => setF(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    setSub(true); setMsg(null)
    try {
      await api.post('/schedules', { ...form, booth: parseInt(form.booth) })
      setMsg({ ok: true, text: 'Agendamento realizado com sucesso!' })
      setF(INIT); setForm(false); load()
    } catch {
      setMsg({ ok: false, text: 'Erro ao realizar agendamento.' })
    } finally {
      setSub(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-white">Meus Agendamentos</h1>
        <button onClick={() => setForm(v => !v)}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded text-sm transition-colors">
          {showForm ? 'Cancelar' : '+ Novo Agendamento'}
        </button>
      </div>
      <p className="text-gray-400 mb-6">Gerencie seus horários no estande de tiro</p>

      {msg && (
        <div className={`mb-4 p-3 rounded text-sm ${msg.ok ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
          {msg.text}
        </div>
      )}

      {showForm && (
        <div className="bg-gray-900 border border-amber-500 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Novo Agendamento</h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Data',     name: 'scheduleDate', type: 'date', extra: { min: new Date().toISOString().split('T')[0] } },
              { label: 'Horário', name: 'scheduleHour', type: 'time' },
            ].map(({ label, name, type, extra }) => (
              <div key={name}>
                <label className="block text-gray-400 text-sm mb-1">{label}</label>
                <input type={type} name={name} value={form[name]} onChange={onChange} required {...extra}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded px-4 py-2.5 focus:outline-none focus:border-amber-500" />
              </div>
            ))}
            <div>
              <label className="block text-gray-400 text-sm mb-1">Baia (1–5)</label>
              <input type="number" name="booth" value={form.booth} onChange={onChange} required min={1} max={5}
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded px-4 py-2.5 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Observação <span className="text-gray-600">(opcional)</span></label>
              <input type="text" name="observation" value={form.observation} onChange={onChange} placeholder="Observações..."
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded px-4 py-2.5 focus:outline-none focus:border-amber-500" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={submitting}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold px-8 py-2.5 rounded transition-colors">
                {submitting ? 'Enviando...' : 'Confirmar Agendamento'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="text-amber-500">Carregando...</p>}

      {!loading && items.length === 0 && !showForm && (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-xl">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-gray-400">Nenhum agendamento ainda.</p>
        </div>
      )}

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-semibold">
                  📅 {new Date(item.scheduleDate + 'T12:00:00').toLocaleDateString('pt-BR')} às {item.scheduleHour}
                </p>
                <p className="text-gray-400 text-sm mt-1">Baia {item.booth}</p>
                {item.observation && <p className="text-gray-500 text-sm">"{item.observation}"</p>}
                {item.operatorMessage && (
                  <p className="text-sm mt-2 bg-gray-800 rounded px-3 py-2 text-gray-300">
                    <span className="text-gray-500 text-xs block mb-0.5">Resposta:</span>
                    {item.operatorMessage}
                  </p>
                )}
              </div>
              <span className={`shrink-0 text-xs px-3 py-1 rounded-full font-medium ${SC[item.status]}`}>
                {SL[item.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}