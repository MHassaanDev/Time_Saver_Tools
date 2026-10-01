import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CopyButton from '../components/ui/CopyButton.jsx'
import { formatHtml, formatCss, formatJs } from '../lib/basicFormat.js'
import { trackEvent } from '../lib/analytics.js'

const EXAMPLE = {
  html: `<h1>Hello, TimeSaver</h1>\n<p>Edit any panel and the preview updates live.</p>\n<button id="btn">Click me</button>`,
  css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 2rem;\n  color: #1a1a2e;\n}\nbutton {\n  padding: .5rem 1rem;\n  border-radius: 8px;\n  border: none;\n  background: #3b63f5;\n  color: white;\n  cursor: pointer;\n}`,
  js: `document.getElementById('btn').addEventListener('click', () => {\n  console.log('Button clicked!');\n});`
}

const FULL_HTML_EXAMPLE = `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: system-ui, sans-serif; padding: 2rem; }\n  </style>\n</head>\n<body>\n  <h1>Paste a full HTML file here</h1>\n  <p>Including AI-generated code from ChatGPT, Claude, Gemini, or Copilot.</p>\n  <script>console.log('loaded');</script>\n</body>\n</html>`

const WIDTHS = { desktop: '100%', tablet: '768px', mobile: '390px' }
const DRAFTS_KEY = 'timesaver-playground-drafts'
const AUTOSAVE_KEY = 'timesaver-playground-autosave'
const MAX_DRAFTS = 5

// Wraps user JS so console.* and runtime errors are relayed to the parent
// via postMessage instead of vanishing into the sandboxed iframe's own
// (invisible) console — this is the "console output if technically safe"
// feature from the spec, done without breaking the sandbox.
function buildConsoleBridge() {
  return `
<script>
(function() {
  var send = function(type, args) {
    try {
      parent.postMessage({ __timesaver_console: true, type: type, args: args.map(function(a){
        try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch(e){ return String(a); }
      }) }, '*');
    } catch (e) {}
  };
  ['log','warn','error','info'].forEach(function(m){
    var orig = console[m];
    console[m] = function() { send(m, Array.prototype.slice.call(arguments)); orig && orig.apply(console, arguments); };
  });
  window.addEventListener('error', function(e) {
    send('error', [e.message + ' (line ' + e.lineno + ')']);
  });
})();
</script>`
}

function buildDoc({ mode, html, css, js, fullHtml }) {
  const bridge = buildConsoleBridge()
  if (mode === 'full') {
    // Inject the bridge right after <head> if present, else prepend it.
    if (/<head[^>]*>/i.test(fullHtml)) {
      return fullHtml.replace(/<head[^>]*>/i, m => m + bridge)
    }
    return bridge + fullHtml
  }
  return `<!DOCTYPE html><html><head>${bridge}<style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`
}

export default function PlaygroundTool() {
  const [mode, setMode] = useState('split') // 'split' | 'full'
  const [html, setHtml] = useState(EXAMPLE.html)
  const [css, setCss] = useState(EXAMPLE.css)
  const [js, setJs] = useState(EXAMPLE.js)
  const [fullHtml, setFullHtml] = useState(FULL_HTML_EXAMPLE)
  const [autoRun, setAutoRun] = useState(true)
  const [srcDoc, setSrcDoc] = useState(() =>
    buildDoc({ mode: 'split', html: EXAMPLE.html, css: EXAMPLE.css, js: EXAMPLE.js, fullHtml: FULL_HTML_EXAMPLE })
  )
  const [viewport, setViewport] = useState('desktop')
  const [previewOnly, setPreviewOnly] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [consoleLines, setConsoleLines] = useState([])
  const [drafts, setDrafts] = useState([])
  const [savedFlash, setSavedFlash] = useState(false)
  // Autosave-with-confirmation: distinct from the named "Save locally" drafts
  // list below. Never applied silently — see the mount effect and banner
  // further down. This is the "safe, predictable" combination of auto-restore
  // (A) and an explicit load workflow (B) the spec asked to choose between.
  const [restoreBanner, setRestoreBanner] = useState(null)
  const restorePendingRef = useRef(false)
  const debounceRef = useRef(null)
  const importInputRef = useRef(null)

  const run = useCallback(() => {
    setConsoleLines([])
    setSrcDoc(buildDoc({ mode, html, css, js, fullHtml }))
    trackEvent('playground_run', { mode })
  }, [mode, html, css, js, fullHtml])

  // Note: srcDoc is initialized synchronously above (not via a mount effect)
  // specifically so the iframe never renders blank on first paint — see the
  // useState initializer. Don't reintroduce a "run on mount" effect here;
  // it would just recompute the same content a frame late.
  useEffect(() => {
    if (!autoRun) return
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(run, 400)
    return () => clearTimeout(debounceRef.current)
  }, [html, css, js, fullHtml, mode, autoRun, run])

  useEffect(() => {
    function onMessage(e) {
      if (e.data && e.data.__timesaver_console) {
        setConsoleLines(lines => [...lines, { type: e.data.type, text: e.data.args.join(' ') }].slice(-50))
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    try {
      setDrafts(JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]'))
    } catch { setDrafts([]) }

    // Check for leftover work from a previous visit. Never applied
    // automatically — only offered via the banner — so a returning user
    // can never lose whatever they're currently looking at without
    // choosing to.
    try {
      const saved = JSON.parse(localStorage.getItem(AUTOSAVE_KEY) || 'null')
      const isDefault =
        !saved || (saved.html === EXAMPLE.html && saved.css === EXAMPLE.css && saved.js === EXAMPLE.js && saved.fullHtml === FULL_HTML_EXAMPLE)
      if (saved && !isDefault) {
        restorePendingRef.current = true
        setRestoreBanner(saved)
      }
    } catch { /* ignore corrupt autosave */ }
  }, [])

  // Debounced autosave — skipped while a restore decision is pending so it
  // can't overwrite the very snapshot the banner is offering to restore.
  useEffect(() => {
    if (restorePendingRef.current) return
    const t = setTimeout(() => {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ mode, html, css, js, fullHtml }))
    }, 600)
    return () => clearTimeout(t)
  }, [mode, html, css, js, fullHtml])

  function restoreAutosave() {
    if (!restoreBanner) return
    setMode(restoreBanner.mode); setHtml(restoreBanner.html); setCss(restoreBanner.css)
    setJs(restoreBanner.js); setFullHtml(restoreBanner.fullHtml)
    restorePendingRef.current = false
    setRestoreBanner(null)
  }

  function dismissAutosave() {
    restorePendingRef.current = false
    setRestoreBanner(null)
  }

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run() }
      if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) { e.preventDefault(); saveDraft() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [run, html, css, js, fullHtml, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  function saveDraft() {
    const next = [
      { id: Date.now(), mode, html, css, js, fullHtml, savedAt: new Date().toLocaleString() },
      ...drafts
    ].slice(0, MAX_DRAFTS)
    setDrafts(next)
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(next))
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1200)
  }

  function loadDraft(d) {
    setMode(d.mode); setHtml(d.html); setCss(d.css); setJs(d.js); setFullHtml(d.fullHtml)
  }

  function deleteDraft(id) {
    const next = drafts.filter(d => d.id !== id)
    setDrafts(next)
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(next))
  }

  function resetExample() {
    setHtml(EXAMPLE.html); setCss(EXAMPLE.css); setJs(EXAMPLE.js); setFullHtml(FULL_HTML_EXAMPLE)
  }

  function clearAll() {
    setHtml(''); setCss(''); setJs(''); setFullHtml('')
  }

  function format() {
    if (mode === 'full') { setFullHtml(f => formatHtml(f)); return }
    setHtml(h => formatHtml(h)); setCss(c => formatCss(c)); setJs(j => formatJs(j))
  }

  // Splits an imported .html file into HTML/CSS/JS for split mode — entirely
  // client-side via DOMParser, never uploaded anywhere. In Full HTML mode
  // the file's raw contents are used as-is instead (no splitting needed).
  function parseHtmlFile(text) {
    const doc = new DOMParser().parseFromString(text, 'text/html')
    const styleEls = [...doc.querySelectorAll('style')]
    const scriptEls = [...doc.querySelectorAll('script')]
    const parsedCss = styleEls.map(s => s.textContent).join('\n\n')
    const parsedJs = scriptEls.map(s => s.textContent).join('\n\n')
    scriptEls.forEach(s => s.remove())
    styleEls.forEach(s => s.remove())
    return { html: doc.body ? doc.body.innerHTML.trim() : '', css: parsedCss, js: parsedJs }
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // reset so importing the same filename again still fires onChange
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      if (mode === 'full') {
        setFullHtml(text)
      } else {
        const parsed = parseHtmlFile(text)
        setHtml(parsed.html); setCss(parsed.css); setJs(parsed.js)
      }
    }
    reader.readAsText(file)
  }

  function download() {
    const doc = buildDoc({ mode, html, css, js, fullHtml })
    const blob = new Blob([doc.replace(buildConsoleBridge(), '')], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'timesaver-playground.html'; a.click()
    URL.revokeObjectURL(url)
  }

  const combinedHtml = useMemo(
    () => mode === 'full' ? fullHtml : `<!DOCTYPE html>\n<html>\n<head>\n<style>\n${css}\n</style>\n</head>\n<body>\n${html}\n<script>\n${js}\n</script>\n</body>\n</html>`,
    [mode, fullHtml, html, css, js]
  )

  return (
    <div className={fullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-ink-950 p-4 overflow-auto' : ''}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="flex rounded-lg border border-ink-200 dark:border-ink-800 overflow-hidden text-xs">
          <button onClick={() => setMode('split')} className={`px-3 py-1.5 ${mode === 'split' ? 'bg-brand-600 text-white' : 'text-ink-600 dark:text-ink-300'}`}>HTML + CSS + JS</button>
          <button onClick={() => setMode('full')} className={`px-3 py-1.5 ${mode === 'full' ? 'bg-brand-600 text-white' : 'text-ink-600 dark:text-ink-300'}`}>Full HTML</button>
        </div>

        <button onClick={run} className="btn-primary">▶ Run</button>
        <label className="flex items-center gap-1.5 text-xs text-ink-500">
          <input type="checkbox" checked={autoRun} onChange={e => setAutoRun(e.target.checked)} /> Auto-run
        </label>
        <button onClick={format} className="btn-secondary">Format</button>
        <button onClick={resetExample} className="btn-ghost">Reset example</button>
        <button onClick={clearAll} className="btn-ghost">Clear</button>
        <button onClick={saveDraft} className="btn-secondary">{savedFlash ? 'Saved ✓' : 'Save locally'}</button>
        <button onClick={() => importInputRef.current?.click()} className="btn-secondary">Import HTML</button>
        <input
          ref={importInputRef}
          type="file"
          accept=".html,.htm,text/html"
          onChange={handleImportFile}
          className="hidden"
          aria-label="Import an HTML file"
        />
        <button onClick={download} className="btn-secondary">Download HTML</button>
        <button onClick={() => setPreviewOnly(p => !p)} className="btn-ghost">{previewOnly ? 'Show editor' : 'Preview only'}</button>
        <button onClick={() => setFullscreen(f => !f)} className="btn-ghost">{fullscreen ? 'Exit fullscreen' : 'Fullscreen'}</button>
      </div>

      {restoreBanner && (
        <div className="flex items-center justify-between gap-3 mb-3 text-xs rounded-lg border border-brand-200 dark:border-brand-900 bg-brand-50 dark:bg-ink-900 px-3 py-2">
          <span className="text-ink-600 dark:text-ink-300">We found unsaved work from your last visit.</span>
          <span className="flex items-center gap-2 shrink-0">
            <button onClick={restoreAutosave} className="btn-primary !py-1 !px-2.5 text-xs">Restore</button>
            <button onClick={dismissAutosave} className="btn-ghost !py-1 !px-2.5 text-xs">Discard</button>
          </span>
        </div>
      )}

      {drafts.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
          <span className="text-ink-400">Recent:</span>
          {drafts.map(d => (
            <span key={d.id} className="inline-flex items-center gap-1 rounded-full border border-ink-200 dark:border-ink-800 pl-2.5 pr-1 py-0.5">
              <button onClick={() => loadDraft(d)} className="hover:text-brand-600 dark:hover:text-brand-400">{d.savedAt}</button>
              <button onClick={() => deleteDraft(d.id)} aria-label="Delete draft" className="text-ink-400 hover:text-red-500 px-1">×</button>
            </span>
          ))}
        </div>
      )}

      <div className={`grid gap-3 ${previewOnly ? '' : 'lg:grid-cols-2'}`}>
        {!previewOnly && (
          <div className="space-y-3">
            {mode === 'split' ? (
              <>
                <EditorPanel label="HTML" value={html} onChange={setHtml} height="h-40" copyLabel="Copy HTML" />
                <EditorPanel label="CSS" value={css} onChange={setCss} height="h-40" copyLabel="Copy CSS" />
                <EditorPanel label="JavaScript" value={js} onChange={setJs} height="h-40" copyLabel="Copy JS" />
              </>
            ) : (
              <EditorPanel label="Full HTML document" value={fullHtml} onChange={setFullHtml} height="h-[34rem]" copyLabel="Copy HTML" />
            )}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex rounded-lg border border-ink-200 dark:border-ink-800 overflow-hidden text-xs">
              {Object.keys(WIDTHS).map(w => (
                <button
                  key={w}
                  onClick={() => setViewport(w)}
                  className={`px-3 py-1.5 capitalize ${viewport === w ? 'bg-brand-600 text-white' : 'text-ink-600 dark:text-ink-300'}`}
                >
                  {w}
                </button>
              ))}
            </div>
            <CopyButton getText={() => combinedHtml} label="Copy combined HTML" className="btn-ghost text-xs" />
          </div>

          <div className="card p-2 flex justify-center bg-ink-50 dark:bg-ink-900">
            <iframe
              title="Live preview"
              srcDoc={srcDoc}
              sandbox="allow-scripts"
              style={{ width: WIDTHS[viewport], height: previewOnly ? '70vh' : '24rem' }}
              className="bg-white rounded-md border border-ink-200 dark:border-ink-800"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-ink-500 mb-1">Console output</p>
            <div className="code-editor h-24 overflow-y-auto text-xs space-y-0.5">
              {consoleLines.length === 0 && <p className="text-ink-400">No output yet.</p>}
              {consoleLines.map((l, i) => (
                <p key={i} className={l.type === 'error' ? 'text-red-500' : l.type === 'warn' ? 'text-amber-500' : ''}>
                  {l.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditorPanel({ label, value, onChange, height, copyLabel }) {
  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart: s, selectionEnd: en } = e.target
      const next = value.slice(0, s) + '  ' + value.slice(en)
      onChange(next)
      requestAnimationFrame(() => { e.target.selectionStart = e.target.selectionEnd = s + 2 })
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium text-ink-500">{label}</p>
        <CopyButton getText={() => value} label={copyLabel} className="btn-ghost text-xs !px-1.5 !py-0.5" />
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className={`code-editor ${height}`}
        aria-label={label}
      />
    </div>
  )
}
