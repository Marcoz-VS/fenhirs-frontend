import axios from 'axios'

const api = axios.create({
  baseURL: 'https://fenhirs-backend.onrender.com',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ✅ INTERCEPTOR DE ERRO PARA DEBUG
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('❌ ERRO COMPLETO:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
    })
    throw error
  }
)

export default api
