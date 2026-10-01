import React from 'react'
import { Link } from 'react-router-dom'

export default function ToolCard({ tool }) {
  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="card group flex items-start gap-3 p-4 hover:border-brand-400 hover:shadow-sm transition-all"
    >
      <span className="w-10 h-10 shrink-0 rounded-lg bg-brand-50 dark:bg-ink-800 text-brand-700 dark:text-brand-300 text-sm font-mono font-semibold flex items-center justify-center">
        {tool.mono}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400">
          {tool.name}
        </span>
        <span className="block text-xs text-ink-500 mt-0.5 line-clamp-2">{tool.description}</span>
      </span>
    </Link>
  )
}
