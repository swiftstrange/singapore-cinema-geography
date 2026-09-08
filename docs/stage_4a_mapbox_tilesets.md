# Stage 4A — Mapbox tileset resource record

## Scope

Three and only three approved GeoJSON exports were uploaded through Mapbox Data Workbench and submitted for publication. No Mapbox styles, website files, or additional/testing tilesets were created.

| Purpose | Local GeoJSON source | Mapbox tileset ID | Tileset URI | Source layer | Feature count | Publication status |
|---|---|---|---|---|---:|---|
| Cinema operations | `data/mapbox/cinema_operations.geojson` | `strange1989.k7sgtzdhwl42` | `mapbox://strange1989.k7sgtzdhwl42` | `92a301efdab2e0544d5e` | 35 | Published |
| Cinema sites | `data/mapbox/cinema_sites.geojson` | `strange1989.bz0cuqrwxaee` | `mapbox://strange1989.bz0cuqrwxaee` | `584d3d6339eb7d64f78d` | 28 | Published |
| Continuity cases | `data/mapbox/cinema_continuity_cases.geojson` | `strange1989.0oxt98o5dqfe` | `mapbox://strange1989.0oxt98o5dqfe` | `fdcb78ae177016b95d2c` | 6 | Published |

Upload/publish date: 2026-09-07 (Asia/Singapore).

## Field verification

### Cinema operations

Mapbox displayed all approved analytical properties, including `operation_id`, `cinema_name`, `site_id`, `opening_year`, `opening_period`, `venue_type_display`, `mall_based`, `mall_name`, `new_town_focus`, `geocode_confidence`, `operator`, `operation_status`, `site_address`, and `closing_year`. The displayed feature table showed `opening_year` as numbers, including values such as 1996, 1965, and 2017; it remains suitable for a Mapbox numeric colour expression.

### Cinema sites

Mapbox displayed `site_id`, `site_name`, `address`, `historical_address`, `modern_geocoding_address`, `documented_operations_per_site`, `earliest_verified_opening_year`, `latest_verified_opening_year`, `operation_names_summary`, `current_operation_present`, `geocode_confidence`, `continuity_case`, and `continuity_note`. The displayed feature table showed `documented_operations_per_site` as numbers, including 1, 2, and 3; it remains suitable for a Mapbox numeric size expression.

### Continuity cases

Mapbox displayed `site_id`, `site_address`, `operation_sequence`, `documented_operations_per_site`, `earliest_verified_opening_year`, `latest_verified_opening_year`, `operators`, `venue_type_sequence`, `continuity_note`, `geocode_confidence`, `case_priority`, and `current_operation_present`.

## Configuration and warnings

All properties were retained under the default “all attributes included” configuration. The point datasets used Mapbox Data Workbench’s standard point-tileset processing configuration; no attributes were intentionally removed and no source-property renaming was observed. No upload validation warnings were shown.

### Source-layer correction recorded in Stage 4B

The Data Workbench interface showed the uploaded dataset names, but Mapbox’s published vector tiles expose account-assigned opaque source-layer identifiers. These were confirmed by Mapbox tile queries and the Studio source selector, then used in the master style:

- `92a301efdab2e0544d5e` — cinema operations
- `584d3d6339eb7d64f78d` — cinema sites
- `fdcb78ae177016b95d2c` — continuity cases
