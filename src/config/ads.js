// ================================
// GOOGLE ADSENSE CONFIGURATION
// ================================
// This file is the single place to wire up real AdSense once the site is
// approved. Until then, every <AdSlot /> renders a clearly-labeled
// "[ Advertisement ]" placeholder — see src/components/ui/AdSlot.jsx.
//
// STEP 1 — Add your approved AdSense Publisher ID here.
//   Example format: "ca-pub-XXXXXXXXXXXXXXXX"
export const ADSENSE_PUBLISHER_ID = '' // '' = ads disabled site-wide

// STEP 2 — Add individual ad slot IDs here once created in the AdSense
// dashboard. Keys match the `slot` prop passed to <AdSlot slot="..." />.
export const AD_SLOTS = {
  toolTop: '',
  toolBottom: '',
  sidebar: '',
  homeBottom: ''
}

// STEP 3 — Central on/off switch per placement. Flip any of these to
// `false` to disable that placement everywhere without touching component
// code. Useful for keeping the tool itself the primary focus (see
// docs/adsense-integration.md, "Ad density" section).
export const AD_PLACEMENTS_ENABLED = {
  toolTop: false, // keep the tool above the fold — off by default
  toolBottom: true,
  sidebar: false,
  homeBottom: true
}

// IMPORTANT: Only insert the official code/IDs supplied by Google AdSense.
// Do not alter Google's ad code in prohibited ways. See:
// docs/adsense-integration.md for the full connection walkthrough,
// including ads.txt placement and Auto Ads vs manual units.
// ================================

export const ADS_ENABLED = Boolean(ADSENSE_PUBLISHER_ID)
