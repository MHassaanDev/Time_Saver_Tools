import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedTools, getActiveCategories, getToolsByCategory, searchTools } from '../lib/toolRegistry.js'
import ToolCard from '../components/ui/ToolCard.jsx'
import { BottomAdSlot } from '../components/ui/AdSlot.jsx'
import { useSEO } from '../lib/useSEO.js'
import { SITE } from '../config/site.js'

export default function Home() {
  useSEO({ title: undefined, description: SITE.description, canonicalPath: '/' })
  const [query, setQuery] = useState('')
  const results = query.trim() ? searchTools(query).slice(0, 6) : []
  const featured = getFeaturedTools()

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero — no ad space above this, per the spec's "understand the site within seconds" rule */}
      <section className="py-16 sm:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink-900 dark:text-white">
          Free Online Developer Tools
        </h1>
        <p className="mt-4 text-lg text-ink-500 max-w-xl mx-auto">
          Fast, privacy-focused tools for coding, formatting, converting, testing, generating, and previewing — directly in your browser.
        </p>

        <div className="mt-8 max-w-lg mx-auto relative">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search developer tools..."
            aria-label="Search developer tools"
            className="w-full rounded-xl border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          {results.length > 0 && (
            <div className="absolute z-20 mt-2 w-full card shadow-lg text-left overflow-hidden">
              {results.map(tool => (
                <Link
                  key={tool.id}
                  to={`/tools/${tool.slug}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 dark:hover:bg-ink-800"
                >
                  <span className="w-7 h-7 shrink-0 rounded-md bg-brand-100 dark:bg-ink-800 text-brand-700 dark:text-brand-300 text-xs font-mono font-semibold flex items-center justify-center">
                    {tool.mono}
                  </span>
                  <span className="text-sm font-medium">{tool.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/tools" className="btn-primary">Explore Developer Tools</Link>
          <Link to="/tools/html-css-js-playground" className="btn-secondary">Open HTML Playground</Link>
        </div>
      </section>

      {/* Popular tools — hand-curated for now; swaps to usage-ranked once
          Analytics has real data (see docs/adsense-integration.md sibling
          notes in the planning docs). */}
      <section className="pb-16">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-bold">Popular Developer Tools</h2>
          <Link to="/tools" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featured.map(tool => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="pb-20">
        <h2 className="text-xl font-bold mb-4">Browse by category</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {getActiveCategories().map(cat => {
            const tools = getToolsByCategory(cat)
            if (tools.length === 0) return null
            return (
              <div key={cat} className="card p-4">
                <h3 className="text-sm font-semibold mb-2">{cat}</h3>
                <ul className="space-y-1.5">
                  {tools.slice(0, 5).map(t => (
                    <li key={t.id}>
                      <Link to={`/tools/${t.slug}`} className="text-sm text-ink-600 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-400">
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <BottomAdSlot className="mb-16" />
    </div>
  )
}
