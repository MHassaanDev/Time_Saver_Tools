# AdSense Integration Guide

This project is built ad-ready but ships with ads fully disabled (every
`<AdSlot />` renders a labeled placeholder) until you complete this checklist.

## 1. Publisher ID
Open `src/config/ads.js` and set:
```js
export const ADSENSE_PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX' // your real ID
```
This alone flips `ADS_ENABLED` to `true` app-wide.

## 2. Ad slot IDs
Create ad units in the AdSense dashboard, then fill in `AD_SLOTS` in the same
file with their slot IDs. Keys already match the placements used across the
site (`toolTop`, `toolBottom`, `sidebar`, `homeBottom`).

## 3. Per-placement on/off switches
`AD_PLACEMENTS_ENABLED` in `src/config/ads.js` lets you disable any single
placement site-wide without touching component code. `toolTop` defaults to
`false` — the tool itself stays above the fold on first load, matching the
site's core design principle.

## 4. The actual ad code
Open `src/components/ui/AdSlot.jsx` and find the comment:
```js
// ADSENSE INTEGRATION POINT
```
Replace the placeholder block with Google's real `<ins class="adsbygoogle">`
snippet (or Auto Ads script, if you choose Auto Ads instead of manual units —
both are supported by this architecture; you don't have to pick one before
launch).

## 5. ads.txt
Replace the placeholder line in `public/ads.txt` with the exact line Google
AdSense gives you after approval. Never invent this value.

## 6. Before you flip the switch
- Custom domain is live (not a `*.pages.dev` URL)
- Privacy Policy accurately describes ad usage (it already does, generically —
  review `src/pages/Privacy.jsx` once ads are live)
- EEA/UK consent banner in place if you expect EU/UK visitors (not included in
  this codebase yet — add a Google-certified CMP before enabling ads for
  those regions)

## Auto Ads vs. manual units
Both are compatible with this architecture. Manual units use the `<AdSlot />`
component and its placements as described above. Auto Ads instead uses a
single sitewide script tag (with the publisher ID) placed once in
`index.html`'s `<head>` — if you choose Auto Ads, you can leave the
`<AdSlot />` placeholders in place (they'll just render nothing meaningful
once ADS_ENABLED is true and Auto Ads is deciding placement itself), or
remove them. Google's AdSense dashboard lets you exclude specific pages/areas
from Auto Ads placement if you want to keep it off the Playground's editor
area, for example.
