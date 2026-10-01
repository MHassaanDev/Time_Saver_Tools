# Google Analytics + AdSense — Full Setup & Earning Guide

This is the practical, step-by-step version. For the code-level wiring
details (which file, which line), see `docs/adsense-integration.md` — this
guide is the "what to do and in what order, and what to actually expect"
version.

**Labeling used throughout:** 🟢 official/verifiable fact · 🟡 consistent
community reporting, not an official number · 🔵 a decision specific to
this project.

---

## Part 1 — Connect Google Analytics (do this first, it's free and instant)

Analytics tells you whether anyone's actually using the site before you
build a business case around it — set this up before worrying about AdSense
at all.

1. **Create a GA4 property.** Go to [analytics.google.com](https://analytics.google.com),
   create an account (if you don't have one) and a new **GA4** property for
   your domain.
2. **Get the Measurement ID.** It looks like `G-XXXXXXXXXX`. Find it under
   Admin → Data Streams → (your web stream).
3. **Paste it into the project.** Open `src/config/analytics.js` and set:
   ```js
   export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'
   ```
   That's the entire integration — `src/lib/analytics.js` handles loading
   the script (asynchronously, so it never blocks the page) and sending a
   pageview on every route change, since this is a single-page app and a
   real browser "page load" only happens once.
4. **Verify it's actually working.** Deploy (or run `npm run build && npm run preview`
   locally), open the site, then check GA4's **Realtime** report — you
   should see yourself as an active user within a minute or two. If you
   don't, double-check the Measurement ID and that you're not blocking the
   request with an ad blocker while testing.
5. **What's already tracked vs. what isn't:** pageviews on every route, plus
   three example events (`playground_run`, `cv_print`, `markdown_download`)
   as a demonstrated pattern. Every other tool doesn't send usage events
   yet — add more following the same `trackEvent('name', { safe: 'params' })`
   pattern in `src/lib/analytics.js` as you decide what's worth measuring.
   🔵 **Never pass actual tool input/output as an event parameter** — only
   the fact that an action happened. This is a promise made in the Privacy
   Policy, not just a suggestion.

---

## Part 2 — Connect Google AdSense

### 2a. Before you apply — the honest checklist
🟡 There's no official minimum page count or traffic number, but consistent
practitioner experience says sites under ~15–20 substantial pages, or newer
than a few months, have meaningfully lower approval odds. Practically, for
this project:
- [ ] Site is on the real custom domain (not a `.pages.dev`/preview URL)
- [ ] All tool pages are live with genuine content (not placeholders)
- [ ] Privacy Policy, Terms, About, Contact all exist and are accurate
- [ ] Site has been live for at least a few weeks with the domain indexed
- [ ] No broken pages/links anywhere

See `docs/adsense-integration.md`'s companion checklist for the fuller
version of this list.

### 2b. Apply
1. Go to [google.com/adsense](https://www.google.com/adsense), sign up with
   your site's URL.
2. Add the AdSense verification snippet (Google gives you this at sign-up —
   it usually goes in `<head>`; follow whatever Google's current flow asks
   for at the time you apply, since this step has changed over the years).
3. Wait for review. 🟡 This can take anywhere from about a day to several
   weeks — there's no guaranteed timeline, and no way to speed it up
   legitimately.
4. You'll get an approval or rejection with a stated reason category. If
   rejected, `docs/adsense-integration.md`'s rejection-reasons table maps
   common reasons to fixes.

### 2c. Once approved — connect it in this codebase
1. Open `src/config/ads.js` and set your real Publisher ID:
   ```js
   export const ADSENSE_PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX'
   ```
   This alone flips ads on site-wide (everything was rendering a labeled
   placeholder until now — see `src/components/ui/AdSlot.jsx`).
2. Create ad units in the AdSense dashboard, then fill in their slot IDs in
   the same file's `AD_SLOTS` object.
3. Update `public/ads.txt` with the exact line Google gives you — never
   invent this value.
4. Decide Auto Ads vs. manual placement — both are supported; manual is
   recommended to start (see `docs/adsense-integration.md`'s reasoning: it
   keeps the tool itself the primary focus, which is also what long-term
   organic traffic depends on).
5. Add an EEA/UK consent banner (a Google-certified Consent Management
   Platform) before ads show to visitors in those regions — not included in
   this codebase yet; this is a real legal requirement if you expect any
   EU/UK traffic, not optional polish.

---

## Part 3 — How a site like this actually earns money

No specific number here is a promise — traffic and revenue depend on
factors outside any codebase's control. This section explains the actual
mechanics so you can reason about your own numbers as they come in.

### The chain that produces revenue
```
Organic search traffic (SEO)
  → Pageviews
    → Ad impressions (some %, not 100%, of pageviews — depends on ad density/viewability)
      → Clicks (a small % of impressions — CTR)
        → Revenue (CPC × clicks, or CPM × impressions for display-priced ads)
```
Every link in that chain is where a real business either grows or stalls —
usually the honest bottleneck for a brand-new site is the very first one
(traffic), not ad optimization.

### RPM — the number that actually matters day to day
**RPM (revenue per 1,000 pageviews)** is the practical metric, since it
already bakes in your specific ad density, fill rate, and CTR. 🟡
Community-reported RPM figures vary enormously by niche and, especially, by
**visitor geography** — Tier-1 English-speaking countries (US, Canada, UK,
Australia) typically show meaningfully higher RPM than South Asia or much
of the rest of the world for the same content, often by a factor of 5–10x
or more in some reported samples. This means **who's visiting matters more
than how many** — 10,000 pageviews from developers in the US will likely
outearn 50,000 from a lower-RPM region.

**What this means for this specific project:** the developer-tools niche
naturally skews toward a professional, often higher-income audience
searching in English — a genuine structural advantage over, say, a general
entertainment site with the same traffic volume. Still an estimate, not a
guarantee.

### Realistic timeline expectations 🟡
- **Weeks 1–4 after launch:** getting indexed, essentially zero meaningful
  traffic. This is normal, not a sign something's broken.
- **Months 1–3:** slow organic growth if SEO fundamentals are solid (see
  `docs/07-seo-strategy.md`-equivalent guidance from the original planning
  docs) — pages start ranking for lower-competition long-tail queries first.
- **Months 3–12:** this is where a real trajectory becomes visible — if
  impressions/clicks in Search Console are trending up month over month,
  the approach is working; if flat, revisit content depth and internal
  linking before assuming AdSense itself is the problem.
- Revenue follows traffic with a lag, not in lockstep — a page can rank well
  and get traffic for months before its cumulative pageviews clear the
  $100 payment threshold.

### What actually moves the needle, in rough priority order
1. **More genuinely useful, well-written tool pages** (the content depth
   this whole project has been built around) — this is the actual growth
   engine, not ad configuration.
2. **Internal linking** between related tools, so visitors (and search
   engines) discover more of the site per visit.
3. **Page speed and mobile experience** — both a ranking factor and a
   direct driver of how many pages someone visits per session.
4. **Ad density/placement tuning** — real, but a smaller lever than the
   three above; going from bad placement to good placement helps, but no
   placement change turns low traffic into high revenue.
5. **Additional monetization** (affiliate, premium tier) — only worth
   layering in once there's an established traffic base to build on (see
   `13-monetization-strategy.md` from the original planning docs).

### The honest bottom line
This guide can tell you exactly how to connect the pipes. It can't tell you
how much water will flow through them — that depends on how well the site
serves real search intent over the coming months, which is mostly a content
and SEO outcome, not an AdSense-configuration outcome.
