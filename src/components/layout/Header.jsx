import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import LogoWithText, { LogoCompact } from '../logo/Logo.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import SearchModal from './SearchModal.jsx'

const NAV = [
  { to: '/tools', label: 'Tools' },
  { to: '/about', label: 'About' }
]

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(e) {
      const isK = e.key === 'k' || e.key === 'K'
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 dark:border-ink-800 bg-white/80 dark:bg-ink-950/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <LogoWithText className="hidden sm:inline-flex" />
          <LogoCompact size={32} className="sm:hidden" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-brand-700 dark:text-brand-400'
                    : 'text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 text-sm text-ink-500 border border-ink-200 dark:border-ink-800 rounded-lg px-3 py-1.5 hover:border-brand-400 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            Search
            <kbd className="text-[10px] border border-ink-300 dark:border-ink-700 rounded px-1">Ctrl K</kbd>
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="sm:hidden btn-ghost !px-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <ThemeToggle />
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
