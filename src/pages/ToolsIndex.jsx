import React, { useState } from 'react'
import { TOOLS, getActiveCategories, getToolsByCategory } from '../lib/toolRegistry.js'
import ToolCard from '../components/ui/ToolCard.jsx'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import { useSEO } from '../lib/useSEO.js'

export default function ToolsIndex() {
  useSEO({
    title: 'All Free Online Tools & Utilities',
    description: 'Browse every free, browser-based tool on TimeSaver Tools — developer tools, document tools, and more — organized by category.',
    canonicalPath: '/tools'
  })
  const [activeCategory, setActiveCategory] = useState('All')
  const visible = activeCategory === 'All' ? TOOLS : getToolsByCategory(activeCategory)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tools' }]} />
      <h1 className="text-3xl font-extrabold mb-2">All Tools</h1>
      <p className="text-ink-500 mb-6">{TOOLS.length} tools, all free, all client-side — nothing you paste or type here is uploaded.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {['All', ...getActiveCategories()].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm rounded-full px-3.5 py-1.5 border transition-colors ${
              activeCategory === cat
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'border-ink-200 dark:border-ink-800 text-ink-600 dark:text-ink-300 hover:border-brand-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map(tool => <ToolCard key={tool.id} tool={tool} />)}
      </div>
    </div>
  )
}
