import { createContext, useContext, useEffect, useState } from 'react'
import apiClient from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [isReady, setIsReady] = useState(false)

  // On mount, if tokens already exist in localStorage, treat the user as
  // logged in immediately (no page reload / no forced login screen).
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedUsername = localStorage.getItem('username')
    if (storedAccessToken) {
      setAccessToken(storedAccessToken)
      setUser(storedUsername ? { username: storedUsername } : { username: 'You' })
    }
    setIsReady(true)
  }, [])

  async function login(username, password) {
    const response = await apiClient.post('/api/auth/login/', { username, password })
    const { access, refresh } = response.data
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
    localStorage.setItem('username', username)
    setAccessToken(access)
    setUser({ username })
    return response.data
  }

  async function register(username, password, email) {
    const body = { username, password }
    if (email) body.email = email
    const response = await apiClient.post('/api/auth/register/', body)
    return response.data
  }

  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('username')
    setAccessToken(null)
    setUser(null)
  }

  const value = {
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken),
    login,
    register,
    logout,
  }

  // Avoid flashing "logged out" UI for a single tick while we check localStorage.
  if (!isReady) return null

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
