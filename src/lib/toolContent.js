// Genuine, tool-specific SEO content — separated from toolRegistry.js so
// that file stays scannable. Deliberately short and specific per tool
// rather than templated filler; see the spec's repeated "no thin pages"
// requirement. Add an entry here whenever a new tool is added; ToolPage.jsx
// renders it below the tool itself.
export const TOOL_CONTENT = {
  'playground': {
    howTo: [
      'Choose a mode: paste a complete HTML document, or use separate HTML/CSS/JS editors.',
      'Click Run (or leave Auto-run on) to render the result in the sandboxed preview pane.',
      'Switch between desktop, tablet, and mobile preview widths to check responsiveness.',
      'Copy or download the combined HTML once you\u2019re happy with it.'
    ],
    faqs: [
      { q: 'Is my code uploaded anywhere?', a: 'No. Everything is combined and rendered locally in a sandboxed iframe inside your own browser.' },
      { q: 'Can I preview AI-generated code from ChatGPT, Claude, Gemini, or Copilot?', a: 'Yes — paste the full HTML file an AI assistant gave you into the "Full HTML" mode and click Run.' },
      { q: 'Why is the preview sandboxed?', a: 'The preview runs in an iframe with a restrictive sandbox so pasted code can\u2019t access or affect the rest of the page — a safety measure, not a limitation you need to work around.' }
    ]
  },
  'json-formatter': {
    howTo: ['Paste your JSON into the input box.', 'Click Format.', 'Copy the readable, indented result.'],
    faqs: [
      { q: 'Is my JSON uploaded?', a: 'No — formatting happens locally using your browser\u2019s built-in JSON parser.' },
      { q: 'Why does it say my JSON is invalid?', a: 'The most common causes are trailing commas, single-quoted keys, or unquoted keys — all valid in JavaScript object literals, but not in JSON.' }
    ]
  },
  'json-validator': {
    howTo: ['Paste your JSON.', 'Click Validate.', 'If invalid, read the specific error and location shown.'],
    faqs: [
      { q: 'What\u2019s the difference between this and a JS object literal?', a: 'JSON requires double-quoted keys and strings, and doesn\u2019t allow trailing commas or comments — a valid JS object can still be invalid JSON.' },
      { q: 'Does this fix my JSON automatically?', a: 'No — it tells you exactly what\u2019s wrong so you can fix it. Use the JSON Formatter afterward to reformat valid JSON.' }
    ]
  },
  'base64-encoder-decoder': {
    howTo: ['Choose Encode or Decode.', 'Paste your text.', 'Copy the result. Toggle "URL-safe" if you need `-`/`_` instead of `+`/`/`.'],
    faqs: [
      { q: 'Is Base64 encryption?', a: 'No — Base64 is an encoding, not encryption. It\u2019s trivially reversible by anyone and provides no security or confidentiality.' },
      { q: 'Does this handle emoji and accented characters correctly?', a: 'Yes — text is UTF-8 encoded before Base64 conversion, so round-tripping non-ASCII text works correctly.' }
    ]
  },
  'url-encoder-decoder': {
    howTo: ['Choose Encode or Decode.', 'Paste your text or URL.', 'Pick "Component" (encode everything) or "Full URI" (preserve `/`, `:`, etc.) when encoding.'],
    faqs: [
      { q: 'Which mode should I use?', a: 'Use Component mode for a single query value (e.g., a search term). Use Full URI mode when encoding an entire URL that should keep its structure characters intact.' },
      { q: 'Why did decoding fail?', a: 'The input likely contains a stray "%" not followed by two valid hex digits — check for a partially-encoded or corrupted string.' }
    ]
  },
  'uuid-generator': {
    howTo: ['Set how many UUIDs you want (1–1000).', 'Click Generate.', 'Copy one or all.'],
    faqs: [
      { q: 'Are these UUIDs actually unique?', a: 'UUID v4 values are generated from 122 random bits using your browser\u2019s cryptographically secure random source — collisions are astronomically unlikely.' },
      { q: 'Can I use these as database primary keys?', a: 'Yes, that\u2019s a common use case — just be aware v4 UUIDs are larger and less index-friendly than auto-incrementing integers at very high scale.' }
    ]
  },
  'jwt-decoder': {
    howTo: ['Paste a JWT.', 'The header and payload decode automatically.', 'Review the claims — expiry (exp), issuer (iss), subject (sub), etc.'],
    faqs: [
      { q: 'Does this verify the signature?', a: 'No — this tool only decodes the header and payload (which are Base64URL, not encrypted). It does not verify the signature, which requires the secret or public key.' },
      { q: 'Is it safe to paste a real production token here?', a: 'Decoding happens locally and nothing is transmitted, but as a general rule, avoid pasting real production secrets/tokens into any third-party tool, this one included — use a test token where possible.' }
    ]
  },
  'regex-tester': {
    howTo: ['Enter your pattern and flags.', 'Paste sample text.', 'Matches highlight live; expand a match to see its capture groups.'],
    faqs: [
      { q: 'Which regex flavor does this use?', a: 'Native JavaScript regex (the same engine your browser and Node.js use) — not PCRE or another language\u2019s flavor, which can differ in subtle ways.' },
      { q: 'Why isn\u2019t my pattern matching?', a: 'Check your flags first (missing "g" only shows the first match; missing "i" makes it case-sensitive) — this is the most common cause.' }
    ]
  },
  'html-formatter': {
    howTo: ['Paste minified or messy HTML.', 'Click Format.', 'Copy the re-indented result.'],
    faqs: [{ q: 'Does this validate my HTML?', a: 'No — it re-indents for readability only. For full HTML validation, W3C\u2019s validator is a better fit.' }]
  },
  'css-formatter': {
    howTo: ['Paste minified or messy CSS.', 'Click Format.', 'Copy the re-indented result.'],
    faqs: [{ q: 'Does this support SCSS/LESS syntax?', a: 'It handles plain CSS reliably; nested preprocessor syntax may not indent perfectly.' }]
  },
  'javascript-formatter': {
    howTo: ['Paste minified or messy JavaScript.', 'Click Format.', 'Copy the re-indented result.'],
    faqs: [{ q: 'Will this format modern syntax (arrow functions, JSX, etc.)?', a: 'Basic re-indentation works across modern syntax, but this is a lightweight formatter, not a full AST-based one like Prettier — complex JSX may not be perfect.' }]
  },
  'hash-generator': {
    howTo: ['Paste your text.', 'Choose an algorithm.', 'Copy the resulting hash.'],
    faqs: [
      { q: 'Is MD5 secure?', a: 'No — MD5 (and SHA-1) are broken for security purposes and shouldn\u2019t be used for passwords or anything security-sensitive. They\u2019re included here for checksums and legacy compatibility only.' },
      { q: 'Which algorithm should I use for a checksum?', a: 'SHA-256 is a solid modern default if the tool/system you\u2019re comparing against supports it; use MD5/SHA-1 only if you specifically need to match a legacy system.' }
    ]
  },
  'color-converter': {
    howTo: ['Enter a color in any format (or use the picker).', 'The equivalent HEX, RGB, and HSL values update automatically.'],
    faqs: [{ q: 'When should I use HSL instead of RGB?', a: 'HSL is often easier to reason about for adjusting lightness or saturation of an existing color, since those are separate, independent values.' }]
  },
  'timestamp-converter': {
    howTo: ['Enter a Unix timestamp to convert it to a date, or pick a date to get its timestamp.', 'Toggle between seconds and milliseconds, and between local time and UTC.'],
    faqs: [{ q: 'Seconds or milliseconds?', a: 'Unix timestamps are traditionally in seconds; JavaScript\u2019s Date.now() returns milliseconds. Use the toggle if your numbers look 1000x off.' }]
  },
  'text-diff-checker': {
    howTo: ['Paste the original text on the left and the changed text on the right.', 'Added, removed, and unchanged lines are highlighted automatically.'],
    faqs: [{ q: 'Does this do word-level or line-level diffing?', a: 'Line-level — it compares your two texts line by line, which covers most code/config/document comparison needs.' }]
  },
  'markdown-editor': {
    howTo: [
      'Write Markdown in the left panel — the preview on the right updates live.',
      'Drag a block from the palette (Heading, List, Table, etc.) into the editor, or just click it to insert at your cursor.',
      'Export with Copy Markdown, Download .md, or Download .html once you\u2019re done.'
    ],
    faqs: [
      { q: 'Does this support every Markdown feature?', a: 'It covers the common set — headings, bold/italic/strikethrough, links, images, lists, checklists, blockquotes, code blocks, tables, and horizontal rules. It\u2019s a lightweight renderer, not a full CommonMark implementation (no nested lists or footnotes, for example).' },
      { q: 'Is raw HTML I type treated as HTML?', a: 'No — for safety, any HTML you type is shown as literal text in the preview rather than executed. This is intentional.' }
    ]
  },
  'cv-builder': {
    howTo: [
      'Fill in your personal info, summary, and section entries on the left — the preview updates instantly.',
      'Drag a section by its \u2820 handle to reorder Experience/Education/Skills/Projects in the preview.',
      'Use Print / Save as PDF when you\u2019re ready, and Export JSON to back up your data (Import JSON restores it later, on any device).'
    ],
    faqs: [
      { q: 'Is my CV data sent anywhere?', a: 'No — it\u2019s saved only in your browser\u2019s local storage and updates as you type. Nothing is uploaded. Export the JSON backup if you want a copy outside the browser, or before clearing your browser data.' },
      { q: 'How many CV templates are there?', a: 'One clean, professional layout for now, with drag-to-reorder sections — more template styles may be added later based on demand.' }
    ]
  },
  'syntax-checker': {
    howTo: ['Choose JavaScript or JSON.', 'Paste your code.', 'Click Check syntax — you\u2019ll get either a clean bill of health or the specific line/column of the problem.'],
    faqs: [
      { q: 'Does this support Python, Java, C++, or other languages?', a: 'Not yet — reliable syntax checking for those needs a real language parser, which is a larger, separate piece of work. This tool covers JavaScript and JSON only, and says so rather than faking support for anything else.' },
      { q: 'Why does it sometimes say the exact position isn\u2019t available?', a: 'For structural problems (unclosed brackets/strings, mismatched brackets) it always gives you an exact line and column. For subtler grammar errors, it falls back to your browser\u2019s own error message, which doesn\u2019t always include a reliable position — shown honestly rather than guessed.' }
    ]
  }
}
