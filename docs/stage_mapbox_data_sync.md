# Mapbox data sync and layer skeleton

Date: 8 September 2026

## Scope and controls

This stage regenerated the four approved Mapbox GeoJSON exports from frozen processed CSV tables. Historical operations, physical sites, continuity cases, and current exhibition spaces remain separate feature collections. No website, chapter-state, narrative, basemap, or existing Mapbox visual layer was changed.

The historical Mapbox tilesets were refreshed in place using their existing tileset and source-layer identifiers. This preserves references used by custom layers `01_operations_opening_year` through `06_case_highlight` in private style `mapbox://styles/strange1989/cmtq74ywn00g801r2gri5d7v0`. The style received only a new vector source for the current-exhibition tileset and one hidden neutral circle skeleton, `07_current_exhibition_spaces`; no existing visual property or layer was changed.

## Local exports and validation

| GeoJSON export | Features | Validation |
| --- | ---: | --- |
| `data/mapbox/cinema_operations.geojson` | 37 | FeatureCollection, Points, unique `operation_id`, numeric chronology fields |
| `data/mapbox/cinema_sites.geojson` | 28 | FeatureCollection, Points, unique `site_id`, numeric operation-count/year fields |
| `data/mapbox/cinema_continuity_cases.geojson` | 7 | FeatureCollection, Points, unique `case_id` |
| `data/mapbox/current_exhibition_spaces.geojson` | 33 | FeatureCollection, Points, unique `space_id` |

All coordinates passed Singapore-bounds sanity checks. The operation export retains distinct Golden Mile records for Golden Theatre, The Projector, and Filmhouse. The current-exhibition export retains true co-located coordinates for SFS Somerset/GV Cineleisure and Golden Mile current operators; building and colocation context is in properties rather than fabricated offsets.

## Published Mapbox resources

| Dataset | Tileset ID / URI | Source-layer ID | Local feature count | Publication state at audit |
| --- | --- | --- | ---: | --- |
| Historical operations | `strange1989.k7sgtzdhwl42` / `mapbox://strange1989.k7sgtzdhwl42` | `92a301efdab2e0544d5e` | 37 | success; no warnings |
| Historical sites | `strange1989.bz0cuqrwxaee` / `mapbox://strange1989.bz0cuqrwxaee` | `584d3d6339eb7d64f78d` | 28 | success; no warnings |
| Continuity cases | `strange1989.0oxt98o5dqfe` / `mapbox://strange1989.0oxt98o5dqfe` | `fdcb78ae177016b95d2c` | 7 | success; no warnings |
| Current exhibition spaces | `strange1989.current_exhibition_spaces` / `mapbox://strange1989.current_exhibition_spaces` | `current_exhibition_spaces` | 33 | one publication success; no warnings |

The new current-exhibition tileset is private and is the only new tileset in this stage. The existing historical tilesets retained both their original IDs and source-layer IDs.

## Properties and compatibility

The refreshed historical operation properties preserve the fields used by the existing style: `operation_id`, `site_id`, `cinema_name`, `opening_year`, `opening_period`, `closing_year`, `operation_status`, `operator`, `venue_type`, `venue_type_display`, `mall_based`, `mall_name`, `new_town_focus`, `geocode_confidence`, and `site_address`. Established controlled `venue_type` values were preserved so existing layer expressions remain compatible. Source-register identifiers are additionally preserved in exported source-ID properties.

`current_exhibition_spaces.geojson` uses exactly these controlled categories: `commercial`, `independent_curated`, `heritage_hybrid`, and `institutional_curated`. It contains operational, programme, address, confidence, Mapbox-match, and source-traceability properties.

The added skeleton layer is `07_current_exhibition_spaces`, using source `mapbox://strange1989.current_exhibition_spaces`, source layer `current_exhibition_spaces`, and `layout.visibility = none`. Its neutral circle paint values are deliberately non-visible by default and no other style design value was edited.

## Completion status

All four Mapbox tileset jobs completed successfully with no reported warnings or errors. The private style was published in Mapbox Studio with the approved hidden `07_current_exhibition_spaces` skeleton. Do not make that layer visible or alter any visual design without a later stage instruction.
