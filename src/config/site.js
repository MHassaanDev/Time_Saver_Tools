// Site-wide constants. This is the ONLY place these values should be
// hardcoded — every page/canonical/OG/structured-data/contact reference
// reads from here, so the domain, email, or tagline can change in one spot.
export const SITE = {
  name: 'TimeSaver Tools',
  tagline: 'Get it done. Faster.',
  description:
    'Free online tools for developers and everyday tasks — JSON, Base64, JWT, Markdown, CV builder and more, all in one place. Fast and browser-based, no install.',
  // TODO: swap for the real production domain once purchased (intended:
  // timesavertools.net — see docs/brand-and-domain.md). Until then this
  // stays a placeholder; update it once, here, when deploying to the real
  // domain or a Cloudflare Pages subdomain — nothing else needs to change.
  url: 'https://example.com',
  // Central contact address — change here only. Currently a personal address;
  // swap for a dedicated inbox (e.g. hello@timesavertools.net) once the
  // domain is live.
  contactEmail: 'dev.muhammadhassaan@gmail.com',
  githubUrl: '', // leave empty until a real public repo exists — footer hides the link when empty
  twitterUrl: ''
}
