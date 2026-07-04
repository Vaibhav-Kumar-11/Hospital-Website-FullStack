import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Preserve the full intended destination (path, query string, and any
  // route state like a pre-selected doctor) so it survives the login round-trip.
  const from = location.state?.from
  const redirectTo = from
    ? { pathname: from.pathname, search: from.search, hash: from.hash }
    : '/'
  const redirectState = from?.state

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (!username || !password) {
      setError('Please enter both username and password.')
      return
    }

    setSubmitting(true)
    try {
      await login(username, password)
      navigate(redirectTo, { replace: true, state: redirectState })
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 400) {
        setError('Invalid username or password. Please try again.')
      } else {
        setError('We could not log you in right now. Please try again shortly.')
      }
      console.error('Login error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-800 text-center">Log in</h1>
      <p className="mt-2 text-slate-500 text-center">Welcome back to MediGuide.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
            autoComplete="username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-600 font-medium hover:text-brand-700">
          Sign up
        </Link>
      </p>
    </div>
  )
}
