import { createContext, useContext, useState, ReactNode } from 'react'
import type { AuthState } from '../types'

interface AuthContextType {
  auth: AuthState | null
  setAuth: (a: AuthState | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<AuthState | null>(() => {
    const raw = localStorage.getItem('auth')
    return raw ? JSON.parse(raw) : null
  })

  const setAuth = (a: AuthState | null) => {
    if (a) {
      localStorage.setItem('auth', JSON.stringify(a))
    } else {
      localStorage.removeItem('auth')
    }
    setAuthState(a)
  }

  const logout = () => setAuth(null)

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth mora biti unutar AuthProvider')
  return ctx
}
