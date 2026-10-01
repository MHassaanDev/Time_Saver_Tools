import React from 'react'
import { ADS_ENABLED, AD_PLACEMENTS_ENABLED, AD_SLOTS } from '../../config/ads.js'

// AdSlot / TopAdSlot / InContentAdSlot / SidebarAdSlot / BottomAdSlot —
// implemented as one component with a `placement` prop rather than five
// near-identical files; the exported aliases below give the same names the
// spec asked for.
//
// Before approval (ADS_ENABLED is false), this renders a small, clearly
// labeled, non-functional placeholder — impossible to mistake for a real ad,
// per AdSense policy on distinguishable ad labeling.
export function AdSlot({ placement = 'toolBottom', className = '' }) {
  const enabled = ADS_ENABLED && AD_PLACEMENTS_ENABLED[placement]
  if (!ADS_ENABLED) {
    return (
      <div
        className={`card flex items-center justify-center text-xs text-ink-400 border-dashed py-6 ${className}`}
        aria-hidden="true"
      >
        [ Advertisement ]
      </div>
    )
  }
  if (!enabled) return null

  // ADSENSE INTEGRATION POINT
  // Replace this block with the approved Google AdSense ad unit for
  // AD_SLOTS[placement] (see src/config/ads.js). Do not modify Google's
  // ad code in ways prohibited by AdSense policies.
  return (
    <div className={className} data-ad-slot={AD_SLOTS[placement]} data-ad-placement={placement}>
      {/* <ins className="adsbygoogle" ... /> goes here once approved */}
    </div>
  )
}

export const TopAdSlot = props => <AdSlot placement="toolTop" {...props} />
export const InContentAdSlot = props => <AdSlot placement="toolBottom" {...props} />
export const SidebarAdSlot = props => <AdSlot placement="sidebar" {...props} />
export const BottomAdSlot = props => <AdSlot placement="homeBottom" {...props} />
