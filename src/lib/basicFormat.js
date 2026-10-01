// Lightweight, dependency-free re-indenters for HTML/CSS/JS.
//
// Deliberately NOT a full AST-based formatter (that's what Prettier is for,
// and bundling Prettier's per-language plugins would add real weight for a
// feature that's secondary to this site's actual tools). This handles the
// common case — messy/minified code with inconsistent indentation — well,
// and is honest in its own UI copy about that limit. See
// docs/architecture notes on "no unnecessary dependencies."

const INDENT = '  '

export function formatHtml(input) {
  const withoutExtraSpace = input.replace(/>\s*</g, '><').trim()
  const tokens = withoutExtraSpace.split(/(<[^>]+>)/g).filter(t => t.length)
  const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'])
  let depth = 0
  const lines = []
  for (const token of tokens) {
    if (!token.trim()) continue
    if (token.startsWith('</')) {
      depth = Math.max(depth - 1, 0)
      lines.push(INDENT.repeat(depth) + token)
    } else if (token.startsWith('<')) {
      lines.push(INDENT.repeat(depth) + token)
      const tagName = (token.match(/^<([a-zA-Z0-9-]+)/) || [])[1] || ''
      const selfClosing = token.endsWith('/>') || voidTags.has(tagName.toLowerCase()) || /<!--/.test(token) || token.startsWith('<!')
      if (!selfClosing) depth += 1
    } else {
      lines.push(INDENT.repeat(depth) + token.trim())
    }
  }
  return lines.join('\n')
}

export function formatCss(input) {
  let out = ''
  let depth = 0
  const cleaned = input.replace(/\s+/g, ' ').trim()
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i]
    if (ch === '{') {
      out = out.trimEnd() + ' {\n'
      depth += 1
      out += INDENT.repeat(depth)
    } else if (ch === '}') {
      depth = Math.max(depth - 1, 0)
      out = out.trimEnd() + '\n' + INDENT.repeat(depth) + '}\n' + INDENT.repeat(depth)
    } else if (ch === ';') {
      out += ';\n' + INDENT.repeat(depth)
    } else {
      out += ch
    }
  }
  return out.split('\n').map(l => l.trimEnd()).join('\n').replace(/\n{2,}/g, '\n').trim()
}

// String/template-literal-aware line-breaker: inserts a newline after `{`,
// `;`, and around `}` — but only outside of quotes, so it doesn't shred code
// that happens to contain those characters in a string. This is what makes
// formatJs actually useful on real-world minified single-line input, not
// just already-multi-line code.
function breakIntoLines(input) {
  let out = ''
  let quote = null // null | '"' | "'" | '`'
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    const prev = input[i - 1]
    if (quote) {
      out += ch
      if (ch === quote && prev !== '\\') quote = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; out += ch; continue }
    if (ch === '{') { out += '{\n'; continue }
    if (ch === '}') { out += '\n}\n'; continue }
    if (ch === ';') { out += ';\n'; continue }
    out += ch
  }
  return out
}

export function formatJs(input) {
  const broken = breakIntoLines(input.replace(/\r/g, ''))
  const lines = broken.split('\n').map(l => l.trim()).filter(l => l.length)
  let depth = 0
  const out = []
  for (const line of lines) {
    const closesFirst = /^[)}\]]/.test(line)
    if (closesFirst) depth = Math.max(depth - 1, 0)
    out.push(INDENT.repeat(depth) + line)
    const opens = (line.match(/[{[(]/g) || []).length
    const closes = (closesFirst ? line.slice(1) : line).match(/[}\])]/g)?.length || 0
    depth = Math.max(depth + opens - closes - (closesFirst ? 0 : 0), 0)
  }
  return out.join('\n')
}

export function formatByLanguage(lang, input) {
  if (lang === 'html') return formatHtml(input)
  if (lang === 'css') return formatCss(input)
  return formatJs(input)
}
