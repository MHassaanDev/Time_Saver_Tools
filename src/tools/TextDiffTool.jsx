import React, { useMemo, useState } from 'react'
import ErrorMessage from '../components/ui/ErrorMessage.jsx'

// Simple line-based LCS diff — dependency-free, genuinely useful for the
// common "compare two versions of code/config/text" case. Not word-level.
// The DP table is O(linesA × linesB) cells, so unbounded input can exhaust
// memory/freeze the tab — MAX_CELLS guards that; see diffLines() below.
const MAX_DIFF_CELLS = 4_000_000 // ~ safe up to roughly 2000x2000 lines

function diffLines(a, b) {
  const linesA = a.split('\n')
  const linesB = b.split('\n')
  const n = linesA.length, m = linesB.length
  if (n * m > MAX_DIFF_CELLS) return { tooLarge: true, lines: [] }
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = linesA[i] === linesB[j] ? dp[i+1][j+1] + 1 : Math.max(dp[i+1][j], dp[i][j+1])
    }
  }
  const result = []
  let i = 0, j = 0
  while (i < n && j < m) {
    if (linesA[i] === linesB[j]) { result.push({ type: 'same', text: linesA[i] }); i++; j++ }
    else if (dp[i+1][j] >= dp[i][j+1]) { result.push({ type: 'removed', text: linesA[i] }); i++ }
    else { result.push({ type: 'added', text: linesB[j] }); j++ }
  }
  while (i < n) { result.push({ type: 'removed', text: linesA[i] }); i++ }
  while (j < m) { result.push({ type: 'added', text: linesB[j] }); j++ }
  return { tooLarge: false, lines: result }
}

export default function TextDiffTool() {
  const [a, setA] = useState('function greet(name) {\n  console.log("Hi " + name);\n}')
  const [b, setB] = useState('function greet(name) {\n  console.log(`Hello, ${name}!`);\n  return true;\n}')

  const diff = useMemo(() => diffLines(a, b), [a, b])
  const added = diff.lines.filter(d => d.type === 'added').length
  const removed = diff.lines.filter(d => d.type === 'removed').length

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-ink-500 block mb-1">Original</label>
          <textarea value={a} onChange={e => setA(e.target.value)} spellCheck={false} className="code-editor h-40" aria-label="Original text" />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500 block mb-1">Changed</label>
          <textarea value={b} onChange={e => setB(e.target.value)} spellCheck={false} className="code-editor h-40" aria-label="Changed text" />
        </div>
      </div>

      {diff.tooLarge ? (
        <ErrorMessage>
          These texts are too large to diff in the browser reliably (this comparison would use excessive memory). Try comparing smaller sections.
        </ErrorMessage>
      ) : (
        <>
          <p className="text-xs text-ink-500">
            <span className="text-green-600 dark:text-green-400">+{added} added</span>{'  '}
            <span className="text-red-600 dark:text-red-400">−{removed} removed</span>
          </p>

          <div className="code-editor overflow-auto max-h-80">
            {diff.lines.map((line, i) => (
              <div
                key={i}
                className={
                  line.type === 'added' ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400' :
                  line.type === 'removed' ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400' : ''
                }
              >
                {line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}{line.text}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
