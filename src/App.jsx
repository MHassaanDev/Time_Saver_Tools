import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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

  // Loads once; a no-op if GA_MEASUREMENT_ID isn't configured (see
  // src/config/analytics.js) — nothing loads until it's set.
  useEffect(() => { initAnalytics() }, [])

  // SPA route changes don't trigger a real page load, so gtag's automatic
  // pageview never fires again after the first one — send it manually on
  // every route change instead.
  useEffect(() => { trackPageview(location.pathname) }, [location.pathname])

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
