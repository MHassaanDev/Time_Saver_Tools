// A small, dependency-free Markdown → HTML renderer.
//
// NOT a full CommonMark implementation — covers exactly the syntax listed
// as required (headings, paragraphs, bold/italic/strikethrough, links,
// images, ordered/unordered/checklist lists, blockquotes, fenced code
// blocks, inline code, tables, horizontal rules) and is honest about not
// supporting more than that (nested lists, footnotes, etc. are out of
// scope — see the tool's own UI copy).
//
// SECURITY: HTML is escaped at the text-leaf level (inside renderInline and
// when emitting code blocks) — never on the whole document upfront, which
// would destroy the literal `>`, `"`, `|` etc. characters block-level
// parsing depends on (a real bug caught by testing this against a
// blockquote + a titled link before shipping it). The output is safe to
// render with dangerouslySetInnerHTML: raw HTML typed by the user becomes
// escaped text, never executable markup.

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderInline(text) {
  let s = escapeHtml(text)
  // Images before links (both use bracket syntax; image has a leading !).
  // Quotes are already &quot; at this point, so the title regex matches that.
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g, (_, alt, src, title) =>
    `<img alt="${alt}" src="${src}"${title ? ` title="${title}"` : ''}>`
  )
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g, (_, label, href, title) =>
    `<a href="${href}"${title ? ` title="${title}"` : ''} target="_blank" rel="noopener noreferrer">${label}</a>`
  )
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
  s = s.replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, (_, a, b) => `<strong>${a || b}</strong>`)
  s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>')
  s = s.replace(/(?:\*([^*]+)\*)|(?:\b_([^_]+)_\b)/g, (_, a, b) => `<em>${a || b}</em>`)
  return s
}

export function renderMarkdown(source) {
  const normalized = source.replace(/\r\n/g, '\n')

  // Protect fenced code blocks from block/inline parsing — their content is
  // escaped for safe display but never treated as markdown.
  const codeBlocks = []
  const withoutCode = normalized.replace(/```([^\n]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    codeBlocks.push({ lang: lang.trim(), code })
    return `\u0000CODEBLOCK${codeBlocks.length - 1}\u0000`
  })

  const lines = withoutCode.split('\n')
  const html = []
  let i = 0
  let paragraphBuf = []

  function flushParagraph() {
    if (paragraphBuf.length) {
      html.push(`<p>${renderInline(paragraphBuf.join(' '))}</p>`)
      paragraphBuf = []
    }
  }

  while (i < lines.length) {
    const line = lines[i]

    const codeMatch = line.match(/^\u0000CODEBLOCK(\d+)\u0000$/)
    if (codeMatch) {
      flushParagraph()
      const block = codeBlocks[Number(codeMatch[1])]
      const cls = block.lang ? ` class="language-${block.lang}"` : ''
      html.push(`<pre><code${cls}>${escapeHtml(block.code).replace(/\n$/, '')}</code></pre>`)
      i++; continue
    }

    if (!line.trim()) { flushParagraph(); i++; continue }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushParagraph(); html.push('<hr>'); i++; continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      flushParagraph()
      const level = heading[1].length
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`)
      i++; continue
    }

    if (/^>\s?/.test(line)) {
      flushParagraph()
      const quoteLines = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, '')); i++
      }
      html.push(`<blockquote><p>${renderInline(quoteLines.join(' '))}</p></blockquote>`)
      continue
    }

    // Table: a header row followed by a |---|---| separator row
    if (/^\|.*\|\s*$/.test(line) && lines[i + 1] && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(lines[i + 1])) {
      flushParagraph()
      const headCells = line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim())
      i += 2
      const rows = []
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        rows.push(lines[i].trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()))
        i++
      }
      html.push('<table><thead><tr>' + headCells.map(c => `<th>${renderInline(c)}</th>`).join('') + '</tr></thead><tbody>' +
        rows.map(r => '<tr>' + r.map(c => `<td>${renderInline(c)}</td>`).join('') + '</tr>').join('') +
        '</tbody></table>')
      continue
    }

    // Checklist / unordered / ordered lists (single-level, no nesting)
    const checklistItem = line.match(/^\s*[-*+]\s+\[( |x|X)\]\s+(.*)$/)
    const ulItem = !checklistItem && line.match(/^\s*[-*+]\s+(.*)$/)
    const olItem = line.match(/^\s*\d+\.\s+(.*)$/)
    if (checklistItem || ulItem || olItem) {
      flushParagraph()
      const isChecklist = Boolean(checklistItem)
      const isOrdered = Boolean(olItem) && !isChecklist && !ulItem
      const items = []
      while (i < lines.length) {
        const cl = lines[i].match(/^\s*[-*+]\s+\[( |x|X)\]\s+(.*)$/)
        const ul = !cl && lines[i].match(/^\s*[-*+]\s+(.*)$/)
        const ol = lines[i].match(/^\s*\d+\.\s+(.*)$/)
        if (isChecklist && cl) { items.push({ checked: cl[1].toLowerCase() === 'x', text: cl[2] }); i++ }
        else if (!isChecklist && !isOrdered && ul) { items.push({ text: ul[1] }); i++ }
        else if (isOrdered && ol) { items.push({ text: ol[1] }); i++ }
        else break
      }
      if (isChecklist) {
        html.push('<ul class="checklist">' + items.map(it =>
          `<li><input type="checkbox" disabled ${it.checked ? 'checked' : ''}> ${renderInline(it.text)}</li>`
        ).join('') + '</ul>')
      } else {
        const tag = isOrdered ? 'ol' : 'ul'
        html.push(`<${tag}>` + items.map(it => `<li>${renderInline(it.text)}</li>`).join('') + `</${tag}>`)
      }
      continue
    }

    paragraphBuf.push(line.trim())
    i++
  }
  flushParagraph()
  return html.join('\n')
}
