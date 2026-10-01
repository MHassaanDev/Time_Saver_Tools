import React, { useMemo, useState } from 'react'
import CopyButton from '../components/ui/CopyButton.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'

export default function UrlEncodeDecodeTool() {
  const [mode, setMode] = useState('encode')
  const [scope, setScope] = useState('component') // 'component' | 'full'
  const [input, setInput] = useState('https://example.com/search?q=hello world&lang=en')

  const result = useMemo(() => {
    if (!input) return { output: '', error: null }
    try {
      if (mode === 'encode') {
        return { output: scope === 'component' ? encodeURIComponent(input) : encodeURI(input), error: null }
      }
      return { output: scope === 'component' ? decodeURIComponent(input) : decodeURI(input), error: null }
    } catch {
      return { output: '', error: 'Couldn\u2019t decode this — check for a stray "%" not followed by two hex digits.' }
    }
  }, [input, mode, scope])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex rounded-lg border border-ink-200 dark:border-ink-800 overflow-hidden text-xs">
          <button onClick={() => setMode('encode')} className={`px-3 py-1.5 ${mode === 'encode' ? 'bg-brand-600 text-white' : 'text-ink-600 dark:text-ink-300'}`}>Encode</button>
          <button onClick={() => setMode('decode')} className={`px-3 py-1.5 ${mode === 'decode' ? 'bg-brand-600 text-white' : 'text-ink-600 dark:text-ink-300'}`}>Decode</button>
        </div>
        {mode === 'encode' && (
          <div className="flex rounded-lg border border-ink-200 dark:border-ink-800 overflow-hidden text-xs">
            <button onClick={() => setScope('component')} className={`px-3 py-1.5 ${scope === 'component' ? 'bg-ink-700 text-white' : 'text-ink-600 dark:text-ink-300'}`}>Component</button>
            <button onClick={() => setScope('full')} className={`px-3 py-1.5 ${scope === 'full' ? 'bg-ink-700 text-white' : 'text-ink-600 dark:text-ink-300'}`}>Full URI</button>
          </div>
        )}
      </div>

      <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false} className="code-editor h-28" aria-label="Input" />
      <ErrorMessage>{result.error}</ErrorMessage>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-ink-500">Result</label>
          <CopyButton getText={() => result.output} />
        </div>
        <textarea readOnly value={result.output} spellCheck={false} className="code-editor h-28" aria-label="Result" />
      </div>
    </div>
  )
}
