import React, { useState } from 'react'
import CopyButton from '../components/ui/CopyButton.jsx'
import { formatByLanguage } from '../lib/basicFormat.js'

const SAMPLES = {
  html: '<div class="card"><h2>Title</h2><p>Some text</p></div>',
  css: '.card{padding:1rem;border-radius:8px}.card h2{margin:0;font-size:1.25rem}',
  javascript: 'function greet(name){if(name){console.log("Hello, "+name);}else{console.log("Hello!");}}'
}

const LABELS = { html: 'HTML', css: 'CSS', javascript: 'JavaScript' }

// Powers /tools/html-formatter, /tools/css-formatter, /tools/javascript-formatter
// via the `language` prop set in toolRegistry.js.
export default function CodeFormatterTool({ language = 'html' }) {
  const [input, setInput] = useState(SAMPLES[language] || '')
  const [output, setOutput] = useState('')

  function format() {
    setOutput(formatByLanguage(language, input))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-ink-500">{LABELS[language]} input</label>
        <button onClick={() => setInput('')} className="btn-ghost text-xs !px-2 !py-1">Clear</button>
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false} className="code-editor h-40" aria-label={`${LABELS[language]} input`} />
      <button onClick={format} className="btn-primary">Format</button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-ink-500">Formatted output</label>
            <CopyButton getText={() => output} />
          </div>
          <textarea readOnly value={output} spellCheck={false} className="code-editor h-48" aria-label="Formatted output" />
        </div>
      )}
      <p className="text-xs text-ink-400">
        Lightweight formatter — re-indents reliably for typical {LABELS[language]}; not a full AST-based formatter like Prettier.
      </p>
    </div>
  )
}
