import React from 'react'

// Original TimeSaver Tools mark: a rounded square containing a stopwatch —
// a circular dial with a top button/crown, a short "hour"-style tick, and
// one bold, fast-sweeping hand to suggest speed/efficiency (not just time).
// Deliberately not a literal clock face (avoids reading as generic/stocky)
// and not a code-bracket like the previous mark, since the brand now
// covers more than developer tools. Pure inline SVG, no image file —
// scales losslessly from favicon size up.
//
// Three reusable pieces, as before: LogoMark (icon only), LogoWithText
// (icon + wordmark, used in the header), and Logo (default export, alias
// of LogoWithText).

export function LogoMark({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="TimeSaver Tools"
    >
      <rect width="32" height="32" rx="8" className="fill-brand-600" />
      {/* stopwatch crown */}
      <rect x="14" y="4" width="4" height="3" rx="1" fill="white" fillOpacity="0.9" />
      {/* dial */}
      <circle cx="16" cy="18" r="9" fill="none" stroke="white" strokeWidth="2" />
      {/* short static tick (12 o'clock reference) */}
      <line x1="16" y1="18" x2="16" y2="13" stroke="white" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
      {/* bold fast-sweeping hand, mid-motion toward ~4 o'clock */}
      <line x1="16" y1="18" x2="21" y2="21.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function LogoWithText({ size = 32, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      <span className="font-bold text-lg tracking-tight text-ink-900 dark:text-white leading-none">
        TimeSaver<span className="font-medium text-ink-500 dark:text-ink-400"> Tools</span>
      </span>
    </span>
  )
}

// Compact "TS" mark — for favicon, mobile nav, small-screen headers, and
// anywhere the full wordmark doesn't fit. Same badge shape/color as
// LogoMark for visual consistency, but letters instead of the stopwatch
// icon, since "TS" needs to stay legible at very small sizes where the
// stopwatch's finer detail (crown + hand) doesn't hold up as well.
export function LogoCompact({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="TimeSaver Tools"
    >
      <rect width="32" height="32" rx="8" className="fill-brand-600" />
      <text
        x="16"
        y="21.5"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="13"
        fontWeight="700"
        fill="white"
      >
        TS
      </text>
    </svg>
  )
}

export default LogoWithText
