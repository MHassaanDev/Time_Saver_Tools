import React from 'react'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import { useSEO } from '../lib/useSEO.js'
import { SITE } from '../config/site.js'

export default function About() {
  useSEO({ title: 'About', description: `About ${SITE.name} — who built it and why.`, canonicalPath: '/about' })
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
      <h1 className="text-3xl font-extrabold mb-4">About {SITE.name}</h1>
      <div className="prose prose-ink dark:prose-invert text-ink-600 dark:text-ink-300 space-y-4 text-sm leading-relaxed">
        <p>
          {SITE.name} is a small, growing collection of developer tools that run entirely in
          your browser — no installs, no signup, and (for every tool currently on the site)
          nothing you type or paste is ever sent to a server.
        </p>
        <p>
          It started with one problem: switching between a dozen different single-purpose
          tool sites to format some JSON, decode a token, or preview a snippet of AI-generated
          HTML is annoying. {SITE.name} puts the ones used most often in one fast, ad-supported
          place.
        </p>
        <p>
          It's built and maintained by an independent developer, not a company — new tools get
          added based on real search and usage data, not guesswork. If a tool you rely on
          elsewhere is missing, that's useful to know (see Contact).
        </p>
      </div>
    </div>
  )
}
