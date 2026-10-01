import React, { useState } from 'react'
import CopyButton from '../components/ui/CopyButton.jsx'

function generateOne() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID()
  // Fallback for older browsers, still using the secure random source.
  const bytes = new Uint8Array(16)
  window.crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`
}

export default function UuidGeneratorTool() {
  const [count, setCount] = useState(5)
  const [uuids, setUuids] = useState(() => Array.from({ length: 5 }, generateOne))

  function regenerate(n = count) {
    setUuids(Array.from({ length: Math.min(Math.max(n, 1), 1000) }, generateOne))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-xs text-ink-500 flex items-center gap-2">
          Quantity
          <input
            type="number" min={1} max={1000} value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-20 rounded-md border border-ink-200 dark:border-ink-800 bg-transparent px-2 py-1 text-sm"
          />
        </label>
        <button onClick={() => regenerate()} className="btn-primary">Generate</button>
        <CopyButton getText={() => uuids.join('\n')} label="Copy all" />
      </div>
      <div className="code-editor h-56 overflow-y-auto space-y-1">
        {uuids.map((u, i) => (
          <div key={i} className="flex items-center justify-between group">
            <span>{u}</span>
            <CopyButton getText={() => u} label="" className="opacity-0 group-hover:opacity-100 btn-ghost !p-1" />
          </div>
        ))}
      </div>
    </div>
  )
}
