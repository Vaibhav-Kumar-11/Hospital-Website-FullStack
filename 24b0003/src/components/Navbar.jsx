import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Cross } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinkClasses = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'text-brand-700 bg-brand-100'
      : 'text-slate-600 hover:text-brand-700 hover:bg-brand-50'
  }`

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/symptom-guide', label: 'Symptom Guide' },
    { to: '/departments', label: 'Departments' },
    { to: '/hospital-map', label: 'Hospital Map' },
    { to: '/emergency', label: 'Emergency' },
    { to: '/about', label: 'About' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center gap-2 text-brand-700 font-semibold text-lg">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white"
            aria-hidden="true"
          >
            <Cross size={18} />
          </span>
          MediGuide
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClasses} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NavLink to="/my-appointments" className={navLinkClasses}>
                My Appointments
              </NavLink>
              <span className="text-sm text-slate-400 px-2">
                {user?.username ? `Hi, ${user.username}` : ''}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClasses}>
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-brand-50"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 px-4 py-3 flex flex-col gap-1 bg-white">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={navLinkClasses}
              end={link.to === '/'}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <NavLink to="/my-appointments" className={navLinkClasses} onClick={() => setMenuOpen(false)}>
                My Appointments
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClasses} onClick={() => setMenuOpen(false)}>
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors w-fit"
                onClick={() => setMenuOpen(false)}
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  )
}
