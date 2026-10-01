import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchTools, primaryCategory } from '../../lib/toolRegistry.js'

// Global search, opened with Ctrl+K (Cmd+K on Mac) from anywhere in the app —
// see the listener registered in Layout.jsx. Pure client-side keyword
// matching (see searchTools in toolRegistry.js) — no API call, so it's
// instant and free to run on every keystroke.
export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const results = searchTools(query).slice(0, 8)

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  if (!open) return null

  function go(tool) {
    navigate(`/tools/${tool.slug}`)
    onClose()
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && results[activeIndex]) { go(results[activeIndex]) }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Search developer tools"
      >
        <div className="flex items-center gap-2 border-b border-ink-200 dark:border-ink-800 px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-400 shrink-0">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search developer tools..."
            className="w-full bg-transparent outline-none text-sm placeholder:text-ink-400"
            aria-label="Search"
          />
          <kbd className="text-[10px] text-ink-400 border border-ink-200 dark:border-ink-700 rounded px-1.5 py-0.5">Esc</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {query && results.length === 0 && (
            <p className="px-4 py-6 text-sm text-center text-ink-500">
              No tools match "{query}" yet.
            </p>
          )}
          {results.map((tool, i) => (
            <button
              key={tool.id}
              onClick={() => go(tool)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                i === activeIndex ? 'bg-brand-50 dark:bg-ink-800' : ''
              }`}
            >
              <span className="w-8 h-8 shrink-0 rounded-md bg-brand-100 dark:bg-ink-800 text-brand-700 dark:text-brand-300 text-xs font-mono font-semibold flex items-center justify-center">
                {tool.mono}
              </span>
              <span>
                <span className="block text-sm font-medium">{tool.name}</span>
                <span className="block text-xs text-ink-500">{primaryCategory(tool)}</span>
              </span>
            </button>
          ))}
          {!query && (
            <p className="px-4 py-6 text-sm text-center text-ink-500">
              Try "format json", "decode jwt", or "preview html".
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
