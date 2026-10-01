import React from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedTools } from '../lib/toolRegistry.js'
import ToolCard from '../components/ui/ToolCard.jsx'
import { useSEO } from '../lib/useSEO.js'

export default function NotFound() {
  useSEO({ title: 'Page Not Found', description: 'This page could not be found.' })
  const featured = getFeaturedTools().slice(0, 4)
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-4xl font-extrabold mb-2">404</h1>
      <p className="text-ink-500 mb-8">That page doesn't exist — but here are some tools that do.</p>
      <div className="grid sm:grid-cols-2 gap-3 text-left mb-8">
        {featured.map(tool => <ToolCard key={tool.id} tool={tool} />)}
      </div>
      <Link to="/tools" className="btn-primary">Browse all tools</Link>
    </div>
  )
}
