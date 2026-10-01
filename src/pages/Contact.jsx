import React from 'react'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import { useSEO } from '../lib/useSEO.js'
import { SITE } from '../config/site.js'

export default function Contact() {
  useSEO({ title: 'Contact', description: `Get in touch about ${SITE.name}.`, canonicalPath: '/contact' })
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
      <h1 className="text-3xl font-extrabold mb-4">Contact</h1>
      <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
        Questions, tool requests, or something not working right? Reach out at{' '}
        <a href={`mailto:${SITE.contactEmail}`} className="text-brand-600 dark:text-brand-400 hover:underline">
          {SITE.contactEmail}
        </a>.
      </p>
    </div>
  )
}
