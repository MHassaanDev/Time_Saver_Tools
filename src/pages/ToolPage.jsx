import React, { Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getToolBySlug } from '../lib/toolRegistry.js'
import { TOOL_CONTENT } from '../lib/toolContent.js'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import RelatedTools from '../components/ui/RelatedTools.jsx'
import { InContentAdSlot, TopAdSlot } from '../components/ui/AdSlot.jsx'
import { useSEO } from '../lib/useSEO.js'
import NotFound from './NotFound.jsx'

// The reusable per-tool page template — every tool's page (per the spec's
// "tool page anatomy") gets: H1 → tool widget above the fold → what it does
// → how to use → FAQ → related tools, in that order. Adding tool #16 means
// adding one entry to toolRegistry.js + toolContent.js — this file doesn't
// change.
export default function ToolPage() {
  const { slug } = useParams()
  const tool = getToolBySlug(slug)

  if (!tool) return <NotFound />

  useSEO({
    title: tool.seoTitle || tool.name,
    description: tool.seoDescription || tool.description,
    canonicalPath: `/tools/${tool.slug}`
  })

  const content = TOOL_CONTENT[tool.id]
  const ToolComponent = tool.component

  // WebApplication / SoftwareApplication structured data — genuine, no
  // fabricated ratings/reviews/prices (explicitly prohibited by the spec).
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any (runs in browser)',
    description: tool.seoDescription || tool.description,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tools', to: '/tools' }, { label: tool.name }]} />

      <div className="flex items-start gap-3 mb-2">
        <span className="w-11 h-11 shrink-0 rounded-lg bg-brand-50 dark:bg-ink-800 text-brand-700 dark:text-brand-300 text-sm font-mono font-semibold flex items-center justify-center">
          {tool.mono}
        </span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">{tool.name}</h1>
          <p className="text-ink-500 text-sm mt-1">{tool.description}</p>
        </div>
      </div>

      <TopAdSlot className="my-6" />

      {/* The tool itself — always above the explanatory content, per spec */}
      <div className="my-6">
        <Suspense fallback={<div className="card p-10 text-center text-sm text-ink-400">Loading tool…</div>}>
          <ToolComponent {...(tool.props || {})} />
        </Suspense>
      </div>

      {tool.privacyLevel && (
        <p className="flex items-start gap-2 text-xs text-ink-500 bg-ink-50 dark:bg-ink-900 rounded-lg px-3 py-2 mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          </svg>
          {tool.privacyLevel}
        </p>
      )}

      <InContentAdSlot className="mb-8" />

      {content && (
        <div className="space-y-8 text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
          {content.howTo && (
            <section>
              <h2 className="text-lg font-semibold text-ink-900 dark:text-white mb-2">How to use it</h2>
              <ol className="list-decimal list-inside space-y-1">
                {content.howTo.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </section>
          )}
          {content.faqs && (
            <section>
              <h2 className="text-lg font-semibold text-ink-900 dark:text-white mb-2">FAQ</h2>
              <dl className="space-y-3">
                {content.faqs.map((f, i) => (
                  <div key={i}>
                    <dt className="font-medium text-ink-900 dark:text-white">{f.q}</dt>
                    <dd className="mt-0.5">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      )}

      <RelatedTools tool={tool} />

      <p className="mt-10 text-xs text-ink-400">
        Something not working right? <Link to="/contact" className="underline hover:text-brand-600">Let us know</Link>.
      </p>
    </div>
  )
}
