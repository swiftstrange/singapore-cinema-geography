# Final map-state and scroll-map technical record

## Scope

This record freezes the website's runtime map-state contract for the published private Mapbox style **Singapore Cinema Geography** (`mapbox://styles/strange1989/cmtq74ywn00g801r2gri5d7v0`). No Mapbox style, source, tileset, layer order, or published paint property was changed during this stage.

The machine-readable source is `data/interim/chapter_map_states.json`. The website controller changes only layer visibility, layer filters, and camera state. It does not call `setPaintProperty`, so the published colour, radius, blur, stroke, emissive-strength, and data-driven opacity definitions remain authoritative.

## Published runtime layer audit

The published style was re-read on 2026-09-08. Public, authenticated default, and draft style endpoints returned the same split-layer contract.

| Semantic role | Actual published runtime layer ID(s) |
|---|---|
| Opening chronology | `01_glow`, `01_basic` |
| Historical venue type | `02_operations_venue_type` |
| Selected historical operations | `03_operations_highlight` |
| Physical-site operation count | `04_sites_operation_count` |
| Continuity-case context | `05_continuity_cases` |
| Single continuity case | `06_glow`, `06_basic` |
| Current exhibition geography | `07_glow`, `07_basic` |

The opening-year range in the current map data is 1930–2026. The published `04_sites_operation_count` radius expression is left untouched; its quantitative meaning remains `documented_operations_per_site → point size`.

## Final state sequence

| State ID | Camera `[longitude, latitude]`; zoom; bearing; pitch | Active layer(s) | Runtime filter |
|---|---|---|---|
| `opening_island` | `[103.825, 1.350]`; 10.35; 0; 0 | `01_glow`, `01_basic` | none |
| `c1_early_openings` | whole island | `01_glow`, `01_basic` | `opening_period = 1930–1949` |
| `c1_midcentury_expansion` | whole island | `01_glow`, `01_basic` | cumulative through 1969 |
| `c1_1970s_1980s_wave` | whole island | `01_glow`, `01_basic` | cumulative through 1989 |
| `c1_full_chronology` | whole island | `01_glow`, `01_basic` | none; full chronology restored |
| `c2_new_town_overview` | `[103.800, 1.335]`; 10.35; 0; 0 | chronology pair + `03` | all four towns |
| `c2_queenstown` | `[103.8044, 1.2965]`; 14.0; -8; 24 | chronology pair + `03` | Queenstown IDs |
| `c2_toa_payoh` | `[103.8502, 1.3329]`; 14.1; 0; 26 | chronology pair + `03` | Toa Payoh IDs |
| `c2_ang_mo_kio` | `[103.84745, 1.3711]`; 13.9; 6; 26 | chronology pair + `03` | Ang Mo Kio IDs |
| `c2_boon_lay` | `[103.712066, 1.347455]`; 13.5; -6; 22 | chronology pair + `03` | Boon Lay ID |
| `c2_new_town_return` | `[103.800, 1.335]`; 10.35; 0; 0 | chronology pair + `03` | all four towns |
| `c3_venue_type_overview` | whole island | `02_operations_venue_type` | none |
| `c3_standalone_focus` | whole island | `02_operations_venue_type` | Standalone cinema |
| `c3_community_new_town_focus` | whole island | `02_operations_venue_type` | Community / new-town commercial centre |
| `c3_mixed_mall_focus` | whole island | `02_operations_venue_type` | Mixed-use + mall-integrated |
| `c3_venue_type_coexistence` | whole island | `02_operations_venue_type` | none; all categories restored |
| `c4_site_count_overview` | whole island | `04_sites_operation_count` | none |
| `c4_repeated_sites_focus` | whole island | `04_sites_operation_count` | `documented_operations_per_site >= 2` |
| `c4_continuity_context` | whole island | `05_continuity_cases` | none; all seven cases |
| `c5_golden_mile_entry` | `[103.864161, 1.301929]`; 15.8; -10; 30 | `05` + `06_glow` + `06_basic` | `site_id = SGC-S-011` on `06` |
| `c5_golden_theatre` | identical Golden Mile camera | `06_glow`, `06_basic` | `site_id = SGC-S-011` |
| `c5_the_projector` | identical Golden Mile camera | `06_glow`, `06_basic` | `site_id = SGC-S-011` |
| `c5_filmhouse` | identical Golden Mile camera | `06_glow`, `06_basic` | `site_id = SGC-S-011` |
| `current_exhibition_geography` | whole island | `07_glow`, `07_basic` | all four current categories |
| `ending_tonight` | whole island | `07_glow`, `07_basic` | all four current categories |

Whole-island state means `[103.825, 1.350]`, zoom 10.35, bearing 0, pitch 0 unless a different camera is listed. Same-area changes use `easeTo` at 650–1000 ms. District and island moves use `flyTo` at 1400–2100 ms. The Golden Mile-to-current-island pullback is 2800 ms.

## Chapter 2 operation selections

The IDs below were read from the current `cinema_operations.geojson`; none are inferred.

- Queenstown: `SGC-O-006`, `SGC-O-007`, `SGC-O-008`
- Toa Payoh: `SGC-O-016`, `SGC-O-017`, `SGC-O-018`
- Ang Mo Kio: `SGC-O-032`, `SGC-O-034`, `SGC-O-035`
- Boon Lay: `SGC-O-036`

The overview/return filter selects all ten IDs. `03_operations_highlight` returns to the published `__chapter_selection__` placeholder whenever it is not selected by a chapter state.

## Labels and legends

- Opening and Chapter 1 show only the opening-year legend, ending at 2026.
- Chapter 2 shows the new-town highlight legend and only its town labels: Queenstown, Toa Payoh, Ang Mo Kio, and Boon Lay.
- Chapter 3 shows only the venue-type legend.
- Chapter 4 shows the operation-count legend, followed by a continuity-context legend.
- Chapter 5 shows one concise `Golden Mile Tower` label and a selected-case legend.
- Present-day and ending states show only the current-exhibition category legend.

## Golden Mile behavior

`SGC-S-011` is selected at runtime on both `06_glow` and `06_basic`. The published `__case_selection__` placeholder remains unchanged in Mapbox and is restored by the website when the layer is not in use. `c5_golden_theatre`, `c5_the_projector`, and `c5_filmhouse` have byte-for-byte equivalent center, zoom, bearing, and pitch values, so the address remains visually fixed while the identity phase changes.

## Ending behavior

`current_exhibition_geography` makes the 2800 ms pullback from Golden Mile to the whole island. Both final states show only `07_glow` and `07_basic`, filtered to the four current categories: `commercial`, `independent_curated`, `heritage_hybrid`, and `institutional_curated`. The ending never re-enables the historical opening-year pair.

## Browser fetch diagnosis

The configured public style URI is exact and current. The public token has `styles:read`, `styles:tiles`, and `fonts:read`; the Mapbox account editor shows zero URL restrictions. Direct style requests with localhost, 127.0.0.1, and external origins all return HTTP 200. The observed fetch failure belonged to the stale browser session left after the prior dev-server hot-reload interruption. A fresh localhost browser session loaded the same URI/token with no configuration or Mapbox-resource change.

## Validation record

- Production build completed successfully.
- All 25 scroll steps match one configured state.
- Every published runtime layer ID exists and loads in a clean localhost session.
- Every chapter state activated its expected layer set with no filter/source/layer error.
- The ten Chapter 2 IDs exist in the current operations GeoJSON.
- The published site data includes `SGC-S-011`.
- The local approved data contain 7 continuity cases and 33 current exhibition spaces.
- The controller contains zero `setPaintProperty` calls; the published `04` radius expression is therefore preserved.
- The visual ending shows the current exhibition geography and no historical chronology layer.
- Browser console showed no application-breaking error. The sole Mapbox warning was the known non-blocking `Cutoff is currently disabled on terrain` message.

No narrative rewrite, CSS redesign, Mapbox style publication, tileset publication, or deployment was performed.
