import React, { useMemo, useState } from 'react'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState('(\\w+)@(\\w+)\\.com')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState('Contact us at hello@timesaver.com or support@example.com for help.')

  const result = useMemo(() => {
    if (!pattern) return { error: null, matches: [], highlighted: text }
    try {
      const re = new RegExp(pattern, flags)
      const matches = [...text.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))]
      let highlighted = []
      let lastIndex = 0
      matches.forEach((m, i) => {
        if (m.index > lastIndex) highlighted.push(<span key={`t${i}`}>{text.slice(lastIndex, m.index)}</span>)
        highlighted.push(<mark key={`m${i}`} className="bg-brand-200 dark:bg-brand-800 rounded px-0.5">{m[0]}</mark>)
        lastIndex = m.index + m[0].length
      })
      highlighted.push(<span key="rest">{text.slice(lastIndex)}</span>)
      return { error: null, matches, highlighted }
    } catch (e) {
      return { error: e.message, matches: [], highlighted: text }
    }
  }, [pattern, flags, text])

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <span className="text-ink-400 font-mono py-2">/</span>
        <input value={pattern} onChange={e => setPattern(e.target.value)} spellCheck={false}
          className="flex-1 code-editor !h-auto py-2" placeholder="pattern" aria-label="Regex pattern" />
        <span className="text-ink-400 font-mono py-2">/</span>
        <input value={flags} onChange={e => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
          className="w-16 code-editor !h-auto py-2" placeholder="flags" aria-label="Regex flags" />
      </div>
      <ErrorMessage>{result.error}</ErrorMessage>

      <div>
        <label className="text-xs font-medium text-ink-500 block mb-1">Sample text</label>
        <textarea value={text} onChange={e => setText(e.target.value)} spellCheck={false} className="code-editor h-28" aria-label="Sample text" />
      </div>

      <div>
        <label className="text-xs font-medium text-ink-500 block mb-1">Highlighted matches ({result.matches.length})</label>
        <div className="code-editor h-28 overflow-auto whitespace-pre-wrap">{result.highlighted}</div>
      </div>

      {result.matches.length > 0 && result.matches[0].length > 1 && (
        <div>
          <label className="text-xs font-medium text-ink-500 block mb-1">Capture groups (first match)</label>
          <div className="code-editor h-auto">
            {result.matches[0].slice(1).map((g, i) => <div key={i}>Group {i + 1}: {g ?? '(none)'}</div>)}
          </div>
        </div>
      )}
    </div>
  )
}
