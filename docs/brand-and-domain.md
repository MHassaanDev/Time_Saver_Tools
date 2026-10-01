# Brand & Domain Notes

## Current decision (do not change without a strong reason)
**Brand:** TimeSaver Tools
**Intended domain:** TimeSaverTools.net (not yet purchased — site currently
runs on a placeholder/deployment URL, see `src/config/site.js`)
**Short form:** none adopted. "TST" / "TS Tools" / "TSTools" were considered
and rejected — none read as more professional or memorable than the full
name, and the full name is short enough (two words) that an abbreviation
doesn't earn its confusion cost. If this changes later, update `SITE.name`
only where a short form is explicitly wanted — don't introduce one in the
logo or nav without revisiting this decision.

## Logo
Original mark: a rounded-square badge containing a stopwatch — circular
dial, a small crown/button at 12 o'clock, and one bold hand sweeping mid-
motion (toward ~4 o'clock) to suggest speed rather than a static clock face.
See `src/components/logo/Logo.jsx` (`LogoMark` = icon only, `LogoWithText`
= icon + wordmark, used as the default export). The favicon in `index.html`
is a simplified inline SVG data URI using the same dial + hand shape, tuned
for legibility at 16–32px.

## If the name/domain ever needs to change
Alternatives considered, evaluated against: easy to pronounce, easy to
spell after hearing it once, broad enough to cover more than dev tools,
plausible for normal-cost .com/.net registration. **None of these domains
have been checked for availability or price — verify before acting on any
of them.**

| Idea | Notes |
|---|---|
| QuickToolbox | Reads well, slightly generic; "toolbox" is a crowded word in this space |
| SnapTools | Short, implies speed; risk of confusion with photo/Snapchat-adjacent brands |
| Tinkr Tools / Tinkr | Playful, memorable; less clearly "fast" |
| Dashtools | "Dash" implies speed; check for conflicts with dashboard-tool products |
| EveryDayTools | Clear, broad, a bit long for a wordmark |
| FastLane Tools | Speed-forward; "Fast Lane" is used elsewhere (insurance, logistics brands) — higher collision risk |

None of these are recommended over the current name — this table exists
only so a future rename doesn't start from zero.

## Architecture notes that make a future rename/migration cheap
- `SITE.name`, `SITE.url`, and `SITE.contactEmail` in `src/config/site.js`
  are the only hardcoded copies — every canonical URL, OG tag, structured
  data block, and contact link is derived from these at render time.
- A future `dev.timesavertools.net` or `timesavertools.net/dev/` structure
  is compatible with the current routing (plain client-side routes under
  `/tools/:slug`) without changes — whichever structure is chosen later is
  purely a DNS/hosting decision, not an app change.
