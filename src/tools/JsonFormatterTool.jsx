import React, { useMemo, useState } from 'react'
import CopyButton from '../components/ui/CopyButton.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'

// Powers both /tools/json-formatter and /tools/json-validator — same
// underlying logic, `mode` prop (from toolRegistry.js) switches the framing.
export default function JsonFormatterTool({ mode = 'format' }) {
  const [input, setInput] = useState('{"name":"TimeSaver","tools":["json","base64","uuid"],"active":true}')
  const [indent, setIndent] = useState('2')

  const result = useMemo(() => {
    if (!input.trim()) return { ok: null, output: '', error: null }
    try {
      const parsed = JSON.parse(input)
      return { ok: true, output: JSON.stringify(parsed, null, indent === 'tab' ? '\t' : Number(indent)), error: null }
    } catch (e) {
      return { ok: false, output: '', error: cleanError(e.message) }
    }
  }, [input, indent])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-ink-500">Paste JSON</label>
        <div className="flex items-center gap-2">
          {mode === 'format' && (
            <select value={indent} onChange={e => setIndent(e.target.value)} className="text-xs rounded-md border border-ink-200 dark:border-ink-800 bg-transparent px-2 py-1">
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tabs</option>
            </select>
          )}
          <button onClick={() => setInput('')} className="btn-ghost text-xs !px-2 !py-1">Clear</button>
        </div>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        spellCheck={false}
        className="code-editor h-40"
        aria-label="JSON input"
        placeholder="Paste JSON here…"
      />

      {result.ok === true && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
          Valid JSON
        </div>
      )}
      {result.ok === false && <ErrorMessage>{result.error}</ErrorMessage>}

      {mode === 'format' && result.ok && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-ink-500">Formatted output</label>
            <CopyButton getText={() => result.output} />
          </div>
          <textarea readOnly value={result.output} spellCheck={false} className="code-editor h-48" aria-label="Formatted JSON output" />
        </div>
      )}
    </div>
  )
}

function cleanError(message) {
  // Native JSON.parse errors are already fairly specific in modern browsers
  // (e.g. "Unexpected token , in JSON at position 42") — pass through, with
  // a nudge toward the most common real-world causes.
  return `${message}. Common causes: a trailing comma, single-quoted keys/strings, or an unquoted key.`
}
