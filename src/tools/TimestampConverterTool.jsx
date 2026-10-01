import React, { useState } from 'react'
import CopyButton from '../components/ui/CopyButton.jsx'

export default function TimestampConverterTool() {
  const [timestamp, setTimestamp] = useState(String(Math.floor(Date.now() / 1000)))
  const [unit, setUnit] = useState('seconds')
  const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 16))

  const ms = unit === 'seconds' ? Number(timestamp) * 1000 : Number(timestamp)
  const date = Number.isFinite(ms) && timestamp.trim() ? new Date(ms) : null

  function useNow() {
    const now = Date.now()
    setTimestamp(String(unit === 'seconds' ? Math.floor(now / 1000) : now))
  }

  function fromDate() {
    const d = new Date(dateInput)
    if (!isNaN(d.getTime())) {
      setTimestamp(String(unit === 'seconds' ? Math.floor(d.getTime() / 1000) : d.getTime()))
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-ink-500">Unix timestamp</label>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-ink-200 dark:border-ink-800 overflow-hidden text-xs">
              <button onClick={() => setUnit('seconds')} className={`px-2.5 py-1 ${unit === 'seconds' ? 'bg-brand-600 text-white' : ''}`}>Seconds</button>
              <button onClick={() => setUnit('milliseconds')} className={`px-2.5 py-1 ${unit === 'milliseconds' ? 'bg-brand-600 text-white' : ''}`}>ms</button>
            </div>
            <button onClick={useNow} className="btn-ghost text-xs !px-2 !py-1">Now</button>
          </div>
        </div>
        <input value={timestamp} onChange={e => setTimestamp(e.target.value.replace(/[^\d]/g, ''))} className="code-editor !h-auto py-2 w-full" aria-label="Unix timestamp" />
      </div>

      {date && (
        <div className="grid sm:grid-cols-2 gap-3">
          <ResultRow label="Local time" value={date.toLocaleString()} />
          <ResultRow label="UTC" value={date.toUTCString()} />
          <ResultRow label="ISO 8601" value={date.toISOString()} />
          <ResultRow label="Relative" value={relative(date)} />
        </div>
      )}

      <div className="border-t border-ink-200 dark:border-ink-800 pt-4">
        <label className="text-xs font-medium text-ink-500 block mb-1">Or convert a date to a timestamp</label>
        <div className="flex gap-2">
          <input type="datetime-local" value={dateInput} onChange={e => setDateInput(e.target.value)} className="code-editor !h-auto py-2 flex-1" aria-label="Date" />
          <button onClick={fromDate} className="btn-secondary">Convert</button>
        </div>
      </div>
    </div>
  )
}

function relative(date) {
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000)
  const abs = Math.abs(diffSec)
  const units = [['year',31536000],['month',2592000],['day',86400],['hour',3600],['minute',60],['second',1]]
  for (const [name, secs] of units) {
    if (abs >= secs || name === 'second') {
      const val = Math.round(diffSec / secs)
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(val, name)
    }
  }
}

function ResultRow({ label, value }) {
  return (
    <div className="card p-3 flex items-center justify-between gap-2">
      <div className="min-w-0">
        <p className="text-xs text-ink-400">{label}</p>
        <p className="font-mono text-sm truncate">{value}</p>
      </div>
      <CopyButton getText={() => value} label="" className="btn-ghost !p-1.5 shrink-0" />
    </div>
  )
}
