import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

export default function App() {
  const { auth } = useAuth()
  return auth ? <Dashboard /> : <Login />
}
