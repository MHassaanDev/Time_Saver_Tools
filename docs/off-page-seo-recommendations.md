# Off-Page SEO Recommendations

On-page SEO (titles, meta descriptions, content, structured data — covered
elsewhere in this project) controls whether a page *can* rank. Off-page SEO
— mainly backlinks, mentions, and genuine external signals — controls how
much Google trusts it *should* rank. This doc is the practical, legitimate
playbook for that second part. Nothing here promises a specific ranking or
traffic outcome — off-page SEO is slower and less controllable than on-page
work, and anyone promising guaranteed results with it is selling something.

## The one rule that matters more than any tactic below
**Every link should exist because it genuinely helps someone, not because
it helps a ranking.** Google's own Webmaster Guidelines explicitly penalize
link schemes — and more practically, manufactured links from low-quality
sources carry little to no real benefit even when they don't get penalized.
The tactics below are all "would a human reasonably click this and find it
useful" tactics, not volume plays.

## Tactics that genuinely work for a free tools site

### 1. Tool directories and aggregators (highest effort-to-value ratio here)
Submit TimeSaver Tools to legitimate "list of tools" sites — this is the
single most directly relevant off-page channel for this specific kind of
project:
- **AlternativeTo** — list it as an alternative to the specific tools it
  overlaps with (e.g., jwt.io for the JWT tool, CodePen for the Playground)
- **Product Hunt** — a genuine launch post when there's enough built to
  show well; one well-timed launch beats several thin ones
- **GitHub "awesome-*" lists** — e.g., `awesome-devtools`-style
  repositories accept PRs adding genuinely useful free tools; this also
  gets the project in front of a developer audience directly
- **SaaSHub, StackShare** — free listings relevant to developer tooling

### 2. Developer community presence (real engagement, not link-dropping)
- **dev.to / Hashnode** — write a genuinely useful post (e.g., "What is a
  JWT, and how do I decode one without a backend?") that happens to
  reference the tool as one way to do it — content-first, tool-mention
  second
- **Hacker News "Show HN"** — appropriate once there's a complete,
  working product to show; HN's community is quick to downvote anything
  that reads as pure self-promotion, so lead with what's interesting about
  the build (e.g., "I built a dependency-free Markdown renderer and
  tested it against XSS before shipping"), not a sales pitch
- **Relevant subreddits** (r/webdev, r/SideProject, r/InternetIsBeautiful) —
  each has its own self-promotion rules; read them before posting, and
  participate genuinely in the community beyond just the one promotional
  post
- **Stack Overflow / developer Q&A** — only where the tool is a genuinely
  correct, non-spammy answer to a real question someone asked (e.g., a
  question about decoding a JWT payload) — this is slow, high-value, and
  the one channel most intolerant of anything that smells like marketing

### 3. Content that earns links on its own
The single highest-leverage off-page strategy for a tools site is
**making content worth linking to without being asked** — a few
genuinely useful explainer pages (what headings doc 5's planned "Guides"
section covers) tend to get cited naturally by other developers writing
about the same topic, which is a stronger, more durable signal than
outreach-driven links.

### 4. Social presence (secondary, not primary)
A simple account (X/Twitter, or wherever the target audience actually is)
posting when a new tool ships, with a link — low effort, modest but real
value, mainly useful for direct traffic and occasional pickup rather than
as a primary SEO lever.

## Explicitly avoid
- **Paid links** or any link exchange program — against Google's
  guidelines and a real risk to the site's standing, not just "against the
  rules" in the abstract
- **Link farms / private blog networks** — the opposite of the "would a
  human click this" test
- **Mass directory submission tools/services** — most submit to low-quality,
  irrelevant directories that add no real value and occasionally hurt more
  than help
- **Comment spam** (dropping a link in blog comments / forums unrelated to
  genuine participation)
- **Reciprocal link schemes** ("link to me and I'll link to you") at scale

## Timeline and measurement
🟡 Off-page signals compound slowly — a single Product Hunt launch or a
well-placed GitHub list entry might take weeks to show up as a ranking
influence, and the effect is cumulative, not instant. Track actual progress
in **Google Search Console's Links report** (shows top linking sites and
pages over time) rather than guessing — this is free, official, and the
most honest signal available for whether any of the above is actually
working.

## How this connects to the rest of the project
This is deliberately the "what to do outside the codebase" counterpart to
`docs/adsense.md` (earning mechanics) and the on-page SEO work already in
the homepage/tool-page copy and metadata. None of the three substitute for
the others — a technically perfect site with zero off-page signal and a
site with great backlinks but thin on-page content both underperform a
site that does reasonably well at all three.
