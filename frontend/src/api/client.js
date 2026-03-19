import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

export const tradesAPI = {
  list: (params) => api.get('/trades/', { params }),
  get: (id) => api.get(`/trades/${id}`),
  create: (data) => api.post('/trades/', data),
  update: (id, data) => api.patch(`/trades/${id}`, data),
  delete: (id) => api.delete(`/trades/${id}`),
}

export const adminAPI = {
  listUsers: () => api.get('/admin/users'),
  updateRole: (userId, role) => api.patch(`/admin/users/${userId}/role?role=${role}`),
  deactivate: (userId) => api.patch(`/admin/users/${userId}/deactivate`),
}

export default api