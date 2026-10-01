import { ANALYTICS_ENABLED, GA_MEASUREMENT_ID } from '../config/analytics.js'

let initialized = false

// Loads gtag.js asynchronously (never blocks initial render/critical
// rendering path — see index.html load order) and only if a real
// Measurement ID has been configured. Safe to call more than once.
export function initAnalytics() {
  if (!ANALYTICS_ENABLED || initialized || typeof window === 'undefined') return
  initialized = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  // send_page_view: false — this is an SPA, so pageviews are sent manually
  // on route change (see trackPageview) rather than only once on load.
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })
}

export function trackPageview(path) {
  if (!ANALYTICS_ENABLED || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', { page_path: path })
}

// Generic event tracker. NEVER pass actual tool input/output as a param —
// only pass the fact that an action happened (see Privacy Policy: tool
// content is never sent to analytics). Safe no-op when analytics is off.
export function trackEvent(name, params = {}) {
  if (!ANALYTICS_ENABLED || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
