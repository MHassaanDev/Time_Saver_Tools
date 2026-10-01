import React, { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import ToolsIndex from './pages/ToolsIndex.jsx'
import ToolPage from './pages/ToolPage.jsx'
import About from './pages/About.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import { initAnalytics, trackPageview } from './lib/analytics.js'

export default function App() {
  const location = useLocation()
  const navigationType = useNavigationType()

  // Loads once; a no-op if GA_MEASUREMENT_ID isn't configured (see
  // src/config/analytics.js) — nothing loads until it's set.
  useEffect(() => { initAnalytics() }, [])

  // SPA route changes don't trigger a real page load, so gtag's automatic
  // pageview never fires again after the first one — send it manually on
  // every route change instead.
  useEffect(() => { trackPageview(location.pathname) }, [location.pathname])

  // React Router does NOT reset scroll position on navigation by default
  // (there's no real page load to reset it) — clicking a Related Tools
  // link while scrolled down left you scrolled to the same pixel depth on
  // the new page, which reads as "nothing happened." Fixed here, but only
  // for PUSH/REPLACE (an actual link click) — not for POP (browser Back/
  // Forward), where jumping to the top would fight the back button's own,
  // better-expected behavior of returning you to where you were.
  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, navigationType])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<ToolsIndex />} />
        <Route path="/tools/:slug" element={<ToolPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
