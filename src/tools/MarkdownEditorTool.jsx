import React, { useMemo, useRef, useState } from 'react'
import { renderMarkdown } from '../lib/markdown.js'
import { trackEvent } from '../lib/analytics.js'
import CopyButton from '../components/ui/CopyButton.jsx'

const EXAMPLE = `# Project Notes

A short **example** so you can see what this editor does. Delete this and start writing, or drag a block from the palette below into the editor.

## Todo
- [x] Set up the repo
- [ ] Write the README
- [ ] Ship it

## Links
Check the [docs](https://example.com "Project docs") for more.

> Tip: drag any block on the left into the editor — it lands wherever your cursor last was.

\`\`\`js
console.log("code blocks work too");
\`\`\`

| Task | Owner |
|------|-------|
| Design | Ada |
| Build | Grace |
`

const BLOCKS = [
  { label: 'Heading', snippet: '## Heading\n' },
  { label: 'Bold', snippet: '**bold text**' },
  { label: 'Italic', snippet: '*italic text*' },
  { label: 'Link', snippet: '[link text](https://example.com)' },
  { label: 'Image', snippet: '![alt text](https://example.com/image.png)' },
  { label: 'List', snippet: '- List item\n- List item\n- List item\n' },
  { label: 'Checklist', snippet: '- [ ] Task one\n- [ ] Task two\n' },
  { label: 'Quote', snippet: '> Quote\n' },
  { label: 'Code block', snippet: '```\ncode here\n```\n' },
  { label: 'Table', snippet: '| Column 1 | Column 2 |\n|----------|----------|\n| Cell     | Cell     |\n' },
  { label: 'Divider', snippet: '\n---\n' }
]

export default function MarkdownEditorTool() {
  const [source, setSource] = useState(EXAMPLE)
  const [view, setView] = useState('split') // 'split' | 'write' | 'preview' — 'write'/'preview' used on mobile
  const cursorRef = useRef({ start: EXAMPLE.length, end: EXAMPLE.length })
  const textareaRef = useRef(null)
  const importRef = useRef(null)

  const html = useMemo(() => renderMarkdown(source), [source])

  function trackCursor(e) {
    cursorRef.current = { start: e.target.selectionStart, end: e.target.selectionEnd }
  }

  // Shared by both the palette's click-to-insert and its drag-and-drop:
  // inserts at the last known cursor position, not a literal pixel drop
  // point (plain <textarea>s don't expose reliable caret-from-mouse-
  // coordinates across browsers) — simple and predictable rather than
  // approximate-and-flaky.
  function insertAtCursor(snippet) {
    const { start, end } = cursorRef.current
    const next = source.slice(0, start) + snippet + source.slice(end)
    setSource(next)
    const newPos = start + snippet.length
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
      textareaRef.current?.setSelectionRange(newPos, newPos)
      cursorRef.current = { start: newPos, end: newPos }
    })
  }

  function handleDrop(e) {
    e.preventDefault()
    const snippet = e.dataTransfer.getData('text/plain')
    if (snippet) insertAtCursor(snippet)
  }

  function downloadMd() {
    trackEvent('markdown_download', { format: 'md' })
    const blob = new Blob([source], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'document.md'; a.click()
    URL.revokeObjectURL(url)
  }

  function downloadHtml() {
    const doc = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Document</title>\n<style>body{font-family:system-ui,sans-serif;max-width:700px;margin:2rem auto;line-height:1.6;padding:0 1rem}code,pre{background:#f1f1f1;border-radius:4px}pre{padding:1rem;overflow:auto}table{border-collapse:collapse}td,th{border:1px solid #ddd;padding:.4rem .6rem}blockquote{border-left:3px solid #ccc;margin:0;padding-left:1rem;color:#555}</style>\n</head>\n<body>\n${html}\n</body>\n</html>`
    const blob = new Blob([doc], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'document.html'; a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setSource(String(reader.result || ''))
    reader.readAsText(file)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-ink-200 dark:border-ink-800 overflow-hidden text-xs sm:hidden">
          <button onClick={() => setView('write')} className={`px-3 py-1.5 ${view === 'write' ? 'bg-brand-600 text-white' : ''}`}>Write</button>
          <button onClick={() => setView('preview')} className={`px-3 py-1.5 ${view === 'preview' ? 'bg-brand-600 text-white' : ''}`}>Preview</button>
        </div>
        <button onClick={() => setSource(EXAMPLE)} className="btn-ghost">Reset example</button>
        <button onClick={() => setSource('')} className="btn-ghost">Clear</button>
        <button onClick={() => importRef.current?.click()} className="btn-secondary">Import .md</button>
        <input ref={importRef} type="file" accept=".md,.markdown,text/markdown,text/plain" onChange={handleImport} className="hidden" aria-label="Import a Markdown file" />
        <CopyButton getText={() => source} label="Copy Markdown" />
        <button onClick={downloadMd} className="btn-secondary">Download .md</button>
        <button onClick={downloadHtml} className="btn-secondary">Download .html</button>
      </div>

      <div className="grid sm:grid-cols-[140px_1fr_1fr] gap-3">
        {/* Block palette — draggable onto the editor, or click to insert at cursor */}
        <div className="flex sm:flex-col gap-1.5 flex-wrap sm:flex-nowrap">
          {BLOCKS.map(b => (
            <button
              key={b.label}
              draggable
              onDragStart={e => e.dataTransfer.setData('text/plain', b.snippet)}
              onClick={() => insertAtCursor(b.snippet)}
              className="btn-ghost !justify-start text-xs border border-ink-200 dark:border-ink-800 cursor-grab active:cursor-grabbing"
              title="Click to insert, or drag into the editor"
            >
              {b.label}
            </button>
          ))}
        </div>

        <div className={view === 'preview' ? 'hidden sm:block' : ''}>
          <textarea
            ref={textareaRef}
            value={source}
            onChange={e => setSource(e.target.value)}
            onSelect={trackCursor}
            onKeyUp={trackCursor}
            onClick={trackCursor}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            spellCheck={false}
            className="code-editor h-96"
            aria-label="Markdown source"
          />
        </div>

        <div className={view === 'write' ? 'hidden sm:block' : ''}>
          <div
            className="card h-96 overflow-auto p-4 markdown-preview"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
      <p className="text-xs text-ink-400">
        Covers headings, bold/italic/strikethrough, links, images, lists, checklists, blockquotes,
        code blocks, tables, and horizontal rules — a lightweight renderer, not a full CommonMark
        implementation.
      </p>
    </div>
  )
}
