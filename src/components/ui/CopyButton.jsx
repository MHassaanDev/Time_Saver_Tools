import React, { useState } from 'react'

export default function CopyButton({ getText, label = 'Copy', className = 'btn-secondary' }) {
  const [copied, setCopied] = useState(false)

  async function handleClick() {
    const text = typeof getText === 'function' ? getText() : getText
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API can fail (permissions, insecure context) — fail quietly
      // rather than throwing a raw error at the user.
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
          Copied
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          {label}
        </>
      )}
    </button>
  )
}
