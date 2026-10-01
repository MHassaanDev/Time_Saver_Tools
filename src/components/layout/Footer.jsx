import React from 'react'
import { Link } from 'react-router-dom'
import LogoWithText from '../logo/Logo.jsx'
import { SITE } from '../../config/site.js'
import { getActiveCategories } from '../../lib/toolRegistry.js'

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 dark:border-ink-800 mt-24">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <LogoWithText />
          <p className="mt-3 text-sm text-ink-500 max-w-xs">
            {SITE.tagline} — developer tools that work directly in your browser.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-sm text-ink-500">
            {getActiveCategories().map(c => (
              <li key={c}>
                <Link to="/tools" className="hover:text-brand-600 dark:hover:text-brand-400">{c}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Site</h3>
          <ul className="space-y-2 text-sm text-ink-500">
            <li><Link to="/tools" className="hover:text-brand-600 dark:hover:text-brand-400">All Tools</Link></li>
            <li><Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-400">About</Link></li>
            <li><Link to="/contact" className="hover:text-brand-600 dark:hover:text-brand-400">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm text-ink-500">
            <li><Link to="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-brand-600 dark:hover:text-brand-400">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-200 dark:border-ink-800 py-4 text-center text-xs text-ink-400">
        © {new Date().getFullYear()} {SITE.name}. All tools run in your browser — no account required.
      </div>
    </footer>
  )
}
