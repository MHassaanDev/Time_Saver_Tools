import React, { useEffect, useMemo, useRef, useState } from 'react'
import { trackEvent } from '../lib/analytics.js'

const STORAGE_KEY = 'timesaver-cv-builder'
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()))

const SECTION_LABELS = {
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects'
}

function defaultCv() {
  return {
    personal: { name: '', title: '', email: '', phone: '', location: '', website: '' },
    summary: '',
    sectionOrder: ['experience', 'education', 'skills', 'projects'],
    experience: [{ id: uid(), role: '', company: '', start: '', end: '', description: '' }],
    education: [{ id: uid(), school: '', degree: '', start: '', end: '' }],
    skills: [],
    projects: [{ id: uid(), name: '', description: '', link: '' }]
  }
}

function loadInitial() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved && saved.personal) return saved
  } catch { /* ignore corrupt save */ }
  return defaultCv()
}

export default function CvBuilderTool() {
  const [cv, setCv] = useState(loadInitial)
  const [view, setView] = useState('write') // mobile: 'write' | 'preview'
  const [skillInput, setSkillInput] = useState('')
  const dragIndexRef = useRef(null)
  const importRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(cv)), 500)
    return () => clearTimeout(t)
  }, [cv])

  function updatePersonal(field, value) {
    setCv(c => ({ ...c, personal: { ...c.personal, [field]: value } }))
  }

  function updateList(key, id, field, value) {
    setCv(c => ({ ...c, [key]: c[key].map(item => item.id === id ? { ...item, [field]: value } : item) }))
  }
  function addItem(key, blank) {
    setCv(c => ({ ...c, [key]: [...c[key], { id: uid(), ...blank }] }))
  }
  function removeItem(key, id) {
    setCv(c => ({ ...c, [key]: c[key].filter(item => item.id !== id) }))
  }
  function moveItem(key, id, dir) {
    setCv(c => {
      const list = [...c[key]]
      const i = list.findIndex(x => x.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= list.length) return c
      ;[list[i], list[j]] = [list[j], list[i]]
      return { ...c, [key]: list }
    })
  }

  function addSkill() {
    const value = skillInput.trim()
    if (!value) return
    setCv(c => ({ ...c, skills: [...c.skills, value] }))
    setSkillInput('')
  }
  function removeSkill(i) {
    setCv(c => ({ ...c, skills: c.skills.filter((_, idx) => idx !== i) }))
  }

  // Section-level drag-and-drop reordering (Experience/Education/Skills/
  // Projects blocks). Within a section, entries reorder via the ↑/↓ buttons
  // above instead of drag-and-drop — more fiddly to get reliable nested
  // drag-and-drop working than it's worth for a first version; this still
  // gives full reordering control, just via a button instead of a drag.
  function handleSectionDrop(targetIndex) {
    const sourceIndex = dragIndexRef.current
    if (sourceIndex === null || sourceIndex === targetIndex) return
    setCv(c => {
      const order = [...c.sectionOrder]
      const [moved] = order.splice(sourceIndex, 1)
      order.splice(targetIndex, 0, moved)
      return { ...c, sectionOrder: order }
    })
    dragIndexRef.current = null
  }

  function resetAll() {
    if (!confirm('Clear all CV data? This can\u2019t be undone.')) return
    setCv(defaultCv())
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(cv, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'cv-data.json'; a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportJson(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'))
        if (parsed && parsed.personal) setCv(parsed)
        else alert('That file doesn\u2019t look like a CV export from this tool.')
      } catch {
        alert('Couldn\u2019t read that file as JSON.')
      }
    }
    reader.readAsText(file)
  }

  function printCv() {
    trackEvent('cv_print')
    window.print()
  }

  const p = cv.personal

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <div className="flex rounded-lg border border-ink-200 dark:border-ink-800 overflow-hidden text-xs sm:hidden">
          <button onClick={() => setView('write')} className={`px-3 py-1.5 ${view === 'write' ? 'bg-brand-600 text-white' : ''}`}>Edit</button>
          <button onClick={() => setView('preview')} className={`px-3 py-1.5 ${view === 'preview' ? 'bg-brand-600 text-white' : ''}`}>Preview</button>
        </div>
        <button onClick={printCv} className="btn-primary">Print / Save as PDF</button>
        <button onClick={downloadJson} className="btn-secondary">Export JSON</button>
        <button onClick={() => importRef.current?.click()} className="btn-secondary">Import JSON</button>
        <input ref={importRef} type="file" accept="application/json" onChange={handleImportJson} className="hidden" aria-label="Import CV JSON" />
        <button onClick={resetAll} className="btn-ghost">Clear all</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* FORM */}
        <div className={`space-y-4 ${view === 'preview' ? 'hidden sm:block' : ''} print:hidden`}>
          <div className="card p-3 space-y-2">
            <h2 className="text-sm font-semibold">Personal information</h2>
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Full name" value={p.name} onChange={e => updatePersonal('name', e.target.value)} className="code-editor !h-auto py-1.5 col-span-2" />
              <input placeholder="Title (e.g. Frontend Developer)" value={p.title} onChange={e => updatePersonal('title', e.target.value)} className="code-editor !h-auto py-1.5 col-span-2" />
              <input placeholder="Email" value={p.email} onChange={e => updatePersonal('email', e.target.value)} className="code-editor !h-auto py-1.5" />
              <input placeholder="Phone" value={p.phone} onChange={e => updatePersonal('phone', e.target.value)} className="code-editor !h-auto py-1.5" />
              <input placeholder="Location" value={p.location} onChange={e => updatePersonal('location', e.target.value)} className="code-editor !h-auto py-1.5" />
              <input placeholder="Website / portfolio" value={p.website} onChange={e => updatePersonal('website', e.target.value)} className="code-editor !h-auto py-1.5" />
            </div>
          </div>

          <div className="card p-3 space-y-2">
            <h2 className="text-sm font-semibold">Summary</h2>
            <textarea placeholder="A 2–3 sentence professional summary…" value={cv.summary} onChange={e => setCv(c => ({ ...c, summary: e.target.value }))} className="code-editor h-20" />
          </div>

          <p className="text-xs text-ink-400 print:hidden">Drag a section by its ⠿ handle to reorder it in the preview.</p>

          {cv.sectionOrder.map((key, index) => (
            <div
              key={key}
              draggable
              onDragStart={() => { dragIndexRef.current = index }}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleSectionDrop(index)}
              className="card p-3 space-y-2"
            >
              <h2 className="text-sm font-semibold flex items-center gap-2 cursor-grab active:cursor-grabbing">
                <span aria-hidden="true">⠿</span> {SECTION_LABELS[key]}
              </h2>

              {key === 'experience' && cv.experience.map(item => (
                <div key={item.id} className="border border-ink-200 dark:border-ink-800 rounded-lg p-2 space-y-1.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <input placeholder="Role" value={item.role} onChange={e => updateList('experience', item.id, 'role', e.target.value)} className="code-editor !h-auto py-1 text-xs" />
                    <input placeholder="Company" value={item.company} onChange={e => updateList('experience', item.id, 'company', e.target.value)} className="code-editor !h-auto py-1 text-xs" />
                    <input placeholder="Start (e.g. 2023)" value={item.start} onChange={e => updateList('experience', item.id, 'start', e.target.value)} className="code-editor !h-auto py-1 text-xs" />
                    <input placeholder="End (or Present)" value={item.end} onChange={e => updateList('experience', item.id, 'end', e.target.value)} className="code-editor !h-auto py-1 text-xs" />
                  </div>
                  <textarea placeholder="What did you do?" value={item.description} onChange={e => updateList('experience', item.id, 'description', e.target.value)} className="code-editor h-16 text-xs" />
                  <ItemControls onUp={() => moveItem('experience', item.id, -1)} onDown={() => moveItem('experience', item.id, 1)} onRemove={() => removeItem('experience', item.id)} />
                </div>
              ))}
              {key === 'experience' && (
                <button onClick={() => addItem('experience', { role: '', company: '', start: '', end: '', description: '' })} className="btn-ghost text-xs">+ Add experience</button>
              )}

              {key === 'education' && cv.education.map(item => (
                <div key={item.id} className="border border-ink-200 dark:border-ink-800 rounded-lg p-2 space-y-1.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <input placeholder="School" value={item.school} onChange={e => updateList('education', item.id, 'school', e.target.value)} className="code-editor !h-auto py-1 text-xs col-span-2" />
                    <input placeholder="Degree / field" value={item.degree} onChange={e => updateList('education', item.id, 'degree', e.target.value)} className="code-editor !h-auto py-1 text-xs col-span-2" />
                    <input placeholder="Start" value={item.start} onChange={e => updateList('education', item.id, 'start', e.target.value)} className="code-editor !h-auto py-1 text-xs" />
                    <input placeholder="End" value={item.end} onChange={e => updateList('education', item.id, 'end', e.target.value)} className="code-editor !h-auto py-1 text-xs" />
                  </div>
                  <ItemControls onUp={() => moveItem('education', item.id, -1)} onDown={() => moveItem('education', item.id, 1)} onRemove={() => removeItem('education', item.id)} />
                </div>
              ))}
              {key === 'education' && (
                <button onClick={() => addItem('education', { school: '', degree: '', start: '', end: '' })} className="btn-ghost text-xs">+ Add education</button>
              )}

              {key === 'skills' && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {cv.skills.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs rounded-full bg-ink-100 dark:bg-ink-800 px-2.5 py-1">
                        {s}
                        <button onClick={() => removeSkill(i)} aria-label={`Remove ${s}`} className="text-ink-400 hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      placeholder="Add a skill and press Enter"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="code-editor !h-auto py-1.5 flex-1 text-xs"
                    />
                    <button onClick={addSkill} className="btn-secondary text-xs">Add</button>
                  </div>
                </div>
              )}

              {key === 'projects' && cv.projects.map(item => (
                <div key={item.id} className="border border-ink-200 dark:border-ink-800 rounded-lg p-2 space-y-1.5">
                  <input placeholder="Project name" value={item.name} onChange={e => updateList('projects', item.id, 'name', e.target.value)} className="code-editor !h-auto py-1 text-xs" />
                  <textarea placeholder="What is it?" value={item.description} onChange={e => updateList('projects', item.id, 'description', e.target.value)} className="code-editor h-14 text-xs" />
                  <input placeholder="Link (optional)" value={item.link} onChange={e => updateList('projects', item.id, 'link', e.target.value)} className="code-editor !h-auto py-1 text-xs" />
                  <ItemControls onUp={() => moveItem('projects', item.id, -1)} onDown={() => moveItem('projects', item.id, 1)} onRemove={() => removeItem('projects', item.id)} />
                </div>
              ))}
              {key === 'projects' && (
                <button onClick={() => addItem('projects', { name: '', description: '', link: '' })} className="btn-ghost text-xs">+ Add project</button>
              )}
            </div>
          ))}
        </div>

        {/* PREVIEW */}
        <div className={view === 'write' ? 'hidden sm:block print:block' : 'print:block'}>
          <div id="cv-print-area" className="card cv-preview p-6 sm:p-8 bg-white text-ink-900">
            <h1 className="text-2xl font-bold">{p.name || 'Your Name'}</h1>
            {p.title && <p className="text-brand-700 font-medium">{p.title}</p>}
            <p className="text-xs text-ink-500 mt-1">
              {[p.email, p.phone, p.location, p.website].filter(Boolean).join('  ·  ')}
            </p>

            {cv.summary && <p className="mt-4">{cv.summary}</p>}

            {cv.sectionOrder.map(key => {
              const hasContent =
                (key === 'experience' && cv.experience.some(x => x.role || x.company)) ||
                (key === 'education' && cv.education.some(x => x.school)) ||
                (key === 'skills' && cv.skills.length > 0) ||
                (key === 'projects' && cv.projects.some(x => x.name))
              if (!hasContent) return null
              return (
              <PreviewSection key={key} title={SECTION_LABELS[key]}>
                {key === 'experience' && cv.experience.filter(x => x.role || x.company).map(item => (
                  <div key={item.id} className="mb-2.5">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{item.role}{item.company ? ` — ${item.company}` : ''}</span>
                      <span className="text-ink-400 font-normal text-xs">{[item.start, item.end].filter(Boolean).join(' – ')}</span>
                    </div>
                    {item.description && <p className="text-sm text-ink-600">{item.description}</p>}
                  </div>
                ))}
                {key === 'education' && cv.education.filter(x => x.school).map(item => (
                  <div key={item.id} className="mb-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{item.school}</span>
                      <span className="text-ink-400 font-normal text-xs">{[item.start, item.end].filter(Boolean).join(' – ')}</span>
                    </div>
                    {item.degree && <p className="text-sm text-ink-600">{item.degree}</p>}
                  </div>
                ))}
                {key === 'skills' && cv.skills.length > 0 && (
                  <p className="text-sm">{cv.skills.join(' · ')}</p>
                )}
                {key === 'projects' && cv.projects.filter(x => x.name).map(item => (
                  <div key={item.id} className="mb-2">
                    <p className="text-sm font-semibold">
                      {item.name} {item.link && <a href={item.link} className="text-brand-600 font-normal text-xs">({item.link})</a>}
                    </p>
                    {item.description && <p className="text-sm text-ink-600">{item.description}</p>}
                  </div>
                ))}
              </PreviewSection>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function ItemControls({ onUp, onDown, onRemove }) {
  return (
    <div className="flex justify-end gap-1">
      <button onClick={onUp} aria-label="Move up" className="btn-ghost !p-1 text-xs">↑</button>
      <button onClick={onDown} aria-label="Move down" className="btn-ghost !p-1 text-xs">↓</button>
      <button onClick={onRemove} aria-label="Remove" className="btn-ghost !p-1 text-xs text-red-500">Remove</button>
    </div>
  )
}

function PreviewSection({ title, children }) {
  return (
    <div className="mt-4">
      <h2 className="text-xs font-bold uppercase tracking-wide text-ink-400 border-b border-ink-200 pb-1 mb-2">{title}</h2>
      {children}
    </div>
  )
}
