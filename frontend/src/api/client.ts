import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth')
  if (raw) {
    const { token } = JSON.parse(raw)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
}

export const devicesApi = {
  list: () => api.get('/devices'),
}

export const telemetryApi = {
  latest: (deviceId: string) =>
    api.get(`/telemetry/${deviceId}/latest`),

  history: (
    deviceId: string,
    startTs: number,
    endTs: number,
    interval = 3600000,
    agg = 'AVG'
  ) =>
    api.get(`/telemetry/${deviceId}/history`, {
      params: { start_ts: startTs, end_ts: endTs, interval, agg },
    }),
}
