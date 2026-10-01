import React, { useMemo, useState } from 'react'
import CopyButton from '../components/ui/CopyButton.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'

function utf8ToBase64(str, urlSafe) {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  bytes.forEach(b => { bin += String.fromCharCode(b) })
  let out = btoa(bin)
  if (urlSafe) out = out.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return out
}

function base64ToUtf8(str) {
  let normalized = str.replace(/-/g, '+').replace(/_/g, '/')
  while (normalized.length % 4) normalized += '='
  const bin = atob(normalized)
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
}

export default function Base64Tool() {
  const [mode, setMode] = useState('encode')
  const [urlSafe, setUrlSafe] = useState(false)
  const [input, setInput] = useState(mode === 'encode' ? 'Hello, TimeSaver! 👋' : 'SGVsbG8sIERldkZsb3ch')

  const result = useMemo(() => {
    if (!input) return { output: '', error: null }
    try {
      if (mode === 'encode') return { output: utf8ToBase64(input, urlSafe), error: null }
      return { output: base64ToUtf8(input), error: null }
    } catch {
      return { output: '', error: 'This doesn\u2019t look like valid Base64 — check for missing characters or padding.' }
    }
  }, [input, mode, urlSafe])

  function switchMode(next) {
    setMode(next)
    setInput(next === 'encode' ? 'Hello, TimeSaver! 👋' : 'SGVsbG8sIERldkZsb3ch')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex rounded-lg border border-ink-200 dark:border-ink-800 overflow-hidden text-xs">
          <button onClick={() => switchMode('encode')} className={`px-3 py-1.5 ${mode === 'encode' ? 'bg-brand-600 text-white' : 'text-ink-600 dark:text-ink-300'}`}>Encode</button>
          <button onClick={() => switchMode('decode')} className={`px-3 py-1.5 ${mode === 'decode' ? 'bg-brand-600 text-white' : 'text-ink-600 dark:text-ink-300'}`}>Decode</button>
        </div>
        {mode === 'encode' && (
          <label className="flex items-center gap-1.5 text-xs text-ink-500">
            <input type="checkbox" checked={urlSafe} onChange={e => setUrlSafe(e.target.checked)} /> URL-safe
          </label>
        )}
      </div>

      <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false} className="code-editor h-32"
        aria-label={mode === 'encode' ? 'Text to encode' : 'Base64 to decode'} />

      <ErrorMessage>{result.error}</ErrorMessage>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-ink-500">{mode === 'encode' ? 'Base64 output' : 'Decoded text'}</label>
          <CopyButton getText={() => result.output} />
        </div>
        <textarea readOnly value={result.output} spellCheck={false} className="code-editor h-32" aria-label="Result" />
      </div>
    </div>
  )
}
