# Final revision plan

## Purpose and authority

This document establishes the final-revision baseline for the DEP5118 Singapore Cinema Geography scrollytelling website. It records the project and published-style state audited on 8 September 2026 and the authoritative revision requirements supplied for the final revision stage.

This plan supersedes conflicting narrative order, layer names, visual values, and deferred-work descriptions in earlier stage notes. It is a plan only: no batch implementation is included here.

## Audited project baseline

- Project root: `F:\NUS\Y2S1\DEP5118\Individual_Assignment_2`
- Local website: `http://localhost:3000`
- Application: React 19.2.6 with vinext 1.0.0-beta.5 and Mapbox GL JS 3.19.1.
- Main runtime controller and narrative: `website/app/page.tsx`
- Global visual system: `website/app/globals.css`
- Map-state contract: `data/interim/chapter_map_states.json`, schema version 2.0.
- Mapbox style: `Singapore Cinema Geography`, owned by `strange1989`.
- Style ID: `cmtq74ywn00g801r2gri5d7v0`
- Style URI: `mapbox://styles/strange1989/cmtq74ywn00g801r2gri5d7v0`
- Published-style API audit: private, non-draft style; live style modified `2026-09-08T06:24:16.207Z`.
- Runtime architecture: the website imports the state JSON and changes only layer filters, layer visibility, and camera state. The current controller contains no `setPaintProperty` call.
- Current state sequence: 25 configured scroll states, from `opening_island` through `ending_tonight`.
- Current mapped data counts recorded in the state file and checked against the data: 37 historical operations, 28 historical sites, 7 continuity cases, and 33 current exhibition spaces.
- Current exhibition categories: 27 commercial, 2 independent curated, 1 heritage hybrid, and 3 institutional curated spaces.
- Golden Mile Tower site ID: `SGC-S-011`.
- Golden Mile operation sequence: Golden Theatre (`SGC-O-043`) → The Projector at Golden Mile Tower (`SGC-O-015`) → Filmhouse (`SGC-O-044`).
- The four Golden Mile states currently use the identical camera: centre `[103.864161, 1.301929]`, zoom `15.8`, bearing `-10`, pitch `30`.
- Current media integration is sparse: one Chapter 1 image and one Chapter 2 town image are rendered. A Lido image remains keyed to the obsolete/nonexistent `c4_lido_focus` state and therefore is not rendered by the current 25-step sequence.
- The present-day and ending states are separate but use the same current-exhibition layers, filters, and whole-island camera.

## Current published Mapbox runtime contract

The current published style was read directly from the Mapbox Styles API during this audit. These are the actual runtime IDs; old combined layer names in earlier documentation must not be used.

| Role | Current published runtime layer ID(s) |
|---|---|
| Opening chronology | `01_basic`, `01_glow` |
| Venue type | `02_operations_venue_type` |
| Operation highlight | `03_operations_highlight` |
| Site operation count | `04_sites_operation_count` |
| Continuity | `05_continuity_cases` |
| Case highlight | `06_basic`, `06_glow` |
| Current exhibition | `07_basic`, `07_glow` |

### Published visual snapshot at baseline

This table records the live values for audit purposes. It is not permission to copy them into CSS or override them at runtime. Before implementing any legend or visual comparison, re-read the then-current published style because the user may make further Studio changes.

| Layer(s) | Live published paint values relevant to the revision |
|---|---|
| `01_basic`, `01_glow` | Opening-year colors: `<1950 #f6ffea`; `<1970 #ffde96`; `<1990 #fa855a`; `<2010 #c93638`; `>=2010 #62c4da`; fallback `rgb(122, 106, 85)`. Basic: radius absent/default, opacity `0.9`, blur `0.4`, emissive `1.8`. Glow: radius `12`, blur `1`, emissive `1`, confidence opacity expression `medium 0.2 / otherwise 0.9`. |
| `02_operations_venue_type` | Standalone `#24e5c2`; community/new-town `#fe6d73`; mixed-use `#2577a7`; mall-integrated `#ffcb77`; fallback `#b8b3a8`. Radius `6`; confidence opacity expression `medium 0.58 / otherwise 0.9`; emissive `1`. |
| `03_operations_highlight` | Fill `#fff1b8`; stroke `#e3a145`; radius `10`; stroke width `8`; stroke opacity `0.8`; blur `0.5`; emissive `1.5`. |
| `04_sites_operation_count` | Color expression: 1 operation `#f2c269`, 2 operations `#e6870a`, 3+ operations `#f96e0b`, fallback `#e3d1b0`. Radius expression: `5 / 9 / 13`, fallback `4`. Opacity `0.6`; blur `0.2`; emissive `1`. |
| `05_continuity_cases` | Fill `#bd4e05`; radius `7`; opacity `0.7`; blur `0.2`; emissive `1`. |
| `06_basic`, `06_glow` | Fill `#ffe3a1`; stroke `#d8792a`; basic radius `9`, stroke width `2`, blur `0.3`; glow radius `15`, blur `1`; stroke opacity `0.8`; emissive `1.5`. |
| `07_basic`, `07_glow` | Commercial `#c2441c`; heritage hybrid `#0d244d`; independent curated `#b52e47`; institutional curated `#4a5a2b`; fallback `#6B6B6B`. Basic opacity `0.9`, blur `0.25`; glow radius `9`, opacity `0.5`, blur `1`; emissive `1.5`. |

## Mapbox visual-lock rules

1. The current published Mapbox style is the sole visual source of truth.
2. Do not infer or reuse colors, radii, opacity, blur, stroke, or emissive values from old documentation, old CSS, old prompts, or historical hex values.
3. Do not call `setPaintProperty`, add replacement visual layers, or otherwise reproduce Mapbox paint logic in website runtime code.
4. Runtime map control remains limited to visibility, filters, and camera unless the user explicitly changes this contract.
5. Legend colors and markers must be derived from the current published style's paint values and data-driven expressions. Re-audit the published style immediately before implementing a legend batch.
6. Chapter 3 point sizes are manually controlled in Mapbox Studio. The current published radius is `6`; it and every other Chapter 3 paint property must remain untouched by website code.
7. Chapter 4 point styling is manually controlled in Mapbox Studio. The live baseline already shows reduced opacity (`0.6`) and color-plus-size differentiation for 1, 2, and 3+ operations. The user may publish further changes. Whatever is published at implementation time is authoritative and must not be overwritten.
8. The same lock applies to all visual properties on `01` through `07`, including fill/color expressions, radius expressions, opacity, blur, stroke color/width/opacity, and emissive strength.
9. The Mapbox style, its sources, tilesets, layer order, and publication state are outside the implementation scope unless the user separately authorizes a Mapbox change.

## Authoritative final revision requirements

### 1. Global top bar

Add a fixed dark-to-transparent gradient behind the global labels “SINGAPORE CINEMA GEOGRAPHY” and “DOCUMENTED SITES AND OPERATIONS.” It must be darkest/semi-transparent at the top, fade smoothly to transparent, remain globally fixed, and not resemble a solid rectangular navbar.

### 2. Global map composition

Shift the map's general visual centre slightly to the right so principal mapped content sits more comfortably beside left-side narrative panels. Treat this as a composition principle, not a requirement for one identical offset in every local case-study camera.

### 3. Intro / cover

Make the first cover state visually quieter. Hide the legend on the cover and show opening-year points only as subdued background lights. As the reader enters the Opening state, bring the points to full visibility and reveal the opening-year legend. Opening is the formal start of the analytical map.

### 4. Chapter 1 camera progression

Replace the uniform whole-island scale with a spatial expansion synchronized with cumulative points:

- 1930s–1940s: closest view, framing the early central/southern cluster.
- 1950s–1960s: modest pullback to include expanding locations.
- 1970s–1980s: further pullback to include wider new-town geography.
- 1990s–2026: widest Chapter 1 extent, approaching the whole island.

The intended narrative is: few early points → expanding geography → peripheral locations enter → camera gradually pulls back.

### 5. Chapter 1 images

Give every Chapter 1 period a relevant image tied to the period, a cinema, or the spatial/architectural change under discussion. Do not limit archival media to the first period.

### 6. Chapter 2 town label

Keep “Queenstown · Toa Payoh · Ang Mo Kio · Boon Lay” on one line without wrapping.

### 7. Chapter 2 visual emphasis

- Overview: keep the four principal new-town highlights prominent while all other cinema points are already subdued.
- Individual town: darken unrelated points further so the selected town dominates.
- Final pullback: restore some brightness to ordinary cinema points and reduce the dominance of the four town highlights so they read as part of a broader network.

Accomplish this without overriding Mapbox's locked paint properties; use state/filter/layer composition consistent with the runtime contract, or pause for explicit approval if the desired effect cannot be achieved within that contract.

### 8. Chapter 2 images

Provide corresponding images across the relevant Chapter 2 pages/towns rather than only one town page.

### 9. Chapter 3 Mapbox size

Preserve the manually modified and published Chapter 3 point sizes. Do not overwrite them in website code.

### 10. Chapter 3 images

Give each spatial type a building/place image that helps readers understand the differences among cinema venue settings.

### 11. Chapter 4 Mapbox style

Chapter 4 styling remains a Mapbox Studio responsibility. The intended design lowers overall point opacity and distinguishes 1, 2, and 3+ documented operations by color as well as size. Do not implement those paint changes in website runtime code. After any further manual publication, re-read and treat the published style as authoritative.

### 12. Chapter 4 narrative repetition

Rewrite the repeated Chapter 4 pages so they have distinct functions and each adds information:

1. all physical cinema sites;
2. repeated sites;
3. continuity cases;
4. transition into the Golden Mile case.

Map changes alone are insufficient.

### 13. Chapter 5 as a full case study

Substantially enrich Chapter 5. Its opening must explain why Golden Mile Tower was selected, what continuity at one address reveals, and what the reader should watch across the stages. Golden Theatre, The Projector, and Filmhouse must each receive a meaningful historical explanation rather than a title alone.

### 14. Chapter 5 images

Give every Golden Mile stage an appropriate image. Place these images on the right side of the page, above the legend area.

### 15. Chapter 5 image style

Keep Chapter 5 images independent from the left blue narrative panel. Feather/blur their edges so they merge naturally with the dark map background.

### 16. Remove Chapter 5 black map label boxes

Remove every Chapter 5 black rectangular location label, including “Golden Mile Tower.” Do not use the small floating map-label box in this chapter.

### 17. Merge present day and ending

Remove the redundant standalone “Current Film Exhibition Geography” page/state. Create one final Ending sequence/page that displays current film exhibition geography, returns to “Where Would You Go Tonight?”, and concludes the narrative.

### 18. Ending information panels

Do not place all ending material in one continuous blue panel. Separate the main concluding narrative from the methodology/caveat and Sources and Data Credits in two visually distinct panels.

### 19. Current exhibition legend markers

Show a colored point plus category label for each current exhibition category: commercial, independent curated, heritage hybrid, and institutional curated.

### 20. All legend colors match the current Mapbox style

Audit every legend against the current published style. Derive colors from the live Mapbox paint/data-driven color expressions, never from old hard-coded hex values. This applies to opening year, Chapter 2 highlight, Chapter 3 venue type, Chapter 4 operation count, continuity/case legends if used, and current exhibition categories.

### 21. Panel edge decoration

Audit the short horizontal rules, partial vertical rules, colored short vertical segments, thin top-border fragments, and related panel-edge decorations. Keep intentional elements, make them slightly more visible/wider/longer, and standardize their position, dimensions, and visual logic. Remove inconsistent instances that are accidental CSS artifacts.

### 22. Map point detail popups

Redesign point-detail popups as semi-transparent dark wine/theatre-curtain red surfaces with readable light text, visually integrated with the translucent blue narrative panels. Change interaction from persistent click-to-open to hover-to-show and mouse-leave-to-dismiss; clicking must not be required.

## Five-batch implementation plan

### Batch 1 — Global UI, intro, legends, and hover popups

- Implement requirements 1–3, 19–22, plus the global composition principle in requirement 2 where it affects opening/global cameras.
- Re-read the live published style before touching legends.
- Establish a legend-data adapter sourced from the live style contract without introducing runtime paint overrides.
- Verify cover/Opening state separation, fixed header gradient, standardized panel decorations, all legend markers/colors, and hover popup lifecycle and styling.
- Do not change Chapter 3 or Chapter 4 Mapbox paint.

### Batch 2 — Chapter 1 and Chapter 2

- Implement requirements 4–8 and apply the right-shift composition principle to these cameras.
- Build and browser-test the Chapter 1 camera pullback sequence alongside point accumulation.
- Add period/town media with verified captions, sources, rights notes, and responsive behavior.
- Implement Chapter 2 overview, town-focus, and return emphasis using the permitted state/filter/layer controls.
- Keep the four-town label on one line and test it at supported viewport sizes.

### Batch 3 — Chapter 3 and Chapter 4

- Implement requirements 9–12 and the relevant global legend/composition rules.
- Re-audit the published style first, particularly after the user's Chapter 4 Studio publication.
- Add venue-setting images for Chapter 3 while preserving its published point size and all Mapbox paint.
- Give the Chapter 4 states four distinct editorial functions and transition cleanly into Golden Mile.
- Do not implement Chapter 4 opacity, color, radius, blur, stroke, or emissive changes in website code.

### Batch 4 — Chapter 5 and merged ending

- Implement requirements 13–18 and the current-exhibition legend already prepared in Batch 1.
- Expand Golden Mile into a full three-operation continuity case at `SGC-S-011`.
- Add right-side, feathered images for the entry and each historical stage, independent of the narrative panel.
- Remove Chapter 5 map-label boxes while retaining the fixed camera across Golden Theatre → The Projector → Filmhouse unless later editorial testing justifies a non-style camera adjustment.
- Merge present day and ending into one final sequence/page, with separate conclusion and methodology/credits panels.

### Batch 5 — Final QA only

- Make no new narrative or visual-direction decisions.
- Validate desktop, tablet, mobile, reduced-motion, keyboard/focus, and hover/pointer behavior.
- Confirm every step maps to a valid state and every referenced layer exists in the published style.
- Re-audit live legend colors against the published style and confirm zero runtime paint overrides.
- Check image crops, feathering, captions, links, credits, reproduction/permission status, and responsive placement.
- Confirm the merged ending, current-exhibition count/category treatment, Golden Mile identity chain, and data caveats.
- Run build/lint checks and perform a clean-browser walkthrough.

## Current code/specification conflicts to resolve in the batches

| Area | Audited current state | Required final state |
|---|---|---|
| Global top bar | `.masthead` already has a top gradient, but the new specification says the current treatment does not sufficiently isolate the labels. | Refine it into the required fixed, dark-to-transparent protective fade. |
| Cover vs Opening | The cover and first Opening panel share `opening_island`; the legend is always rendered and the chronology pair is fully active. | Quiet cover with no legend and subdued lights, followed by a distinct analytical Opening state with full points and legend. |
| Global composition | Most island cameras use centres around `[103.825, 1.35]` or `[103.8, 1.335]` without a documented right-side composition offset. | Shift principal content right while preserving case-specific framing. |
| Chapter 1 cameras | All four Chapter 1 states use the same whole-island camera and zoom `10.35`. | Progressive zoom-out from the early core to near whole-island scale. |
| Chapter 1 media | Only `c1_early_openings` has an image. | One relevant image for every period. |
| Chapter 2 town label | `.map-label` has a `17rem` maximum width and no no-wrap rule. | Four-town label stays on one line. |
| Chapter 2 emphasis | Base chronology layers remain fully active in every overview/town/return state; only the `03` selection filter changes. Overview and return use the same selected IDs. | Three-stage emphasis: subdued overview context, darker town context, and a more balanced network return. |
| Chapter 2 media | Only Ang Mo Kio has an image. | Images across relevant towns/pages. |
| Chapter 3 size | No runtime paint override exists; the live published radius is `6`. | Preserve the manually published size. |
| Chapter 3 media | No current `c3_*` state has an image. The Ang Mo Kio image is coded under `c2_ang_mo_kio`, despite older content documentation calling it Chapter 3. | A building/place image for each spatial type. |
| Chapter 4 style | Live `04` already uses lower opacity and color plus size; earlier docs still describe older single-color radii. | Preserve style ownership and re-read the final publication; never override in website code. |
| Chapter 4 narrative | Three states repeat the same title and paragraph. | Distinct all-sites, repeated-sites, continuity-cases, and Golden-Mile-transition functions. |
| Chapter 5 content | Entry and three stages have empty body copy. | Full case-study introduction and meaningful text for every stage. |
| Chapter 5 media | No `c5_*` images exist. The only Lido media entry is obsolete and unrelated to the selected final case. | Appropriate right-side feathered imagery for each Golden Mile stage. |
| Chapter 5 labels | Every `c5_*` state sets `map_label: "Golden Mile Tower"`, rendered as a dark floating box. | Remove all such boxes from Chapter 5. |
| Ending structure | `current_exhibition_geography` and `ending_tonight` are separate states with the same layers, filter, and camera. | One merged ending sequence/page. |
| Ending panels | Conclusion, caveat, and credits sit inside one `ending-step` narrative surface. | Separate conclusion from methodology/caveat/credits in two panels. |
| Current legend | Category names have no swatch elements. | Colored marker plus label for all four categories. |
| Legend colors | Opening, venue, highlight, and operation-count swatches are hard-coded in CSS and do not match the current published style. | Derive every legend marker from the live published style expressions. |
| Panel decorations | Decorations come from several independent rules: legend top/left borders, story-step left border and `:before` rule, map-label left border, end-matter top border, and media borders. | Audit, standardize intentional motifs, and remove accidental inconsistencies. |
| Popups | Interaction is click-to-open with a close button. Source CSS currently declares a dark navy popup (`#0b1726`), although the final brief reports a white rendered popup. | Verify computed browser styling, then implement wine-red translucent hover popups that disappear on mouse leave. |
| Earlier documentation | `stage_4b_mapbox_master_style.md` uses obsolete combined IDs; `stage_5a_website_prototype.md` describes 18 states and older chapter roles; `stage_6a_final_content.md` uses an older chapter order, Lido as the main case, and says the latest mapped year is 2017. | Use this plan, the current 25-state JSON, the current data, and the live published style as the final-revision baseline. |

## Guardrails for all future batches

- Implement one approved batch at a time; do not collapse all revisions into one change and do not fragment them into dozens of tiny edits.
- Do not begin a batch until the user explicitly approves it.
- Preserve research data and identifiers unless a later request explicitly authorizes data work.
- Treat media rights as unresolved until reproduction permission or applicable institutional terms are confirmed.
- Re-check the published Mapbox style at the start of any batch that touches legends or map presentation.
- Keep a clear audit trail of files changed, tests run, browser states checked, and any conflicts requiring user judgment.

## Baseline audit file set

The baseline was established by inspecting:

- `README.md`
- `website/app/page.tsx`
- `website/app/globals.css`
- `website/app/layout.tsx`
- `website/js/config.js`
- `website/package.json`
- `data/interim/chapter_map_states.json`
- `data/interim/qualitative_media_register.csv`
- `data/processed/current_exhibition_spaces.csv`
- `data/processed/operations.csv`
- `docs/stage_4b_mapbox_master_style.md`
- `docs/stage_4c_chapter_map_states.md`
- `docs/stage_5a_website_prototype.md`
- `docs/stage_5b_visual_refinement.md`
- `docs/stage_6a_final_content.md`
- `docs/stage_current_exhibition_data.md`
- the current published Mapbox style returned by the Styles API for `cmtq74ywn00g801r2gri5d7v0`

## Stop condition

The baseline audit and planning task is complete.

## Batch progress

### Batch 1 — completed 8 September 2026

- Added a distinct `cover_island` state. The cover retains the published chronology layers behind a translucent UI veil, hides the legend, and transitions into the fully visible analytical Opening without changing Mapbox paint.
- Applied responsive left camera padding to broad, flat map states so their geographic subject is visually biased toward the right. Local district states and the fixed Golden Mile sequence receive zero padding.
- Moved the global masthead and its taller dark-to-transparent fade above the map/story stacking contexts so the two global labels remain legible while scrolling.
- Replaced hard-coded analytical legend colors with a centralized palette read at runtime from the current published layer paint expressions. Added published-color markers to all four current-exhibition categories and color-plus-size markers to the site-count legend.
- Standardized narrative and legend panel-edge decoration as a 2 px left rule plus a consistent 3.25 rem upper-left rule; removed the duplicated chapter-accent CSS declarations.
- Replaced click popups with one reusable hover popup. It updates between points, tolerates small pointer movement, closes after leaving the point/popup region, and is removed on every state transition. Coarse-pointer layouts suppress the hover-only popup safely.
- Restyled popup surfaces as compact translucent wine-red panels with light text and matching directional tips.
- Production build passed. Browser checks covered the cover/Opening transition, top fade, right-biased broad composition, every displayed legend family (`01`–`07` as applicable), popup open/update/close/state-transition behavior, and panel treatments.
- The final published-style safety re-check returned the same modification timestamp (`2026-09-08T06:24:16.207Z`), Chapter 3 radius (`6`), and Chapter 4 color/radius expressions and opacity (`0.6`). No Mapbox resource or paint property was modified.
- Repository-wide lint still reports pre-existing scaffold accessibility/type rules in unused UI components and existing `page.tsx` conventions; it does not block the successful production build.

### Batch 2 — completed 8 September 2026

- Preserved the approved Chapter 1 `fitBounds` implementation, bounds, padding/offset logic, and camera sequence without alteration. Desktop browser validation reconfirmed settled zooms of `14.74`, `12.37`, `11.39`, and `10.85` for the four Chapter 1 states.
- Added a locally served, responsive archival image to every Chapter 1 period: Capitol Theatre and Namazie Mansions (c.1950), Lido Theatre and Shaw House (1960s), Jurong Drive-In on opening night (14 July 1971), and Jubilee Theatre in Ang Mo Kio (1994). All four are National Archives of Singapore images surfaced through the National Library Board's BiblioAsia cinema history.
- Kept the Chapter 2 four-town label on one line and positioned it wholly within the usable map area beside the narrative panel at the tested desktop viewport.
- Implemented the Chapter 2 emphasis sequence exclusively through existing layer visibility and selection filters: overview uses `01_basic` with the four-town `03_operations_highlight`; individual town states use the dimmer confidence-aware `01_glow` context with only the selected town in `03_operations_highlight`; the return restores `01_glow` plus `01_basic` while retaining the four-town highlight. No runtime paint override was added.
- Added locally served, responsive town imagery for Queenstown (former Venus and Golden City Theatres, National Heritage Board/Roots), Toa Payoh (former Kong Chian Cinema, National Heritage Board/Roots), Ang Mo Kio (Jubilee Theatre, National Archives of Singapore via BiblioAsia), and Boon Lay (Savoy Cinema, user-approved Flight Sixty Five/WordPress image), with captions and linked attribution.
- Updated `data/interim/qualitative_media_register.csv` with source URLs, captions, dates where stated, local asset paths, and explicit rights notes. Reproduction permission remains unconfirmed for the integrated institutional images and must be resolved before public publication.
- Production build passed. Desktop browser checks at `1410 × 771` covered every Chapter 1 and Chapter 2 state, all six local image loads and crops, exact state/filter transitions, confidence-aware context opacity, panel fit, and the absence of runtime errors. The complete one-line town label was additionally verified fully in-frame at `390 × 844`, `1024 × 768`, and `1410 × 771`.
- No Chapter 3, Chapter 4, Chapter 5, ending, global legend, Mapbox style, or published Mapbox resource was changed in this batch. The hover-popup lifecycle was subsequently hardened so popups close immediately when no interactive feature remains under the cursor.

### Batch 3 — completed 8 September 2026

- Audited the live Chapter 3 sequence as five states: a four-category overview, focused standalone, focused community/new-town, combined mixed-use/mall, and a four-category return. The existing narrative presents mixed-use and mall settings together rather than as separate pages.
- Added a locally served building/context image to each focused Chapter 3 type page: Rex Cinemas at 2 Mackenzie Road for the standalone setting (National Heritage Board/Roots), the former Kong Chian Cinema building at 600 Lorong 4 Toa Payoh for the community/new-town setting (National Heritage Board/Roots), and Lido Theatre with Shaw House for the combined mixed-use/mall setting (National Archives of Singapore via BiblioAsia). Overview and return states intentionally remain image-free. No reliably illustrated presented type remains unresolved.
- Reused the established Chapters 1–2 left-panel image system and extended its 16:9 crop rule to Chapter 3. Desktop browser checks confirmed all three images load locally, captions/credits remain readable, and no image or panel overflows the `1410 × 771` viewport.
- Restructured Chapter 4 into four distinct editorial steps: `One Address, Many Lives` introduces physical sites and the point-size encoding; `Addresses that return` isolates sites with two or more documented operations; `Cases with evidence to follow` introduces the selected high-confidence qualitative subset without implying uninterrupted operation; and `One address to follow` isolates Golden Mile Tower (`SGC-S-011`) as the handoff to Chapter 5.
- Preserved the existing all-sites, repeated-sites, and continuity-case cameras at `[103.825, 1.35]`, zoom `10.35`. The repeated-sites state retains the filter `documented_operations_per_site >= 2`; the continuity state uses `05_continuity_cases`. Added only the required Golden Mile transition camera at `[103.864161, 1.301929]`, zoom `13.4`, with the existing `golden_mile` filter resolving to `site_id == SGC-S-011`. Golden Theatre, The Projector, and Filmhouse remain three distinct operation records at that one physical site.
- Production build passed. Desktop browser QA covered all nine Chapter 3–4 states and confirmed the intended active layers/filters, 37 venue-type records in the overview/return, 1 standalone record, 11 community/new-town records, 21 mixed-use/mall records, 28 physical sites, 7 repeated sites, 7 continuity cases, and exactly one Golden Mile feature. No runtime alerts or stuck popups were present; the cross-layer hover lifecycle recheck also passed.
- Captured the current published paint definitions immediately before and after implementation. The serialized Chapter 3/4 style baseline was byte-identical (SHA-256 `D8BF85C0995F222DEBA17BBE0945D52BBC8362DA335F18EE0B392715783C022C`): Chapter 3 radius remains `6`, and all published color, opacity, blur, stroke, emissive, and data-driven expressions remain unchanged. No `setPaintProperty`, replacement visual layer, Mapbox style edit, tileset edit, or resource publication was introduced.
- Updated `data/interim/qualitative_media_register.csv`; reproduction permission remains unconfirmed for all three institutional images and must be resolved before public publication.
- Chapter 1 cameras/images and all Chapter 2 states, choreography, labels and images remained unchanged. Chapter 5 and the Ending were not rewritten.

### Batch 4 — completed 8 September 2026

- Expanded Chapter 5 into four evidence-led states at Golden Mile Tower (`SGC-S-011`). `One address, three cinema lives` introduces the physical-site case at 6001 Beach Road; `A cinema built into the tower` establishes Golden Theatre as the 1973 original large auditorium within the mixed-use building; `Old halls, a new curatorial model` explains The Projector's adaptive independent-cinema use and retains the 2014 soft-launch/founding versus January 2015 regular-opening chronology conflict; and `Another operation enters the same rooms` establishes Filmhouse's 3 February 2026 opening in the former Projector Level 5 premises.
- Preserved Golden Theatre, The Projector and Filmhouse as three distinct documented operations. Filmhouse is explicitly described as a new entity under different ownership and management, not a rename of The Projector; continuity is limited to the physical site and reused cinema space.
- Kept the three operation states on an identical camera: centre `[103.864161, 1.301929]`, zoom `15.8`, bearing `-10`, pitch `30`. The Chapter 5 opener uses a slightly broader establishing camera at the same centre, zoom `14.6`, bearing `-6`, pitch `20`. All Chapter 5 `map_label` values are now empty, removing the floating black location boxes without adding a replacement label.
- Added four locally served Chapter 5 images in a dedicated right-side map overlay rather than inside the left narrative panel. The overlay changes with the active state, sits above the legend, uses a strong radial alpha feather into the dark map, and keeps its caption/source visually secondary: Golden Mile Tower's cinema block (Darren Soh via Docomomo Singapore), the 1976 Golden Theatre auditorium (Building Materials & Equipment via Docomomo Singapore), a Projector Redrum screening (The Projector via CNA Lifestyle, published 2022), and the Filmhouse foyer (official Filmhouse image, published August 2026).
- No Chapter 5 image/evidence gap remains for the requested sequence. Reproduction permission is unconfirmed for all four integrated images and must be resolved before public publication. Golden Theatre capacity remains intentionally omitted from the narrative because the project retains conflicting figures; no unsupported claim was introduced.
- Removed the standalone `current_exhibition_geography` / Present Day step and state. `ending_tonight` is now the sole final state, flies directly from Golden Mile to the broad right-biased Singapore view, keeps `07_glow` and `07_basic` filtered to all four current categories, and concludes with `Where Would You Go Tonight?` while showing all 33 mapped current exhibition spaces.
- Split the ending into a primary narrative panel containing only the ending label, title and conclusion, followed by a visually separate quieter methodology/sources panel. The secondary panel states the incomplete-census, unresolved-site, coordinate-confidence and current-status-date caveats before the sources and map credits.
- Preserved Batch 1's runtime legend-color synchronization. Desktop browser QA confirmed four visible current-exhibition markers—Commercial, Independent curated, Heritage hybrid and Institutional curated—with colors read from the current published `07_basic` expression rather than hard-coded legend values.
- Production build passed. Desktop browser QA at `1410 × 771` covered all four Chapter 5 states and the ending: every local image loaded, remained right of the narrative panel and above the legend, used the feather mask, and displayed a readable caption; the operation-state cameras were identical; no Chapter 5 map label was visible; the Present Day state was absent; all 33 ending features rendered; the two ending panels had a visible 57.6 px gap; and no runtime alert appeared. Hover popups opened and closed correctly on both Chapter 5 and ending layers.
- Captured all published analytical paint definitions (`01` through `07`) immediately before and after Batch 4. The serialized baseline remained byte-identical (SHA-256 `604A5693EBB01AC4D5236EE44F2C93F5520970702B30D6D11A9577DB95062DC8`). No runtime paint override, Mapbox style change, layer replacement, tileset edit or resource publication occurred.
- Chapters 1–4, their cameras, narrative, images and state/filter choreography remained unchanged. The global top gradient, popup implementation and legend synchronization architecture were not modified.

Batch 4 implementation and validation are complete. Final QA and deployment have not started.

### Final local visual refinements — completed 8 September 2026

- Moved the Chapter 5 right-side media overlay into the upper-right viewport area with responsive top positioning, while retaining its established width and caption relationship.
- Expanded the Filmhouse state into one aligned photographic composition: the existing official Filmhouse foyer image remains dominant, with three smaller author photographs in a supporting column. The cinematic feather is applied to the composition's outer perimeter rather than its internal image edges.
- Recorded the three user-provided Filmhouse photographs as author-owned media with unknown shooting dates in `data/interim/qualitative_media_register.csv`; the official Filmhouse attribution remains unchanged and the reader-facing caption now notes the additional author photographs.
- Refined only the two Cover title colors: the project title now reuses the established Chapter 3 gold accent (`#dcb475`), and the opening question uses the dark wine token (`--wine: #9c3f55`) derived from the existing popup palette.
- Production build and the requested targeted Chapter 5/Cover viewport checks passed. Final QA and deployment were not started.
