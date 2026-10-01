import React, { useMemo, useState } from 'react'
import CopyButton from '../components/ui/CopyButton.jsx'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'

function parseColor(input) {
  const s = input.trim()
  let m
  if ((m = s.match(/^#?([0-9a-f]{6})$/i))) {
    const hex = m[1]
    return { r: parseInt(hex.slice(0,2),16), g: parseInt(hex.slice(2,4),16), b: parseInt(hex.slice(4,6),16) }
  }
  if ((m = s.match(/^#?([0-9a-f]{3})$/i))) {
    const [r,g,b] = m[1].split('').map(c => parseInt(c+c,16))
    return { r, g, b }
  }
  if ((m = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i))) {
    return { r: +m[1], g: +m[2], b: +m[3] }
  }
  if ((m = s.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%/i))) {
    return hslToRgb(+m[1], +m[2], +m[3])
  }
  return null
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) }
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r,g,b), min = Math.min(r,g,b)
  let h, s, l = (max + min) / 2
  if (max === min) { h = s = 0 }
  else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      default: h = (r - g) / d + 4
    }
    h /= 6
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) }
}

const toHex = n => n.toString(16).padStart(2, '0')

export default function ColorConverterTool() {
  const [input, setInput] = useState('#3b63f5')
  const rgb = useMemo(() => parseColor(input), [input])
  const hsl = useMemo(() => rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null, [rgb])
  const hex = useMemo(() => rgb ? `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}` : null, [rgb])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={hex || '#000000'}
          onChange={e => setInput(e.target.value)}
          className="w-12 h-10 rounded-md border border-ink-200 dark:border-ink-800 bg-transparent cursor-pointer"
          aria-label="Pick a color"
        />
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="#3b63f5, rgb(59,99,245), or hsl(230,90%,60%)"
          className="flex-1 code-editor !h-auto py-2"
          aria-label="Color value"
        />
      </div>

      {!rgb && input.trim() && <ErrorMessage>Couldn't recognize that as HEX, RGB, or HSL.</ErrorMessage>}

      {rgb && (
        <>
          <div className="h-16 rounded-lg border border-ink-200 dark:border-ink-800" style={{ background: hex }} />
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <ValueRow label="HEX" value={hex} />
            <ValueRow label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
            <ValueRow label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
          </div>
        </>
      )}
    </div>
  )
}

function ValueRow({ label, value }) {
  return (
    <div className="card p-3 flex items-center justify-between">
      <div>
        <p className="text-xs text-ink-400">{label}</p>
        <p className="font-mono text-sm">{value}</p>
      </div>
      <CopyButton getText={() => value} label="" className="btn-ghost !p-1.5" />
    </div>
  )
}
