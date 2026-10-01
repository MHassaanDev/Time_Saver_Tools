import React, { useEffect, useState } from 'react'
import CopyButton from '../components/ui/CopyButton.jsx'
import { md5 } from '../lib/md5.js'

const ALGOS = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512']
const SECURE = new Set(['SHA-256', 'SHA-512'])

async function webCryptoHash(algo, text) {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest(algo, data)
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function HashGeneratorTool() {
  const [input, setInput] = useState('TimeSaver Tools')
  const [algo, setAlgo] = useState('SHA-256')
  const [hash, setHash] = useState('')
  const [uppercase, setUppercase] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!input) { setHash(''); return }
      const result = algo === 'MD5' ? md5(input) : await webCryptoHash(algo, input)
      if (!cancelled) setHash(result)
    }
    run()
    return () => { cancelled = true }
  }, [input, algo])

  const displayed = uppercase ? hash.toUpperCase() : hash

  return (
    <div className="space-y-3">
      <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false} className="code-editor h-28" aria-label="Text to hash" />

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex rounded-lg border border-ink-200 dark:border-ink-800 overflow-hidden text-xs">
          {ALGOS.map(a => (
            <button key={a} onClick={() => setAlgo(a)} className={`px-3 py-1.5 ${algo === a ? 'bg-brand-600 text-white' : 'text-ink-600 dark:text-ink-300'}`}>{a}</button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-xs text-ink-500">
          <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} /> Uppercase
        </label>
      </div>

      {!SECURE.has(algo) && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          {algo} is not secure for passwords or security-sensitive use — included for checksums/legacy compatibility only.
        </p>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-ink-500">{algo} hash</label>
          <CopyButton getText={() => displayed} />
        </div>
        <div className="code-editor break-all">{displayed || '—'}</div>
      </div>
    </div>
  )
}
