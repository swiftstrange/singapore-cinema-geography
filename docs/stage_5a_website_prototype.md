# Stage 5A — functional local website prototype

## Scope and status

This is a local-only scrollytelling prototype. It consumes the existing private
Mapbox style and the approved Stage 4C map-state configuration. It does not
create, change, publish, or upload any Mapbox resource, and it does not alter
the frozen research data.

## Local structure

```
website/
  app/
    globals.css          # desktop-first visual system and responsive baseline
    layout.tsx           # document metadata and Mapbox GL JS CDN assets
    page.tsx             # map, scroll controller, legends, labels and popups
  js/
    config.js            # client-side Mapbox configuration only
```

The stage configuration remains authoritative at
`data/interim/chapter_map_states.json`. The application imports that file
directly rather than copying or rewriting its cameras, filters, highlights or
state IDs.

## Map configuration

- Map library: Mapbox GL JS 3.19.1
- Private style URI: `mapbox://styles/strange1989/cmtq74ywn00g801r2gri5d7v0`
- Client-side configuration file: `website/js/config.js`
- The configuration file contains only the user-approved public browser token.
  The administrative secret is neither read nor written by this prototype.

## Implemented interaction model

- An `IntersectionObserver` changes state as the reader reaches each narrative
  panel.
- All 18 approved Stage 4C states are implemented with their supplied camera,
  active-layer, opacity, filter and highlight settings.
- The existing six custom style layers are toggled and filtered in place; the
  site does not add a duplicate visual layer or source.
- HTML legends change by state and distinguish medium-confidence coordinates
  with lower opacity.
- Chapter 3 town labels and the Chapter 4 Lido / Shaw House label appear only
  in their corresponding focused states.
- Hovering a visible marker applies a small radius increase and a pointer
  cursor. Clicking a visible operation, site or continuity marker creates a
  popup from feature properties, including coordinate confidence.
- The camera honours reduced-motion preference by jumping rather than
  animating.

## Editorial and accessibility baseline

The initial landing state is the opening island view with the headline
“Where Would You Go Tonight?”. The sequence contains Chapter 1 opening
geographies, Chapter 2 venue settings, Chapter 3 new-town focus states,
Chapter 4 address continuity, and a return to the opening island view. Each
panel is marked as a working draft pending later editorial revision. The layout
uses semantic headings, keyboard-focusable story panels, labelled map and live
legend regions, visible text contrast, and a small-screen layout adjustment.

No archival images, fabricated quotations, unsupported geographic claims, or
final narrative conclusions have been introduced.

## Validation completed

- `npm run build` completed successfully.
- The local development server returned HTTP 200 for the root route.
- Browser inspection confirmed that the private style loaded, the map reached
  the active state, and tested Chapter 1, Chapter 2, Chapter 3 and Chapter 4
  scroll states changed to their expected cameras, labels and legends.
- Development output contained no application error. Mapbox emitted one
  non-blocking base-style warning: “Cutoff is currently disabled on terrain”.

## Known limitations for later stages

- This is a functional desktop-first prototype, not the finished editorial
  site.
- The responsive layout is a baseline and needs device-specific visual QA in a
  later stage.
- Marker colours and hierarchy deliberately inherit the approved master style;
  any visual-system revisions should be made in a separately approved style
  phase, not by creating replacement web layers.
- The current environment exposes development output but not a separate
  browser-console export. The recorded warning above is the only observed
  browser-side diagnostic during this check.
