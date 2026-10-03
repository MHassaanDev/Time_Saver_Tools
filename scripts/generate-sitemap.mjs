// Generates public/sitemap.xml from the tool registry — runs automatically
// before every build (see package.json "prebuild"), so the sitemap can
// never drift out of sync with the actual tool list the way a hand-
// maintained one would. Also keeps robots.txt's Sitemap: line pointed at
// the same configured domain, from the same source of truth.
//
// Deliberately plain Node + regex extraction rather than importing
// toolRegistry.js directly — that file pulls in `react` and a dozen
// `lazy(() => import(...))` component references that only make sense
// inside Vite's build graph; reading it as text and extracting the fields
// this script actually needs is simpler and has zero risk of import
// resolution issues in a standalone Node script.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const registrySrc = readFileSync(path.join(root, 'src/lib/toolRegistry.js'), 'utf8')
const siteSrc = readFileSync(path.join(root, 'src/config/site.js'), 'utf8')

const slugs = [...registrySrc.matchAll(/\n\s*slug: '([^']+)'/g)].map(m => m[1])
const urlMatch = siteSrc.match(/url: '([^']+)'/)
const baseUrl = (urlMatch ? urlMatch[1] : 'https://timesavertools.vercel.app').replace(/\/$/, '')

if (slugs.length === 0) {
  console.error('generate-sitemap: found 0 tool slugs — toolRegistry.js format may have changed. Aborting so a near-empty sitemap never ships silently.')
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/tools', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.4', changefreq: 'monthly' },
  { path: '/contact', priority: '0.3', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.2', changefreq: 'monthly' },
  { path: '/terms', priority: '0.2', changefreq: 'monthly' }
]

const toolPages = slugs.map(slug => ({ path: `/tools/${slug}`, priority: '0.8', changefreq: 'monthly' }))

const urls = [...staticPages, ...toolPages]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${baseUrl}${u.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

writeFileSync(path.join(root, 'public/sitemap.xml'), xml)

// Keep robots.txt's Sitemap: line pointed at the same domain as SITE.url,
// rather than letting the two drift apart.
const robotsPath = path.join(root, 'public/robots.txt')
const robotsSrc = readFileSync(robotsPath, 'utf8')
const updatedRobots = robotsSrc.replace(/Sitemap: .*/, `Sitemap: ${baseUrl}/sitemap.xml`)
writeFileSync(robotsPath, updatedRobots)

console.log(`generate-sitemap: wrote ${urls.length} URLs (${toolPages.length} tools + ${staticPages.length} static pages) to public/sitemap.xml, using base URL ${baseUrl}`)
if (baseUrl === 'https://example.com') {
  console.log('generate-sitemap: NOTE — SITE.url in src/config/site.js is still the placeholder domain. The sitemap is structurally correct but every URL in it is a placeholder until that\u2019s set to the real domain.')
}
