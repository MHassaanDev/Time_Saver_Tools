import React, { useState } from 'react'
import { checkJavaScript, checkJson } from '../lib/syntaxCheck.js'

const SAMPLES = {
  javascript: 'function greet(name) {\n  console.log("Hello, " + name);\n', // intentionally missing closing brace
  json: '{\n  "name": "TimeSaver Tools",\n  "tools": [1, 2, 3],\n}' // intentionally has a trailing comma
}

export default function SyntaxCheckerTool() {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(SAMPLES.javascript)
  const [result, setResult] = useState(null)

  function check() {
    const checker = language === 'json' ? checkJson : checkJavaScript
    setResult(checker(code))
  }

  function switchLanguage(lang) {
    setLanguage(lang)
    setCode(SAMPLES[lang])
    setResult(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex rounded-lg border border-ink-200 dark:border-ink-800 overflow-hidden text-xs">
          <button onClick={() => switchLanguage('javascript')} className={`px-3 py-1.5 ${language === 'javascript' ? 'bg-brand-600 text-white' : ''}`}>JavaScript</button>
          <button onClick={() => switchLanguage('json')} className={`px-3 py-1.5 ${language === 'json' ? 'bg-brand-600 text-white' : ''}`}>JSON</button>
        </div>
        <button onClick={() => setCode('')} className="btn-ghost text-xs !px-2 !py-1">Clear</button>
      </div>

      <textarea
        value={code}
        onChange={e => { setCode(e.target.value); setResult(null) }}
        spellCheck={false}
        className="code-editor h-56"
        aria-label="Code to check"
      />

      <button onClick={check} className="btn-primary">Check syntax</button>

      {result && result.valid === true && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
          No syntax errors found.
        </div>
      )}

      {result && result.valid === false && (
        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3 py-2.5 text-sm">
          {result.positionKnown ? (
            <p className="text-red-700 dark:text-red-300 font-medium">
              Error at line {result.line}, column {result.col}
            </p>
          ) : (
            <p className="text-red-700 dark:text-red-300 font-medium">
              Syntax error found — exact line/column isn't available for this one in your browser.
            </p>
          )}
          <p className="text-red-600 dark:text-red-400 mt-1">{result.message}</p>
        </div>
      )}
    </div>
  )
}
