# TimeSaver Tools

**Get it done. Faster.** — free, browser-based tools. No backend. No signup.
Started as developer tools; now also covers documents (Markdown, CV) —
architecture is ready for more categories (image/PDF/etc.) later.

## Quick start
```bash
npm install
npm run dev      # local dev server
npm run build    # production build → /dist (static files, deploy as-is)
npm run preview  # preview the production build locally
```
Deploys as static files to Cloudflare Pages (or Netlify/Vercel/any static
host) — `npm run build` output in `/dist` is the entire deployable site.

**Verified this update:** `npm install && npm run build` completes cleanly
(79 modules, ~72KB gzipped core bundle, every new tool code-split into its
own small chunk). The trickiest new logic was independently tested against
real inputs before shipping — see "What's new" below for specifics.

## What's new in this update
**Homepage title was genuinely too short for SEO (a real, valid catch).**
It was composing to just "TimeSaver Tools" — 16 characters, well under the
recommended ~50–60. Fixed: the homepage `<title>` now reads "All-in-One
Free Online Tools & Utilities — TimeSaver Tools" (58 characters), and the
static `index.html` title/description (what crawlers see before JS
hydrates) now matches exactly rather than drifting from the dynamic one.
`/tools` page title and meta description updated the same way.

**Broadened on-page copy beyond "developer tools."** The homepage H1, CTA
buttons, section headings, and search placeholder no longer say "Developer
Tools" specifically — the site's own tool list now genuinely includes
general-audience tools (Markdown Editor, CV Builder), so the copy catching
up to that is an accuracy fix, not just a keyword play. "No sign-up" is
mentioned once, at the end of the subheading — a real feature, not the
headline.

**`docs/off-page-seo-recommendations.md`** — legitimate backlink/off-page
strategy for this specific kind of site (tool directories, developer
community presence, content that earns links on its own) with an explicit
section on what NOT to do (link schemes, PBNs, mass directory submission —
all real risks, not just rule-following for its own sake).

## What's new in the previous update
**JWT Encoder, built into the same tool.** `/tools/jwt-decoder` (URL kept
for SEO continuity) now has Decode/Encode tabs. Encoding signs with
HS256/HS384/HS512 via the Web Crypto API — **verified against the standard
jwt.io HS256 test vector byte-for-byte before shipping**, not just "looks
right." Algorithms needing a private key (RS256, ES256, etc.) are
deliberately not offered — there's nowhere safe for a private key to live
in a static client-side tool, so rather than fake it, the tool says so.

**Auto-generated sitemap.xml.** `scripts/generate-sitemap.mjs` runs
automatically before every build (`npm run build` → `prebuild` hook) and
derives the full URL list from the tool registry itself — adding tool #19
means it's in the sitemap on the next build with zero manual steps. Also
keeps `robots.txt`'s `Sitemap:` line pointed at the same domain as
`SITE.url`, so the two can't drift out of sync. Verified: deleted
`public/sitemap.xml`, ran a full `npm run build`, confirmed it reappeared
in `dist/` with all 24 URLs (18 tools + 6 static pages).

**Scroll position fix (real bug, not cosmetic).** React Router doesn't
reset scroll position on navigation by default — clicking a Related Tools
link while scrolled down landed you on the new tool's page at the same
pixel depth, which read as "did anything even change?" Fixed in `App.jsx`:
scrolls to top on an actual navigation (clicking a link), but deliberately
**not** on browser Back/Forward, where jumping to the top would fight the
better-expected behavior of returning you to where you were.

## What's new in the previous update
**Brand:** added the requested compact "TS" mark (`LogoCompact` in
`src/components/logo/Logo.jsx`) — used on small screens/mobile nav and as
the favicon, alongside the existing full stopwatch wordmark on larger
screens.

**Playground — Import HTML.** A new "Import HTML" button reads a local
`.html` file and, in split mode, splits it into HTML/CSS/JS via `DOMParser`
(never uploaded anywhere); in Full HTML mode it loads the file as-is.

**Three new tools:**
- **Markdown Editor** (`/tools/markdown-editor`) — a from-scratch,
  dependency-free Markdown → HTML renderer (`src/lib/markdown.js`), a
  drag-and-drop block palette (drag or click to insert Headings, Lists,
  Tables, etc. at your cursor), live preview, and Copy/Download (.md/.html)/
  Import. Covers headings, bold/italic/strikethrough, links, images, lists,
  checklists, blockquotes, fenced code blocks, inline code, tables, and
  horizontal rules — not a full CommonMark implementation, and says so in
  its own UI. **Tested against a real sample covering every supported
  syntax element, including an XSS attempt** (raw `<script>` in the source
  renders as escaped text, not executable markup) — this actually caught
  two real bugs before shipping: escaping the whole document upfront (before
  parsing) was destroying the literal `>` and `"` characters that blockquote
  and titled-link parsing depend on. Fixed by moving escaping to the
  text-leaf level instead.
- **CV / Resume Builder** (`/tools/cv-builder`) — instant form-based editing
  with a live preview, drag-to-reorder sections (Experience/Education/
  Skills/Projects — drag by the ⠿ handle), per-entry ↑/↓/Remove controls,
  autosave to local storage, JSON export/import for backup/portability, and
  Print/Save-as-PDF (a dedicated print stylesheet shows only the CV, not the
  app chrome). One clean template for now — more styles are a natural
  follow-up, not built this round to keep scope real.
- **Syntax Error Checker** (`/tools/syntax-error-checker`) — JavaScript and
  JSON only, deliberately: reliably finding syntax errors in arbitrary
  languages needs real per-language parsers, which is a separate, larger
  piece of work (see "What's next"). Built as its own tested module
  (`src/lib/syntaxCheck.js`): a hand-written, string/comment-aware bracket
  and quote scanner reliably locates the most common errors (unclosed/
  mismatched brackets, unterminated strings) with an exact line and column;
  for subtler grammar errors it falls back to the browser's own parser
  message rather than fabricating a position it can't verify. **Verified
  against 10 cases** including three deliberate false-positive traps
  (a brace inside a string, a bracket inside a comment, a valid multi-line
  template literal) — none of them incorrectly flagged as errors.

**Google Analytics — actually wired, not just documented.**
`src/config/analytics.js` + `src/lib/analytics.js`: a GA4 loader that only
activates once a real Measurement ID is set (same disabled-by-default
pattern as `config/ads.js`), loads asynchronously, and manually sends a
pageview on every SPA route change (a real gap in naive GA+SPA setups,
since gtag's automatic pageview only fires once). Three example events
(`playground_run`, `cv_print`, `markdown_download`) demonstrate the pattern
— none of them send actual tool content, only that the action happened.

**`docs/adsense.md`** — the full guide: connecting Analytics, connecting
AdSense end-to-end, and a realistic, labeled-estimate explanation of how a
site like this actually earns money (the RPM/traffic/geography mechanics,
realistic timelines, what actually moves revenue vs. what's a smaller
lever). Distinct from the more technical `docs/adsense-integration.md`
(which covers the code-level wiring).

## What's next (still not built — see the full brief for scope)
A full multi-language code formatter/checker suite (Python, Java, C/C++,
SQL, etc. with real parsers) is still a separate, larger piece of work —
the Syntax Checker above intentionally covers JS/JSON only rather than
faking broader support.

## Why React here (and why that's fine for a no-backend, SEO-focused site)
Still 100% static output — `npm run build` produces plain HTML/CSS/JS with
no server needed. The one honest trade-off: this is a client-rendered SPA,
so it leans more on Googlebot's JS rendering for SEO than pages that are
static HTML from the first byte.

## Why no Monaco/CodeMirror, no Prettier, no icon library, no markdown library
All would add real weight for features that are secondary to the actual
tools, and the build target is Lighthouse 95–100. Code editors are styled
`<textarea>` elements; formatters are honest, lightweight re-indenters;
icons are inline SVG or monospace monograms; MD5 and the Markdown renderer
are from-scratch implementations, each independently tested rather than
assumed correct.

## Project structure
```
src/
  config/         site.js (name/domain/tagline/contact), ads.js (AdSense),
                  analytics.js (GA4) — the ONLY places these are hardcoded
  lib/            toolRegistry.js (source of truth for every tool),
                  toolContent.js (how-to/FAQ per tool), useSEO.js,
                  basicFormat.js, md5.js, markdown.js, syntaxCheck.js,
                  analytics.js (GA4 loader/tracker)
  components/
    layout/       Header, Footer, Layout, ThemeToggle, SearchModal (Ctrl+K)
    ui/           CopyButton, Breadcrumbs, AdSlot, ToolCard, RelatedTools, ErrorMessage
    logo/         Logo.jsx (LogoMark / LogoWithText / LogoCompact "TS")
  pages/          Home, ToolsIndex, ToolPage (generic per-tool template), About,
                  Privacy, Terms, Contact, NotFound
  tools/          One component per tool (15 files cover all 18 routes)
public/           robots.txt, ads.txt (placeholder)
docs/             adsense.md (this round's guide), adsense-integration.md
                  (code-level wiring), brand-and-domain.md
```

## How to add tool #19
1. Add one object to `TOOLS` in `src/lib/toolRegistry.js` — a `categories`
   array (top-level category from `CATEGORIES` + an optional sub-tag), a
   `status`, and a `lazy()` import.
2. Add one entry to `src/lib/toolContent.js`.
3. Build the component in `src/tools/`.

Nothing else changes — homepage, `/tools` index, search, routing, SEO
metadata, structured data, and category nav all read from the registry
automatically (verified: adding the two Document Tools above made a brand
new "Document Tools" nav category appear with zero UI code changes).

## The 18 tools
HTML CSS JS Playground · JSON Formatter · JSON Validator · Base64 Encoder/Decoder
· URL Encoder/Decoder · UUID Generator · JWT Encoder/Decoder · Regex Tester ·
HTML Formatter · CSS Formatter · JavaScript Formatter · Hash Generator
(MD5/SHA-1/SHA-256/SHA-512) · Color Converter · Timestamp Converter ·
Text Diff Checker · Markdown Editor · CV/Resume Builder · Syntax Error Checker.

## Privacy
Every tool above processes data 100% client-side — verified in code, not
just claimed. `src/pages/Privacy.jsx` lists every tool by name and updates
automatically if the tool list changes.
