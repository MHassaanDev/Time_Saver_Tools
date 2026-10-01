import { useEffect } from 'react'
import { SITE } from '../config/site.js'

// Deliberately not react-helmet or any extra dependency — a tool-registry-driven
// SPA only ever needs to set a handful of tags per route, so a tiny hook does
// the job without adding a runtime dependency. See README "Why no Helmet".
export function useSEO({ title, description, canonicalPath = '' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE.name}` : SITE.name
    document.title = fullTitle

    setMeta('description', description || SITE.description)
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description || SITE.description, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('twitter:card', 'summary_large_image', 'name')
    setMeta('twitter:title', fullTitle, 'name')
    setMeta('twitter:description', description || SITE.description, 'name')

    const canonicalHref = `${SITE.url}${canonicalPath}`
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', canonicalHref)
  }, [title, description, canonicalPath])
}

function setMeta(name, content, attr = 'name') {
  let tag = document.querySelector(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}
