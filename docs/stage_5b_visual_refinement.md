# Stage 5B — visual, layout and interaction refinement

## Visual direction

The interface now uses a quiet, dark editorial treatment: a persistent map is
the dominant image, while the text surface reads as a restrained publication
overlay rather than a dashboard card. A muted terracotta accent provides the
editorial cue; chapter-specific accents are limited to kickers and short rules.
The analytical colours embedded in the approved Mapbox style have not changed.

## Typography

- Display and chapter titles: **Source Serif 4** (Google Fonts, with Georgia
  fallback). It provides the cinematic editorial voice.
- Body, legend, interface and popup text: **DM Sans** (Google Fonts, with
  Arial fallback). It remains compact and highly legible above the basemap.
- Kicker/metadata text uses restrained upper-case tracking rather than heavy
  weights.

## Layout and panels

- The desktop narrative column is `clamp(22rem, 34vw, 32rem)`, leaving roughly
  66% of the canvas visible for the map at ordinary laptop widths.
- The opening is deliberately unboxed: large title, short contextual line and
  a subtle scroll cue sit over the island map.
- Story steps use a translucent left-rule surface, generous vertical rhythm and
  a modest active-state shift. This reduces the earlier prototype-card effect.
- The ending returns to a quiet wide map state with space for later reflection,
  source note and credits.

## Map interface refinements

- Legends now use a compact translucent surface, small uppercase heading,
  consistent swatches and state-specific content.
- Town and case labels fade in/out through persistent overlay markup and are
  visible only at their approved Chapter 3/4 states.
- Mapbox popups now use a dark editorial surface with clearer name, metadata
  hierarchy and confidence text.
- Marker-radius changes have a short Mapbox paint transition to soften hover
  feedback. Cursor and click behaviour are preserved.
- The Chapter 4 Lido panel contains a restrained, reusable archival-media
  reservation; it does not introduce an image or historical content.

## Scroll and transition refinement

The existing configuration-driven state architecture remains unchanged. The
scroll observer was strengthened so that the visible story step nearest the
reader's central reading line selects the active state. This removes a browser
QA edge case in which overlapping observer entries could briefly restore an
older chapter state. Stage 4C camera, filter, opacity and highlight values are
still read directly from `data/interim/chapter_map_states.json`.

## Responsive and reduced-motion behaviour

- At tablet/laptop widths, the narrative column grows modestly to retain a
  readable measure while preserving map space.
- Below 700px, narrative panels expand to the page width, typography scales
  down, legends shrink, and map labels are constrained away from the edges.
- When reduced motion is requested, browser scroll smoothing and interface
  transitions are disabled; the existing Mapbox zero-duration camera behaviour
  remains in effect.

## Validation

- `npm run build` succeeds after the refinement.
- Browser checks confirmed map load, Chapter 2 venue legend, Queenstown label
  and the approved Chapter 3 camera, Lido label and approved Chapter 4 camera,
  then the ending island state.
- The checked browser viewport was approximately 1280×800, within the intended
  laptop range. The clamp-based desktop and 1050px/700px responsive rules were
  reviewed for the requested 1366×768, 1440×900 and 1920×1080 ranges; the
  available browser surface did not expose a viewport-resize control for
  pixel-for-pixel screenshots at each of those dimensions.
- The development server returned HTTP 200 after the final change. A temporary
  HMR error occurred while the stylesheet was being replaced, then resolved on
  the next update; it is not present in the rebuilt site. The only recurring
  Mapbox diagnostic is the non-blocking terrain warning, “Cutoff is currently
  disabled on terrain”.

## Deliberately deferred to Stage 6

- Final long-form chapter prose and final methodology wording.
- Archival photographs, captions, permissions/source credits and qualitative
  case material.
- Final citations, project credits and fuller ending reflection.
- Device-specific browser screenshots and final mobile interaction polish.
- Any separately approved changes to the Mapbox visual system.
