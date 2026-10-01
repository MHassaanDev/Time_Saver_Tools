import { lazy } from 'react'

// ============================================================
// TOOL REGISTRY — the single source of truth for every tool.
// Add a new tool by adding one object here + one component in
// /src/tools. Nothing else in the app needs to change — the
// homepage, /tools index, search, and routing all read from
// this array. See docs (03-development-roadmap style notes)
// in README.md.
// ============================================================

// Code-split: each tool's component only loads when its page is visited,
// so the homepage never pays for code it doesn't use (section 24 of the spec).
const components = {
  playground: lazy(() => import('../tools/PlaygroundTool.jsx')),
  jsonFormatter: lazy(() => import('../tools/JsonFormatterTool.jsx')),
  base64: lazy(() => import('../tools/Base64Tool.jsx')),
  urlEncode: lazy(() => import('../tools/UrlEncodeDecodeTool.jsx')),
  uuid: lazy(() => import('../tools/UuidGeneratorTool.jsx')),
  jwt: lazy(() => import('../tools/JwtDecoderTool.jsx')),
  regex: lazy(() => import('../tools/RegexTesterTool.jsx')),
  codeFormatter: lazy(() => import('../tools/CodeFormatterTool.jsx')),
  hash: lazy(() => import('../tools/HashGeneratorTool.jsx')),
  color: lazy(() => import('../tools/ColorConverterTool.jsx')),
  timestamp: lazy(() => import('../tools/TimestampConverterTool.jsx')),
  diff: lazy(() => import('../tools/TextDiffTool.jsx')),
  markdown: lazy(() => import('../tools/MarkdownEditorTool.jsx')),
  cvBuilder: lazy(() => import('../tools/CvBuilderTool.jsx')),
  syntaxChecker: lazy(() => import('../tools/SyntaxCheckerTool.jsx'))
}

// The full intended taxonomy — most of these have zero tools today. This is
// deliberate: the data model (and the UI) should already understand the
// site's future shape (Image Tools, PDF Tools, Document Tools, etc.) so
// adding a new category later is a data change, not a UI change. Anywhere
// user-facing (nav, footer, homepage) uses getActiveCategories() below
// instead of this raw list, so nothing links to an empty category today.
export const CATEGORIES = [
  'Developer Tools',
  'Web Tools',
  'Text Tools',
  'Document Tools',
  'Image Tools',
  'PDF Tools',
  'SEO Tools',
  'Productivity Tools',
  'File Tools',
  'Calculator Tools',
  // Finer-grained sub-tags used within Developer Tools today — a tool can
  // carry one of these alongside its top-level category (see each tool's
  // `categories` array below).
  'Code & Web',
  'Encoding & Decoding',
  'Security & Hashing',
  'Converters',
  'Regex'
]

export const TOOLS = [
  {
    id: 'playground',
    name: 'HTML CSS JS Playground',
    slug: 'html-css-js-playground',
    categories: ['Developer Tools', 'Code & Web'],
    mono: '▶',
    description: 'Paste HTML, CSS, and JavaScript — or a full AI-generated HTML file — and see a live, sandboxed preview instantly.',
    keywords: ['html css js playground', 'code preview', 'live preview', 'ai code preview', 'html playground', 'codepen alternative'],
    searchTerms: ['preview ai generated code', 'test html css js', 'run html in browser', 'html css js preview'],
    status: 'live',
    featured: true,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Your code is processed and rendered entirely in your browser, inside a sandboxed preview frame. Nothing is uploaded.',
    relatedTools: ['html-formatter', 'css-formatter', 'javascript-formatter'],
    seoTitle: 'HTML CSS JS Playground — Live Code Preview',
    seoDescription: 'Paste HTML, CSS, JavaScript — or AI-generated code from ChatGPT, Claude, Gemini, or Copilot — and preview it instantly in a secure sandboxed frame.',
    component: components.playground
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    slug: 'json-formatter',
    categories: ['Developer Tools', 'Code & Web'],
    mono: '{ }',
    description: 'Beautify minified or messy JSON into clean, readable, properly indented output.',
    keywords: ['json formatter', 'json beautifier', 'pretty print json', 'format json online'],
    searchTerms: ['make json readable', 'indent json', 'clean up json'],
    status: 'live',
    featured: true,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Processing happens in your browser. Your JSON is never uploaded.',
    relatedTools: ['json-validator', 'base64-encoder-decoder'],
    seoTitle: 'JSON Formatter — Beautify JSON Online',
    seoDescription: 'Free online JSON formatter. Paste messy or minified JSON and get clean, indented, readable output instantly — 100% in your browser.',
    props: { mode: 'format' },
    component: components.jsonFormatter
  },
  {
    id: 'json-validator',
    name: 'JSON Validator',
    slug: 'json-validator',
    categories: ['Developer Tools', 'Code & Web'],
    mono: '✓',
    description: 'Check whether your JSON is syntactically valid, with a specific, plain-English error if it isn\u2019t.',
    keywords: ['json validator', 'validate json', 'json syntax checker', 'is this valid json'],
    searchTerms: ['check json syntax', 'find json error', 'why is my json invalid'],
    status: 'live',
    featured: true,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Processing happens in your browser. Your JSON is never uploaded.',
    relatedTools: ['json-formatter', 'base64-encoder-decoder'],
    seoTitle: 'JSON Validator — Check JSON Syntax Online',
    seoDescription: 'Validate JSON instantly and see exactly what\u2019s wrong — line, character, and a plain-English explanation. 100% client-side.',
    props: { mode: 'validate' },
    component: components.jsonFormatter
  },
  {
    id: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    slug: 'base64-encoder-decoder',
    categories: ['Developer Tools', 'Encoding & Decoding'],
    mono: '64',
    description: 'Encode text to Base64, or decode Base64 back to plain text — with correct UTF-8 and URL-safe handling.',
    keywords: ['base64 encoder', 'base64 decoder', 'encode base64', 'decode base64', 'text to base64'],
    searchTerms: ['base64 to text', 'text to base64', 'decode base64 string'],
    status: 'live',
    featured: true,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Processing happens in your browser. Nothing you type or paste is uploaded.',
    relatedTools: ['url-encoder-decoder', 'jwt-decoder'],
    seoTitle: 'Base64 Encoder & Decoder Online',
    seoDescription: 'Encode text to Base64 or decode Base64 to text, free and instant, with correct UTF-8 and URL-safe support. Nothing leaves your browser.',
    component: components.base64
  },
  {
    id: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    slug: 'url-encoder-decoder',
    categories: ['Developer Tools', 'Encoding & Decoding'],
    mono: '%',
    description: 'Percent-encode text for safe use in a URL, or decode a percent-encoded URL back to readable text.',
    keywords: ['url encoder', 'url decoder', 'percent encoding', 'escape url', 'unescape url'],
    searchTerms: ['encode query string', 'decode url', 'url escape characters'],
    status: 'live',
    featured: false,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Processing happens in your browser. Nothing is uploaded.',
    relatedTools: ['base64-encoder-decoder', 'jwt-decoder'],
    seoTitle: 'URL Encoder & Decoder Online',
    seoDescription: 'Percent-encode or decode URLs and query strings instantly. Understand the difference between component and full-URI encoding.',
    component: components.urlEncode
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    slug: 'uuid-generator',
    categories: ['Developer Tools', 'Security & Hashing'],
    mono: 'ID',
    description: 'Generate cryptographically random UUID v4 values, one at a time or in bulk.',
    keywords: ['uuid generator', 'generate uuid', 'uuid v4', 'guid generator'],
    searchTerms: ['make uuid', 'random unique id', 'generate guid'],
    status: 'live',
    featured: true,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Generated locally using your browser\u2019s secure random source. Nothing is transmitted or logged.',
    relatedTools: ['hash-generator', 'jwt-decoder'],
    seoTitle: 'UUID Generator — Random UUID v4 Online',
    seoDescription: 'Generate secure, random UUID v4 values instantly, one or in bulk. 100% client-side using the Web Crypto API.',
    component: components.uuid
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    slug: 'jwt-decoder',
    categories: ['Developer Tools', 'Encoding & Decoding'],
    mono: 'JWT',
    description: 'Decode a JSON Web Token\u2019s header and payload to inspect its claims. Decoding only — this does not verify the signature.',
    keywords: ['jwt decoder', 'decode jwt', 'jwt inspector', 'jwt debugger'],
    searchTerms: ['read jwt payload', 'inspect jwt claims', 'jwt token decoder'],
    status: 'live',
    featured: true,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Decoding happens entirely in your browser. Your token is never sent anywhere — but treat real tokens as sensitive and avoid pasting production secrets into any online tool, this one included.',
    relatedTools: ['base64-encoder-decoder', 'hash-generator'],
    seoTitle: 'JWT Decoder — Inspect JSON Web Tokens Online',
    seoDescription: 'Decode a JWT\u2019s header and payload instantly and see its claims in readable JSON. Decoding only — does not verify the signature.',
    component: components.jwt
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    slug: 'regex-tester',
    categories: ['Developer Tools', 'Regex'],
    mono: '.*',
    description: 'Test a regular expression against sample text, with live match highlighting and capture-group breakdown.',
    keywords: ['regex tester', 'regex validator', 'test regular expression', 'regex match tester'],
    searchTerms: ['check my regex', 'regex highlighting', 'javascript regex tester'],
    status: 'live',
    featured: true,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Processing happens in your browser using native JavaScript regex. Nothing is uploaded.',
    relatedTools: ['text-diff-checker', 'json-formatter'],
    seoTitle: 'Regex Tester — Test Regular Expressions Online',
    seoDescription: 'Test JavaScript regular expressions against sample text with live highlighting and capture groups. Free, instant, no signup.',
    component: components.regex
  },
  {
    id: 'html-formatter',
    name: 'HTML Formatter',
    slug: 'html-formatter',
    categories: ['Developer Tools', 'Code & Web'],
    mono: '<>',
    description: 'Re-indent and tidy messy HTML markup for readability.',
    keywords: ['html formatter', 'format html', 'html beautifier', 'indent html'],
    searchTerms: ['clean up html', 'html pretty print'],
    status: 'live',
    featured: false,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Processing happens in your browser. Nothing is uploaded.',
    relatedTools: ['css-formatter', 'javascript-formatter', 'html-css-js-playground'],
    seoTitle: 'HTML Formatter — Beautify HTML Online',
    seoDescription: 'Clean up and re-indent messy HTML instantly in your browser. Free, fast, no signup.',
    props: { language: 'html' },
    component: components.codeFormatter
  },
  {
    id: 'css-formatter',
    name: 'CSS Formatter',
    slug: 'css-formatter',
    categories: ['Developer Tools', 'Code & Web'],
    mono: '{;}',
    description: 'Re-indent and tidy messy CSS for readability.',
    keywords: ['css formatter', 'format css', 'css beautifier', 'indent css'],
    searchTerms: ['clean up css', 'css pretty print'],
    status: 'live',
    featured: false,
    popular: false,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Processing happens in your browser. Nothing is uploaded.',
    relatedTools: ['html-formatter', 'javascript-formatter', 'html-css-js-playground'],
    seoTitle: 'CSS Formatter — Beautify CSS Online',
    seoDescription: 'Clean up and re-indent messy CSS instantly in your browser. Free, fast, no signup.',
    props: { language: 'css' },
    component: components.codeFormatter
  },
  {
    id: 'javascript-formatter',
    name: 'JavaScript Formatter',
    slug: 'javascript-formatter',
    categories: ['Developer Tools', 'Code & Web'],
    mono: 'JS',
    description: 'Re-indent and tidy messy JavaScript for readability.',
    keywords: ['javascript formatter', 'format javascript', 'js beautifier', 'indent javascript'],
    searchTerms: ['clean up js', 'javascript pretty print'],
    status: 'live',
    featured: false,
    popular: false,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Processing happens in your browser. Nothing is uploaded.',
    relatedTools: ['html-formatter', 'css-formatter', 'html-css-js-playground'],
    seoTitle: 'JavaScript Formatter — Beautify JS Online',
    seoDescription: 'Clean up and re-indent messy JavaScript instantly in your browser. Free, fast, no signup.',
    props: { language: 'javascript' },
    component: components.codeFormatter
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    slug: 'hash-generator',
    categories: ['Developer Tools', 'Security & Hashing'],
    mono: '#',
    description: 'Generate an MD5, SHA-1, SHA-256, or SHA-512 hash of any text.',
    keywords: ['hash generator', 'md5 generator', 'sha256 generator', 'sha512 online', 'checksum generator'],
    searchTerms: ['generate hash from text', 'md5 online', 'sha256 hash'],
    status: 'live',
    featured: true,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Hashing happens locally using the Web Crypto API (and a local MD5 implementation). Nothing is uploaded.',
    relatedTools: ['uuid-generator', 'base64-encoder-decoder'],
    seoTitle: 'Hash Generator — MD5, SHA-1, SHA-256, SHA-512',
    seoDescription: 'Generate MD5, SHA-1, SHA-256, or SHA-512 hashes of any text instantly, entirely in your browser.',
    component: components.hash
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    slug: 'color-converter',
    categories: ['Developer Tools', 'Converters'],
    mono: '◐',
    description: 'Convert a color between HEX, RGB, and HSL, with a live preview swatch.',
    keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hex to hsl'],
    searchTerms: ['convert hex to rgb', 'rgb to hsl converter'],
    status: 'live',
    featured: false,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Processing happens in your browser. Nothing is uploaded.',
    relatedTools: ['timestamp-converter'],
    seoTitle: 'Color Converter — HEX, RGB, HSL Online',
    seoDescription: 'Convert colors between HEX, RGB, and HSL instantly with a live preview. Free, fast, no signup.',
    component: components.color
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    slug: 'timestamp-converter',
    categories: ['Developer Tools', 'Converters'],
    mono: '⏱',
    description: 'Convert between Unix timestamps and human-readable dates, in any timezone.',
    keywords: ['timestamp converter', 'unix timestamp converter', 'epoch converter'],
    searchTerms: ['convert unix timestamp', 'epoch to date', 'date to unix time'],
    status: 'live',
    featured: false,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Processing happens in your browser. Nothing is uploaded.',
    relatedTools: ['color-converter'],
    seoTitle: 'Unix Timestamp Converter Online',
    seoDescription: 'Convert Unix timestamps to human-readable dates and back, instantly, in your local timezone or UTC.',
    component: components.timestamp
  },
  {
    id: 'text-diff-checker',
    name: 'Text Diff Checker',
    slug: 'text-diff-checker',
    categories: ['Developer Tools', 'Text Tools'],
    mono: '±',
    description: 'Compare two blocks of text and see exactly what changed, line by line.',
    keywords: ['text diff checker', 'compare text', 'diff tool', 'text comparison'],
    searchTerms: ['compare two texts', 'find differences between text', 'diff checker online'],
    status: 'live',
    featured: false,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Comparison happens in your browser. Nothing is uploaded.',
    relatedTools: ['regex-tester', 'json-formatter'],
    seoTitle: 'Text Diff Checker — Compare Two Texts Online',
    seoDescription: 'Compare two blocks of text and see additions, deletions, and changes line by line, instantly, in your browser.',
    component: components.diff
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor',
    slug: 'markdown-editor',
    categories: ['Developer Tools', 'Document Tools', 'Text Tools'],
    mono: 'MD',
    description: 'Write Markdown with a live preview — drag ready-made blocks (headings, lists, tables, links) straight into the editor, then export as .md or .html.',
    keywords: ['markdown editor', 'markdown preview', 'markdown to html', 'online markdown editor'],
    searchTerms: ['write markdown online', 'markdown live preview', 'md file editor'],
    status: 'live',
    featured: true,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Everything is rendered locally in your browser. Nothing you write is uploaded.',
    relatedTools: ['text-diff-checker', 'case-converter'],
    seoTitle: 'Markdown Editor with Live Preview — Free & Online',
    seoDescription: 'Write and preview Markdown online with drag-and-drop formatting blocks. Export to .md or .html, import existing files — 100% in your browser.',
    component: components.markdown
  },
  {
    id: 'cv-builder',
    name: 'CV / Resume Builder',
    slug: 'cv-builder',
    categories: ['Document Tools', 'Productivity Tools'],
    mono: 'CV',
    description: 'Build a CV from a simple form with an instant live preview — drag whole sections to reorder them, then print or save as PDF.',
    keywords: ['cv builder', 'resume builder', 'free cv maker', 'online resume creator'],
    searchTerms: ['make a cv online', 'build resume free', 'cv maker no signup'],
    status: 'live',
    featured: true,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Your CV is built and stored only in your own browser (local storage) — never uploaded to a server. Export a JSON backup any time.',
    relatedTools: ['markdown-editor'],
    seoTitle: 'Free CV / Resume Builder — Online, No Signup',
    seoDescription: 'Build a professional CV from a simple form with a live preview. Reorder sections by dragging, then print or save as PDF — free, no account needed.',
    component: components.cvBuilder
  },
  {
    id: 'syntax-checker',
    name: 'Syntax Error Checker',
    slug: 'syntax-error-checker',
    categories: ['Developer Tools', 'Code & Web'],
    mono: '!=',
    description: 'Paste JavaScript or JSON and find exactly which line and column a syntax error is on.',
    keywords: ['syntax checker', 'javascript syntax error', 'json syntax error', 'find code error'],
    searchTerms: ['where is my syntax error', 'javascript error line number', 'check code for errors'],
    status: 'live',
    featured: false,
    popular: true,
    clientSide: true,
    requiresBackend: false,
    privacyLevel: 'Checked locally using your browser\u2019s own JavaScript engine. Nothing is uploaded.',
    relatedTools: ['json-validator', 'javascript-formatter'],
    seoTitle: 'JavaScript & JSON Syntax Checker — Find the Error Line',
    seoDescription: 'Paste JavaScript or JSON and instantly find which line and column a syntax error is on — free, no signup, checked entirely in your browser.',
    component: components.syntaxChecker
  }
]

export function getToolBySlug(slug) {
  return TOOLS.find(t => t.slug === slug)
}

export function getFeaturedTools() {
  return TOOLS.filter(t => t.featured)
}

export function getPopularTools() {
  return TOOLS.filter(t => t.popular)
}

export function getToolsByCategory(category) {
  return TOOLS.filter(t => (t.categories || []).includes(category))
}

// Only categories that currently have at least one live tool — this is what
// nav/footer/homepage should render, so nothing links to an empty category
// page. CATEGORIES itself stays the full future taxonomy.
export function getActiveCategories() {
  return CATEGORIES.filter(c => getToolsByCategory(c).length > 0)
}

// The category shown on cards/search results — the most specific one
// (last in the array) rather than the top-level "Developer Tools" tag,
// so cards read as "Encoding & Decoding" rather than just "Developer Tools"
// for every single tool.
export function primaryCategory(tool) {
  const cats = tool.categories || []
  return cats[cats.length - 1] || cats[0] || ''
}

export function getRelatedTools(tool) {
  return (tool.relatedTools || [])
    .map(slug => getToolBySlug(slug))
    .filter(Boolean)
}

// Lightweight client-side search — keyword/synonym matching, no API,
// no dependency. See section 7/8 of the spec: an AI-routing layer can
// be swapped in later behind this same function signature if it's ever
// justified by real query volume.
export function searchTools(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return TOOLS
    .map(tool => {
      const haystacks = [
        tool.name,
        tool.description,
        ...(tool.categories || []),
        ...(tool.keywords || []),
        ...(tool.searchTerms || [])
      ].join(' ').toLowerCase()
      let score = 0
      if (tool.name.toLowerCase().includes(q)) score += 10
      if (haystacks.includes(q)) score += 3
      q.split(/\s+/).forEach(word => {
        if (word.length > 1 && haystacks.includes(word)) score += 1
      })
      return { tool, score }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.tool)
}
