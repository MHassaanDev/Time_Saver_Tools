import React, { useMemo, useState } from 'react'
import CopyButton from '../components/ui/CopyButton.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'

function base64UrlDecode(segment) {
  let s = segment.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  const bin = atob(s)
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
}

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0IiwibmFtZSI6IkRldkZsb3ciLCJpYXQiOjE3MTAwMDAwMDB9.4Ptf7X3fq0X0QW0m7-example-signature'

export default function JwtDecoderTool() {
  const [token, setToken] = useState(SAMPLE)

  const result = useMemo(() => {
    const parts = token.trim().split('.')
    if (parts.length !== 3) {
      return { error: token.trim() ? 'A JWT has three dot-separated parts (header.payload.signature) — this input doesn\u2019t.' : null }
    }
    try {
      const header = JSON.parse(base64UrlDecode(parts[0]))
      const payload = JSON.parse(base64UrlDecode(parts[1]))
      return { header, payload, signature: parts[2], error: null }
    } catch {
      return { error: 'Couldn\u2019t decode this token\u2019s header/payload — check it was copied in full.' }
    }
  }, [token])

  return (
    <div className="space-y-3">
      <textarea
        value={token}
        onChange={e => setToken(e.target.value)}
        spellCheck={false}
        className="code-editor h-24"
        aria-label="JWT"
        placeholder="Paste a JWT…"
      />
      <ErrorMessage>{result.error}</ErrorMessage>

      {result.header && (
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-ink-500">Header</label>
              <CopyButton getText={() => JSON.stringify(result.header, null, 2)} />
            </div>
            <pre className="code-editor h-40 overflow-auto">{JSON.stringify(result.header, null, 2)}</pre>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-ink-500">Payload</label>
              <CopyButton getText={() => JSON.stringify(result.payload, null, 2)} />
            </div>
            <pre className="code-editor h-40 overflow-auto">{JSON.stringify(result.payload, null, 2)}</pre>
          </div>
        </div>
      )}
      {result.header && (
        <p className="text-xs text-ink-400">
          Signature not verified (decoding only — verifying requires the signing secret/key, which never belongs in a browser tool).
        </p>
      )}
    </div>
  )
}
