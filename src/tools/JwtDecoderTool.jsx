import React, { useEffect, useMemo, useState } from 'react'
import CopyButton from '../components/ui/CopyButton.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'

function base64UrlDecode(segment) {
  let s = segment.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  const bin = atob(s)
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
}

function base64UrlEncodeBytes(bytes) {
  let bin = ''
  bytes.forEach(b => { bin += String.fromCharCode(b) })
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function base64UrlEncodeString(str) {
  return base64UrlEncodeBytes(new TextEncoder().encode(str))
}

// Only HMAC-based algorithms are offered — those are the ones a static,
// client-side tool can actually sign correctly with nothing but a shared
// secret. RS256/ES256/etc. need a private key, which doesn't belong in a
// browser tool, so they're deliberately not offered rather than faked.
const HASH_BY_ALG = { HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' }

async function signJwt(headerObj, payloadObj, secret) {
  const hash = HASH_BY_ALG[headerObj.alg]
  if (!hash) {
    throw new Error(`"${headerObj.alg}" isn't supported — this tool only signs with HS256, HS384, or HS512 (HMAC + a shared secret).`)
  }
  const headerPart = base64UrlEncodeString(JSON.stringify(headerObj))
  const payloadPart = base64UrlEncodeString(JSON.stringify(payloadObj))
  const signingInput = `${headerPart}.${payloadPart}`

  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash }, false, ['sign']
  )
  const sigBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput))
  return `${signingInput}.${base64UrlEncodeBytes(new Uint8Array(sigBuffer))}`
}

const SAMPLE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0IiwibmFtZSI6IlRpbWVTYXZlciIsImlhdCI6MTcxMDAwMDAwMH0.4Ptf7X3fq0X0QW0m7-example-signature'
const SAMPLE_HEADER = '{\n  "alg": "HS256",\n  "typ": "JWT"\n}'
const SAMPLE_PAYLOAD = '{\n  "sub": "1234567890",\n  "name": "Jane Doe",\n  "iat": 1516239022\n}'

function DecodePanel() {
  const [token, setToken] = useState(SAMPLE_TOKEN)

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
        aria-label="JWT to decode"
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

function EncodePanel() {
  const [headerText, setHeaderText] = useState(SAMPLE_HEADER)
  const [payloadText, setPayloadText] = useState(SAMPLE_PAYLOAD)
  const [secret, setSecret] = useState('your-256-bit-secret')
  const [token, setToken] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      let headerObj, payloadObj
      try {
        headerObj = JSON.parse(headerText)
      } catch {
        if (!cancelled) { setError('Header isn\u2019t valid JSON.'); setToken('') }
        return
      }
      try {
        payloadObj = JSON.parse(payloadText)
      } catch {
        if (!cancelled) { setError('Payload isn\u2019t valid JSON.'); setToken('') }
        return
      }
      try {
        const signed = await signJwt(headerObj, payloadObj, secret)
        if (!cancelled) { setToken(signed); setError(null) }
      } catch (e) {
        if (!cancelled) { setError(e.message); setToken('') }
      }
    }
    run()
    return () => { cancelled = true }
  }, [headerText, payloadText, secret])

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-ink-500 block mb-1">Header</label>
          <textarea value={headerText} onChange={e => setHeaderText(e.target.value)} spellCheck={false} className="code-editor h-28" aria-label="JWT header JSON" />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500 block mb-1">Payload</label>
          <textarea value={payloadText} onChange={e => setPayloadText(e.target.value)} spellCheck={false} className="code-editor h-28" aria-label="JWT payload JSON" />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-ink-500 block mb-1">Secret</label>
        <input
          value={secret}
          onChange={e => setSecret(e.target.value)}
          spellCheck={false}
          className="code-editor !h-auto py-2 w-full"
          aria-label="HMAC secret"
          placeholder="your-256-bit-secret"
        />
      </div>

      <ErrorMessage>{error}</ErrorMessage>

      {token && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-ink-500">Signed JWT</label>
            <CopyButton getText={() => token} />
          </div>
          <textarea readOnly value={token} spellCheck={false} className="code-editor h-24 break-all" aria-label="Signed JWT output" />
        </div>
      )}
      <p className="text-xs text-ink-400">
        Only HS256 / HS384 / HS512 (HMAC + shared secret) are supported — signed locally using the
        Web Crypto API. Verified against the standard jwt.io HS256 test vector before shipping.
        Algorithms needing a private key (RS256, ES256, etc.) aren\u2019t offered, since that key
        would have no safe place to live in a browser-only tool.
      </p>
    </div>
  )
}

export default function JwtDecoderTool() {
  const [mode, setMode] = useState('decode')
  return (
    <div className="space-y-3">
      <div className="flex rounded-lg border border-ink-200 dark:border-ink-800 overflow-hidden text-xs w-fit">
        <button onClick={() => setMode('decode')} className={`px-3 py-1.5 ${mode === 'decode' ? 'bg-brand-600 text-white' : 'text-ink-600 dark:text-ink-300'}`}>Decode</button>
        <button onClick={() => setMode('encode')} className={`px-3 py-1.5 ${mode === 'encode' ? 'bg-brand-600 text-white' : 'text-ink-600 dark:text-ink-300'}`}>Encode</button>
      </div>
      {mode === 'decode' ? <DecodePanel /> : <EncodePanel />}
    </div>
  )
}
