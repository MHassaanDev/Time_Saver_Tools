import React from 'react'
import { getRelatedTools } from '../../lib/toolRegistry.js'
import ToolCard from './ToolCard.jsx'

export default function RelatedTools({ tool }) {
  const related = getRelatedTools(tool)
  if (related.length === 0) return null
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold mb-3">Related tools</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {related.map(t => <ToolCard key={t.id} tool={t} />)}
      </div>
    </section>
  )
}
