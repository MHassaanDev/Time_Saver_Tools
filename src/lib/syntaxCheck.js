// A deliberately scoped "where's the error" checker for JSON and JavaScript.
//
// Honest about its limits: it reliably finds the most common, most
// locatable syntax mistakes — mismatched/extra/missing brackets, unclosed
// strings, unclosed template literals, unclosed block comments — via its
// own character-by-character scanner (deterministic, tested, not dependent
// on inconsistent browser error internals). For everything else, it falls
// back to the browser's native JSON.parse / Function-constructor error
// message without inventing a line number it can't actually verify.
//
// Does NOT support Python/Java/C++/SQL/etc — that needs real per-language
// parsers, which is intentionally out of scope here (see project README).

function toLineCol(source, index) {
  let line = 1, col = 1
  for (let i = 0; i < index && i < source.length; i++) {
    if (source[i] === '\n') { line++; col = 1 } else { col++ }
  }
  return { line, col }
}

const PAIRS = { ')': '(', ']': '[', '}': '{' }
const OPENERS = new Set(['(', '[', '{'])

// Scans for the most common structural errors: bracket mismatches and
// unterminated strings/template literals/block comments. Returns null if
// none of these specific issues are found (caller falls back to the
// engine's own parser for anything subtler).
function scanStructural(source) {
  const stack = [] // { char, index }
  let i = 0
  const n = source.length
  while (i < n) {
    const ch = source[i]

    // Line comment
    if (ch === '/' && source[i + 1] === '/') {
      while (i < n && source[i] !== '\n') i++
      continue
    }
    // Block comment
    if (ch === '/' && source[i + 1] === '*') {
      const start = i
      i += 2
      let closed = false
      while (i < n) {
        if (source[i] === '*' && source[i + 1] === '/') { i += 2; closed = true; break }
        i++
      }
      if (!closed) {
        const { line, col } = toLineCol(source, start)
        return { line, col, message: 'Unclosed block comment (/* … */) starting here.' }
      }
      continue
    }
    // Single/double-quoted strings — not allowed to span a raw newline
    if (ch === '"' || ch === "'") {
      const quote = ch
      const start = i
      i++
      let closed = false
      while (i < n) {
        if (source[i] === '\\') { i += 2; continue }
        if (source[i] === '\n') break
        if (source[i] === quote) { closed = true; i++; break }
        i++
      }
      if (!closed) {
        const { line, col } = toLineCol(source, start)
        return { line, col, message: `Unterminated string starting with ${quote} here.` }
      }
      continue
    }
    // Template literals — CAN span multiple lines; only unterminated by EOF is an error
    if (ch === '`') {
      const start = i
      i++
      let closed = false
      while (i < n) {
        if (source[i] === '\\') { i += 2; continue }
        if (source[i] === '`') { closed = true; i++; break }
        i++
      }
      if (!closed) {
        const { line, col } = toLineCol(source, start)
        return { line, col, message: 'Unterminated template literal (`) starting here.' }
      }
      continue
    }
    // Brackets
    if (OPENERS.has(ch)) { stack.push({ char: ch, index: i }); i++; continue }
    if (ch === ')' || ch === ']' || ch === '}') {
      const top = stack.pop()
      if (!top || top.char !== PAIRS[ch]) {
        const { line, col } = toLineCol(source, i)
        return { line, col, message: `Unexpected "${ch}" — no matching "${PAIRS[ch]}" was open here.` }
      }
      i++; continue
    }
    i++
  }
  if (stack.length) {
    const top = stack[stack.length - 1]
    const { line, col } = toLineCol(source, top.index)
    const closeChar = { '(': ')', '[': ']', '{': '}' }[top.char]
    return { line, col, message: `Unclosed "${top.char}" here — expected a matching "${closeChar}" before the end of the code.` }
  }
  return null
}

export function checkJavaScript(source) {
  if (!source.trim()) return { valid: null, message: null }

  const structural = scanStructural(source)

  try {
    // Compiles (parses) without executing — a real syntax check. Does not
    // support ES module import/export syntax (Function() bodies can't use
    // it), so module code will be flagged even if it's otherwise valid —
    // stated in the tool's own UI, not hidden.
    new Function(source)
    return { valid: true, message: null }
  } catch (e) {
    if (structural) return { valid: false, positionKnown: true, ...structural }
    return { valid: false, positionKnown: false, message: e.message }
  }
}

export function checkJson(source) {
  if (!source.trim()) return { valid: null, message: null }
  try {
    JSON.parse(source)
    return { valid: true, message: null }
  } catch (e) {
    const structural = scanStructural(source)
    if (structural) return { valid: false, positionKnown: true, ...structural }

    // Firefox-style: "...at line 2 column 5 of the JSON data"
    const lc = e.message.match(/line (\d+) column (\d+)/i)
    if (lc) return { valid: false, positionKnown: true, line: Number(lc[1]), col: Number(lc[2]), message: e.message }

    // V8-style: "...at position 42"
    const pos = e.message.match(/position (\d+)/i)
    if (pos) {
      const { line, col } = toLineCol(source, Number(pos[1]))
      return { valid: false, positionKnown: true, line, col, message: e.message }
    }
    return { valid: false, positionKnown: false, message: e.message }
  }
}
