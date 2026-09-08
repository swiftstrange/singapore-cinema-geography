# Stage 3C — GeoJSON export validation

## Scope and freeze

This stage generated local, Mapbox-ready GeoJSON from the frozen Stage 2D spatial tables only. No research, geocoding, source-table changes, Mapbox uploads, tilesets, styles, website files, or spatial interpretation were undertaken.

Excluded unresolved master-site records remain in the master tables and are not present in these exports: SGC-S-014, SGC-S-015, SGC-S-016, SGC-S-017, SGC-S-018, SGC-S-019, and SGC-S-027.

## Export inventory

| Export | Purpose | Feature count |
|---|---|---:|
| `data/mapbox/cinema_operations.geojson` | One point per verified operation | 35 |
| `data/mapbox/cinema_sites.geojson` | One point per high/medium-confidence physical site | 28 |
| `data/mapbox/cinema_continuity_cases.geojson` | One point per repeated-operation/continuity case | 6 |

All files are GeoJSON `FeatureCollection` documents. All geometries are `Point` geometries with coordinate order `[longitude, latitude]`.

## Property schema

### Operations

`operation_id`, `site_id`, `cinema_name`, `alternate_names`, `opening_year`, `opening_period`, `closing_year`, `operation_status`, `operator`, `venue_type`, `venue_type_display`, `mall_based`, `mall_name`, `new_town_focus`, `geocode_confidence`, and `site_address`.

`opening_year` and `closing_year` are JSON numbers or `null`; blank values were not exported as strings. `opening_period` uses the controlled values `1930–1949`, `1950–1969`, `1970–1989`, `1990–2009`, `2010–2017`, and `unknown`. `venue_type` is a controlled analysis value, and `venue_type_display` is its controlled legend label. `new_town_focus` uses `Toa Payoh`, `Ang Mo Kio`, `Queenstown`, `Boon Lay`, or `none`.

### Sites

`site_id`, `site_name`, `address`, `historical_address`, `modern_geocoding_address`, `documented_operations_per_site`, `earliest_verified_opening_year`, `latest_verified_opening_year`, `operation_names_summary`, `current_operation_present`, `geocode_confidence`, `continuity_case`, and `continuity_note`.

The operation count and earliest/latest opening years are JSON numbers. Historical and modern geocoding addresses are retained separately when the frozen table explicitly distinguishes them.

### Continuity cases

`site_id`, `site_address`, `operation_sequence`, `documented_operations_per_site`, `earliest_verified_opening_year`, `latest_verified_opening_year`, `operators`, `venue_type_sequence`, `continuity_note`, `geocode_confidence`, `case_priority`, and `current_operation_present`.

`case_priority` is controlled as `primary`, `secondary`, or `supporting`. SGC-S-009 is primary and SGC-S-012 is secondary.

## Validation results

| Check | Result |
|---|---|
| JSON / GeoJSON parsing | Passed for all three exports |
| Expected feature counts | Passed: 35 operations, 28 sites, 6 continuity cases |
| Geometry type | Passed: every feature is a Point |
| Coordinate order and completeness | Passed: every feature has two non-null numeric coordinates in `[longitude, latitude]` order |
| Singapore bounds check | Passed: all coordinates fall within longitude 103.6–104.1 and latitude 1.15–1.5 |
| Confidence inclusion rule | Passed: high/medium only; no unresolved records included |
| Numeric field typing | Passed: all populated opening/closing years and site count fields are JSON numbers |

Confidence composition:

| Layer | High | Medium | Total |
|---|---:|---:|---:|
| Operations | 31 | 4 | 35 |
| Sites | 24 | 4 | 28 |
| Continuity cases | 6 | 0 | 6 |

Operations have 34 numeric opening years, one null opening year, and a numeric opening-year range of 1930–2017. Site-level `documented_operations_per_site` ranges from 1 to 3.

## Controlled-value checks

### Venue-type display values

| Value | Operations |
|---|---:|
| Community / new-town commercial centre | 11 |
| Mall-integrated cinema | 9 |
| Mixed-use cinema complex | 10 |
| Other / not classified | 4 |
| Standalone cinema | 1 |

### Mall-based values

| Value | Operations |
|---|---:|
| yes | 11 |
| no | 14 |
| unknown | 10 |

### New-town focus

| Value | Operations |
|---|---:|
| Toa Payoh | 4 |
| Ang Mo Kio | 3 |
| Queenstown | 1 |
| Boon Lay | 1 |
| none | 26 |

## Duplicate-coordinate review

Six duplicate-coordinate groups are expected because multiple operations share a physical site: SGC-S-003, SGC-S-008, SGC-S-009, SGC-S-012, SGC-S-013, and SGC-S-033.

One additional coincident-point group is retained intentionally: SGC-S-028 (New Crown Cinema) and SGC-S-029 (New Town Cinema). The frozen site records preserve separate historical site identities but associate both with the same verified present-day redevelopment/building address, 5 Ang Mo Kio Central 2. Both remain medium-confidence and are not silently merged. This is documented export behaviour, not a new coordinate assignment.

## Validation errors found and fixed

No malformed geometry, null-coordinate, out-of-bounds, confidence-inclusion, or numeric-typing errors were found in the generated exports. The cross-site coincident-point case above was reviewed and explicitly documented.

## Mapbox readiness

The three files contain all fields required for the approved Chapter 3 filters and legends: operation opening period, venue type/display, mall-based status, new-town focus, confidence, site operation counts, continuity status, and current-operation status. They are ready for upload as Mapbox tilesets when that later stage is authorised.
