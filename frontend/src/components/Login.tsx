import { FormEvent, useState } from 'react'
import { authApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { AuthState } from '../types'

export default function Login() {
  const { setAuth } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login(username, password)
      setAuth(res.data as AuthState)
    } catch {
      setError('Neispravni podaci za prijavu. Provjerite email i lozinku.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-greenhouse-800 to-greenhouse-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="text-2xl font-bold text-gray-800">Greenhouse Monitor</h1>
          <p className="text-gray-500 text-sm mt-1">Pametno praćenje uvjeta u plasteniku</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="korisnik@primjer.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenhouse-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lozinka
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenhouse-500 text-sm"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-greenhouse-600 hover:bg-greenhouse-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Prijavljivanje…' : 'Prijavi se'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          ThingsBoard lokalna instanca — localhost:8080
        </p>
      </div>
    </div>
  )
}
